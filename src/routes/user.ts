import { ApiRoute } from "../interfaces";

export const apis: ApiRoute[] = [
    {
        method: 'POST',
        path: 'login',
        functionName: 'login',
        des: 'login user',
        noAuth: true,
        parameters: [
            {
                name: 'request',
                in: 'body',
                required: true,
                type: 'object',
                schema: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            default: 'bob'
                        },
                        password: {
                            type: "string",
                            default: '456332Ddx'
                        },
                    },
                }
            },
        ],
        usedDefinitions: ['UserTokenResponse'],
        responses: {
            '200': {
                description: 'success authenticate user',
                schema: {
                    "$ref": "#/definitions/UserTokenResponse"

                },
                example: `{access_token: 234wesdfew, refresh_token: sfds46f45g, lifetime: 300, expired_time: 1657455541212}`
            },
            '401': {
                description: 'username or secret key is wrong or invalid',
            }
        }

    },


];