import {
  POINTS, PLACE, HARD_WAYS, HORN, ANY_CRAPS, C_AND_E, FIELD, ANY_SEVEN,
  PASS, DONT_PASS, COME, DONT_COME
} from './CrapsConstants';

export class CrapsTableStore {

  betBuckets = [];

  constructor() {

    // these buckets do not have separate entries for each individual value
    [ANY_CRAPS, C_AND_E, FIELD, ANY_SEVEN].forEach( meta => {
      this.betBuckets.push({
        type: meta.type,
        label: meta.labelFunc(),
        verboseLabel: meta.verboseLabelFunc(),
        code: meta.codeFunc(),
        groupCode: meta.type,
        option: "default"
      });

    });

    // pass and don't pass have default and odds buckets
    [PASS, DONT_PASS].forEach( meta => {
      ["default", "odds"].forEach( option => {
        this.betBuckets.push({
          type: meta.type,
          label: meta.labelFunc(),
          verboseLabel: meta.verboseLabelFunc(undefined, option),
          code: meta.codeFunc(undefined, option),
          groupCode: meta.type,
          option: option
        });
      });
    });


    [HARD_WAYS, HORN].forEach( meta => {
      meta.values.forEach((val) => {
        this.betBuckets.push({
          type: meta.type,
          label: meta.labelFunc(val),
          verboseLabel: meta.verboseLabelFunc(val, "default"),
          code: meta.codeFunc(val),
          groupCode: `${meta.type}-${val}`,
          option: "default"
        });
      });
    });

    // place bets have a bucket for each value and to place (default), buy or lay
    [PLACE].forEach( meta => {
      meta.values.forEach( val => {
        ["default", "buy", "lay"].forEach( option => {
          this.betBuckets.push({
            type: meta.type,
            label: meta.labelFunc(val, option),
            verboseLabel: meta.verboseLabelFunc(val, option),
            code: meta.codeFunc(val, option),
            groupCode: `${meta.type}-${val}`,
            option: option
          });
        });
      });
    });

    // come/dont' come have a default bucket each, and then another default and odds bucket for each point
    [COME, DONT_COME].forEach( meta => {
      this.betBuckets.push({
        type: meta.type,
        label: meta.labelFunc(),
        verboseLabel: meta.verboseLabelFunc(),
        code: meta.codeFunc(),
        groupCode: meta.type,
        option: "default"
      });

      ["default", "odds"].forEach( option => {
        POINTS.forEach( val => {
          this.betBuckets.push({
            type: meta.type,
            label: meta.labelFunc(val, option),
            verboseLabel: meta.verboseLabelFunc(val, option),
            code: meta.codeFunc(val, option),
            groupCode: `${meta.type}-${val}`,
            option: option
          });
        });
      });
    });
  }

  getBucketForCode(code) {
    return this.betBuckets.find(e => e.code === code);
  }

  getVerboseLabelForCode(code) {
    const bucket = this.getBucketForCode(code);

    if (bucket) {
      return bucket.verboseLabel;
    }

    return "";
  }

}

export default CrapsTableStore;
