const model = require('./model');

/**
 * Module to handle messaging
 * @param userModel
 * @param mongoose
 * @param connection a mongodb connection
 * @param {Callback<Message>} hook will be called after message sent
 * @returns {Messaging}
 * @constructor
 */
function Messaging ({ userModel, mongoose, connection, sendHook, systemUserId }) {
  const result = model({ userModel, mongoose, connection });
  this.mongoose = mongoose;
  this._Message = result.Message;
  this._Channel = result.Channel;
  this.sendHook = sendHook;
  this.systemUserId = systemUserId;
  const refThis = this;

  /**
   * Create a message to send
   * @param messageBody
   * @param attachment
   * @returns {{from: *, body: *, attachment: *}}
   * @constructor
   */
  this.Message = function({ from, messageBody, attachment }) {
    return {
      from: from,
      body: messageBody,
      attachment: attachment
    }
  };

  /**
   * Create a channel
   * @param topic
   * @param attendee
   * @returns {Promise<*>}
   * @returns {Promise<Query>}
   */
  this.newChannel = async function({ topic, attendee }) {
    const channel = new refThis._Channel({ topic, attendee });
    return channel.save();
  };

  /**
   * Send message to a channel
   * @param {String} from user id
   * @param {String} channelId
   * @param {Object} message Message create by Messaging.Message
   * @returns {Promise<Query>}
   */
  this.sendMessage = async function({ channelId, message }) {
    const messageToSave = new this._Message(message);
    messageToSave.channel = channelId;
    messageToSave.date = new Date();
    const saved = await messageToSave.save();
    const channel = await refThis._Channel.findOne({_id: channelId});
    channel.latestMessage = messageToSave._id;
    await channel.save();
    if (refThis.sendHook && typeof refThis.sendHook === "function") {
        await refThis.sendHook({ message: saved, channel });
    }
    return saved;
  };

  /**
   * Find all messages across channel
   * @param {String} channelId
   * @param {Number} skip number to skip, ignore now
   * @param {Object} sorting sorting rule, ignore now
   * @returns {Promise<void|Query|number|*|T>}
   */
  this.messages = async function({ channelId, skip, sorting }) {
    // let id = channelId;
    // if (typeof channelId === String) {
    //   id = ObjectId(channelId);
    // }
    let query = refThis._Message.find({ channel: channelId });
    if (sorting) {
      query = query.sort(sorting);
    }
    if (skip) {
      query = query.skip(skip);
    }
    return query.populate('from');
  };

  this.myChannels = async function({ userId }) {
    return this.channelsForUser({ userId });
  };

  this.channelsForUser = async function({ userId }) {
    return refThis._Channel.find({ attendee: { $in: [userId] } }).populate('attendee').populate('latestMessage');
  };

  this.channelWithId = async function({ channelId }) {
    return refThis._Channel.findOne({ _id: channelId });
  };

  this.systemChannel = async function({ userId }) {
    return refThis._Channel.findOne({ attendee: { $in:[userId] }, isSystem: true }).populate('attendee').populate('latestMessage');
  };

  /**
   * Create a system channel with isSystem flag on, attendee will included both userId and systemUserId
   * @param userId
   * @param systemUserId
   * @returns {Promise<*>}
   */
  this.newSystemChannel = async function({ userId }) {
    const channel = new refThis._Channel({ topic: 'System', attendee: [userId, refThis.systemUserId], isSystem: true });
    return channel.save();
  };

  return this;
}

module.exports = Messaging;