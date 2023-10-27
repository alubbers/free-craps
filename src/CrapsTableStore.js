const PLACE_BETS = [4, 5, 6, 8, 9, 10];
const HARD_WAYS = [4, 6, 8, 10];
const HORN_BETS = [2, 3, 11, 12];
const ANY_CRAPS = [2, 3, 12];
const C_AND_E = [2, 3, 11, 12];
const FIELD_VALUES = [2, 3, 4, 9, 10, 11, 12]

class CrapsTableStore {

  betBuckets = [];

  constructor() {
    this.betBuckets.push({
      type: 'pass',
      value: 'Pass Line',
      code: 'pass'
    });

    this.betBuckets.push({
      type: 'pass',
      value: "Don't Pass Bar",
      code: 'dontPass'
    });

    this.betBuckets.push({
      type: 'come',
      value: 'Come',
      code: 'come'
    });

    this.betBuckets.push({
      type: 'come',
      value: "Don't Come",
      code: 'dontCome'
    });

    PLACE_BETS.forEach((element) => {
      this.betBuckets.push({
        type: 'place',
        value: '' + element,
        code: `place-${element}`
      });
    });

    HARD_WAYS.forEach((element) => {
      this.betBuckets.push({
        type: 'hardWay',
        value: '' + element,
        code: `hardWay-${element}`
      });
    });

    HORN_BETS.forEach((element) => {
      this.betBuckets.push({
        type: 'horn',
        value: '' + element,
        code: `horn-${element}`
      });
    });

    this.betBuckets.push({
      type: 'anySeven',
      value: 'Any Seven',
      code: 'anySeven'
    });

    this.betBuckets.push({
      type: 'anyCraps',
      value: 'Any Craps',
      code: 'anyCraps'
    });

    this.betBuckets.push({
      type: 'c-and-e',
      value: 'C & E',
      code: 'c-and-e'
    });

    this.betBuckets.push({
      type: 'field',
      value: 'Field',
      code: 'field'
    });
  }

}

export default CrapsTableStore;
