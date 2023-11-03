import { Project } from "../../internal-db/models/Project";
import { BaseAPI } from "../../server/base-api";


export class get extends BaseAPI {
    async list() {
        return await this.paginateResponse(Project);
    }
}