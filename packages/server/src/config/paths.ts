import path from 'path';

const CLIENT_HOST: string = process.env.CLIENT_HOST || '';

// Resolve relative to the server package root (2 levels up from src/config/)
// This works for both dev (running from src/) and prod (running from dist/src/)
const serverRoot = path.resolve(__dirname, '..', '..');
const monorepoRoot = path.resolve(serverRoot, '..', '..');

export default {
  clientBuildFolder: path.join(monorepoRoot, 'packages', 'client', 'build'),
  clientHome: `${CLIENT_HOST}/#/visualization`,
  clientLogin: `${CLIENT_HOST}/#/login`,
};
