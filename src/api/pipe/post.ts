import { errorLog } from "../../common";
import { ProjectPipe } from "../../internal-db/models/ProjectPipe";
import { ReportPipeEntry } from "../../internal-db/models/ReportPipeEntry";
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

    async addPipeEntry() {
        // =>get params
        const projectName = this.param('project_name');
        const pipeName = this.param('pipe_name');
        const reportName = this.param('report_name');
        const order = this.paramNumber('order', 1);

        try {
            // =>find project by name
            const project = await this.findProjectByName(projectName);
            if (this.isErrorResponse(project)) return project;
            // =>find report by name
            const report = await this.findReportByName(reportName, project.id);
            if (this.isErrorResponse(report)) return report;
            // =>find pipe by name
            const pipe = await this.findPipeByName(pipeName, project.id);
            if (this.isErrorResponse(pipe)) return pipe;
            // =>check before exist
            if ((await ReportPipeEntry.findAll({
                where: {
                    project_id: project.id,
                    report_id: report.id,
                    pipe_id: pipe.id,
                }
            })).length > 0) {
                return this.error400('exist such report pipe entry');
            }
            // =>add entry
            const newEntry = await ReportPipeEntry.create({
                order,
                pipe_id: pipe.id,
                project_id: project.id,
                report_id: report.id,
            });
            return this.response(newEntry);
        } catch (e) {
            errorLog('err23422144', e);
            return this.error400();
        }
    }
}