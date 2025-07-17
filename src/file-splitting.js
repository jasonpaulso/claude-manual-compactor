// File splitting logic

function splitFile(lines, splitPercentage, overlapLines) {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error('Lines must be a non-empty array');
  }
  
  if (splitPercentage < 1 || splitPercentage > 100) {
    throw new Error('Split percentage must be between 1 and 100');
  }
  
  if (overlapLines < 0) {
    throw new Error('Overlap lines must be non-negative');
  }
  
  const totalLines = lines.length;
  const splitIndex = Math.floor((totalLines * splitPercentage) / 100);
  
  // Handle edge cases
  if (splitIndex === 0) {
    return {
      part1: [lines[0]],
      part2: lines.slice(1)
    };
  }
  
  if (splitIndex >= totalLines) {
    return {
      part1: lines.slice(),
      part2: []
    };
  }
  
  // Calculate overlap - both parts should share overlap lines
  const actualOverlap = Math.min(overlapLines, splitIndex, totalLines - splitIndex);
  const part1End = Math.min(splitIndex + actualOverlap, totalLines);
  const part2Start = Math.max(0, part1End - actualOverlap);
  
  return {
    part1: lines.slice(0, part1End),
    part2: lines.slice(part2Start)
  };
}

module.exports = { splitFile };