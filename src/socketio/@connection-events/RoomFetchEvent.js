import TenantRoomGenerator from "./../@services/TenantRoomGenerator";
import CustomRoomGenerator from "./../@services/CustomRoomGenerator";
import * as db from "./../../models";

export default function RoomFetchEvent(
  socketIo,
  socket,
  user,
  userOnlineStatus
) {
  socket.on("chat.rooms", (callback) => {
    let rooms = [];
    TenantRoomGenerator(user, userOnlineStatus).then((room) => {
      rooms.push(room);
      CustomRoomGenerator(user).then((customRooms) => {
        rooms = [...rooms, ...customRooms];
        callback(rooms);
      });
    });
  });

  socket.on("chat.join", (roomId, callback) => {
    socket.join(`${user.tenant}/${roomId}`);
    console.log(`${user.tenant}/${roomId}`);

    if (userOnlineStatus[`${user.tenant}/${user.id}`]) {
      userOnlineStatus[`${user.tenant}/${user.id}`] = [
        ...userOnlineStatus[`${user.tenant}/${user.id}`],
        {
          roomUid: roomId,
          status: 1,
        },
      ];
    } else {
      userOnlineStatus[`${user.tenant}/${user.id}`] = [
        {
          roomUid: roomId,
          status: 1,
        },
      ];
    }

    setTimeout(() => {
      socketIo.to(`${user.tenant}/${roomId}`).emit("chat.user.status", {
        user: {
          id: user.id,
          roomUid: roomId,
          status: 1,
        },
      });
    }, 500);
    callback({ success: "ok" });
  });

  socket.on("chat.create.room", (users, callback) => {
    users.push(user);

    let promises = [];
    users.forEach((__user) => {
      promises.push(
        new Promise((resolve) => {
          return resolve(parseInt(__user.id));
        })
      );
    });

    Promise.all(promises).then((orFields) => {
      const room = db.Room;
      const roomUser = db.RoomUser;
      const sequelize = db.Sequelize;
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

      roomUser.findAll(query).then((rooms) => {
        let found = null;
        let _promises = [];
        rooms.forEach((_room) => {
          _promises.push(
            new Promise((_resolve) => {
              let ___promises = [];
              _room.Room.RoomUsers.forEach((__room) => {
                ___promises.push(
                  new Promise((___resolve) => {
                    return ___resolve(parseInt(__room.userId));
                  })
                );
              });

              Promise.all(___promises).then((roomUsersList) => {
                console.log(
                  roomUsersList.sort().join("-"),
                  orFields.sort().join("-")
                );
                if (
                  roomUsersList.sort().join("-") == orFields.sort().join("-")
                ) {
                  found = _room.Room;
                }
                return _resolve({});
              });
            })
          );
        });

        Promise.all(_promises).then(() => {
          if (!found) {
            let newRoom = {
              type: "customRoom",
              title: "n/a",
              tenant: user.tenant,
              createdBy: user.id,
            };
            room.create(newRoom).then((createdRoom) => {
              console.log("roomcreated", createdRoom);
              callback(createdRoom);

              users.forEach((__user) => {
                socketIo
                  .to(`${createdRoom.tenant}/user-space-${__user.id}`)
                  .emit("chat.user.space", createdRoom);
              });

              users.forEach((___user) => {
                let newRoomUser = {
                  roomUid: createdRoom.id,
                  userId: ___user.id,
                  tenant: user.tenant,
                };
                roomUser.create(newRoomUser).then((createdRoomUser) => {
                  console.log("roomUsercreated", createdRoomUser.id);
                });
              });
            });
          } else {
            callback(found);
          }
        });
      });
    });
  });
}
