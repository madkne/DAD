import { ReportModes } from "../data";
import { ApiRoute } from "../interfaces";

export const apis: ApiRoute[] = [
    {
        method: 'POST',
        path: 'add/by-query',
        functionName: 'addByQuery',
        des: 'create new report by a Query (like sql)',
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
                            default: 'project1'
                        },
                        source_name: {
                            type: "string",
                            default: 'source1'
                        },
                        name: {
                            type: "string",
                            default: 'report1'
                        },
                        mode: {
                            type: "string",
                            default: 'table',
                            enum: ReportModes,
                        },
                        query: {
                            type: "string",
                            default: 'SELECT * FROM table1'
                        },
                        order: {
                            type: 'number',
                            default: 1
                        }
                    },
                }
            },
        ],
        usedDefinitions: ['ReportModel'],
        responses: {
            '200': {
                description: 'success created report',
                schema: {
                    "$ref": "#/definitions/ReportModel"

                },
            },
        }

    },



];