import { Express, static as expressStatic } from 'express';
import * as path from 'path';
import { Global } from '../global';
import { Dashboard } from '../internal-db/models/Dashboard';

export namespace TemplateEngine {

    export async function setup(app: Express) {
        // =>add assets
        app.use(Global.AssetsBaseUrl, expressStatic(path.join(Global.ENV.PUBLIC_PATH, 'assets')));
        // =>serve pages with twig
        // view engine setup
        app.set('view engine', 'twig');
        app.set('views', path.join(Global.ENV.PUBLIC_PATH, 'templates'));
        app.set("twig options", {
            allowAsync: true, // Allow asynchronous compiling
            strict_variables: false,
            cache: false,
            optimizations: 0,
        });
    }

    export async function serveDashboards(app: Express) {
        app.get(Global.ENV.DASHBOARD_BASE_URL + '/:name', async (req, res) => {
            const dashboardName = req?.params?.name as string;
            if (!dashboardName) return res.status(404).json({ error: 'bad dashboard name' });
            // =>find dashboard by name
            const dashboardDB = await Dashboard.findOne({ where: { name: dashboardName } });
            if (!dashboardDB) return res.status(404).json({ error: 'not found such dashboard' });
            const dashboard = dashboardDB.toJSON();
            // =>choose theme
            if (dashboard.theme === 'simple') {
                return res.render('dashboards/simple.twig', { dashboard });
            }
            else {
                return res.status(404).json({ error: 'bad dashboard theme' });
            }

        });
    }
}