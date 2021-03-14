CREATE TABLE IF NOT EXISTS "user" (
  "id" varchar NOT NULL COLLATE "default",
  "spotifyId" varchar NOT NULL,
  "spotifyAccessToken" varchar NOT NULL,
  "spotifyRefreshToken" varchar NOT NULL,
  "tokenUpdated" bigint NOT NULL,
  "expiresIn" bigint NOT NULL,
  "displayName" varchar NOT NULL,
  "photos" text[] not NULL
);

ALTER TABLE "user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;
