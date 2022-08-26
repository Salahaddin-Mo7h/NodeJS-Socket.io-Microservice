import AuthHandler from "./AuthHandler";
import ConnectionEvents from "./@connection-events/ConnectionEvents";
import RoomFetchEvent from "./@connection-events/RoomFetchEvent";
import TextMessageEvents from "./@connection-events/TextMessageEvents";
import LastSeenEvents from "./@connection-events/LastSeenEvents";

export default function SocketIoHandlers(socketIo) {
  socketIo = AuthHandler(socketIo);
  let userOnlineStatus = {};
  socketIo.on("authenticated", (socket) => {
    const user = {
      tenant: socket.decoded_token.tenant,
      id: socket.decoded_token.id,
      name: socket.decoded_token.name,
    };
    console.log("Connection Authenticated!!!");
    socket.join(`${user.tenant}/user-space-${user.id}`);
    ConnectionEvents(socketIo, socket, user, userOnlineStatus);
    RoomFetchEvent(socketIo, socket, user, userOnlineStatus);
    TextMessageEvents(socketIo, socket, user, userOnlineStatus);
    LastSeenEvents(socketIo, socket, user, userOnlineStatus);
  });
}
