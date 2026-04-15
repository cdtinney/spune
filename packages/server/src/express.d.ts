import type { User as AppUser } from './types';

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
