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
  - [Testing](#testing)
  - [Building](#building)
  - [Deploying](#deploying)
  - [Debugging](#debugging)
- [Thanks to..](#thanks-to)

## Developing

### Requirements

* [Node.js/npm](https://nodejs.org/en/)
* [Configured Spotify application](https://developer.spotify.com/dashboard/login)
* (optional) [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Installing

Clone the repository (and navigate into it):

```
$ git clone git@github.com:cdtinney/spune.git
$ cd spune
```

Install dependencies:

```
$ npm install
```

### Creating Spotify Client ID

* Login to the Spotify developer dashboard [here](https://developer.spotify.com/dashboard/applications)
* Create a new Client ID (and keep the page open)

### Setting Environment Variables

Create an `.env` file in the root directory, and set these variables:

```
CLIENT_HOST = http://localhost:3000 # Local Webpack dev server host
SPOT_REDIRECT_URI = http://localhost:5000/api/callback # Local Node.js server host
SPOT_CLIENT_ID = <CLIENT_ID>
SPOT_CLIENT_SECRET = <CLIENT_SECRET>
```

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
$ npm run server
```

To run server only (non-watch mode):

```
$ npm run start
```

### Testing

To run client tests (in watch mode):

```
$ npm run client-test
```

### Building

To build the client:

```
$ npm run client-build
```

### Deploying

This project was made to be deployed to Heroku, with a single dyno serving both the static React front-end and API requests.

To deploy via Heroku and GitHub:

1. Create a new project on Heroku
2. Connect the project to the GitHub repository
3. Set environment variables:

    ```
    heroku config:set SPOT_REDIRECT_URI=https://<PROJECT_NAME>.herokuapp.com/api/callback -a <PROJECT_NAME>
    heroku config:set SPOT_CLIENT_ID=<INSERT_CLIENT_ID> -a <PROJECT_NAME>
    heroku config:set SPOT_CLIENT_SECRET=<INSERT_CLIENT_SECRET> -a <PROJECT_NAME>
    ```

### Debugging

TODO

## Thanks to..

Resources used:

* [Deploying a React app alongside a server to Heroku](https://www.fullstackreact.com/articles/deploying-a-react-app-with-a-server/)
* [Spotify Auth With React + React-Router](https://github.com/kauffecup/spotify-react-router-auth)
