import { debugLog, infoLog } from "../../common";
import { Auth } from "../../server/auth";
import { BaseAPI } from "../../server/base-api";
import { HttpStatusCode } from "../../types";


export class post extends BaseAPI {

    async login() {
        // =>get params
        const username = this.param('username');
        const password = this.param('password');

        let user = await Auth.authenticate(username, password);
        if (user) {
            debugLog('token', JSON.stringify(user));
            // =>log user
            infoLog('user', `login user with name '${user.getDataValue('username')}' `);
            // =>create new session
            let res = await Auth.addSession(user.toJSON(), this.request.req);
            // =>set cookie
            // request.res.cookie(session.cookieName, token, {
            //     expires: expired,
            //     path: session.cookiePath,
            //     // signed: true, 
            // });
            return this.response(res);
        }
        return this.error(HttpStatusCode.HTTP_401_UNAUTHORIZED);
    }
}