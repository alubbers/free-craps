#!/bin/bash
# Service account key rotation script for Google Cloud Platform
# This script should be run periodically (e.g., monthly) to rotate service account keys

set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
KEY_STORAGE_BUCKET="gs://${PROJECT_ID}-secure-keys"
SERVICE_ACCOUNTS=(
  "free-craps-admin"
  "free-craps-deployer"
)
RETENTION_DAYS=30  # Keep old keys for this many days

# Create key storage bucket if it doesn't exist
if ! gsutil ls "$KEY_STORAGE_BUCKET" &>/dev/null; then
  echo "Creating secure key storage bucket..."
  gsutil mb -l us-central1 "$KEY_STORAGE_BUCKET"
  gsutil versioning set on "$KEY_STORAGE_BUCKET"
  
  # Set lifecycle policy to auto-delete old versions
  cat > /tmp/lifecycle.json << EOF
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {
        "age": $RETENTION_DAYS,
        "isLive": false
      }
    }
  ]
}
EOF
  gsutil lifecycle set /tmp/lifecycle.json "$KEY_STORAGE_BUCKET"
  rm /tmp/lifecycle.json
  
  # Set bucket IAM permissions
  gsutil iam ch -d allUsers "$KEY_STORAGE_BUCKET"
  gsutil iam ch -d allAuthenticatedUsers "$KEY_STORAGE_BUCKET"
fi

# Rotate keys for each service account
for SA in "${SERVICE_ACCOUNTS[@]}"; do
  SA_EMAIL="${SA}@${PROJECT_ID}.iam.gserviceaccount.com"
  TIMESTAMP=$(date +%Y%m%d%H%M%S)
  NEW_KEY_FILE="/tmp/${SA}-${TIMESTAMP}.json"
  
  echo "Rotating keys for $SA_EMAIL..."
  
  # List existing keys
  EXISTING_KEYS=$(gcloud iam service-accounts keys list --iam-account="$SA_EMAIL" --format="value(name)")
  KEY_COUNT=$(echo "$EXISTING_KEYS" | wc -l)
  
  # Create new key
  gcloud iam service-accounts keys create "$NEW_KEY_FILE" --iam-account="$SA_EMAIL"
  echo "Created new key: $NEW_KEY_FILE"
  
  # Upload to secure bucket
  gsutil cp "$NEW_KEY_FILE" "${KEY_STORAGE_BUCKET}/${SA}/${TIMESTAMP}.json"
  echo "Uploaded key to ${KEY_STORAGE_BUCKET}/${SA}/${TIMESTAMP}.json"
  
  # Secure delete the local key file
  shred -u "$NEW_KEY_FILE"
  
  # If we have more than 2 keys, delete the oldest key (keep current key + 1 previous)
  if [ "$KEY_COUNT" -ge 2 ]; then
    # Get oldest key (first in the list)
    OLDEST_KEY=$(echo "$EXISTING_KEYS" | head -n 1)
    if [ -n "$OLDEST_KEY" ]; then
      echo "Deleting oldest key: $OLDEST_KEY"
      gcloud iam service-accounts keys delete "$OLDEST_KEY" --iam-account="$SA_EMAIL" --quiet
    fi
  fi
  
  echo "Rotation complete for $SA_EMAIL"
  echo "---------------------------------"
done

echo "All service account keys have been rotated."
echo "New keys are stored in $KEY_STORAGE_BUCKET"
echo "Remember to update any systems using these service accounts."