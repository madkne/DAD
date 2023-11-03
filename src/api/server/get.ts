import { Op } from "sequelize";
import { Global } from "../../global";
import { User } from "../../internal-db/models/User";
import { Auth } from "../../server/auth";
import { BaseAPI } from "../../server/base-api";
import {
    detectPackageManager,
    installDependencies,
    addDependency,
    addDevDependency,
    removeDependency,
} from "nypm";
import { errorLog } from "../../common";

export class get extends BaseAPI {

    async status() {
        return this.response('ok');
    }

    async install() {
        // =>check not installed server
        if (await this.readConfig<boolean>('server.is_installed')) {
            return this.error403('already installed server!');
        }
        // =>find admin user
        const rootUser = await User.findAll({ where: { admin_level: { [Op.gt]: 0 } } });
        // =>add root user, if not exist
        if (rootUser.length === 0) {
            await User.create({
                username: Global.ENV.ROOT_USERNAME,
                password: await Auth.encryptPassword(Global.ENV.ROOT_PASSWORD),
                admin_level: 100,
                settings: {},
            });
        }
        // =>install data source needed drivers 
        let needDrivers = Global.ENV.DS_TYPES;
        let installedDrivers = [];
        try {
            for (const driver of needDrivers) {
                // =>find driver
                const dbPackage = Global.DATABASE_DRIVER_PACKAGES[driver];
                if (!dbPackage) continue;
                await addDependency(dbPackage);
                installedDrivers.push(driver);
            }
            await installDependencies();
        } catch (e) {
            errorLog('err24322', e);
            return this.error400('bad install driver packages! try again');
        }
        // =>add install completed to config
        await this.updateConfig('server.is_installed', true);

        return this.response({
            add_root_user: true,
            installed_drivers: installedDrivers,
        });
    }
}