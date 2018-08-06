function generateCooke(numChars) {
    return (Math.random().toString(36) + Array(numChars).join('0'))
        .slice(2, numChars + 2);
}

module.exports = generateCooke;
