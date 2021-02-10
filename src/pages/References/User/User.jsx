import React from 'react';
import { Row, Col, Skeleton, Table, Tag } from "antd";
import { connect } from "react-redux";

import {
    getUsers,
    // deleteUser
} from "../../../server/config";

// import DeleteConfirm from "../../../commonComponents/DeleteConfirm";
import ModalForm from "./components/ModalForm";
import ChangePasswordModal from "./components/ChangePasswordModal";

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
            title: content.full_name,
            dataIndex: 'full_name',
            sorter: (a, b) => a['full_name'].localeCompare(b['full_name']),
        },
        {
            title: content.phone,
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
        },
        {
            title: content.role,
            dataIndex: 'role',
            sorter: (a, b) => a['role']['label'].localeCompare(b['role']['label']),
            render: (record) => record['label'],
        },
        {
            title: content.status,
            render: (record) => {
                const obj = record['status'];
                if (obj && obj.hasOwnProperty('id')) {
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
                } else {
                    return null;
                }
            },
        },
    ];
}

class User extends React.Component {
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
        getUsers().then((res) => {
            if (res && res.data && res.data.meta && res.data.meta.payload_count) {
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

        // const isMultiple = selectedRowKeys.length > 1 ? true : false;
        const isSingle = selectedRowKeys.length === 1 ? true : false;

        return (
            <React.Fragment>
                <Row justify="space-between" style={{ marginBottom: 20 }}>
                    <Col>
                        <h3>
                            {content.user_heading}
                        </h3>
                    </Col>
                    <Col>
                        <Row gutter={[8]}>
                            {
                                isSingle && (
                                    <ChangePasswordModal getObj={this.getCheckedObj} getList={this.getList} />
                                )
                            }
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
                            {/* {
                                (isSingle || isMultiple) && (
                                    <Col>
                                        <DeleteConfirm list={selectedRowKeys} getList={this.getList} delete={deleteUser} />
                                    </Col>
                                )
                            } */}
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

export default connect(mapStateToProps)(User);