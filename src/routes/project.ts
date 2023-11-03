import { ApiRoute } from "../interfaces";

export const apis: ApiRoute[] = [
    {
        method: 'POST',
        path: 'add',
        functionName: 'add',
        des: 'create new project just by user with admin level 1 or higher',
        parameters: [
            {
                name: 'request',
                in: 'body',
                required: true,
                type: 'object',
                schema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            default: 'project1'
                        },
                    },
                }
            },
        ],
        usedDefinitions: ['ProjectModel'],
        responses: {
            '200': {
                description: 'success created project',
                schema: {
                    "$ref": "#/definitions/ProjectModel"

                },
            },
        }

    },
    {
        method: 'GET',
        path: '',
        functionName: 'list',
        des: 'get list of all projects',

        usedDefinitions: ['ProjectModel'],
        responses: {
            '200': {
                description: 'list of projects',
                schema: {
                    "$ref": "#/definitions/ProjectModel"

                },
            },
        }

    },


];