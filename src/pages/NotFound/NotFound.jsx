import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const NotFound = (props) => {
    const { langs, lang } = props;
    const content = langs[lang];

    return (
        <Result
            status="404"
            title="404"
            subTitle={content.not_found}
            extra={<Button type="primary">
                <Link to="/">
                    {content.back_home_btn}
                </Link>
            </Button>}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(NotFound);