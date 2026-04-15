'use strict';
// User table schema reference (see migrations/001_create_users.sql for DDL)
//
// columns:
//   id              SERIAL PRIMARY KEY
//   spotify_id      TEXT UNIQUE NOT NULL
//   spotify_access_token  TEXT
//   spotify_refresh_token TEXT
//   token_updated   BIGINT
//   expires_in      BIGINT
//   display_name    TEXT
//   photos          JSON
Object.defineProperty(exports, '__esModule', { value: true });
exports.tableName = void 0;
exports.tableName = 'users';
//# sourceMappingURL=User.js.map
