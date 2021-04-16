import React, { useState } from "react";
import { Row, Col, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

/* HOST */
import { loginUser } from "../../server/config";

/* FUNCTIONS */
import { setCookie } from "../../utils/useCookies";

/* STYLES */
import "../../index.scss";
import "./login.scss";

/* CONSTANTS */
import { userAccessTokenName } from "../../constants";

/* COMPONENTS */
import LoginTopHeader from "./components/LoginTopHeader";
import { connect } from "react-redux";

const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
}

const Login = (props) => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const [loginForm] = Form.useForm();

    const { langs, lang } = props;
    const content = langs[lang];

    const handleUsernameChange = (e) => setUsername(e.target.value);

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const onFinish = () => {
        setSubmitting(true);

        loginUser({
            username,
            password,
        }).then((res) => {
            if (res && res.status === 200 && res.data) {
                setCookie(userAccessTokenName, res.data.token)
                window.location = "/dashboard";
            } else {
                message.error("Something went wrong!")
                loginForm.resetFields();
                setSubmitting(false);
            }
        })
    }

    return (
        <Row className="login-row">
            <Col xs={24} sm={12} md={12} lg={7} className="login-left">
                <Row justify="space-between" style={{ height: "100%" }}>
                    <Col span={24}>
                        <LoginTopHeader />
                        <Row align="bottom" justify="center" className="welcome-section">
                            <Col>
                                <h2>Welcome</h2>
                                <p>This is a subtitle in login page</p>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}>
                        <Form
                            form={loginForm}
                            name="basic"
                            className="login-form"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: content.please_add_login,
                                    },
                                ]}
                            >
                                <Input
                                    autoFocus
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    name="username"
                                    placeholder={content.username}
                                    onChange={handleUsernameChange}
                                    disabled={isSubmitting}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: content.please_add_password,
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    name="password"
                                    placeholder={content.password}
                                    onChange={handlePasswordChange}
                                    disabled={isSubmitting}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button htmlType="submit" className="submit-btn" disabled={isSubmitting} loading={isSubmitting}>
                                    {content.login_submit}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col span={24}>
                        <Row style={{ height: "100%" }} justify="center" align="bottom">
                            <Col>{content.all_right_reserved} {getCurrentYear()}</Col>
                        </Row>
                    </Col>
                </Row>


            </Col>

            <Col xs={24} sm={12} md={12} lg={17} className="login-right">
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col className="glass-box">
                        <h2>Give a man a fish and you feed him for a day; teach a man to fish and you feed him for a lifetime.</h2>
                        <p>Exemplary word</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(Login);