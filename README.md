**This is no longer maintained.**

![Spune Logo](packages/client/src/assets/spune_logo_small.png)

> Web-based Spotify display for your living room TV.

[![Build Status](https://travis-ci.org/cdtinney/spune.svg?branch=master)](https://travis-ci.org/cdtinney/spune) [![Coverage Status](https://coveralls.io/repos/github/cdtinney/spune/badge.svg?branch=master)](https://coveralls.io/github/cdtinney/spune?branch=master) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
  - [Inspiration](#inspiration)
  - [Technologies](#technologies)
- [Developing](#developing)
  - [Requirements](#requirements)
  - [Installing](#installing)
  - [Creating Spotify Client ID](#creating-spotify-client-id)
  - [Setting Environment Variables](#setting-environment-variables)
  - [Running](#running)
  - [Stopping](#stopping)
  - [Testing](#testing)
    - [Server](#server)
    - [Client](#client)
    - [Linting](#linting)
    - [Coveralls](#coveralls)
  - [Building](#building)
  - [Deploying](#deploying)
  - [Debugging](#debugging)
    - [Heroku](#heroku)
  - [Database](#database)
    - [Development](#development)
    - [Production](#production)
- [Thanks to..](#thanks-to)

## Introduction

Spune is a simple "Now Playing" visualizer for Spotify, inspired by desktop Zune software.

### Inspiration

Inspiration for building this is as follows:

1. Desktop Zune software is awesome to look at on your TV
2. Desktop Spotify software sucks to look at on your TV
3. Therefore, a client that shows what you're listening to in the style of Zune
must be awesome

Here are some screenshots of the glory that is Zune:

![Zune Player 1](./assets/player.png)

![Zune Player 2](./assets/player2.png)

### Technologies

Spune uses the following technologies:

* Client
  * React/Redux
  * Webpack
  * Jest
  * ESLint
* Server
  * Node.js/Express
  * Passport.js
  * MongoDB via Mongoose
  * Jest/Puppeteer/Supertest
  * ESLint
* CI/CD
  * Travis CI
  * Heroku
  * mLab MongoDB
  * Coveralls

## Developing

### Requirements

To run the application:

* [Node.js/npm](https://nodejs.org/en/)
* [Configured Spotify application](https://developer.spotify.com/dashboard/login)
* [MongoDB Community Server](https://www.mongodb.com/download-center/community)

For CI/CD:

* [Travis CI CLI](https://github.com/travis-ci/travis.rb#readme)
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Installing

Clone the repository (and navigate into it):

```
$ git clone git@github.com:cdtinney/spune.git
$ cd spune
```

Install dependencies for both server and client:

```
$ npm run bootstrap
```

### Creating Spotify Client ID

* Login to [the Spotify developer dashboard](https://developer.spotify.com/dashboard/applications)
* Create a new Client ID
  * Keep the page open so you can copy/paste the ID and secret next

### Setting Environment Variables

Create an `.env` file in the `packages/server` directory,
and set these **required** variables (for a local environment):

```
CLIENT_HOST = http://localhost:3000
SPOT_REDIRECT_URI = http://localhost:5000/api/callback
SPOT_CLIENT_ID = <CLIENT_ID>
SPOT_CLIENT_SECRET = <CLIENT_SECRET>
SESSION_SECRET = <SESSION_SECRET_STRING> # This can be anything
```

In production, replace `localhost:port` with the URL it's being hosted at.

There are also optional variables:

```
MONGODB_URI = <MONGODB_URI> # Defaults to mongodb://localhost:27107:spune
```

### Running

First, **ensure that the MongoDB daemon is running** (e.g. run `mongod` in a separate terminal).

To run both client and server, in watch mode:

```
$ npm run watch
```

To run the client in watch mode:

```
$ npm run client:watch
```

To run the server in watch mode:

```
$ npm run server:watch
```

To run server in non-watch mode:

```
$ npm run server:start
```

### Stopping

To stop a running development server, use `Ctrl+C` to gracefully shut it down.

If you accidentally use `Ctrl+Z`, you will have to manually kill the old processes to free up the ports.
This can be done via finding the process IDs (PIDs):

```
$ ps -A | egrep "start.js|app.js"
$ kill -9 <SERVER_PID> <CLIENT_PID>
```

### Testing

To run all tests with coverage:

```
$ npm run test
```

#### Server

To run server tests in watch mode:

```
$ npm run server:test
```

To run server tests with coverage:

```
$ npm run server:test:coverage
```

To run integration tests (**NOTE: this requires a client production build to exist in `packages/client/build`**):

```
$ npm run server:test:integration
```

#### Client

To run client tests in watch mode:

```
$ npm run client:test
```

To run client tests with coverage:

```
$ npm run client:test:coverage
```

#### Linting

To lint the server:

```
$ npm run server:lint
```

#### Coveralls

**In order to use Coveralls locally, you must configure `.coveralls.yml` in the root directory
with `repo_token` set.**

For example:

```
repo_token: foobar1234
```

To run all tests and and report to Coveralls:

```
$ npm run test:coveralls
```

### Building

To build the client:

```
$ npm run client:build
```

### Deploying

The application is deployed to Heroku via Travis CI, with a single dyno
serving both the static React front-end and API requests.

To deploy to Herokua via Travis CI:

1. Connect the repository on Travis CI as a new project
1. [Set environment variables](#setting-environment-variables) for Travis CI in order for tests to run
      * Required variables:
        * `SPOT_REDIRECT_URI`
        * `SPOT_CLIENT_ID`
        * `SPOT_CLIENT_SECRET`
        * `SESSION_SECRET`
1. Create a new Heroku application (e.g. `spune-fork-foo`)
1. [Set config variables](#setting-environment-variables) for the Heroku application
      * Required variables:
        * `SPOT_REDIRECT_URI`
        * `SPOT_CLIENT_ID`
        * `SPOT_CLIENT_SECRET`
        * `SESSION_SECRET`
        * `MONGODB_URI` - this should be set automatically after the next step
1. Add the [mLab MongoDB add-on](https://elements.heroku.com/addons/mongolab)
      * This will automatically set the `MONGODB_URI` environment variable
1. [Update the Heroku API key in `.travis.yml`](https://docs.travis-ci.com/user/deployment/heroku/)
1. Update the Heroku app name

All commits to `master` should be deployed (by default).

### Debugging

TODO Expand this section

#### Heroku

To view Heroku application logs (in real-time):

```
$ heroku logs -a <APP_NAME> --tail
```

### Database

#### Development

Development database debugging can be done via the MongoDB shell.

To access the shell and switch to the Spune database:

```
$ mongo
> use spune
```

To view all records in a collection (e.g. `users`):

```
> db.users.find().pretty()
```

To quit, press `Ctrl + C`.

#### Production

Production database debugging (e.g. deleting invalid documents) can be done via
the [mLab UI](https://www.mlab.com/home).

## Thanks to..

Resources used:

* [Deploying a React app alongside a server to Heroku](https://www.fullstackreact.com/articles/deploying-a-react-app-with-a-server/)
* [Spotify Auth With React + React-Router](https://github.com/kauffecup/spotify-react-router-auth)
* Zune and Spotify, obviously
