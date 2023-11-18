const dashboardVue = new Vue({
    el: '#app',
    data() {
        return {
            reportsData: {},
            baseApi: GlobalVariables.baseApi,
            name: GlobalVariables.name,
            entries: GlobalVariables.entries,
            chartTypeMap: {
                'bar_chart': 'bar',
                'line_chart': 'line',
                'area_chart': 'area',
                'pie_chart': 'pie'
            }
        }
    },
    created() {
        axios.interceptors.response.use(response => {
            return response;
        }, error => {
            return error;
        });

        this.fetchAllData();
    },
    methods: {
        async fetchAllData() {
            let res = await axios.get(this.baseApi + `/api/v1/dashboard/data/fetch/report-format?name=${this.name
                }&is_force=false`);
            // console.log(res)
            if (!res || res.status !== 200 || !res.data || !res.data.data) {
                alert('failed to fetch data!');
                return;
            }
            this.reportsData = res.data.data;
            // console.log(this.entries)
            for (const key of Object.keys(this.reportsData)) {
                const report = this.entries.find(i => i.report.name == key)?.report;
                if (!report) continue;
                const reportMode = report.mode;
                // =>check not data
                const el = document.getElementById('report_' + report.id);
                // =>no data
                if (this.reportsData[key].length === 0) {
                    el.innerHTML = '<error>No Data!</error>';
                } else {
                    if (reportMode === 'table') {
                        this.renderReportAsTable(el, report, this.reportsData[key]);
                    } else {
                        this.renderReportAsChart(el, report, this.reportsData[key]);
                    }
                }

            }
        },
        async renderReportAsTable(el, report, data) {
            const columns = [];
            const rows = [];
            // =>collect columns
            for (const col of data.columns) {
                columns.push(`<td>${col}</td>`);
            }
            // =>collect rows
            for (const row of data.rows) {
                const rowData = row.map(i => `<td>${i}</td>`);

                rows.push(`<tr>${rowData.join('')}</tr>`);
            }


            el.innerHTML = `
                                <table>
            <thead><tr>${columns.join('\n')}</tr></thead>
            <tbody>${rows.join('\n')}</tbody>
                                    </table>
                                `;
        },


        async renderReportAsChart(el, report, data) {
            el.innerHTML = `<div style="max-height: 500px;"><canvas id="chart_report_${report.id}"></canvas></div>
                `;
            const canvasEl = document.getElementById(`chart_report_${report.id}`);
            // =>collect labels
            const labels = data.labels;

            // =>collect datasets
            const datasets = [];
            for (const item of data.data) {
                datasets.push({
                    data: item,
                });
                // labels.push(item[1]);
            }
            // =ready data
            const chartData = {
                labels,
                datasets,
            };
            // =>render chart
            const chartEl = new Chart(canvasEl,
                {
                    type: this.chartTypeMap[report.mode],
                    data: chartData,
                }
            );
            setTimeout(() => {
                canvasEl.style.margin = 'auto';
                chartEl.render();
            }, 300);
            // console.log(chartEl, chartData, this.chartTypeMap[report.mode], data)
        }
    },
});
