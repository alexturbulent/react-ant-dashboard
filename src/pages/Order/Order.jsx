import React from 'react';
import { Row, Col, Skeleton, Table, Select, Space, DatePicker, Button } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import FileSaver from 'file-saver';

import { getOrders, getOrderReport } from "../../server/config";
import { PlusOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
import { setCurrentOrder } from "../../redux/actions";

const { Option } = Select;
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm";

function renderColumns(content, lang) {
    return [
        {
            title: content.id,
            dataIndex: 'id',
            fixed: 'left',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: content.cost,
            dataIndex: 'cost',
        },
        {
            title: content.cost_sum,
            dataIndex: 'cost_sum',
        },
        {
            title: content.delivery_cost,
            dataIndex: 'delivery_cost',
        },
        {
            title: content.delivery_cost_sum,
            dataIndex: 'delivery_cost_sum',
        },
        {
            title: content.total_cost,
            dataIndex: 'total_cost',
        },
        {
            title: content.total_cost_sum,
            dataIndex: 'total_cost_sum',
        },
        {
            title: content.last_edited_ts,
            width: 150,
            render: (data) => data['last_edited_ts'] ? moment(data['last_edited_ts']).format(dateTimeFormat) : null,
        },
        {
            title: content.last_editor,
            render: (data) => data['last_editor'] ? data['last_editor']['full_name'] : null,
        },
        {
            title: content.payment_due_ts,
            render: (data) => data['payment_due_ts'] ? moment(data['payment_due_ts']).format(dateFormat) : null,
        },
        {
            title: content.payment_due_type,
            render: (data) => data['payment_due_type'] ? data['payment_due_type'][`label_${lang}`] : null,
        },
        {
            title: content.user,
            render: (data) => data['user'] ? data['user'][`full_name`] : null,
        },
        {
            title: content.status,
            render: (data) => data['status'] ? data['status'][`label_${lang}`] : null,
        },
    ]
}

const currentTime = Date.now();
const date_from = moment(currentTime - 10 * 24 * 60 * 60 * 1000).format(dateFormat);
const date_to = moment(currentTime).format(dateFormat);
const dateFromMoment = moment(date_from, dateFormat);
const dateToMoment = moment(date_to, dateFormat);

class Orders extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            orderType: 'active',
            isLoading: true,
            isReportFetching: false,
            list: [],
            date_from,
            date_to,
        }
    }

    onSelectChange = (selectedRowKeys) => this.setState({ selectedRowKeys });

    handleClickedRow = (record) => {
        let newList = [];
        const { selectedRowKeys } = this.state;
        const id = record['id'];

        if (this.state.selectedRowKeys.includes(id)) {
            newList = selectedRowKeys.filter((selectedId) => selectedId !== id);
        } else {
            newList = [...selectedRowKeys, id];
        }

        this.setState({
            selectedRowKeys: newList,
        })
    }

    getCheckedObj = () => {
        const { list, selectedRowKeys } = this.state;
        let newObj = {};

        list.forEach((obj) => {
            if (selectedRowKeys.length === 1 && obj['id'] === selectedRowKeys[0]) {
                newObj = obj;
            }
        })
        return newObj;
    }

    handleOrderTypeChange = (orderType) => {
        if (orderType) {
            this.setState({
                orderType,
            }, () => this.getList());
        }
    }

    handleDateRange = (dateList) => {
        const date_from = moment(dateList[0]).format(dateFormat);
        const date_to = moment(dateList[1]).format(dateFormat);

        this.setState({
            date_from,
            date_to,
        }, () => this.getList());
    }

    goToEdit = () => {
        const { selectedRowKeys, list } = this.state;
        let selectedOrder = null;
        for (let index = 0; index < list.length; index++) {
            if (selectedRowKeys.includes(list[index]['id'])) {
                selectedOrder = list[index];
                break;
            }
        }

        if (selectedOrder) {
            this.props.setCurrentOrder(selectedOrder);
            this.props.history.push('/order/order-form');
        }
    }

    getReport = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            this.setState({
                isReportFetching: true,
            }, () => {
                getOrderReport({
                    order_ids: selectedRowKeys
                }).then((res) => {
                    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    FileSaver.saveAs(blob, `report.xlsx`);
                    this.setState({ isReportFetching: false });
                })
            })
        }
    }

    getList = () => {
        const {
            orderType,
            date_from,
            date_to,
        } = this.state;

        this.setState({ isLoading: true }, () => {
            getOrders(
                orderType,
                {
                    date_from,
                    date_to,
                }
            ).then((res) => {
                if (res && res.data) {
                    this.setState({
                        isLoading: false,
                        selectedRowKeys: [],
                        list: res.data.payload,
                    });
                } else {
                    this.setState({
                        isLoading: false,
                    })
                }
            })
        });
    }

    componentDidMount() {
        if (date_from && date_to) {
            this.getList();
        } else {
            this.setState({
                isLoading: false,
            })
        }
    }

    render() {
        const {
            selectedRowKeys,
            isLoading,
            isReportFetching,
            list,
        } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const { langs, lang } = this.props;
        const content = langs[lang];

        const columns = renderColumns(content, lang);

        const isMultiple = selectedRowKeys.length > 1 ? true : false;
        const isSingle = selectedRowKeys.length === 1 ? true : false;

        return (
            <React.Fragment>
                <Row justify="space-between" style={{ marginBottom: 20 }}>
                    <Col>
                        <Space>
                            <h3>
                                {content.order_heading}
                            </h3>
                            <Select
                                style={{ width: 200 }}
                                onChange={this.handleOrderTypeChange}
                                defaultValue="active"
                            >
                                <Option value="active">Active</Option>
                                <Option value="archive">Archive</Option>
                                <Option value="cancelled">Cancelled</Option>
                            </Select>
                            <RangePicker
                                onChange={this.handleDateRange}
                                defaultValue={[dateFromMoment, dateToMoment]}
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            {
                                (isSingle || isMultiple) && (
                                    <Button onClick={this.getReport} title="Report" loading={isReportFetching} disabled={isReportFetching}>
                                        <FileExcelOutlined />
                                    </Button>
                                )
                            }
                            <Button type="primary" onClick={() => this.props.history.push('/order/order-form')}>
                                <PlusOutlined />
                            </Button>
                            {
                                isSingle && (
                                    <Button onClick={this.goToEdit}>
                                        <EditOutlined />
                                    </Button>
                                )
                            }
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {
                            isLoading ? (
                                <Skeleton active />
                            ) : (
                                    <Table
                                        bordered
                                        size="small"
                                        rowSelection={rowSelection}
                                        columns={columns}
                                        dataSource={list}
                                        rowKey="id"
                                        scroll={{ x: 1300 }}
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: (event) => {
                                                    this.handleClickedRow(record);
                                                },
                                            };
                                        }}
                                    />
                                )
                        }
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        langs: state.langs,
    }
}

export default withRouter(connect(mapStateToProps, { setCurrentOrder })(Orders));