import { DashboardThemes, ReportModes } from "../data";
import { ApiRoute } from "../interfaces";

export const apis: ApiRoute[] = [
    {
        method: 'POST',
        path: 'add',
        functionName: 'add',
        des: 'create new dashboard',
        parameters: [
            {
                name: 'request',
                in: 'body',
                required: true,
                type: 'object',
                schema: {
                    type: "object",
                    properties: {
                        project_name: {
                            type: "string",
                            default: 'project1',
                            required: true,
                        },
                        name: {
                            type: "string",
                            default: 'dashboard1',
                            required: true,
                        },
                        theme: {
                            type: "string",
                            default: 'simple',
                            enum: DashboardThemes,
                        },
                        title: {
                            type: "string",
                            default: 'My Dashboard'
                        },
                        description: {
                            type: "string",
                        },
                    },
                }
            },
        ],
        usedDefinitions: ['DashboardModel'],
        responses: {
            '200': {
                description: 'success created dashboard',
                schema: {
                    "$ref": "#/definitions/DashboardModel"
                },
            },
        }

    },


];