import { errorLog } from "../../common";
import { ProjectPipe } from "../../internal-db/models/ProjectPipe";
import { BaseAPI } from "../../server/base-api";
import * as fs from 'fs';

export class put extends BaseAPI {

    async updatePipeJsScriptByFile() {
        // =>get params
        const pipeName = this.formDataParam('pipe_name');
        const projectName = this.formDataParam('project_name');
        const file = this.paramFile('file');
        // console.log(file, projectName, pipeName);
        try {
            // =>check file mimetype
            if (file.mimeType.indexOf('javascript') < 0) return this.error400('upload javascript file');
            // =>find project
            const project = await this.findProjectByName(projectName);
            if (this.isErrorResponse(project)) return project;
            // =>find pipe
            const pipe = await this.findPipeByName(pipeName, project.id);
            if (this.isErrorResponse(pipe)) return pipe;
            // =>read file
            const jsScriptFile = fs.readFileSync(file.tmp_path).toString();
            // =>update pipe
            await ProjectPipe.update({ js_script: jsScriptFile }, { where: { id: pipe.id } });

            return this.response(true);
        } catch (e) {
            errorLog('err324212121', e);
            return this.error400();
        }
    }
}