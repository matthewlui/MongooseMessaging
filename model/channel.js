function schema({userModel, Schema}) {
  return Schema({
    attendee: {
      type: [{type: String, ref: userModel}],
    },
    topic: String,
    createdAt: Date,
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  });
}

module.exports = schema;
