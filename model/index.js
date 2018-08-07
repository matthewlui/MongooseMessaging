const channel = require('./channel');
const message = require('./message');

function createMongooseModel({userModel, mongoose, connection}) {
  const Schema = mongoose.Schema;
  const channelSchema = channel({userModel, Schema});
  const messageSchema = message({userModel, Schema});
  const channelModel = connection.model('Channel', channelSchema);
  const messageModel = connection.model('Message', messageSchema);
  return {
    Message: messageModel,
    Channel: channelModel,
    mongoose,
  };
}

module.exports = createMongooseModel;
