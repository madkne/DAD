import { DashboardEntryTypes, DashboardEntryWidths, DashboardThemes, ReportModes } from "../data";
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

    {
        method: 'POST',
        path: 'entry/add',
        functionName: 'addEntry',
        des: 'add an entry to exist dashboard',
        parameters: [
            {
                name: 'request',
                in: 'body',
                required: true,
                type: 'object',
                schema: {
                    type: "object",
                    properties: {
                        dashboard_name: {
                            type: "string",
                            default: 'dashboard1',
                            required: true,
                        },
                        entry_type: {
                            type: "string",
                            default: 'report',
                            enum: DashboardEntryTypes,
                        },
                        report_name: {
                            type: "string",
                        },
                        text: {
                            type: "string",
                        },
                        width: {
                            type: "string",
                            default: '12-12',
                            enum: DashboardEntryWidths,
                        },
                        height: {
                            type: 'string',
                            default: 'auto',
                        }
                    },
                }
            },
        ],
        usedDefinitions: ['DashboardEntryModel'],
        responses: {
            '200': {
                description: 'success created dashboard entry',
                schema: {
                    "$ref": "#/definitions/DashboardEntryModel"
                },
            },
        }

    },


];