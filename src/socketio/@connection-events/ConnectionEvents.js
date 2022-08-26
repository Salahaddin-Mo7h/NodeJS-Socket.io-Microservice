export default function ConnectionEvents(
  socketIo,
  socket,
  user,
  userOnlineStatus
) {
  socket.conn.on("heartbeat", () => {
    if (userOnlineStatus[`${user.tenant}/${user.id}`])
      userOnlineStatus[`${user.tenant}/${user.id}`].forEach((element) => {
        socketIo
          .to(`${user.tenant}/${element.roomUid}`)
          .emit("chat.user.status", {
            user: {
              id: user.id,
              roomUid: element.roomUid,
              status: 1,
            },
          });
      });
  });

  socket.on("disconnect", () => {
    let promises = [];
    if (userOnlineStatus[`${user.tenant}/${user.id}`])
      userOnlineStatus[`${user.tenant}/${user.id}`].forEach((element) => {
        socketIo
          .to(`${user.tenant}/${element.roomUid}`)
          .emit("chat.user.status", {
            user: {
              id: user.id,
              roomUid: element.roomUid,
              status: 0,
            },
          });
        promises.push(element);
      });

    Promise.all(promises).then(() => {
      delete userOnlineStatus[`${user.tenant}/${user.id}`];
      console.log("Dispathed Disconnect event");
    });
    console.log("Disconnected user", user.id, user.tenant);
  });
}
