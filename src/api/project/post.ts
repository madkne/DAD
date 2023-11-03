import { errorLog } from "../../common";
import { Project } from "../../internal-db/models/Project";
import { BaseAPI } from "../../server/base-api";


export class post extends BaseAPI {

    async add() {
        try {
            // =>get params
            const name = this.param('name');
            // =>check admin
            if (!await this.isAdmin()) return this.error403('need admin access');
            let newProject = await Project.create({
                name,
                settings: {},
            });

            return this.response(newProject);
        } catch (e) {
            errorLog('err3411', e);
            return this.error400();
        }
    }

}