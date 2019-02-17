module.exports = function generateCookie(numChars) {
  return (Math.random().toString(36) + Array(numChars).join('0'))
    .slice(2, numChars + 2);
};
