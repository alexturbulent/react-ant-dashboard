import React from 'react';
import { Row, Col, Form, Input, Button, Select, Space, DatePicker, InputNumber, message, Skeleton } from 'antd';
import { connect } from 'react-redux';
import moment from "moment";
import { withRouter } from 'react-router-dom';
import { v4 as uuid } from "uuid";

import {
    createOrder,
    updateOrder,
} from "../../../server/config";

import { setCurrentOrder } from "../../../redux/actions";

import NoData from "../../../commonComponents/NoData";
import ProductModal from "./ProductModal";
import EditableTable from "./EditableTable";

import "../../pages.scss";

const { Option } = Select;
const { TextArea } = Input;

class OrderForm extends React.Component {
    constructor() {
        super();
        this.state = {
            isEdit: false,

            isEditRendering: false,

            isSubmitting: false,
            isFetching: true,
            isProductFetching: true,
            paymentDueTypes: [],
            users: [],
            statuses: [],
            productList: [],
            basketProducts: [],
            userTypeId: null,
            basketProductsCost: 0,
            params: {
                payment_due_type: {
                    id: null,
                },
                user: {
                    id: null,
                },
                longitude: null,
                latitude: null,
                address: null,
                note: null,
                payment_due_ts: null,
                status: {
                    id: null
                },
                cost: null,
                delivery_cost: null,
            }
        }
    }

    handleInputNumberChange = (name, value) => {
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    }

    handleSelectChange = (name, value) => {
        this.setState({
            params: {
                ...this.state.params,
                [name]: {
                    id: value
                },
            }
        })
        if (name === 'user') {
            const selectedUser = this.state.users.filter((user) => user['id'] === value);
            if (selectedUser) {
                let { basketProducts, productList, userTypeId } = this.state;
                const newUserTypeId = selectedUser[0]['user_type']['id'];

                if (newUserTypeId !== userTypeId) {
                    let basketProductsCost = 0;

                    basketProducts = basketProducts.map((product) => {
                        product['cost_item'] = product[`user_type_${newUserTypeId}_cost`];
                        product['cost_item_total'] = product['cost_item'] * product['count_total'];
                        basketProductsCost += product['cost_item_total'];
                        return product;
                    })


                    productList = productList.map((product) => {
                        product['cost_item'] = product[`user_type_${newUserTypeId}_cost`];
                        return product;
                    })

                    this.setState({
                        basketProductsCost,
                        productList,
                        basketProducts,
                    })
                }
            }
        }
    }

    handleDateRange = (name, value) => {
        let randomMin = Math.random() * 10;
        randomMin = randomMin.toFixed();
        const selectedDateInMillis = moment(value).valueOf();
        const dateInMillis = selectedDateInMillis - (15 * 60 * 60 * 1000 + randomMin * 60 * 1000);

        this.setState({
            [name]: dateInMillis ? dateInMillis : selectedDateInMillis,
        });
    }

    setBasketProducts = (list) => {
        let basketProductsCost = 0;

        list.forEach((product) => {
            basketProductsCost += product['cost_item_total'];
        })
        this.setState({
            basketProductsCost,
            basketProducts: list,
        })
    }

    mergeBasketProductList = (list) => {
        const { basketProducts } = this.state;
        let newList = [];

        if (list && Array.isArray(list) && list.length) {
            list.forEach((newProduct) => {
                let isExist = false;
                for (let index = 0; index < basketProducts.length; index++) {
                    if (newProduct['id'] === basketProducts[index]['id']) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    newList.push(newProduct);
                }
            })
            this.setState({
                basketProducts: [...newList, ...basketProducts],
            })
        }
    }

    setEditingObj = () => {
        const { current_order } = this.props;
        let basketProductsCost = 0;

        const itemBasket = current_order.item_basket.map((item) => {
            basketProductsCost = item.cost_item_total;

            let newItem = {
                ...item,
                ...item.product,
            }

            delete newItem.product;
            return newItem;
        });

        delete current_order.item_basket;

        this.setState({
            isEdit: true,
            isEditRendering: false,
            basketProductsCost,
            basketProducts: itemBasket,

            params: {
                // ...this.state.params,
                ...current_order,
                payment_due_ts: moment(current_order),
            }
        })
    }

    onFinish = () => {
        const { isEdit, basketProducts, payment_due_ts } = this.state;

        let cost = 0;

        if (isEdit) {
            basketProducts.map((product) => {
                product.uuid = this.state.params.item_basket_uuid;
                cost += product['cost_item'];
                product['product'] = {
                    id: product.id,
                }
                delete product.id;
                return product;
            })

            const objToSend = {
                ...this.state.params,
                payment_due_ts,
                cost,
                item_basket: basketProducts,
            }

            this.setState({
                isSubmitting: true,
            }, () => {
                updateOrder(objToSend).then((res) => {
                    if (res && res.data) {
                        message.success(res.data.meta.message);
                        this.goToOrders();
                    } else {
                        this.setState({
                            isSubmitting: false,
                        })
                    }
                })
            })

        } else {
            const item_basket_uuid = uuid();

            basketProducts.map((product) => {
                product.uuid = item_basket_uuid;
                cost += product['cost_item'];
                product['product'] = {
                    id: product.id,
                }
                delete product.id;
                return product;
            })

            const objToSend = {
                ...this.state.params,
                item_basket_uuid,
                payment_due_ts,
                cost,
                item_basket: basketProducts,
            }

            this.setState({
                isSubmitting: true,
            }, () => {
                createOrder(objToSend).then((res) => {
                    if (res && res.data) {
                        message.success(res.data.meta.message);
                        this.goToOrders();
                    } else {
                        this.setState({
                            isSubmitting: false,
                        })
                    }
                })
            })
        }
    }

