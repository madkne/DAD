import { BaseAPI } from "../../server/base-api";


export class get extends BaseAPI {

    async status() {
        return this.response('ok');
    }
}