import * as bcrypt from 'bcrypt';
import { Request } from "express";
import { errorLog, generateString, infoLog } from "../common";
import * as https from 'https';
import { Global } from '../global';
import { User } from '../internal-db/models/User';
import { UserModel } from '../internal-db/models/interfaces';
import { UserTokenResponse } from '../interfaces';
import { Session } from '../internal-db/models/Session';

export namespace Auth {
    const tokenSign = '0x_dadsrv';
    const cachingAuth: {
        [k: string]: {
            expiredAt?: number;
            userId?: number;
            userName?: string;
        }
    } = {};
    /********************************* */
    export async function authenticate(username: string, secret_key: string) {
        if (!username || !secret_key) return undefined;
        // =>find user by username
        const user = await User.findOne({ where: { username } });
        // =>if ont exist
        if (!user) return undefined;
        // =>check user password
        if (!await comparePassword(user.getDataValue('password'), secret_key)) {
            return undefined;
        }
        return user;
    }
    /********************************* */
    async function comparePassword(hashedPassword: string, simplePassword: string, replaceSlash = false) {
        if (!simplePassword || !hashedPassword) return false;

        if (replaceSlash) {
            // =>replace '||||' with '/'
            hashedPassword = hashedPassword.replace(/\|\|\|\|/g, '/');
        }

        return await bcrypt.compare(simplePassword, hashedPassword);

    }
    /********************************* */
    export async function addSession(user: UserModel, req: Request): Promise<UserTokenResponse> {
        const now = new Date();
        try {
            const expired = new Date();
            expired.setSeconds(now.getSeconds() + Global.ENV.AUTH_TOKEN_LIFETIME);
            const token = tokenSign + generateString(20);
            const refresh_token = generateString(40);
            // =>create new session
            await Session.create({
                user_id: user.id,
                ip: req.ip,
                user_agent: req.get('user-agent'),
                created_at: now.getTime(),
                token,
                refresh_token,
                expired_token_at: expired.getTime(),
            });
            return {
                access_token: token,
                refresh_token,
                expired_time: expired.getTime(),
                lifetime: Global.ENV.AUTH_TOKEN_LIFETIME * 1000,
            };
        } catch (e) {
            errorLog('err5454', e);
            return {
                access_token: null,
                refresh_token: null,
                lifetime: 0,
                expired_time: now.getTime(),
            };
        }
    }
    /********************************* */
    export async function encryptPassword(password: string, saltRounds: string | number = 10, replaceSlash = false) {
        let hash = await bcrypt.hash(password, saltRounds);
        if (replaceSlash) {
            // =>replace '/' with '||||'
            hash = hash.replace(/\//g, '||||');
        }
        return hash;
    }
    /********************************* */
    export async function getUserByToken(token: string): Promise<UserModel | 'expired' | 'invalid'> {
        // =>check token sign
        if (!token.startsWith(tokenSign)) return 'invalid';
        // =>find user session by token
        const session = await Session.findOne({ where: { token } });
        if (!session) return 'invalid';
        // =>check expired token
        if (new Date().getTime() > session.getDataValue('expired_token_at')) {
            return 'expired';
        }
        let user = await User.findOne({ where: { id: session.getDataValue('user_id') } });
        // console.log('session:', { session, user })
        // =>if not found user
        if (!user) {
            return 'invalid';
        }
        // =>update session
        session.setDataValue('checked_token_at', new Date().getTime());
        await session.save();

        return user.toJSON();
    }
    /********************************* */

}