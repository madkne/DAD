import { DataSourceSettings } from "../../internal-db/models/interfaces";
import { BaseSourceDriver } from "./base";


export class sqlite extends BaseSourceDriver {
    private sqlitePath: string;
    private sqlite3;
    private db;

    constructor() {
        super();
    }

    override async connect(params: DataSourceSettings) {
        this.sqlitePath = params.sqlite_path;
        this.sqlite3 = require('sqlite3').verbose();
        this.db = new this.sqlite3.Database(this.sqlitePath);
    }
    async executeSelectQuery(query: string) {
        return new Promise((res) => {
            this.db.serialize(() => {
                this.db.all(query, (err, row) => {
                    // console.log(err, row);
                    res(row);
                });
            });

        });
    }

    override async disconnect() {
        if (!this.db) return;
        await this.db.close();
    }
}