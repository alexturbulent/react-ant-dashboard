import React from 'react';
import { Col, Row, Typography } from 'antd';

import LangChanger from "./LangChanger";

const { Title } = Typography;

const LoginTopHeader = () => {
    return (
        <React.Fragment>
            <Row justify="space-between">
                <Col>
                    <Title level={3} className="text-center">LMS</Title>
                </Col>
                <Col>
                    <LangChanger />
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default LoginTopHeader;