Messsaging:

Channel:
A channel is a way to organise user access and message
```
{
    _id: ObjectId,
    attendee: [USER_ID],
    topic: String,
    createdAt: Date,
}

```


/user/me/channels

```javascript
{
  data: [CHANNEL, CHANNEL]
}
```


/channel/:channelId/messages?page=1

```javascript
{
	data: [Message, Message]
}
```


/message/

Message:
Typed record which can be display on front end.
Associated to Channel

```javascript
{
    _id: ObjectId,
	from: USER_ID, // populate
	type: ENUM_STRING, //TEXT, AIA_INTERNAL_MAIL
	date: Date,
    channel: String,
	body: String,
	attachment: {
		type: ENUM_STRING,
        url: URL,
		lan: Number,
		loc: Number
    }
}
```

