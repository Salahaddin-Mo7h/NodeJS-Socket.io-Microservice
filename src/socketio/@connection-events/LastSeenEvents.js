import * as db from "./../../models";

export default function LastSeenEvents(
  socketIo,
  socket,
  user,
  userOnlineStatus
) {
  socket.on("chat.update.seen", (roomUid, callback) => {
    let query = {
      attributes: ["id"],
      where: {
        tenant: user.tenant,
        roomUid,
        userId: user.id,
      },
      raw: true,
    };
    db.LastSeen.findAll(query).then((lastSeens) => {
      if (lastSeens.length > 0) {
        let lastSeen = {
          timestamp: new Date(),
        };
        db.LastSeen.update(lastSeen, {
          where: { id: lastSeens[0].id },
        });
        callback({ status: "ok" });
      } else {
        let lastSeen = {
          tenant: user.tenant,
          roomUid,
          timestamp: new Date(),
          userId: user.id,
        };
        db.LastSeen.create(lastSeen).then((lastSeen) => {
          callback({ status: "ok" });
        });
      }
    });
  });
}
