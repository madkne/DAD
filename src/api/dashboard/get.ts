import { Op } from "sequelize";
import { errorLog } from "../../common";
import { Dashboard } from "../../internal-db/models/Dashboard";
import { DashboardEntry } from "../../internal-db/models/DashboardEntry";
import { Report } from "../../internal-db/models/Report";
import { BaseAPI } from "../../server/base-api";
import { ManageDataSource } from "../../datasource/data-source";
import { DashboardModel, ReportModel } from "../../internal-db/models/interfaces";


export class get extends BaseAPI {

    async fetchData() {
        try {
            const reportData = {};
            const res = await this._fetchBasicData();
            if (this.isErrorResponse(res)) return res;
            const reports = res[2];
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

    async fetchDataAsReportFormat() {
        try {
            const reportData = {};
            const res = await this._fetchBasicData();
            if (this.isErrorResponse(res)) return res;
            const [dashboard, dashboardReportIds, reports] = res;
            // =>iterate reports
            for (const report of reports) {
                let data = await ManageDataSource.fetchReportData(report);
                const reportResult: {
                    columns?: string[];
                    rows?: string[][];
                    labels?: string[];
                    data?: number[][];
                } = {};
                // =>table
                if (report.mode === 'table') {
                    // =>collect columns
                    reportResult.columns = [];
                    if (data.length > 0) {
                        reportResult.columns = Object.keys(data[0]);
                    }
                    // =>collect rows
                    reportResult.rows = [];
                    for (const row of data) {
                        const rowData = [];
                        for (const key of Object.keys(row)) {
                            rowData.push(row[key]);
                        }
                        reportResult.rows.push(rowData);
                    }
                }
                // =>chart
                else if (report.mode.endsWith('_chart')) {
                    // =>collect labels
                    reportResult.labels = [];
                    // =>detect label field
                    let labelField = report.data.label_field;
                    if (!labelField && data.length > 0) {
                        for (const key of Object.keys(data[0])) {
                            if (typeof data[0][key] === 'string') {
                                labelField = key;
                                break;
                            } else {
                                labelField = key;
                            }
                        }
                    }
                    if (data.length > 0 && labelField) {
                        for (const row of data) {
                            reportResult.labels.push(row[labelField]);
                        }
                    }
                    // =>collect data
                    reportResult.data = [[]];
                    // =>detect data field
                    let dataField = report.data.data_field;
                    if (!dataField && data.length > 0) {
                        for (const key of Object.keys(data[0])) {
                            if (typeof data[0][key] === 'number') {
                                dataField = key;
                                break;
                            } else {
                                dataField = key;
                            }
                        }
                    }
                    if (data.length > 0 && dataField) {
                        for (const row of data) {
                            reportResult.data[0].push(row[dataField]);
                        }
                    }
                    // console.log(labelField)
                }
                reportData[report.name] = reportResult;
            }


            return this.response(reportData);
        } catch (e) {
            errorLog('err2121221', e);
            return this.error400();
        }
    }



    /************************************* */
    private async _fetchBasicData(): Promise<[DashboardModel, number[], ReportModel[]]> {
        // =>get params
        const isForce = this.paramBoolean('is_force');
        const dashboardName = this.param('name');
        const password = this.param('password');
        try {
            // =>find dashboard
            const dashboard = await this.findDashboardByName(dashboardName);
            if (this.isErrorResponse(dashboard)) return dashboard as any;
            // =>check password
            if (dashboard.password && dashboard.password !== password) return this.error403('bad password') as any;
            // =>collect all reports of dashboard
            const dashboardReportIds = (await DashboardEntry.findAll({ where: { dashboard_id: dashboard.id, entry_type: 'report' } })).map(i => i.getDataValue('report_id'));
            const reports = (await Report.findAll({
                where: {
                    id: { [Op.in]: dashboardReportIds }
                }
            })).map(i => i.toJSON());

            return [dashboard, dashboardReportIds, reports];
        } catch (e) {
            errorLog('err212143221', e);
            return this.error400('bad basic fetch') as any;
        }
    }
}