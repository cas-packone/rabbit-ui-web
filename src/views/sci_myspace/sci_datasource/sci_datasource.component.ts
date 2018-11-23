import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import Component from 'vue-class-component';
import component from 'vue-form-generator';
import {
    datasource_columns,
    datasource_info,
    datasource_service,
} from '../../../service/views/sci_datasource/sci_datasource_service';
import {util} from '@/service/uitil/util';

class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    currentpage = 1;
    datasourceInfos: any = [];
    totalnum = 2;

    mounted() {
        console.log('hello from app');
        (<any>window).sci_datasource_context = this;
        this.greet();
    }

    greet() {
        console.log(this.greeting);
        datasource_service.loadDataSource(this.greeting).then((data) => {
                console.log('//////////////////////////////////创建数据源成功');
                console.log(data);
                // if (data.status == 201) {
                //     this.$Notice.open({
                //         title: '通知',
                //         desc: '数据源  <span style="font-weight: bold">' + '  </span>创建成功'
                //     });
                //     this.refreshtable();
                // }
            },
            (reason) => {
                console.log('//////////////////////////////////创建数据源错误');
                console.log(reason);
            });

        datasource_service.getDataSourceByPage(this.currentpage).then(
            (data) => {
                console.log('//////////////////////////////////////////');
                console.log(data);
                this.datasourceInfos = (<any>data).data.results;
                this.totalnum = (<any>data).data.count;
                for (let item of this.datasourceInfos) {
                    item['enginetype'] = 't';
                    item.size = '4';
                }
                });
    }
}

@Component({})
export default class SciDatasourceComponent extends Vue {

    input_datasourcename: any = null;
    selected_enginetype: any = null;
    selected_dataset: any = null;

    show_webui: boolean = false;
    show_notebook: boolean = false;

    dataengines: any = [];

    dialog_title: any = '';
    selected_datasource: any = {};
    currentpage = 1;
    totalnum = 2;
    mydataset: any = [];
    datasourceColumns = datasource_columns;
    datasourceInfos: any = [];
    schema: any = [];
    gen_schema: any = [];
    gen_a_schema: any = [];
    model: any = {};
    formOptions: any = {};

    mounted() {
        console.log('hello from app');
        (<any>window).sci_datasource_context = this;
        this.refreshDataEngnie();
        this.refreshtable();
    }

    changePage(page: any) {
        this.currentpage = page;
        this.refreshtable();
    }

    refreshDataEngnie() {
        datasource_service.getDataEngine().then((data) => {
                console.log('///////////////////////////////////////////datasources');
                console.log(data);
                this.dataengines = (<any>data).data.results;
            },
            (reason) => {

            });
    }

    start_DataSource(id: any) {
        datasource_service.startDataSource(id).then();
        datasource_service.mock_startDataSource(id);
        this.refreshtable();
    }

    stop_DataSource(id: any) {
        datasource_service.stopDataSource(id).then();
        datasource_service.mock_stopDataSource(id);
        this.refreshtable();
    }

    delete_DataSource(id: any) {
        datasource_service.deleteDataSource(id).then();
        datasource_service.mock_deleteDataSource(id);
        this.refreshtable();
    }

    load_DataSource() {
        datasource_service.loadDataSource(this.model).then((data) => {
                console.log('//////////////////////////////////创建数据源成功');
                console.log(data);
                if (data.status == 201) {
                    this.$Notice.open({
                        title: '通知',
                        desc: '数据源  <span style="font-weight: bold">' + this.input_datasourcename + '  </span>创建成功'
                    });
                    this.refreshtable();
                }
            },
            (reason) => {
                console.log('//////////////////////////////////创建数据源错误');
                console.log(reason);
            });
    }

    show_WebUI() {
        this.show_webui = true;
    }

    // components!: {
    //     'vue-form-generator': VueFormGenerator.component;
    // };

    show_SimbaUI() {
        this.show_notebook = true;
    }

