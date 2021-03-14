#!/bin/sh

export PGHOST="localhost"
export PGPORT=5432
export PGDATABASE="spune"

# Reads params from env vars above
createdb -e $PGDATABASE

# Add the session table required for `connect-pg-simple`
psql -e -v -d spune < node_modules/connect-pg-simple/table.sql

# Add model tables
psql -e -v -d spune < ./internal/user.sql
