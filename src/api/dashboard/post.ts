import { errorLog } from "../../common";
import { Dashboard } from "../../internal-db/models/Dashboard";
import { Project } from "../../internal-db/models/Project";
import { BaseAPI } from "../../server/base-api";
import { DashboardTheme } from "../../types";


export class post extends BaseAPI {
    async add() {
        // =>get params
        const projectName = this.param('project_name');
        const name = this.param('name');
        let title = this.param('title');
        let theme = this.param<DashboardTheme>('theme', 'simple');
        const description = this.param('description');
        try {
            // =>find project by name
            const project = await Project.findOne({ where: { name: projectName } });
            if (!project) return this.error404('not found such project');
            // =>check no duplicate dashboard name
            if ((await Dashboard.findAll({ where: { project_id: project.getDataValue('id'), name } })).length > 0) {
                return this.error400('duplicate dashboard name on this project');
            }
            // =>check title
            if (!title) title = name;
            // =>add dashboard
            const newDashboard = await Dashboard.create({
                auto_refresh: 'off',
                description,
                name,
                title,
                theme,
                project_id: project.getDataValue('id'),
                settings: {},
            });

            return this.response(newDashboard);
        } catch (e) {
            errorLog('err43211', e);
            return this.error400();
        }

    }
}