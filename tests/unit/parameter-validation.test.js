const {
  validateSplit,
  validateOverlap,
  validateModel
} = require('../../src/parameter-validation');

describe('Parameter Validation Tests', () => {
  describe('validateSplit', () => {
    describe('valid values', () => {
      test('should accept valid integer within range 1-100', () => {
        expect(validateSplit(50)).toBe(50);
        expect(validateSplit('50')).toBe(50);
        expect(validateSplit(1)).toBe(1);
        expect(validateSplit(100)).toBe(100);
      });
    });

    describe('invalid range values', () => {
      test('should reject value 0', () => {
        expect(() => validateSplit(0)).toThrow('Split percentage must be between 1 and 100');
      });

      test('should reject value 101', () => {
        expect(() => validateSplit(101)).toThrow('Split percentage must be between 1 and 100');
      });

      test('should reject negative value -5', () => {
        expect(() => validateSplit(-5)).toThrow('Split percentage must be between 1 and 100');
      });

      test('should reject value 150', () => {
        expect(() => validateSplit(150)).toThrow('Split percentage must be between 1 and 100');
      });
    });

    describe('non-integer values', () => {
      test('should reject decimal value 50.5', () => {
        expect(() => validateSplit(50.5)).toThrow('Split percentage must be between 1 and 100');
      });

      test('should reject string "abc"', () => {
        expect(() => validateSplit('abc')).toThrow('Split percentage must be between 1 and 100');
      });

      test('should reject null', () => {
        expect(() => validateSplit(null)).toThrow('Split percentage must be between 1 and 100');
      });

      test('should reject undefined', () => {
        expect(() => validateSplit(undefined)).toThrow('Split percentage must be between 1 and 100');
      });

      test('should reject empty string', () => {
        expect(() => validateSplit('')).toThrow('Split percentage must be between 1 and 100');
      });
    });
  });

  describe('validateOverlap', () => {
    describe('valid values', () => {
      test('should accept valid integer within range 0-99999', () => {
        expect(validateOverlap(10)).toBe(10);
        expect(validateOverlap('10')).toBe(10);
        expect(validateOverlap(0)).toBe(0);
        expect(validateOverlap(99999)).toBe(99999);
      });
    });

    describe('invalid range values', () => {
      test('should reject value -1', () => {
        expect(() => validateOverlap(-1)).toThrow('Overlap lines must be between 0 and 99999');
      });

      test('should reject value 100000', () => {
        expect(() => validateOverlap(100000)).toThrow('Overlap lines must be between 0 and 99999');
      });

      test('should reject value -50', () => {
        expect(() => validateOverlap(-50)).toThrow('Overlap lines must be between 0 and 99999');
      });
    });

    describe('non-integer values', () => {
      test('should reject decimal value 10.5', () => {
        expect(() => validateOverlap(10.5)).toThrow('Overlap lines must be between 0 and 99999');
      });

      test('should reject string "xyz"', () => {
        expect(() => validateOverlap('xyz')).toThrow('Overlap lines must be between 0 and 99999');
      });

      test('should reject null', () => {
        expect(() => validateOverlap(null)).toThrow('Overlap lines must be between 0 and 99999');
      });

      test('should reject undefined', () => {
        expect(() => validateOverlap(undefined)).toThrow('Overlap lines must be between 0 and 99999');
      });

      test('should reject empty string', () => {
        expect(() => validateOverlap('')).toThrow('Overlap lines must be between 0 and 99999');
      });
    });
  });

  describe('validateModel', () => {
    describe('valid model names', () => {
      test('should accept valid Claude model names', () => {
        expect(validateModel('claude-3-sonnet-20240229')).toBe('claude-3-sonnet-20240229');
        expect(validateModel('claude-3-opus-20240229')).toBe('claude-3-opus-20240229');
        expect(validateModel('claude-3-haiku-20240307')).toBe('claude-3-haiku-20240307');
      });

      test('should accept valid model aliases', () => {
        expect(validateModel('sonnet')).toBe('sonnet');
        expect(validateModel('opus')).toBe('opus');
        expect(validateModel('haiku')).toBe('haiku');
      });

      test('should trim whitespace from valid model names', () => {
        expect(validateModel('  sonnet  ')).toBe('sonnet');
        expect(validateModel('\topus\n')).toBe('opus');
      });
    });

    describe('model parameter handling', () => {
      test('should accept any valid string model name', () => {
        expect(validateModel('invalid-model')).toBe('invalid-model');
        expect(validateModel('gpt-4')).toBe('gpt-4');
        expect(validateModel('claude-4-super-new')).toBe('claude-4-super-new');
      });

      test('should accept empty model parameters as optional', () => {
        expect(validateModel('')).toBeUndefined();
        expect(validateModel('   ')).toBeUndefined();
        expect(validateModel(null)).toBeUndefined();
        expect(validateModel(undefined)).toBeUndefined();
      });

      test('should reject non-string model parameter', () => {
        expect(() => validateModel(123)).toThrow('Model must be a string');
        expect(() => validateModel({})).toThrow('Model must be a string');
        expect(() => validateModel([])).toThrow('Model must be a string');
      });
    });
  });
});