import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Form, Tag, InputNumber, Button, Space, Popconfirm } from 'antd';
import { connect } from "react-redux";

import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const EditableContext = React.createContext();


const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async e => {
        try {
            const values = await form.validateFields();

            if (values.hasOwnProperty('count')) {
                const count_total = values['count'] + record['count_container'] * record['count_in_container'];
                const cost_item_total = record['cost_item'] ? count_total * record['cost_item'] : 0;

                const newObj = {
                    ...record,
                    ...values,
                    count_total,
                    cost_item_total,
                }
                handleSave({ ...newObj });
            } else if (values.hasOwnProperty('count_container')) {
                const count_total = record['count'] + values['count_container'] * record['count_in_container'];
                const cost_item_total = record['cost_item'] ? count_total * record['cost_item'] : 0;

                const newObj = {
                    ...record,
                    ...values,
                    count_total,
                    cost_item_total,
                }
                handleSave({ ...newObj });
            }
            toggleEdit();
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber ref={inputRef} min={0} max={100000000} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
    }

    return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
    constructor() {
        super();
        this.state = {
            count: 2,
            selectedRowKeys: [],
            isDeleteBtnDisabled: true,
        };
    }

    renderColumns = (content, lang) => {
        return [
            {
                title: content.label,
                dataIndex: 'label',
                width: 120,
                // ...this.getColumnSearchProps('label'),
            },
            {
                title: content.count,
                dataIndex: 'count',
                width: 120,
                editable: true,
            },
            {
                title: content.count_container,
                width: 120,
                dataIndex: 'count_container',
                editable: true,
            },
            {
                title: content.count_in_container,
                width: 120,
                dataIndex: 'count_in_container',
            },
            {
                title: content.count_total,
                width: 120,
                dataIndex: 'count_total',
            },
            {
                title: content.cost,
                width: 120,
                dataIndex: 'cost_item',
            },
            {
                title: content.cost_item_total,
                width: 120,
                dataIndex: 'cost_item_total',
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

    handleSave = (row) => {
        const newData = [...this.props.basketProducts];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });

        this.props.setBasketProducts(newData);
    }

    onSelectChange = selectedRowKeys => {
        this.setState({
            selectedRowKeys,
            isDeleteBtnDisabled: selectedRowKeys.length > 0 ? false : true,
        });
    }

    deleteConfirm = () => {
        const { selectedRowKeys } = this.state;
        const { basketProducts } = this.props;

        const newList = basketProducts.filter((product) => !selectedRowKeys.includes(product.id));
        this.props.setBasketProducts(newList);
        this.setState({ selectedRowKeys: [] });
    }

    render() {
        const { selectedRowKeys, isDeleteBtnDisabled } = this.state;
        const { lang, langs, basketProducts } = this.props;
        const content = langs[lang];

        const cols = this.renderColumns(content, lang);

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };

        const columns = cols.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        return (
            <div style={{ marginTop: 20 }}>
                <Space style={{ marginBottom: 20 }}>
                    <Popconfirm
                        title={`${content.delete_confirm_label}?`}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        cancelText={content.cancel_label}
                        okText={content.confirm_label}
                        onConfirm={this.deleteConfirm}
                    >
                        <Button danger disabled={isDeleteBtnDisabled}>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </Space>

                <Table
                    components={components}
                    // rowSelection="checkbox"
                    rowSelection={rowSelection}
                    rowClassName={() => 'editable-row'}
                    rowKey="id"
                    bordered
                    size="small"
                    dataSource={basketProducts}
                    columns={columns}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(EditableTable);