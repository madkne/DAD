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


];