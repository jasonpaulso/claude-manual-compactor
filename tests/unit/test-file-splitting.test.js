/**
 * Unit tests for file splitting logic
 * Tests the splitFile function with various scenarios and edge cases
 */

const fs = require('fs');
const path = require('path');
const { splitFile } = require('../../src/file-splitting');

// Mock fs module for testing
jest.mock('fs');

/**
 * Helper function to generate test data
 * @param {number} lineCount - Number of lines to generate
 * @param {string} prefix - Prefix for each line
 * @returns {string[]} Array of generated lines
 */
function generateTestLines(lineCount, prefix = 'Line') {
  return Array.from({ length: lineCount }, (_, i) => `${prefix} ${i + 1}`);
}

/**
 * Helper function to verify content integrity
 * @param {string[]} originalLines - Original file lines
 * @param {string[]} part1 - First part
 * @param {string[]} part2 - Second part
 * @param {number} overlapLines - Number of overlapping lines
 * @returns {boolean} True if content integrity is maintained
 */
function verifyContentIntegrity(originalLines, part1, part2, overlapLines) {
  // Verify that all original lines are present when accounting for overlap
  const combinedLines = [...part1, ...part2.slice(overlapLines)];
  
  if (combinedLines.length !== originalLines.length) {
    return false;
  }
  
  for (let i = 0; i < originalLines.length; i++) {
    if (combinedLines[i] !== originalLines[i]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Helper function to verify overlapping lines are identical
 * @param {string[]} part1 - First part
 * @param {string[]} part2 - Second part
 * @param {number} overlapLines - Number of overlapping lines
 * @returns {boolean} True if overlapping lines are identical
 */
function verifyOverlapIntegrity(part1, part2, overlapLines) {
  if (overlapLines === 0) return true;
  
  const part1OverlapStart = Math.max(0, part1.length - overlapLines);
  const part1Overlap = part1.slice(part1OverlapStart);
  const part2Overlap = part2.slice(0, Math.min(overlapLines, part2.length));
  
  if (part1Overlap.length !== part2Overlap.length) {
    return false;
  }
  
  for (let i = 0; i < part1Overlap.length; i++) {
    if (part1Overlap[i] !== part2Overlap[i]) {
      return false;
    }
  }
  
  return true;
}

describe('File Splitting Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Splitting Functionality', () => {
    test('should split 100-line file at 50% with 10 lines overlap', () => {
      const lines = generateTestLines(100);
      const result = splitFile(lines, 50, 10);
      
      expect(result.part1).toHaveLength(60); // 50 + 10 overlap
      expect(result.part2).toHaveLength(50); // 50 remaining lines
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[49]).toBe('Line 50');
      expect(result.part1[59]).toBe('Line 60'); // Now includes overlap
      expect(result.part2[0]).toBe('Line 51'); // part1End - overlap + 1
      expect(result.part2[result.part2.length - 1]).toBe('Line 100');
    });

    test('should split 80-line file at 25% with 5 lines overlap', () => {
      const lines = generateTestLines(80);
      const result = splitFile(lines, 25, 5);
      
      expect(result.part1).toHaveLength(25); // 20 + 5 overlap
      expect(result.part2).toHaveLength(60); // 60 remaining lines
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[19]).toBe('Line 20');
      expect(result.part1[24]).toBe('Line 25'); // Now includes overlap
      expect(result.part2[0]).toBe('Line 21'); // part1End - overlap + 1
      expect(result.part2[result.part2.length - 1]).toBe('Line 80');
    });

    test('should split 60-line file at 75% with 0 lines overlap', () => {
      const lines = generateTestLines(60);
      const result = splitFile(lines, 75, 0);
      
      expect(result.part1).toHaveLength(45);
      expect(result.part2).toHaveLength(15);
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[44]).toBe('Line 45');
      expect(result.part2[0]).toBe('Line 46');
      expect(result.part2[14]).toBe('Line 60');
    });
  });

  describe('Edge Cases', () => {
    test('should handle very small file (1 line)', () => {
      const lines = generateTestLines(1);
      const result = splitFile(lines, 50, 0);
      
      expect(result.part1).toHaveLength(1);
      expect(result.part2).toHaveLength(0);
      expect(result.part1[0]).toBe('Line 1');
    });

    test('should handle very small file (2 lines)', () => {
      const lines = generateTestLines(2);
      const result = splitFile(lines, 50, 1);
      
      expect(result.part1).toHaveLength(2); // 1 + 1 overlap
      expect(result.part2).toHaveLength(1); // 1 remaining line
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[1]).toBe('Line 2'); // Now includes overlap
      expect(result.part2[0]).toBe('Line 2'); // Overlap line
    });

    test('should handle very small file (5 lines)', () => {
      const lines = generateTestLines(5);
      const result = splitFile(lines, 40, 1);
      
      expect(result.part1).toHaveLength(3); // 2 + 1 overlap
      expect(result.part2).toHaveLength(3); // 3 remaining lines
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[1]).toBe('Line 2');
      expect(result.part1[2]).toBe('Line 3'); // Now includes overlap
      expect(result.part2[0]).toBe('Line 3'); // Overlap line
      expect(result.part2[2]).toBe('Line 5');
    });

    test('should handle split at 1% boundary', () => {
      const lines = generateTestLines(100);
      const result = splitFile(lines, 1, 0);
      
      expect(result.part1).toHaveLength(1);
      expect(result.part2).toHaveLength(99);
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part2[0]).toBe('Line 2');
    });

    test('should handle split at 100% boundary', () => {
      const lines = generateTestLines(50);
      const result = splitFile(lines, 100, 0);
      
      expect(result.part1).toHaveLength(50);
      expect(result.part2).toHaveLength(0);
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[49]).toBe('Line 50');
    });

    test('should handle overlap larger than part_1 size', () => {
      const lines = generateTestLines(10);
      const result = splitFile(lines, 30, 5); // part1 = 3 lines, overlap = 5
      
      expect(result.part1).toHaveLength(6); // 3 + 3 limited overlap
      expect(result.part2).toHaveLength(7); // 7 remaining lines
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[2]).toBe('Line 3');
      expect(result.part1[5]).toBe('Line 6'); // Includes overlap
      expect(result.part2[0]).toBe('Line 4'); // Overlap starts here
      expect(result.part2[6]).toBe('Line 10');
    });

    test('should handle overlap equal to total file size', () => {
      const lines = generateTestLines(5);
      const result = splitFile(lines, 50, 5);
      
      expect(result.part1).toHaveLength(4); // 2 + 2 limited overlap
      expect(result.part2).toHaveLength(3); // 3 remaining lines
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[1]).toBe('Line 2');
      expect(result.part1[3]).toBe('Line 4'); // Includes overlap
      expect(result.part2[0]).toBe('Line 3'); // Overlap starts here
      expect(result.part2[2]).toBe('Line 5');
    });
  });

  describe('Boundary Conditions', () => {
    test('should handle overlap = 0', () => {
      const lines = generateTestLines(20);
      const result = splitFile(lines, 50, 0);
      
      expect(result.part1).toHaveLength(10);
      expect(result.part2).toHaveLength(10);
      expect(result.part1[9]).toBe('Line 10');
      expect(result.part2[0]).toBe('Line 11');
    });

    test('should handle overlap = 99999 (very large)', () => {
      const lines = generateTestLines(10);
      const result = splitFile(lines, 50, 99999);
      
      expect(result.part1).toHaveLength(10); // 5 + 5 limited overlap (all lines)
      expect(result.part2).toHaveLength(5); // 5 remaining lines
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[4]).toBe('Line 5');
      expect(result.part1[9]).toBe('Line 10'); // Includes all overlap
      expect(result.part2[0]).toBe('Line 6'); // Overlap starts here
      expect(result.part2[4]).toBe('Line 10');
    });

    test('should handle split = 1', () => {
      const lines = generateTestLines(100);
      const result = splitFile(lines, 1, 0);
      
      expect(result.part1).toHaveLength(1);
      expect(result.part2).toHaveLength(99);
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part2[0]).toBe('Line 2');
    });

    test('should handle split = 100', () => {
      const lines = generateTestLines(50);
      const result = splitFile(lines, 100, 0);
      
      expect(result.part1).toHaveLength(50);
      expect(result.part2).toHaveLength(0);
      expect(result.part1[0]).toBe('Line 1');
      expect(result.part1[49]).toBe('Line 50');
    });
  });

  describe('Content Integrity', () => {
    test('should verify part_1 + part_2 contains all original content with overlap accounted for', () => {
      const lines = generateTestLines(50);
      const result = splitFile(lines, 60, 8);
      
      expect(verifyContentIntegrity(lines, result.part1, result.part2, 8)).toBe(true);
    });

    test('should verify overlapping lines are identical', () => {
      const lines = generateTestLines(30);
      const result = splitFile(lines, 50, 5);
      
      expect(verifyOverlapIntegrity(result.part1, result.part2, 5)).toBe(true);
    });

    test('should verify line order is preserved', () => {
      const lines = generateTestLines(40);
      const result = splitFile(lines, 70, 3);
      
      // Check that lines are in order in part1
      for (let i = 0; i < result.part1.length - 1; i++) {
        const currentLineNum = parseInt(result.part1[i].split(' ')[1]);
        const nextLineNum = parseInt(result.part1[i + 1].split(' ')[1]);
        expect(nextLineNum).toBe(currentLineNum + 1);
      }
      
      // Check that lines are in order in part2
      for (let i = 0; i < result.part2.length - 1; i++) {
        const currentLineNum = parseInt(result.part2[i].split(' ')[1]);
        const nextLineNum = parseInt(result.part2[i + 1].split(' ')[1]);
        expect(nextLineNum).toBe(currentLineNum + 1);
      }
    });

    test('should handle complex content integrity test', () => {
      const lines = generateTestLines(100);
      const result = splitFile(lines, 45, 12);
      
      // Verify content integrity
      expect(verifyContentIntegrity(lines, result.part1, result.part2, 12)).toBe(true);
      
      // Verify overlap integrity
      expect(verifyOverlapIntegrity(result.part1, result.part2, 12)).toBe(true);
      
      // Verify expected lengths
      expect(result.part1).toHaveLength(57); // 45 + 12 overlap
      expect(result.part2).toHaveLength(55); // 55 remaining lines
    });
  });

  describe('Error Handling', () => {
    test('should throw error for empty lines array', () => {
      expect(() => splitFile([], 50, 10)).toThrow('Lines must be a non-empty array');
    });

    test('should throw error for null lines', () => {
      expect(() => splitFile(null, 50, 10)).toThrow('Lines must be a non-empty array');
    });

    test('should throw error for undefined lines', () => {
      expect(() => splitFile(undefined, 50, 10)).toThrow('Lines must be a non-empty array');
    });

    test('should throw error for invalid split percentage (0)', () => {
      const lines = generateTestLines(10);
      expect(() => splitFile(lines, 0, 5)).toThrow('Split percentage must be between 1 and 100');
    });

    test('should throw error for invalid split percentage (101)', () => {
      const lines = generateTestLines(10);
      expect(() => splitFile(lines, 101, 5)).toThrow('Split percentage must be between 1 and 100');
    });

    test('should throw error for negative overlap lines', () => {
      const lines = generateTestLines(10);
      expect(() => splitFile(lines, 50, -1)).toThrow('Overlap lines must be non-negative');
    });
  });

  describe('Performance and Memory Tests', () => {
    test('should handle large files efficiently', () => {
      const lines = generateTestLines(10000);
      const startTime = Date.now();
      const result = splitFile(lines, 30, 100);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
      expect(result.part1).toHaveLength(3100); // 3000 + 100 overlap
      expect(result.part2).toHaveLength(7000); // 7000 remaining lines
    });

    test('should not modify original lines array', () => {
      const originalLines = generateTestLines(20);
      const linesCopy = [...originalLines];
      const result = splitFile(originalLines, 50, 5);
      
      expect(originalLines).toEqual(linesCopy);
      expect(result.part1).not.toBe(originalLines);
      expect(result.part2).not.toBe(originalLines);
    });
  });
});