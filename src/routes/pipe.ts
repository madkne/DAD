import { ApiRoute } from "../interfaces";


export const apis: ApiRoute[] = [
    {
        method: 'POST',
        path: 'pipe/add',
        functionName: 'addReportPipe',
        des: 'add new pipe to existing report',
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
                        pipe: {
                            type: "object",
                            $ref: "#/definitions/ProjectPipeDefinition"
                        },

                    },
                }
            },
        ],
        usedDefinitions: ['ProjectPipeModel', 'ProjectPipeDefinition'],
        responses: {
            '200': {
                description: 'success created project pipe',
                schema: {
                    "$ref": "#/definitions/ProjectPipeModel"

                },
            },
        }

    },
    {
        method: 'PUT',
        path: 'pipe/update/js-script-file',
        functionName: 'updatePipeJsScriptByFile',
        des: 'update js script of existing report pipe',
        description: `for example:
\`\`\`
function boot(inputs) {
    var result = inputs['query_result'];
    return result;
}
\`\`\`
input variables: \`query_result: []\`, \`pipe: {}\`, \`report: {}\`
        `,
        parameters: [
            {
                name: 'pipe_name',
                in: 'formData',
                required: true,
                type: 'string',
                default: 'pipe1',
            },
            {
                name: 'project_name',
                in: 'formData',
                required: true,
                type: 'string',
                default: 'project1',
            },
            {
                name: 'file',
                in: 'formData',
                required: true,
                description: '*.js file that contains `boot` function',
                type: 'file',
            },

        ],
        includeMiddlewares: ['FormDataParser'],
        responses: {
            '200': {
                description: 'success updated project pipe js script',
            },
        }

    },

    {
        method: 'POST',
        path: 'entry/add',
        functionName: 'addPipeEntry',
        des: 'add an existing project pipe to an existing report',
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
                        pipe_name: {
                            type: "string",
                            default: 'pipe1',
                            required: true,
                        },
                        report_name: {
                            type: "string",
                            default: 'report1',
                            required: true,
                        },
                        order: {
                            type: "number",
                            default: 1,
                            description: "bigger order is higher priority"
                        },
                    },
                }
            },
        ],
        usedDefinitions: ['ReportPipeEntryModel'],
        responses: {
            '200': {
                description: 'success created report pipe entry',
                schema: {
                    "$ref": "#/definitions/ReportPipeEntryModel"
                },
            },
        }

    },
]