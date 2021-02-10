import React from 'react';
import { Empty } from "antd";
import { connect } from 'react-redux';

const NoData = (props) => {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={props.content.no_data} />;
}

const mapStateToProps = (state) => {
    return {
        content: state.langs[state.lang],
    }
}

export default connect(mapStateToProps)(NoData);