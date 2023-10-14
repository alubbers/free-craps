
class RollUtils {

  roll2d6() {
    const alphaDie = Math.ceil(Math.random() * 6);
    const betaDie = Math.ceil(Math.random() * 6);
    const rollTotal = alphaDie + betaDie;

    return {
      a: alphaDie,
      b: betaDie,
      total: rollTotal
    };
  }

  /*
  * Return an object with data about the result of the given data in craps.
  * @param roll an object in the same format as the result of roll2d6()
  * @param point an integer either 0 or 2-12, representing the point prior to the roll,
  *              0 is interpreted as no point ( of "off" )
  * @return an object: {
  *                   craps: true iff point is off and 2, 3, or 12 is rolled
                      passLineWin: true iff point is off and a 7 or 11 is rolled
                      hardWay: true iff a 4, 6, 8, or 10 is rolled with a matching pair of die results
                      pointState: a coded result with these possible values [
                             "POINT_SET", "POINT_HIT", "LINE_AWAY", "NO_CHANGE"
                           ]
                      newPoint: -1 if no point was set, 0 if it was turned off, a valid point value otherwise
  *               }
  */
  buildCrapsResult(roll, point = 0) {
    let result = {
      craps: false,
      passLineWin: false,
      hardWay: false,
      pointState: "NO_CHANGE",
      newPoint: -1
    };

    if (point === 0) {
      if (roll.total === 2 || roll.total === 3 || roll.total === 12) {
        result.craps = true;
      }
      else if (roll.total === 7 || roll.total === 11) {
        result.passLineWin = true;
      }
      else {
        result.pointState = "POINT_SET";
        result.newPoint = roll.total;
      }
    }
    else {
      if (roll.total === point) {
        result.pointState = "POINT_HIT";
        result.newPoint = 0;
      }
      else if (roll.total === 7) {
        result.pointState = "LINE_AWAY";
        result.newPoint = 0;
      }
    }

    // check the hard ways, they are independent of the point
    if (roll.total == 4 || roll.total == 6 || roll.total == 8 || roll.total == 10) {
      result.hardWay = roll.a === roll.b;
    }

    return result;
  }

}

export default new RollUtils();
