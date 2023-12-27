export const PLACE_BETS = [4, 5, 6, 8, 9, 10];
export const HARD_WAYS = [4, 6, 8, 10];
export const HORN_BETS = [2, 3, 11, 12];
export const ANY_CRAPS = [2, 3, 12];
export const C_AND_E = [2, 3, 11, 12];
export const FIELD_VALUES = [2, 3, 4, 9, 10, 11, 12]

export class CrapsTableStore {

  betBuckets = [];

  constructor() {
    this.betBuckets.push({
      type: 'pass',
      label: 'Pass Line',
      code: 'pass'
    });

    this.betBuckets.push({
      type: 'pass',
      label: "Don't Pass Bar",
      code: 'dontPass'
    });

    this.betBuckets.push({
      type: 'come',
      label: 'Come',
      code: 'come'
    });

    this.betBuckets.push({
      type: 'come',
      label: "Don't Come",
      code: 'dontCome'
    });

    PLACE_BETS.forEach((element) => {
      this.betBuckets.push({
        type: 'place',
        label: '' + element,
        code: `place-${element}`
      });
    });

    HARD_WAYS.forEach((element) => {
      this.betBuckets.push({
        type: 'hardWay',
        label: '' + element,
        code: `hardWay-${element}`
      });
    });

    HORN_BETS.forEach((element) => {
      this.betBuckets.push({
        type: 'horn',
        label: '' + element,
        code: `horn-${element}`
      });
    });

    this.betBuckets.push({
      type: 'anySeven',
      label: 'Any Seven',
      code: 'anySeven'
    });

    this.betBuckets.push({
      type: 'anyCraps',
      label: 'Any Craps',
      code: 'anyCraps'
    });

    this.betBuckets.push({
      type: 'c-and-e',
      label: 'C & E',
      code: 'c-and-e'
    });

    this.betBuckets.push({
      type: 'field',
      label: 'Field',
      code: 'field'
    });
  }

  getBucketForCode(code) {
    return this.betBuckets.find(e => e.code === code);
  }
  
  buildCompleteLabelTextForCode(code) {
    const bucket = this.getBucketForCode(code);
    
    return this.buildCompleteLabelTextForBucket(bucket);
  }
  
  buildCompleteLabelTextForBucket(bucket) {
    let result = "";
    if (bucket) {
      switch(bucket.type) {
        case "place": {
          result = "Place ";
          break;
        }
        case "horn": {
          result = "Horn ";
          break;
        }
        case "hardWay": {
          result = "Hard ";
          break;
        }
      }
      
      result = result + bucket.label;
    }
    
    return result;
  }

}
