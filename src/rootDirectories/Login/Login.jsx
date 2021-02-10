import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

/* HOST */
// import { loginUser } from "../../server/config";

/* FUNCTIONS */
import { setCookie } from "../../utils/useCookies";
// import { setRequestHeader } from "../../server/host";

/* STYLES */
import "../../index.scss";
import "./login.scss";

/* CONSTANTS */
import {
    userAccessTokenName,
    APP_VERSION,
} from "../../constants";

const { Title } = Typography;

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const submitLogin = () => {
        setSubmitting(true);
        
        if (login === 'test' && password === "123") {
            setCookie(userAccessTokenName, true);
            window.location = "/dashboard";
        } else {
            form.resetFields();
            setPassword('');
            setLogin('');
            setSubmitting(false);
            message.error("Login or password is incorrect!");
        }

        // Request to log in
        // loginUser({ login, password }).then((res) => {
        //     if (res && res.status === 200) {
        //         setCookie(userAccessTokenName, res.data.cookieProp);
        //         setRequestHeader(res.data);
        //         window.location = "/dashboard";
        //     } else {
        //         form.resetFields();
        //         setPassword('');
        //         setLogin('');
        //         setSubmitting(false);
        //     }
        // })
    }

    return (
        <React.Fragment>
            <div className="version-box">
                <p>v - {APP_VERSION}</p>
            </div>
            <Row justify="center" align="middle" style={{ height: "100vh" }}>
                <Col xs={20} sm={12} md={8} lg={4}>
                    <Title level={3} className="text-center">Project name</Title>

                    <Form
                        name="basic"
                        form={form}
                        onFinish={submitLogin}

                    >
                        <Form.Item
                            name="login"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your login!",
                                },
                            ]}
                        >
                            <Input
                                name="login"
                                autoFocus
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Login"
                                disabled={isSubmitting}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password
                                name="password"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Password"
                                disabled={isSubmitting}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="float-right" disabled={isSubmitting} loading={isSubmitting}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default Login;