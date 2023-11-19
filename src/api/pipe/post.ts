import { errorLog } from "../../common";
import { ProjectPipe } from "../../internal-db/models/ProjectPipe";
import { ProjectPipeDefinition } from "../../internal-db/models/interfaces";
import { BaseAPI } from "../../server/base-api";


export class post extends BaseAPI {

    async addReportPipe() {
        // =>get params
        const projectName = this.param('project_name');
        const pipe = this.param<ProjectPipeDefinition>('pipe');
        try {
            // =>find project by name
            const project = await this.findProjectByName(projectName);
            if (this.isErrorResponse(project)) return project;
            // =>check no duplicate name
            if ((await ProjectPipe.findAll({ where: { project_id: project.id, name: pipe.name } })).length > 0) {
                return this.error400('duplicate pipe name on this project');
            }
            // =>create pipe
            const newPipe = await ProjectPipe.create({
                project_id: project.id,
                name: pipe.name,
                api_endpoint: pipe.api_endpoint,
                api_method: pipe.api_method,
                event: pipe.event,
                js_script: pipe.js_script,
                type: pipe.type,
                settings: {},
            })
            return this.response(newPipe);
        } catch (e) {
            errorLog('err234221', e);
            return this.error400();
        }
    }
}