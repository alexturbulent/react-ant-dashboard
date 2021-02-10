import React from "react";
import { Menu, Button, Dropdown, Modal } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { deleteCookie } from "../../../utils/useCookies";
import { userAccessTokenName } from "../../../constants";
import { lang_content } from "../../../lang";

import {
    UserOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const TopNavUserMenu = (props) => {
    const content = lang_content[props.lang];

    function confirmLogOut() {
        confirm({
            title: content.log_out_title,
            icon: <ExclamationCircleOutlined />,
            content: content.log_out_content,
            okText: content.log_out_submit_btn,
            cancelText: content.log_out_cancel_btn,
            centered: true,
            onOk() {
                deleteCookie(userAccessTokenName);
                window.location = "/login"
            },
        });
    }

    return (
        <Dropdown
            trigger={["click"]}
            overlay={
                <Menu>
                    <Menu.Item key="child1" onClick={() => props.history.push('/profile')}>
                        <UserOutlined />
                        {content.menu_profile}
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item key="child2" onClick={confirmLogOut}>
                        <LogoutOutlined />
                        {content.menu_log_out}
                    </Menu.Item>
                </Menu>
            }
        >
            <Button shape="circle">
                <UserOutlined />
            </Button>
        </Dropdown>
    )
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
    }
}

export default withRouter(connect(mapStateToProps)(TopNavUserMenu));