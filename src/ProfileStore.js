

class ProfileStore {

  // sample data for now
  data = {
    name: "Guy Smiley",
    handle: "smileGuy",
    cash: 1000,
    created: "10/11/2023",
    history: {
      totalRollCount: 100,
      totalPointsHit: 20,
      totalWinnings: 500,
      totalLoans: 500,
      games: [
        {
          when: "10/01/2023",
          rolls: 40,
          pointsHit: 20,
          rolls: [
            {
              activeBets: [
                {
                  zone: "passLine",
                  amount: 5
                }
              ],
              point: 0,
              roll: 4
            }
          ]
        },
        {
          when: "10/02/2023",
          rolls: 10,
          pointsHit: 0,
          rolls: [
            {
              activeBets: [],
              point: 0,
              roll: 7
            },
            {
              activeBets: [],
              point: 0,
              roll: 10
            },
            {
              activeBets: [],
              point: 10,
              roll: 6
            },
            {
              activeBets: [],
              point: 10,
              roll: 10
            }
          ]
        },
        {
          when: "10/02/2023",
          rolls: 4,
          pointsHit: 0,
          rolls: [
            {
              activeBets: [
                {
                  zone: "passLine",
                  amount: 10
                }
              ],
              point: 0,
              roll: 7
            },
            {
              activeBets: [
                {
                  zone: "passLine",
                  amount: 10
                }
              ],
              point: 0,
              roll: 11
            },
            {
              activeBets: [
                {
                  zone: "passLine",
                  amount: 10
                },
                {
                  zone: "field",
                  amount: 5
                }
              ],
              point: 0,
              roll: 6
            },
            {
              activeBets: [
                {
                  zone: "passLine",
                  amount: 10
                },
                {
                  zone: "passLineOdds",
                  amount: 30
                }
              ],
              point: 6,
              roll: 7
            }
          ]
        }
      ],
      loans: [
        {
          when: "10/01/2023",
          amount: 500,
          paid: false
        }
      ]
    }
  }

  getData() {
    return this.data;
  }

}

export default new ProfileStore();
