'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('path'));
const CLIENT_HOST = process.env.CLIENT_HOST || '';
// Resolve relative to the server package root (2 levels up from src/config/)
// This works for both dev (running from src/) and prod (running from dist/src/)
const serverRoot = path_1.default.resolve(__dirname, '..', '..');
const monorepoRoot = path_1.default.resolve(serverRoot, '..', '..');
exports.default = {
  clientBuildFolder: path_1.default.join(monorepoRoot, 'packages', 'client', 'build'),
  clientHome: `${CLIENT_HOST}/#/visualization`,
  clientLogin: `${CLIENT_HOST}/#/login`,
};
//# sourceMappingURL=paths.js.map
