import React from 'react';
import { Form, Select } from 'antd';
import { connect } from 'react-redux';

import { setLang } from "../../../redux/actions";
import { langCookieName } from "../../../constants";
import { getCookie, setCookie } from "../../../utils/useCookies";

import flag_ru from "../../../assets/img/flag_ru.png";
import flag_uz from "../../../assets/img/flag_uz.png";

const { Option } = Select;

class LangChanger extends React.Component {
    handleSelectChange = (value) => {
        this.props.setLang(value);
        setCookie(langCookieName, value);
    }

    checkLang = () => {
        const currentLang = getCookie(langCookieName);
        if (currentLang && (currentLang === 'uz' || currentLang === 'ru')) {
            this.props.setLang(currentLang);
        } else {
            setCookie(langCookieName, 'uz');
            this.props.setLang('uz');
        }
    }

    componentDidMount() {
        this.checkLang();
    }

    render() {
        const { lang } = this.props;

        return (
            <Form
                name="basic"
                initialValues={{
                    language: lang,
                }}
            >
                <Form.Item
                    name="language"
                >
                    <Select
                        onChange={this.handleSelectChange}
                        className="lang-selector"
                    >
                        <Option value="ru"><img src={flag_ru} alt="Img error" /> Ru</Option>
                        <Option value="uz"><img src={flag_uz} alt="Img error" /> Uz</Option>
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
    }
}

export default connect(mapStateToProps, { setLang })(LangChanger);