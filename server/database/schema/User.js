const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  spotifyId: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
});
UserSchema.plugin(findOrCreate);
const User = mongoose.model('User', UserSchema);

module.exports = User;