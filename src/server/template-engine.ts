import { Express, static as expressStatic } from 'express';
import * as path from 'path';
import { Global } from '../global';
import { Dashboard } from '../internal-db/models/Dashboard';
import { DashboardEntry } from '../internal-db/models/DashboardEntry';
import { Report } from '../internal-db/models/Report';
import { Op } from 'sequelize';
import { baseUrl } from '../common';

export namespace TemplateEngine {

    export async function setup(app: Express) {
        // =>add assets
        app.use(Global.AssetsBaseUrl, expressStatic(path.join(Global.ENV.PUBLIC_PATH, 'assets')));
        // =>serve pages with twig
        // view engine setup
        // app.engine('twig.html',);
        app.set('view engine', 'twig');
        app.set('views', path.join(Global.ENV.PUBLIC_PATH, 'templates'));
        app.set("twig options", {
            allowAsync: true, // Allow asynchronous compiling
            strict_variables: false,
            cache: false,
            optimizations: 0,
            debug_mode: true,
            'defaultTemplateExtensions': ['html', 'twig', 'twig.html'],
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
            // =>fetch dashboard entries
            let entries = (await DashboardEntry.findAll({ where: { dashboard_id: dashboard.id } })).map(i => i.toJSON());
            // =>fetch reports by entries
            const entryReportIds = entries.filter(i => i.entry_type == 'report').map(i => i.report_id);
            const entryReports = (await Report.findAll({ where: { id: { [Op.in]: entryReportIds } } })).map(i => i.toJSON());
            for (const id of entryReportIds) {
                const findEntry = entries.find(i => i.report_id === id);
                if (!findEntry) continue;
                findEntry['report'] = entryReports.find(i => i.id == id);
            }
            // =>choose theme
            if (dashboard.theme === 'simple') {
                return res.render('dashboards/simple.twig', { dashboard, entries, base_api: baseUrl() });
            }
            else {
                return res.status(404).json({ error: 'bad dashboard theme' });
            }

        });
    }
}