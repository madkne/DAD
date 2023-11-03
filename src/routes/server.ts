import { ApiRoute } from "../interfaces";

export const apis: ApiRoute[] = [
    {
        method: 'GET',
        path: 'status',
        functionName: 'status',
        des: 'server status',
        responses: {
            '200': {
                description: 'successful operation',
            },
        },

    },
    {
        method: 'GET',
        path: 'install',
        functionName: 'install',
        des: 'install server by admin just first time',
        noAuth: true,
        responses: {
            '200': {
                description: 'successful operation',
            },
        },

    },


];