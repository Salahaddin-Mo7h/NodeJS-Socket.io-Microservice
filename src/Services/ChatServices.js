import request from "request";
import Config from "./../config/Config";

export default function getTenantUsers(user) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        headers: {
          "content-type": "application/json",
          Authorization: Config().SERVICE_AUTH_KEY,
          tenant: user.tenant
        },
        url: `${Config().BACKEND_URL}/service/chat/tenant/users`
      },
      (err, response, body) => {
        if (!err) {
          return resolve(JSON.parse(body));
        } else {
          return reject({
            error: "error occured"
          });
        }
      }
    );
  });
}