    refreshtable() {
        /**自动生成表单
         */
        datasource_service.getOpDatasource().then((data: any) => {
            //console.log('options////////////////////////////options');
            this.schema = (<any>data).data.actions.POST;
            this.formOptions = {
                validateAfterLoad: true,
                validateAfterChanged: true,
            };
            // console.log(this.schema);
            //console.log('options///////' + this.schema + '///////options');

            for (let elem in this.schema) {
                let value = this.schema[elem];
                if (value.read_only) continue;
                let gen_field = <any>{};
                switch (value.type) {
                    case 'boolean':
                        gen_field.type = 'checkbox';
                        break;
                    case 'string':
                        gen_field.type = 'input';
                        gen_field.inputType = 'text';
                        gen_field.validator = VueFormGenerator.validators.string;
                        VueFormGenerator.component;
                        break;
                    case 'field':
                        if ('choices' in value) {
                            gen_field.type = 'select';
                            gen_field.values = [];
                            for (let c of value.choices) {
                                gen_field.values.push({'id': c.value, 'name': c.display_name});
                            }
                        }
                        break;
                    case 'datetime':
                        gen_field.type = 'dateTimePicker';
                        gen_field.dateTimePickerOptions = {'format': 'HH:mm:ss'};
                        break;
                    case 'choice':
                        gen_field.type = 'select';
                        gen_field.values = [];
                        for (let c of value.choices) {
                            gen_field.values.push({'id': c.value, 'name': c.display_name});
                        }
                        break;
                    default:
                        break;
                }

                if ('default' in value) {
                    gen_field.default = value.default;
                }
                if ('help_text' in value) {
                    gen_field.hint = value.help_text;
                }
                gen_field.model = elem;
                gen_field.label = value.label;
                gen_field.required = value.required;
                gen_field.readonly = value.read_only;
                if (value.required) {
                    gen_field.validator = VueFormGenerator.validators.string;
                }
                // console.log(gen_field);
                this.gen_schema.push(gen_field);
                // break;
            }
            //console.log(JSON.stringify(this.gen_schema));
            let aa = new Greeter(this.model);
            let jd = <any>{
                'type': 'submit',
                'buttonText': 'Submit',
                'validateBeforeSubmit': true,
                'onSubmit': function () {
                    aa.greet();
                },
            };
            this.gen_schema.push(jd);
            this.gen_schema = {'fields': this.gen_schema};

            // for (let aa in this.gen_schema) {
            //     this.gen_a_schema = this.gen_schema[aa];
            //     console.log(this.gen_a_schema);
            // }
        });

        datasource_service.getDataSourceByPage(this.currentpage).then(
            (data) => {
                console.log('//////////////////////////////////////////');
                console.log(data);
                this.datasourceInfos = (<any>data).data.results;
                this.totalnum = (<any>data).data.count;
                for (let item of this.datasourceInfos) {
                    item['enginetype'] = 't';
                    item.size = '4';
                }
                // for (let item of this.datasourceInfos) {
                //     util.dir_get(item.engine).then((data) => {
                //             let index = 0;
                //             for (let item_iner of this.datasourceInfos) {
                //                 if (item_iner.engine == (<any>data).data.url) {
                //                     item_iner.enginetype = (<any>data).data.name;
                //                     Vue.set(this.datasourceInfos, index, item_iner);
                //                 }
                //                 index++;
                //             }
                //         },
                //         (reason) => {
                //             console.log('get dataenginename error');
                //         });
                //
                //     util.dir_get(item.dataset).then((data) => {
                //             let index = 0;
                //             for (let item_iner of this.datasourceInfos) {
                //                 if (item_iner.dataset == (<any>data).data.url) {
                //                     item_iner.datasetname = (<any>data).data.name;
                //                     item_iner.size = (<any>data).data.size;
                //                     Vue.set(this.datasourceInfos, index, item_iner);
                //                 }
                //                 index++;
                //             }
                //         },
                //         (reason) => {
                //             console.log('get dataenginename error');
                //         });
                // }
            },
            (reason) => {
                console.log(this.datasourceInfos, 'bbbbbbbbbbbbbbbb');
                this.$Notice.open({
                    title: '通知',
                    desc: '数据访问失败'
                });
            });
        datasource_service.getMyAllDataSet().then(
            (data) => {
                this.mydataset = (<any>data).data.results;
            },
            (reason) => {
                console.log('///////////////////////////////////////getmyalldataseterro');
            });
    }
}

