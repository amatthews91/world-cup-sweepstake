import getPlayersWithPoints, { comparePlayers } from './pointsCalculator';

describe('points calculator', () => {
  describe('comparing player scores', () => {
    test('puts B first if B points higher', () => {
      expect(comparePlayers({ points: 5 }, { points: 10 })).toEqual(1);
    });

    test('puts A first if A points higher', () => {
      expect(comparePlayers({ points: 10 }, { points: 5 })).toEqual(-1);
    });

    describe('if both player\'s points are the same', () => {
      test('puts B first if B predicted is closest to total goals', () => {
        expect(comparePlayers({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 6 }, 10)).toEqual(1);
      });

      test('puts A first if A predicted is closest to total goals', () => {
        expect(comparePlayers({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 6 }, 4)).toEqual(-1);
      });
    })

    describe('if both players prediction is the same distance from total goals', () => {
      test('puts B first if B predicted under total goals & A went over.', () => {
        expect(comparePlayers({ points: 10, goalsPredicted: 15 }, { points: 10, goalsPredicted: 5 }, 10)).toEqual(1);
      });

      test('puts A first if A predicted under total goals & B went over.', () => {
        expect(comparePlayers({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 15 }, 10)).toEqual(-1);
      });
    });

    test('returns equal if A & B have same points & predicted same total goals', () => {
      expect(comparePlayers({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 5 }, 10)).toEqual(0);
    });
  });

  describe('calculate points for players', () => {

    const player1 = {
      teams: {
        goals: ['England', 'Germany'],
        outcomes: [ 'Italy', 'France', 'Spain' ]
      },
      goalsPredicted: 10
    };

    const player2 = {
      teams: {
        goals: ['France', 'Italy'],
        outcomes: [ 'Germany', 'England', 'Spain' ]
      },
      goalsPredicted: 10
    };

    const teams = {
      'England': {
        goals: 5,
        wins: 3,
        draws: 0,
        losses: 0
      },
      'Germany': {
        goals: 3,
        wins: 0,
        draws: 0,
        losses: 0
      },
      'Italy': {
        goals: 2,
        wins: 1,
        draws: 0,
        losses: 0
      },
      'France': {
        goals: 0,
        wins: 2,
        draws: 0,
        losses: 1
      },
      'Spain': {
        goals: 1,
        wins: 0,
        draws: 2,
        losses: 1
      }
    };

    test('correctly calculates player points', () => {
      expect(getPlayersWithPoints([ player1 ], teams)[0].points).toEqual(19);
      expect(getPlayersWithPoints([ player2 ], teams)[0].points).toEqual(13);
    });
  });
});
