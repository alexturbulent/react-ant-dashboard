import React from 'react';
import { Modal, Button, Tag, Table, Input, Space, } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class ProductModal extends React.Component {
    state = {
        visible: false,
        selectedRowKeys: [],

        searchText: '',
        searchedColumn: '',
    };

    renderColumns = (content, lang) => {
        return [
            {
                title: content.label,
                dataIndex: 'label',
                width: 120,
                fixed: 'left',
                ...this.getColumnSearchProps('label'),
            },
            {
                title: content.count_in_container,
                width: 120,
                dataIndex: 'count_in_container',
                sorter: (a, b) => a.count_in_container - b.count_in_container,
            },
            {
                title: content.cost,
                width: 120,
                dataIndex: 'cost_item',
            },
            {
                title: content.model,
                width: 120,
                render: (record) => {
                    const obj = record['auto_models'];
                    let models = [];
                    obj.forEach((model) => {
                        models.push(model.label);
                    });
                    return models.join(", ");
                },
            },
            {
                title: content.model_brand,
                width: 120,
                render: (record) => {
                    const obj = record['auto_model_brand'];
                    return obj[`label`]
                },
            },
            {
                title: content.measurement,
                width: 120,
                render: (record) => {
                    const obj = record['measurement'];
                    return obj[`label_${lang}`]
                },
            },
            {
                title: content.manufacturer,
                width: 120,
                render: (record) => {
                    const obj = record['product_manufacturer'];
                    return obj[`label`]
                },
            },
            {
                title: content.product_type,
                width: 120,
                render: (record) => {
                    const obj = record['product_type'];
                    return obj[`label_${lang}`]
                },
            },
            {
                title: content.images,
                width: 120,
                render: (record) => {
                    const images = record['product_images'];
                    return images && Array.isArray(images) ? images.length : 0;
                },
            },
            {
                title: content.status,
                fixed: 'right',
                width: 120,
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

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={this.props.langs[this.props.lang]['search']}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        {
                            this.props.langs[this.props.lang]['search']
                        }
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        {
                            this.props.langs[this.props.lang]['reset']
                        }
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                    text
                ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    }

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    closeModal = () => {
        this.setState({
            visible: false,
            selectedRowKeys: [],
        });
    }

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

    handleSubmit = () => {
        const { selectedRowKeys } = this.state;
        const list = this.props.productList;
        const checkedProducts = list.filter((product) => selectedRowKeys.includes(product.id));
        this.setState({
            visible: false,
            selectedRowKeys: [],
        })
        this.props.mergeBasketProductList(checkedProducts);
    }

    render() {
        const { selectedRowKeys } = this.state;
        const list = this.props.productList;
        const { lang, langs } = this.props;
        const content = langs[lang];

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const columns = this.renderColumns(content, lang);

        return (
            <React.Fragment>
                <Button type="primary" onClick={this.showModal}>
                    <ShoppingCartOutlined />
                </Button>
                <Modal
                    centered
                    width='90%'
                    keyboard={false}
                    maskClosable={false}
                    title={content.product_heading}
                    visible={this.state.visible}
                    closable={false}
                    onOk={this.handleSubmit}
                    onCancel={this.closeModal}
                >

                    <Table
                        bordered
                        size="small"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={list}
                        rowKey="id"
                        scroll={{ x: 400, y: 500 }}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    this.handleClickedRow(record);
                                },
                            };
                        }}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(ProductModal);