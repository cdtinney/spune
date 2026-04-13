// Polyfill TextEncoder/TextDecoder for pg module (needed by Jest 23)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
