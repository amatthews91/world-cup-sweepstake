const compare = require('../playerService').comparePlayers;

describe('player service', () => {
  describe('comparing player scores', () => {
    test('puts B first if B points higher', () => {
      expect(compare({ points: 5 }, { points: 10 })).toEqual(1);
    });

    test('puts A first if A points higher', () => {
      expect(compare({ points: 10 }, { points: 5 })).toEqual(-1);
    });

    describe('if both player\'s points are the same', () => {
      test('puts B first if B predicted is closest to total goals', () => {
        expect(compare({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 6 }, 10)).toEqual(1);
      });

      test('puts A first if A predicted is closest to total goals', () => {
        expect(compare({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 6 }, 4)).toEqual(-1);
      });
    })

    describe('if both players prediction is the same distance from total goals', () => {
      test('puts B first if B predicted under total goals & A went over.', () => {
        expect(compare({ points: 10, goalsPredicted: 15 }, { points: 10, goalsPredicted: 5 }, 10)).toEqual(1);
      });

      test('puts A first if A predicted under total goals & B went over.', () => {
        expect(compare({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 15 }, 10)).toEqual(-1);
      });
    });

    test('returns equal if A & B have same points & predicted same total goals', () => {
      expect(compare({ points: 10, goalsPredicted: 5 }, { points: 10, goalsPredicted: 5 }, 10)).toEqual(0);
    });
  });
});
