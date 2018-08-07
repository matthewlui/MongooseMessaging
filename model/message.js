function schema({userModel, Schema}) {
  return Schema({
    from: {
      type: String,
      ref: userModel,
    }, // populate
    type: {
      type: String,
      default: 'TEXT',
    }, // TEXT, AIA_INTERNAL_MAIL
    date: Date,
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
    },
    body: String,
    attachment: {
      type: String,
      url: String,
      lan: Number,
      loc: Number,
    },
  });
}

module.exports = schema;
