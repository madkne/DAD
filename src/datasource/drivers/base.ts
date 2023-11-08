import { DataSourceSettings } from "../../internal-db/models/interfaces";


export class BaseSourceDriver {

    constructor() { }

    connect(params: DataSourceSettings) { }

    executeSelectQuery(query: string) { }

    disconnect() { }
}