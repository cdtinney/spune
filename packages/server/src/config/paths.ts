import path from 'path';

const CLIENT_HOST: string = process.env.CLIENT_HOST || '';

// Resolve to the server package root from src/config/.
// In dev:  __dirname = .../server/src/config       → up 2 = server root
// In prod: __dirname = .../server/dist/src/config   → up 3 = server root
const inDist = __dirname.includes(`${path.sep}dist${path.sep}`);
const serverRoot = path.resolve(__dirname, ...Array(inDist ? 3 : 2).fill('..'));
const monorepoRoot = path.resolve(serverRoot, '..', '..');

export default {
  clientBuildFolder: path.join(monorepoRoot, 'packages', 'client', 'build'),
  clientHome: `${CLIENT_HOST}/#/visualization`,
  clientLogin: `${CLIENT_HOST}/#/login`,
};
