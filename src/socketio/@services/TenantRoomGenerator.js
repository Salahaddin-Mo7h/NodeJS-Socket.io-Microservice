import getTenantUsers from "./../../Services/ChatServices";
import * as db from "./../../models";

export default function TenantRoomGenerator(user, userOnlineStatus) {
  return new Promise((resolve) => {
    const message = db.Message;
    getTenantUsers(user).then((users) => {
      let promises = [];
      users.forEach((__user) => {
        promises.push(
          new Promise((resolve) => {
            if (userOnlineStatus[`${user.tenant}/${__user.id}`]) {
              __user["online"] = 1;
            } else {
              __user["online"] = 0;
            }
            return resolve(__user);
          })
        );
      });
      Promise.all(promises).then((users) => {
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
            roomUid: "general-tenant-" + user.tenant,
          },
          raw: true,
          order: [["id", "DESC"]],
          limit: 1,
        };
        message.findAll(query).then((messages) => {
          if (messages.length > 0) {
            let _query = {
              attributes: ["timestamp"],
              where: {
                tenant: user.tenant,
                roomUid: "general-tenant-" + user.tenant,
                userId: user.id,
              },
              raw: true,
            };
            db.LastSeen.findAll(_query).then((lastSeens) => {
              if (lastSeens.length > 0) {
                let __query = {
                  attributes: ["id", "timestamp"],
                  where: {
                    tenant: user.tenant,
                    roomUid: "general-tenant-" + user.tenant,
                    timestamp: {
                      [db.Sequelize.Op.gt]: lastSeens[0].timestamp,
                    },
                  },
                  raw: true,
                };
                message.findAll(__query).then((_messages) => {
                  console.log("ddddd", lastSeens.length);
                  return resolve({
                    title: "General Room",
                    roomUid: "general-tenant-" + user.tenant,
                    type: "general-tenant",
                    users,
                    lastMessage: messages,
                    unseen: _messages.length,
                  });
                });
              } else {
                return resolve({
                  title: "General Room",
                  roomUid: "general-tenant-" + user.tenant,
                  type: "general-tenant",
                  users,
                  lastMessage: messages,
                  unseen: 1,
                });
              }
            });
          } else {
            return resolve({
              title: "General Room",
              roomUid: "general-tenant-" + user.tenant,
              type: "general-tenant",
              users,
              lastMessage: messages,
              unseen: 0,
            });
          }
        });
      });
    });
  });
}
