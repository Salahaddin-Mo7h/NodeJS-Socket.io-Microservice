import * as db from "./../../models";

export default function TextMessageEvents(
  socketIo,
  socket,
  user,
  userOnlineStatus
) {
  socket.on("chat.message.text", (roomId, payload, callback) => {
    const message = db.Message;
    let msg = {
      tenant: user.tenant,
      roomUid: roomId,
      messageType: "text",
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date(),
      data: payload,
    };
    message.create(msg).then((createdMessage) => {
      callback(createdMessage);
      socketIo
        .to(`${createdMessage.tenant}/${createdMessage.roomUid}`)
        .emit("chat.message", createdMessage);
    });
  });

  socket.on("chat.history", (roomId, lastSeenMessageTimestamp, callback) => {
    const message = db.Message;
    const sequelize = db.Sequelize;
    let query = {
      attributes: [
        "id",
        "tenant",
        "timestamp",
        "data",
        "roomUid",
        "senderName",
        "senderId",
        "messageType",
      ],
      where: {
        tenant: user.tenant,
        roomUid: roomId,
      },
      raw: true,
      order: [["timestamp", "DESC"]],
      limit: 10,
    };

    if (lastSeenMessageTimestamp) {
      query.where.timestamp = {
        [sequelize.Op.lt]: lastSeenMessageTimestamp,
      };
    }
    message.findAll(query).then((messages) => callback(messages.reverse()));
  });
}
