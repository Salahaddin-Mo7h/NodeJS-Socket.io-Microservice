import * as db from "./../../models";
import getTenantUsers from "./../../Services/ChatServices";

export default function CustomRoomGenerator(user) {
  return new Promise((resolve) => {
    const message = db.Message;
    getTenantUsers(user).then((users) => {
      const roomUser = db.RoomUser;
      let query = {
        attributes: ["id"],
        where: {
          userId: user.id,
          tenant: user.tenant,
        },
        include: [
          {
            required: true,
            model: db.Room,
            include: [
              {
                model: db.RoomUser,
              },
            ],
          },
        ],
      };

      let promises = [];
      roomUser.findAll(query).then((rooms) => {
        if (rooms.length > 0) {
          rooms.forEach((____room) => {
            let _query = {
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
                roomUid: ____room.Room.id,
              },
              raw: true,
              order: [["id", "DESC"]],
              limit: 1,
            };

            promises.push(
              new Promise((_resolve) => {
                message.findAll(_query).then((messages) => {
                  if (messages.length > 0) {
                    let __query = {
                      attributes: ["timestamp"],
                      where: {
                        tenant: user.tenant,
                        roomUid: ____room.Room.id,
                        userId: user.id,
                      },
                      raw: true,
                    };
                    db.LastSeen.findAll(__query).then((lastSeens) => {
                      if (lastSeens.length > 0) {
                        let ___query = {
                          attributes: ["id", "timestamp"],
                          where: {
                            tenant: user.tenant,
                            roomUid: ____room.Room.id,
                            timestamp: {
                              [db.Sequelize.Op.gt]: lastSeens[0].timestamp,
                            },
                          },
                          raw: true,
                        };
                        message.findAll(___query).then((_messages) => {
                          return _resolve({
                            users: ____room.Room.RoomUsers,
                            roomUid: ____room.Room.id,
                            type: ____room.Room.type,
                            lastMessage: messages,
                            unseen: _messages.length,
                          });
                        });
                      } else {
                        return _resolve({
                          users: ____room.Room.RoomUsers,
                          roomUid: ____room.Room.id,
                          type: ____room.Room.type,
                          lastMessage: messages,
                          unseen: 1,
                        });
                      }
                    });
                  } else {
                    return _resolve({
                      users: ____room.Room.RoomUsers,
                      roomUid: ____room.Room.id,
                      type: ____room.Room.type,
                      lastMessage: messages,
                      unseen: 0,
                    });
                  }
                });
              })
            );
          });
          Promise.all(promises).then((roomList) => {
            return resolve(roomList);
          });
        } else {
          return resolve([]);
        }
      });
    });
  });
}
