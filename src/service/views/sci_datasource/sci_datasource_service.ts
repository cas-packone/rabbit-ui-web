import {util} from '../../uitil/util';

export class DataSourceService {

    getAllData(url: any) {
        return util.get(url);
    }

    /**
     * 获取options请求返回的数据  用来实现动态分页
     */
    getOpDatasource() {
        let url = '/space/datainstances/';
        return util.options(url);
    }

    getMyAllData(url: any) {
        return util.get(url);
    }

    getDataByPage(url: any, page: any) {
        url = url + page;
        let data = {
            page: page
        };
        return util.get(url, data);
    }

    getDataEngine(url: any) {
        return util.get(url);
    }

    getOpenSourceDataList(url: any) {
        return util.get(url);
    }

    shareDataset(dataset_url: any) {
        let data = {
            'url': dataset_url,
            'public': true,
        };
        return util.patch_url(dataset_url, data).then(function (data) {
            // this.dataset = (<any>data).body.results
            console.log('///////////////////////////////////////////sharedataset');
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }

    deleteDataset(url: any) {
        return util.delete_url(url).then(function (data) {
            // this.dataset = (<any>data).body.results
            console.log('///////////////////////////////////////////deletedataset');
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }

    operateDataSource(url: any, id: any) {
        let data = {
            id: id
        };
        return util.get(url, data);
    }

    // startDataSource(url:any,id: any) {
    //     let data = {
    //         id: id
    //     };
    //     return util.get(url, data);
    // }
    //
    // stopDataSource(url:any,id: any) {
    //     let data = {
    //         id: id
    //     };
    //     return util.get(url, data);
    // }

    loadData(url: any, model: any) {
        console.log('--------------------------------------------------');
        console.log('Model:' + JSON.stringify(model) + 'url:' + url);
        let data;
        if (url == '/space/datasets/') {
            data = {
                type: model.type,
                description: model.description,
                name: model.name,
                uri: model.uri,
                remark: model.remark,
            };
        } else if (url == '/space/datainstances/') {
            data = {
                name: model.name,
                engine: model.engine,
                dataset: model.dataset,
                space: model.space,
            };
        } else if (url == '/space/spaces/') {
            data = {
                blueprint: model.blueprint,
                engines: model.engines,
                name: model.name,
                remedy_script:model.remedy_script,
            };
        }
        return util.post(url, data);
    }

    /**
     * 载入-----创建数据源
     * @param url
     * @param name
     * @param enginetype
     * @param dataset
     */
    datasetloadDataSource(url: any, name: any, enginetype: any, dataset: any) {
        let data = {
            name: name,
            engine: enginetype,
            dataset: dataset,
            space: 'http://10.0.88.2:800/api/space/spaces/29/'
        };
        return util.post(url, data);
    }

    deleteDataSource(url: any) {
        return util.delete_url(url).then(function (data) {
            // this.datasource = (<any>data).body.results
            console.log('///////////////////////////////////////////deletedatasource');
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }
}

export let datasource_columns = [
    /*{
        title: '编号',
        key: 'uuid',
        width: 70,
        tooltip: true
    },*/
    {
        title: '名称',
        key: 'name',
        tooltip: true
    },
    {
        title: '数据集名称',
        key: 'dataset',
        tooltip: true,
        render: (h: any, params: any) => {
            // let a = this;
            // let texts ;
            // if (params.row.size >= 1024) {
            //     texts = (params.row.size / 1024).toPrecision(4) + 'G';
            // } else if (1 <= params.row.size < 1024) {
            //     texts = params.row.size.toPrecision(4) + 'M';
            // } else if (0 < params.row.size < 1) {
            //     texts = (params.row.size * 1024) + 'KB';
            // }
            return h('div', {
                props: {},
            }, params.row.dataset.name);
        },
    },
    {
        title: '引擎类型',
        key: 'engine',
        tooltip: true,
        render: (h: any, params: any) => {
            return h('div', {
                props: {},
            }, params.row.engine.name);
        }
    },
    {
        title: '大小',
        key: 'size',
        tooltip: true,
        // render: (h, params) => {
        //     // let a = this;
        //     let texts;
        //     if (params.row.size >= 1024) {
        //         texts = (params.row.size / 1024).toPrecision(4) + 'G';
        //     } else if (1 <= params.row.size < 1024) {
        //         texts = params.row.size.toPrecision(4) + 'M';
        //     } else if (0 < params.row.size < 1) {
        //         texts = (params.row.size * 1024) + 'KB';
        //     }
        //     return h('div', {
        //         props: {},
        //     }, texts);
        // },
    },
    {
        title: '状态',
        key: 'status',
        tooltip: true,
        render: (h: any, params: any) => {
            let states = ['无状态', '运行中', '阻塞中', '挂起中', '已停止', '奔溃中', '暂停中', '失联中',];
            return h('span', states[params.row.status]);
        }
    },
    {
        title: '操作',
        key: 'operation',
        width: 160,
        render: (h: any, params: any) => {
            let statebutton = '停止';
            if (params.row.state == 0) {
                statebutton = '启动';
            } else {
                statebutton = '停止';
            }

            return h('div', [
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small',
                        ghost: true
                    },
                    style: {
                        'margin-top': '5px',
                        'margin-bottom': '5px',
                        'margin-right': '5px'
                    },
                    on: {
                        click: () => {
                            if (params.row.state == 0) {
                                (<any>window).sci_datasource_context.start_DataSource(params.row.id);
                            } else {
                                (<any>window).sci_datasource_context.stop_DataSource(params.row.id);
                            }
                        },
                    }
                }, statebutton),
                h('Button', {
                    props: {
                        type: 'success',
                        size: 'small',
                        ghost: true
                    },
                    style: {
                        'margin-top': '5px',
                        'margin-bottom': '5px',
                    },
                    on: {
                        click: () => {
                            (<any>window).sci_datasource_context.show_WebUI();
                            (<any>window).sci_datasource_context.dialog_title = '数据引擎WebUI（' + params.row.enginetype + ')';
                            (<any>window).sci_datasource_context.selected_datasource = params.row;
                        },
                    }
                }, 'WebUI'),
                h('Button', {
                    props: {
                        type: 'error',
                        size: 'small',
                    },
                    style: {
                        'margin-top': '5px',
                        'margin-bottom': '5px',
                        'margin-right': '5px'
                    },
                    on: {
                        click: () => {
                            (<any>window).sci_datasource_context.delete_DataSource(params.row);
                        },
                    }
                }, '删除'),
                h('Button', {
                    props: {
                        type: 'info',
                        size: 'small',
                    },
                    style: {
                        'margin-top': '5px',
                        'margin-bottom': '5px',
                    },
                    on: {
                        click: () => {
                            (<any>window).sci_datasource_context.show_SimbaUI();
                            (<any>window).sci_datasource_context.dialog_title = 'Simba分析（' + params.row.name + ')';
                            (<any>window).sci_datasource_context.selected_datasource = params.row;
                        },
                    }
                }, 'Simba查询')
            ]);

        }
    }
];
export let datasource_info = {
    datasource: [
        {
            id: 1,
            name: '对撞事例数据源',
            dataset: '共有数据集',
            enginetype: 'eventdb',
            size: '1.1G',
            state: 1,
            operation: 1,
        }
        ,
        {
            id: 2,
            name: '测试数据源',
            dataset: 'TP-CH数据源',
            enginetype: 'hive',
            size: '1G',
            state: 0,
            operation: 1,
        }
    ],
    totalnum: 2
};

export let my_all_dataset = [
    {
        id: 1,
        name: '2012年10月对撞事例数据',
        owner: '共有数据集',
        size: '1.1G',
        description: '2012年10月对撞事例数据',
        operation: 1,
    },
    {
        id: 2,
        name: 'Lubm模拟数据',
        owner: '王华进',
        size: '0.75G',
        description: '对LUBM数据进行扩展生成的数据',
        operation: 1,
    },
    {
        id: 3,
        name: 'TP-CH模拟数据',
        owner: '王华进',
        size: '1G',
        description: '使用TP-CH生成工具生成的数据',
        operation: 2,
    },
    {
        id: 4,
        name: '搜狗语料——新闻',
        owner: '共有数据集',
        size: '1.39G',
        description: '搜狗公司提供的开源语料库，包括20个类别，10000个新闻',
        operation: 2,
    },
];
export let datasource_service = new DataSourceService();
