import socketioJwt from "socketio-jwt";
import Config from "./../config/Config";

export default function AuthHandler(socketIo) {
  return socketIo.sockets.on(
    "connection",
    socketioJwt.authorize({
      secret: Config().JWT_SECRET,
      timeout: Config().SOCKET_AUTH_TIMEOUT,
      callback: false
    })
  );
}
