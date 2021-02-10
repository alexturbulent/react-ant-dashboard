import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Form, Input, message, Row, Col, Popconfirm } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';

import { resetPassword } from "../../../../server/config";

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            popConfirmVisible: false,
            visible: false,
            isSubmitting: false,
            params: {
                password: null,
            }
        }
    }

    onFinish = () => {
        this.setState({
            isSubmitting: true,
        }, () => {
            const { password } = this.state.params;

            const user = this.props.getObj();
            const user_id = user.id;

            resetPassword({
                user_id,
                password,
            }).then((res) => {
                if (res) {
                    this.setState({ isSubmitting: false, visible: false });
                    this.props.getList();
                    message.success('Success');
                } else {
                    this.setState({ isSubmitting: false, visible: false });
                }
            })
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


    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            popConfirmVisible: false,
        })
    }

    managePopConfirm = (bool) => {
        if (bool !== undefined && !!this.state.params.password) {
            this.setState({ popConfirmVisible: bool });
        }
    }

    handlePopConfirmSubmit = () => {

    }

    render() {
        const { isSubmitting, popConfirmVisible } = this.state;
        const { langs, lang } = this.props;
        const content = langs[lang];

        return (
            <React.Fragment>
                <Button type="primary" onClick={this.showModal} title={content.change_password}>
                    <UnlockOutlined />
                </Button>

                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={content.change_password}
                    visible={this.state.visible}
                    footer={null}
                    width={350}
                    className="car-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                    >
                        <Form.Item
                            label={content.password}
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Required!',
                                },
                            ]}
                        >
                            <Input.Password placeholder={content.password} name="password" onChange={this.handleInputChange} />
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
                                    <Popconfirm
                                        title={content.pop_confirm_title}
                                        visible={popConfirmVisible}
                                        onConfirm={this.onFinish}
                                        okButtonProps={{ loading: isSubmitting }}
                                        onCancel={() => this.managePopConfirm(false)}
                                        cancelText={content.btn_cancel}
                                    >
                                        <Button type="primary" htmlType="submit" loading={isSubmitting} onClick={() => this.managePopConfirm(true)}>
                                            {content.btn_submit}
                                        </Button>
                                    </Popconfirm>
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
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(ModalForm);