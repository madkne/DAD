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
]