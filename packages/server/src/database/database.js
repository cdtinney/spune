const { Sequelize } = require('sequelize');
const User = require('./models/user');
const logger = require('../logger');

class Database {
  constructor(
    host = process.env.PGHOST,
    databaseName = process.env.PGDATABASE,
  ) {
    this.dbInstance = new Sequelize({
      dialect: 'postgres',
      host,
      database: databaseName,
    });
    this.Models = {
      User: new User(this),
    };
  }

  defineModel(modelName, attributes) {
    this.dbInstance.define(modelName, attributes);
  }

  async connect() {
    try {
      await this.dbInstance.authenticate();
      logger.info('Connection has been established successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
    }
  }

  async disconnect() {
    try {
      await this.dbInstance.close();
      logger.info('Connection has been closed successfully.');
    } catch (error) {
      logger.error('Unable to close the connection:', error);
    }
  }

  static getInstance() {
    if (Database.Instance !== null) {
      return Database.Instance;
    }

    Database.Instance = new Database();
    return Database.Instance;
  }
}

module.exports = Database;
