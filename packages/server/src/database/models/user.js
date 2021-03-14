const { DataTypes } = require('sequelize');
const logger = require('../../logger');

class User {
  constructor(database) {
    this.model = database.defineModel('User', {
      spotifyId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      spotifyAccessToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      spotifyRefreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tokenUpdated: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      expiresIn: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
    });
  }

  async findOne(whereCondition, done) {
    const model = await this.model.findOne(whereCondition);
    done(null, model);
    return model;
  }

  async findOneAndUpdate(refreshToken, userAttributes, done) {
    const model = await this.model.findOne({
      where: {
        spotifyRefreshToken: refreshToken,
      },
    });
    if (model === null) {
      done(new Error('No model found'));
      return null;
    }

    const updatedModel = await this.model.update(userAttributes, {
      where: {
        spotifyId: model.spotifyId,
      },
    });
    done(null, updatedModel);
    return updatedModel;
  }

  async upsert(spotifyId, userAttributes, done) {
    const existingModel = this.findOne({
      where: {
        spotifyId,
      },
    });
    if (existingModel === null) {
      const newModel = await this.model.create(userAttributes);
      logger.info(`Created new model with Spotify ID: ${newModel.spotifyId}`);
      done(null, newModel);
      return newModel;
    }

    const updatedModel = await this.model.update(userAttributes, {
      where: {
        spotifyId,
      },
    });
    logger.info(`Updated model with Spotify ID: ${updatedModel.spotifyId}`);
    done(null, updatedModel);
    return updatedModel;
  }
}

module.exports = User;
