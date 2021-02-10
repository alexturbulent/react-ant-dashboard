import React from 'react';
import { Row, Col, Form, Select } from 'antd';
import { connect } from 'react-redux';

import { setLang } from "../../redux/actions";
import { langCookieName } from "../../constants";
import { getCookie, setCookie } from "../../utils/useCookies";
import { lang_content } from "../../lang";

const { Option } = Select;

class Profile extends React.Component {
    state = { lang: getCookie(langCookieName) }

    handleSelectChange = (value) => {
        this.setState({ lang: value });
        this.props.setLang(value);
        setCookie(langCookieName, value);
    }

    render() {
        const { lang } = this.state;
        const content = lang_content[lang];

        return (
            <React.Fragment>
                <Row style={{ marginBottom: 20 }}>
                    <Col>
                        <h3>
                            {content.profile_heading}
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form
                            name="basic"
                            initialValues={{
                                language: lang,
                            }}
                        >
                            <Form.Item
                                label={content.profile_select_label}
                                name="language"
                            >
                                <Select
                                    placeholder={content.profile_select_label}
                                    // defaultValue={lang}
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value="ru">Русский (ru)</Option>
                                    <Option value="uz">O'zbek (uz)</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default connect(null, { setLang })(Profile);