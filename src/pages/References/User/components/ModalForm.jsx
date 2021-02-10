import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Form, Input, Select, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, } from '@ant-design/icons';

import {
    createUser,
    updateUser,
} from "../../../../server/config";

import "../../../pages.scss";

const { Option } = Select;

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            isSubmitting: false,
            roles: [],
            userTypes: [],
            params: {
                full_name: null,
                phone: null,
                password: null,
                user_type: {
                    id: null
                },
                status: {
                    id: null
                },
                role: {
                    id: null
                },
            }
        }
    }

    onFinish = () => {
        this.setState({ isSubmitting: true }, () => {
            if (this.props.edit) {
                updateUser(this.state.params).then((res) => {
                    if (res) {
                        this.setState({ isSubmitting: false, visible: false });
                        this.props.getList();
                        message.success('Success');
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                })
            } else {
                createUser(this.state.params).then((res) => {
                    if (res) {
                        this.setState({ isSubmitting: false, visible: false });
                        message.success('Success');
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                    this.props.getList();
                })
            }
        });
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
        if (name) {
            this.setState({
                params: {
                    ...this.state.params,
                    [name]: {
                        id: value
                    },
                }
            })
        }
    }

    showModal = () => {
        const { edit, statuses } = this.props;
        const { params, roles } = this.state;

        if (edit) {
            const obj = this.props.getObj();
            this.setState({
                visible: true,
                params: { ...obj },
            });
        } else {
            const statusId = statuses.length ? statuses[0]['id'] : null;
            const roleId = roles.length ? roles[0]['id'] : null;
            this.setState({
                visible: true,
                params: {
                    ...params,
                    status: {
                        id: statusId,
                    },
                    role: {
                        id: roleId,
                    }
                }
            });
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    getCollection = () => {
        // Call collection requests here
    }
    componentDidMount() {
        this.getCollection();
    }

    render() {
        const {
            edit,
            statuses,
        } = this.props;

        const {
            isSubmitting,
            roles,
            // userTypes,
        } = this.state;

        const {
            full_name,
            phone,
            password,
            status,
            user_type,
            role,
        } = this.state.params;

        const user_type_id = user_type['id'];
        const status_id = status['id'];
        const role_id = role['id'];

        const { langs, lang } = this.props;
        const content = langs[lang];

        return (
            <React.Fragment>
                {
                    edit ? (
                        <Button onClick={this.showModal} title={content.btn_edit}>
                            <EditOutlined />
                        </Button>
                    ) : (
                            <Button type="primary" onClick={this.showModal} title={content.btn_add}>
                                <PlusOutlined />
                            </Button>
                        )
                }
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={edit ? content.edit_modal_heading : content.add_modal_heading}
                    visible={this.state.visible}
                    footer={null}
                    width={350}
                    className="car-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        initialValues={{
                            full_name,
                            phone,
                            status_id,
                            role_id,
                            user_type_id,
                            password,
                        }}
                    >
                        <Form.Item
                            label={content.full_name}
                            name="full_name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Full name required!',
                                },
                            ]}
                        >
                            <Input placeholder={content.full_name} name="full_name" onChange={this.handleInputChange} />
                        </Form.Item>

                        <Form.Item
                            label={content.phone}
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Phone required!',
                                },
                            ]}
                        >
                            <Input placeholder={content.phone} name="phone" onChange={this.handleInputChange} />
                        </Form.Item>

                        {
                            !edit && (
                                <Form.Item
                                    label={content.password}
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Password required!',
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder={content.password} name="password" onChange={this.handleInputChange} />
                                </Form.Item>
                            )
                        }

                        <Form.Item
                            label={content.role}
                            name="role_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Status required!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={content.role}
                                onChange={(value) => this.handleSelectChange('role', value)}
                            >
                                {
                                    roles.map((role) => (
                                        <Option value={role.id} key={role.id}>
                                            {role['label']}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        {/* <Form.Item
                            label={content.user_type_heading}
                            name="user_type_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Status required!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={content.user_type_heading}
                                onChange={(value) => this.handleSelectChange('user_type', value)}
                            >
                                {
                                    userTypes.map((userType) => (
                                        <Option value={userType.id} key={userType.id}>
                                            {userType[`label_${lang}`]}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item> */}

                        <Form.Item
                            label={content.status}
                            name="status_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Status required!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={content.status}
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

                        <Row className="form-footer" justify="end" gutter={[8]}>
                            <Col>
                                <Form.Item>
                                    <Button onClick={this.handleCancel} disabled={isSubmitting}>
                                        {content.btn_cancel}
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                        {content.btn_submit}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statuses: state.status_ref,
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(ModalForm);