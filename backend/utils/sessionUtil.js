export const generateTitle = (prompt) => {
  return prompt.split(' ').slice(0, 3).join(' ') + (prompt.split(' ').length > 3 ? '...' : '');
};


export const extractCode = (gptResponse) => {
  // 1. Handle empty responses
  if (!gptResponse) return '';

  // 2. Extract the last code block (most likely the actual code)
  const codeBlocks = gptResponse.match(/```(?:[a-z]*\n)?([\s\S]+?)```/gi);
  if (codeBlocks) {
    const lastBlock = codeBlocks[codeBlocks.length - 1];
    return lastBlock.replace(/```.*\n?|\```/g, '').trim();
  }

  // 3. Fallback: Extract content between markers (e.g., /////)
  const markerMatch = gptResponse.match(/(\/{5,}|={5,})([\s\S]+?)(\/{5,}|={5,})/);
  if (markerMatch) return markerMatch[2].trim();

  // 4. Ultimate fallback: Return everything (assume it's pure code)
  return gptResponse.trim();
};