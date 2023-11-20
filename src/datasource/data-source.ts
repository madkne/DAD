import { Op } from "sequelize";
import { DatabaseDrivers } from "../data";
import { DataSource } from "../internal-db/models/DataSource";
import { ProjectPipe } from "../internal-db/models/ProjectPipe";
import { ReportPipeEntry } from "../internal-db/models/ReportPipeEntry";
import { ProjectPipeModel, ReportModel } from "../internal-db/models/interfaces";
import { ProjectPipeResponse } from "../interfaces";
import { errorLog } from "../common";
import * as vm from 'vm';

export namespace ManageDataSource {


    export async function fetchReportData(report: ReportModel) {
        let data = [];
        if (report.data?.query) {
            data = await fetchDataFromSourceByQuery(report.source_id, report.data?.query)
            //TODO:
        }
        // =>get pipes of 'after_query' event
        const reportPipeIds = (await ReportPipeEntry.findAll({ where: { report_id: report.id }, order: [['order', 'DESC']] })).map(i => i.toJSON().pipe_id);
        const reportPipes = (await ProjectPipe.findAll({ where: { id: { [Op.in]: reportPipeIds } } })).map(i => i.toJSON());
        // =>iterate pipes
        for (const pipe of reportPipes) {
            // =>run pipe
            const res = await executeReportPipe(pipe, report, data);
            // =>if error
            if (res.error) {
                errorLog('err2333222', res.error);
                // =>if fetal
                if (res.status === 'fetal') {
                    break;
                } else {
                    data = res.data;
                }
            }
            else {
                data = res.data;
            }
        }

        return data;
    }



    /************************************* */
    /************************************* */
    /************************************* */
    async function fetchDataFromSourceByQuery(sourceId: number, query: string) {
        // =>find source by id
        const sourceDB = await DataSource.findByPk(sourceId);
        if (!sourceDB) return undefined;
        const source = sourceDB.toJSON();
        // =>select right driver
        const driverClassDef = DatabaseDrivers[source.source_type];
        if (!driverClassDef) return undefined;
        const driverClass = new driverClassDef();
        // =>connect
        await driverClass.connect(source.settings);
        // =>exec query
        const result = await driverClass.executeSelectQuery(query);

        return result as any;
    }
    /************************************* */
    async function executeReportPipe(pipe: ProjectPipeModel, report: ReportModel, data: any[]): Promise<ProjectPipeResponse> {
        // =>if type 'run_js_script'
        if (pipe.type === 'run_js_script') {
            try {
                const sandbox = {
                    console,
                };
                const script = new vm.Script(pipe.js_script);
                const context = vm.createContext(sandbox);
                script.runInContext(context, { displayErrors: true, filename: 'pipe.js' });
                // =>call 'boot' function
                const res = await context['boot']({
                    query_result: data,
                    pipe,
                    report,
                });
                if (!Array.isArray(res)) {
                    return {
                        error: 'bad pipe response',
                        status: pipe.required ? 'fetal' : 'warning',
                        data,
                    };
                }
                // console.log('res:', res)
                data = res;
                return {
                    status: 'success',
                    data,
                };
            } catch (e) {
                errorLog('err3212111', e);
                return {
                    error: e,
                    status: pipe.required ? 'fetal' : 'warning',
                    data,
                };
            }
        }
        else {
            //TODO:
            return {
                error: 'no implemented!',
                status: 'warning',
                data,
            };
        }
    }
}