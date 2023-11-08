import { Op } from "sequelize";
import { errorLog } from "../../common";
import { Dashboard } from "../../internal-db/models/Dashboard";
import { DashboardEntry } from "../../internal-db/models/DashboardEntry";
import { Report } from "../../internal-db/models/Report";
import { BaseAPI } from "../../server/base-api";
import { ManageDataSource } from "../../datasource/data-source";


export class get extends BaseAPI {

    async fetchData() {
        // =>get params
        const isForce = this.paramBoolean('is_force');
        const dashboardName = this.param('name');
        try {
            const reportData = {};
            // =>find dashboard
            const dashboard = await Dashboard.findOne({ where: { name: dashboardName } });
            if (!dashboard) return this.error404('not found such dashboard');
            // =>collect all reports of dashboard
            const dashboardReportIds = (await DashboardEntry.findAll({ where: { dashboard_id: dashboard.getDataValue('id'), entry_type: 'report' } })).map(i => i.getDataValue('report_id'));
            const reports = (await Report.findAll({
                where: {
                    id: { [Op.in]: dashboardReportIds }
                }
            })).map(i => i.toJSON());
            // =>iterate reports
            for (const report of reports) {
                let data = await ManageDataSource.fetchReportData(report);
                reportData[report.name] = data;
            }


            return this.response(reportData);
        } catch (e) {
            errorLog('err2121221', e);
            return this.error400();
        }
    }
}