    getCollection = () => {
        // Call any collection here
    }

    goToOrders = () => this.props.history.push('/order');

    componentWillUnmount() {
        this.props.setCurrentOrder(null);
    }

    componentDidMount() {
        const { current_order } = this.props;
        if (current_order) {
            this.setState({
                isEditRendering: true,
            }, () => {
                this.getCollection();
                this.setEditingObj();
            })
        } else {
            this.getCollection();
        }
    }

    render() {
        const {
            isEdit,
            isEditRendering,
            isSubmitting,
            isFetching,
            isProductFetching,
            users,
            statuses,
            paymentDueTypes,
            productList,
            basketProducts,
            basketProductsCost,
        } = this.state;

        const {
            delivery_cost,
            payment_due_type,
            user,
            address,
            note,
            status,
            payment_due_ts,
        } = this.state.params;

        const {
            langs,
            lang,
        } = this.props;
        const content = langs[lang];

        const status_id = status['id'];
        const payment_due_type_id = payment_due_type['id'];
        const user_id = user['id'];

        const total_sum = basketProductsCost + delivery_cost;

        if (isFetching || isEditRendering) {
            return (
                <React.Fragment>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <div className="car-form">
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        initialValues={{
                            user_id,
                            payment_due_type_id,
                            status_id,
                            payment_due_ts,
                            delivery_cost,
                            address,
                            note,
                        }}
                    >
                        <Row justify="space-between" style={{ marginBottom: 20 }}>
                            <Col>
                                <h3>
                                    {content[`${isEdit ? 'edit_order_heading' : 'new_order_heading'}`]}
                                </h3>
                            </Col>
                            <Col>
                                <Space>
                                    <Form.Item>
                                        {
                                            !isProductFetching && (
                                                <ProductModal
                                                    productList={productList}
                                                    mergeBasketProductList={this.mergeBasketProductList}
                                                />
                                            )
                                        }
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" disabled={isSubmitting} loading={isSubmitting}>
                                            {content.btn_submit}
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button onClick={this.goToOrders} disabled={isSubmitting}>
                                            {content.btn_cancel}
                                        </Button>
                                    </Form.Item>
                                </Space>
                            </Col>
                        </Row>

                        <Row gutter={[16]}>
                            <Col xs={24} sm={24} lg={8}>
                                <Form.Item
                                    label={content.user}
                                    name="user_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Required!',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={content.payment_due_type_id}
                                        onChange={(value) => this.handleSelectChange('user', value)}
                                        notFoundContent={<NoData />}
                                    >
                                        {
                                            users.map((user) => (
                                                <Option value={user.id} key={user.id}>
                                                    {user[`full_name`]}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={content.payment_due_type}
                                    name="payment_due_type_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Required!',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={content.payment_due_type_id}
                                        onChange={(value) => this.handleSelectChange('payment_due_type', value)}
                                    >
                                        {
                                            paymentDueTypes.map((paymentDueType) => (
                                                <Option value={paymentDueType.id} key={paymentDueType.id}>
                                                    {paymentDueType[`label_${lang}`]}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={content.status}
                                    name="status_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Required!',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={content.status_id}
                                        onChange={(value) => this.handleSelectChange('status', value)}
                                    >
                                        {
                                            statuses.map((status) => (
                                                <Option value={status.id} key={status.id}>
                                                    {status[`label_${lang}`]}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} lg={8}>
                                <Form.Item
                                    label={content.payment_due_ts}
                                    name="payment_due_ts"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Required!',
                                        },
                                    ]}
                                >
                                    <DatePicker onChange={(date) => this.handleDateRange('payment_due_ts', date)} className="w-100" />
                                </Form.Item>

                                <Form.Item
                                    label={content.delivery_cost}
                                    name="delivery_cost"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Required field!',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder={content.delivery_cost}
                                        min={1}
                                        max={1000000000}
                                        className="w-100"
                                        onChange={(value) => this.handleInputNumberChange("delivery_cost", value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={content.total_sum}
                                >
                                    <Button type="text">
                                        {total_sum}
                                    </Button>
                                </Form.Item>

                            </Col>

                            <Col xs={24} sm={24} lg={8}>
                                <Form.Item
                                    label={content.address}
                                    name="address"
                                >
                                    <TextArea
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        placeholder={content.address}
                                        name="address"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={content.note}
                                    name="note"
                                >
                                    <TextArea
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        placeholder={content.note}
                                        name="note"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <EditableTable
                            basketProducts={basketProducts}
                            setBasketProducts={this.setBasketProducts}
                        />
                    </Form>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        langs: state.langs,
        current_order: state.current_order,
    }
}

export default withRouter(connect(mapStateToProps, { setCurrentOrder })(OrderForm));