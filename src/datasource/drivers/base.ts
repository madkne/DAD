import { DataSourceSettings } from "../../internal-db/models/interfaces";

// export abstract class AbstractBaseSourceDriver {
//     abstract connect(params: DataSourceSettings);

//     abstract executeSelectQuery(query: string);

//     abstract disconnect();
// }


export class BaseSourceDriver {

    constructor() { }

    connect(params: DataSourceSettings) { }

    executeSelectQuery(query: string) { }

    disconnect() { }
}