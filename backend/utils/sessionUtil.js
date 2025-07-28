export const generateTitle = (prompt) => {
  return prompt.split(' ').slice(0, 3).join(' ') + (prompt.split(' ').length > 3 ? '...' : '');
};


export const extractCode = (gptResponse) => {
  
  if (!gptResponse) return '';

  
  const codeBlocks = gptResponse.match(/```(?:[a-z]*\n)?([\s\S]+?)```/gi);
  if (codeBlocks) {
    const lastBlock = codeBlocks[codeBlocks.length - 1];
    return lastBlock.replace(/```.*\n?|\```/g, '').trim();
  }

  
  const markerMatch = gptResponse.match(/(\/{5,}|={5,})([\s\S]+?)(\/{5,}|={5,})/);
  if (markerMatch) return markerMatch[2].trim();


  return gptResponse.trim();
};