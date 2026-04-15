'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = configurePassport;
const serializeUser_1 = __importDefault(require('./serialization/serializeUser'));
const deserializeUser_1 = __importDefault(require('./serialization/deserializeUser'));
const passportStrategy_1 = __importDefault(require('../spotify/auth/passportStrategy'));
function configurePassport(passport) {
  passport.serializeUser(serializeUser_1.default);
  passport.deserializeUser(deserializeUser_1.default);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.use((0, passportStrategy_1.default)());
}
//# sourceMappingURL=configurePassport.js.map
