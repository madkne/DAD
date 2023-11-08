import { DatabaseDrivers } from "../data";
import { DataSource } from "../internal-db/models/DataSource";
import { ReportModel } from "../internal-db/models/interfaces";

export namespace ManageDataSource {


    export async function fetchReportData(report: ReportModel) {
        let data = [];
        if (report.data?.query) {
            data = await fetchDataFromSourceByQuery(report.source_id, report.data?.query)
            //TODO:
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

}