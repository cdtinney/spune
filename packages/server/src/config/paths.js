const path = require('path');

const CLIENT_HOST = process.env.CLIENT_HOST || '';

module.exports = {
  clientBuildFolder: path.join(__dirname, '../../../client/build'),
  clientHome: `${CLIENT_HOST}/#/visualization`,
  clientLogin: `${CLIENT_HOST}/#/login`,
};
