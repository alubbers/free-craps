import {
  PLACE, HARD_WAYS, HORN, ANY_CRAPS, C_AND_E, FIELD, ANY_SEVEN,
  PASS, DONT_PASS, COME, DONT_COME
} from './CrapsConstants';

export class CrapsTableStore {

  betBuckets = [];

  constructor() {
    // these buckets do not have separate entries for each individual value
    [PASS, DONT_PASS, COME, DONT_COME, ANY_CRAPS, C_AND_E, FIELD, ANY_SEVEN].forEach( meta => {
      this.betBuckets.push({
        type: meta.type,
        label: meta.labelFunc(),
        code: meta.codeFunc(),
        option: "default"
      });

    });

    [PLACE, HARD_WAYS, HORN].forEach( meta => {
      meta.values.forEach((val) => {
        this.betBuckets.push({
          type: meta.type,
          label: meta.labelFunc(val),
          verboseLabel: meta.verboseLabelFunc(val, "default"),
          code: meta.codeFunc(val),
          option: "default"
        });
      });
    });
  }

  getBucketForCode(code) {
    return this.betBuckets.find(e => e.code === code);
  }

  buildCompleteLabelTextForCode(code) {
    const bucket = this.getBucketForCode(code);

    if (bucket) {
      return bucket.verboseLabel;
    }

    return "";
  }

}

export default CrapsTableStore;
