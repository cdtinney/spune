'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const initApp_1 = __importDefault(require('./src/initApp'));
const initServer_1 = __importDefault(require('./src/initServer'));
(0, initServer_1.default)((0, initApp_1.default)());
//# sourceMappingURL=app.js.map
