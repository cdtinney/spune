# spune
> Web-based Spotify display for your living room TV.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Developing](#developing)
  - [Requirements](#requirements)
  - [Installing](#installing)
  - [Creating Spotify Client ID](#creating-spotify-client-id)
  - [Setting Environment Variables](#setting-environment-variables)
  - [Running](#running)
  - [Stopping](#stopping)
  - [Testing](#testing)
  - [Building](#building)
  - [Deploying](#deploying)
  - [Debugging](#debugging)
- [Thanks to..](#thanks-to)

## Developing

### Requirements

To run the application:

* [Node.js/npm](https://nodejs.org/en/)
* [Configured Spotify application](https://developer.spotify.com/dashboard/login)

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
$ npm install
$ cd client && npm install
```

### Creating Spotify Client ID

* Login to [the Spotify developer dashboard](https://developer.spotify.com/dashboard/applications)
* Create a new Client ID
  * Keep the page open so you can copy/paste the ID and secret next

### Setting Environment Variables

Create an `.env` file in the root directory, and set these variables (for a local environment):

```
CLIENT_HOST = http://localhost:3000
SPOT_REDIRECT_URI = http://localhost:5000/api/callback
SPOT_CLIENT_ID = <CLIENT_ID>
SPOT_CLIENT_SECRET = <CLIENT_SECRET>
```

In production, replace `localhost:port` with the URL it's being hosted at.

### Running

To run both client and server:

```
$ npm run dev
```

To run client only:

```
$ npm run client
```

To run server only (watch mode):

```
$ npm run server:watch
```

To run server only (non-watch mode):

```
$ npm run server
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

To run client tests (in watch mode):

```
$ npm run client:test
```

### Building

To build the client:

```
$ npm run client:build
```

### Deploying

The application is deployed to Heroku via Travis CI, with a single dyno
serving both the static React front-end and API requests.

To deploy via Heroku and Travis CI:

1. Connect the repository on Travis CI as a new project
2. Create a new Heroku application (e.g. `spune`)
3. [Set config variables](#setting-environment-variables) for the Heroku application
      * Ensure that `SPOT_REDIRECT_URI`, `SPOT_CLIENT_ID`, and `SPOT_CLIENT_SECRET` are set correctly
4. [Update the Heroku API key in `.travis.yml`](https://docs.travis-ci.com/user/deployment/heroku/)
5. Update the Heroku app name

All commits to `master` should be deployed (by default).

### Debugging

TODO

## Thanks to..

Resources used:

* [Deploying a React app alongside a server to Heroku](https://www.fullstackreact.com/articles/deploying-a-react-app-with-a-server/)
* [Spotify Auth With React + React-Router](https://github.com/kauffecup/spotify-react-router-auth)
