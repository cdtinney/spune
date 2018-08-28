# spune
> Web-based Spotify display for your living room TV.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Configuration](#configuration)
    - [Installation](#installation)
    - [Usage](#usage)
- [Developing](#developing)
    - [Installing](#installing)
    - [Running](#running)
    - [Testing](#testing)
    - [Debugging](#debugging)
    - [Building](#building)
    - [Deploying](#deploying)

## Getting Started

### Requirements

### Configuration

### Installation

### Usage

## Developing

### Installing

To install dependencies:

```
npm install
```

### Running

To run both client and server:

```
npm run dev
```

To run client only:

```
npm run client
```

To run server only (watch mode):

```
npm run server
```

To run server only (non-watch mode):

```
npm run start
```

### Testing

To run client tests (in watch mode):

```
npm run client-test
```

### Debugging

### Building

To build the client:

```
npm run client-build
```

### Deploying

#### Environment Variables

```
heroku config:set SPOT_REDIRECT_URI=https://spune-vis.herokuapp.com/api/callback -a szune
heroku config:set SPOT_CLIENT_ID=INSERT_CLIENT_ID -a szune
heroku config:set SPOT_CLIENT_SECRET=INSERT_CLIENT_SECRET -a szune
```

## Thanks to..

Resources used:

* [Deploying a React app alongside a server to Heroku](https://www.fullstackreact.com/articles/deploying-a-react-app-with-a-server/)
* [Spotify Auth With React + React-Router](https://github.com/kauffecup/spotify-react-router-auth)
 