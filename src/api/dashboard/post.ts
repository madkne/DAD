import { errorLog } from "../../common";
import { Dashboard } from "../../internal-db/models/Dashboard";
import { DashboardEntry } from "../../internal-db/models/DashboardEntry";
import { Project } from "../../internal-db/models/Project";
import { Report } from "../../internal-db/models/Report";
import { BaseAPI } from "../../server/base-api";
import { DashboardEntryType, DashboardEntryWidth, DashboardTheme } from "../../types";


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

    async addEntry() {
        // =>get params
        const dashboardName = this.param('dashboard_name');
        const entryType = this.param<DashboardEntryType>('entry_type', 'report');
        const width = this.param<DashboardEntryWidth>('width', '10-10');
        let reportName = this.param('report_name');
        let text = this.param('text');
        let height = this.param('height', 'auto');
        try {
            // =>find dashboard by name
            const dashboard = await Dashboard.findOne({ where: { name: dashboardName } });
            if (!dashboard) return this.error404('not found such dashboard');
            let report: Report;
            // =>if entry is report
            if (entryType === 'report') {
                // =>find report by name
                report = await Report.findOne({ where: { name: reportName } });
                if (!report) return this.error404('not found such report');
                // =>check no duplicate report as entry
                if ((await DashboardEntry.findAll({ where: { report_id: report.getDataValue('id'), dashboard_id: dashboard.getDataValue('id') } })).length > 0) {
                    return this.error400('duplicate report entry on this dashboard');
                }

            } else {
                //TODO:
            }
            // =>add dashboard entry
            const newDashboardEntry = await DashboardEntry.create({
                dashboard_id: dashboard.getDataValue('id'),
                entry_type: entryType,
                height,
                report_id: report?.getDataValue('id'),
                text,
                width,
                settings: {},
            });

            return this.response(newDashboardEntry);
        } catch (e) {
            errorLog('err433211', e);
            return this.error400();
        }

    }
}