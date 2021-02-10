import React from 'react';
import { Row, Col, Skeleton, Table, Tag, Image } from "antd";
import { connect } from "react-redux";

import { getCarBrands, deleteCarBrand } from "../../../server/config";
import { host, port } from "../../../server/host";

import DeleteConfirm from "../../../commonComponents/DeleteConfirm";
import ModalForm from "./components/ModalForm";

function renderColumns(content, lang) {
    return [
        {
            title: content.index,
            dataIndex: 'index',
            align: "center",
            width: 70,
            sorter: (a, b) => a.index - b.index,
        },
        {
            title: content.id,
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: content.file_path,
            dataIndex: 'file_path',
            render: (record) => record && <Image className="brand-img" alt="Img error" src={`${host}:${port}${record}`} />,
        },
        {
            title: content.label,
            dataIndex: 'label',
            sorter: (a, b) => a.label.localeCompare(b.label),
        },
        {
            title: content.sequence,
            dataIndex: 'sequence_id',
            sorter: (a, b) => a.sequence_id - b.sequence_id,
        },
        {
            title: content.status,
            render: (record) => {
                const obj = record['status'];
                return (
                    obj['id'] === 1 ? (
                        <Tag color="#87d068" style={{ minWidth: 100 }}>
                            {obj[`label_${lang}`]}
                        </Tag>
                    ) : (
                            <Tag color="#ff0000" style={{ minWidth: 100 }}>
                                {obj[`label_${lang}`]}
                            </Tag>
                        )
                )
            },
        },
    ];
}

class AutoBrand extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            isLoading: true,
            list: [],
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

    getList = () => {
        this.setState({ isLoading: true });
        getCarBrands().then((res) => {
            if (res && res.data && res.data.meta) {
                const list = res.data.payload.map((item, index) => {
                    item.index = index + 1;
                    return item;
                });
                this.setState({
                    isLoading: false,
                    selectedRowKeys: [],
                    list,
                })
            } else {
                this.setState({
                    isLoading: false,
                })
            }
        })
    }

    componentDidMount() {
        this.getList();
    }

    render() {
        const {
            selectedRowKeys,
            isLoading,
            list,
        } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const { langs, lang } = this.props;
        const content = langs[lang];

        const columns = renderColumns(content, lang);

        const isMultiple = selectedRowKeys.length > 1 ? true : false;
        const isSingle = selectedRowKeys.length === 1 ? true : false;

        return (
            <React.Fragment>
                <Row justify="space-between" style={{ marginBottom: 20 }}>
                    <Col>
                        <h3>
                            {content.auto_brand_heading}
                        </h3>
                    </Col>
                    <Col>
                        <Row gutter={[8]}>
                            {
                                !isLoading && (
                                    <Col>
                                        <ModalForm getList={this.getList} />
                                    </Col>
                                )
                            }
                            {
                                isSingle && (
                                    <Col>
                                        <ModalForm edit getObj={this.getCheckedObj} getList={this.getList} />
                                    </Col>
                                )
                            }
                            {
                                (isSingle || isMultiple) && (
                                    <Col>
                                        <DeleteConfirm list={selectedRowKeys} getList={this.getList} delete={deleteCarBrand} />
                                    </Col>
                                )
                            }
                        </Row>
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

export default connect(mapStateToProps)(AutoBrand);