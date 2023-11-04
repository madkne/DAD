import { DatabaseTypes } from "../data";
import { ApiRoute } from "../interfaces";
import { DatabaseType } from "../types";

export const apis: ApiRoute[] = [
    // {
    //     method: 'POST',
    //     path: 'add',
    //     functionName: 'add',
    //     des: 'add new data source to a project just by user with admin level 1 or higher',
    //     parameters: [
    //         {
    //             name: 'request',
    //             in: 'body',
    //             required: true,
    //             type: 'object',
    //             schema: {
    //                 type: "object",
    //                 properties: {
    //                     project_name: {
    //                         type: "string",
    //                         default: 'project1'
    //                     },
    //                     name: {
    //                         type: "string",
    //                         default: 'source1'
    //                     },
    //                     source_type: {
    //                         type: "string",
    //                         enum: DatabaseTypes,
    //                         default: 'sqlite'
    //                     },
    //                 },
    //             }
    //         },
    //     ],
    //     usedDefinitions: ['DataSourceModel'],
    //     responses: {
    //         '200': {
    //             description: 'success created data source',
    //             schema: {
    //                 "$ref": "#/definitions/DataSourceModel"

    //             },
    //         },
    //     }

    // },
    {
        method: 'POST',
        path: 'add/sqlite/by-path',
        functionName: 'addSqliteByPath',
        des: 'add new sqlite data source to a project just by user with admin level 1 or higher',
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
                            default: 'source1'
                        },
                        project_name: {
                            type: "string",
                            default: 'project1'
                        },
                        path: {
                            type: "string",
                            default: '/tmp/db.sqlite'
                        },
                    },
                }
            },
        ],
        usedDefinitions: ['DataSourceModel'],
        responses: {
            '200': {
                description: 'success created data source',
                schema: {
                    "$ref": "#/definitions/DataSourceModel"

                },
            },
        }

    },


];