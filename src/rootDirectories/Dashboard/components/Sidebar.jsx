import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Drawer } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
    HomeOutlined,
    BookOutlined,
    UnorderedListOutlined,
    CarOutlined,
    DashboardOutlined,
    BlockOutlined,
    // DollarCircleOutlined,
    // ControlOutlined,
    // PayCircleOutlined,
    CopyrightOutlined,
    BarcodeOutlined,
    BankOutlined,
    ApartmentOutlined,
    UserOutlined,
    DropboxOutlined,
    DollarOutlined,
    NotificationOutlined,
    BellOutlined,
} from '@ant-design/icons';

import { lang_content } from "../../../lang";
import { APP_VERSION } from "../../../constants";

const { Sider } = Layout;
const { SubMenu } = Menu;



const Menus = (props) => {
    const content = props.content;

    const mainMenus = [
        {
            label: content.menu_home,
            path: "/",
            icon: <HomeOutlined />,
            children: null
        },
        {
            label: content.menu_reference,
            path: "/references",
            icon: <BookOutlined />,
            children: [
                {
                    label: content.menu_auto_brand,
                    path: "/references/auto-brand",
                    icon: <DashboardOutlined />,
                },
                {
                    label: content.menu_auto_model,
                    path: "/references/auto-model",
                    icon: <CarOutlined />,
                },
                {
                    label: content.menu_auto_model_type,
                    path: "/references/auto-model-type",
                    icon: <BlockOutlined />,
                },
                // {
                //     label: content.menu_currency,
                //     path: "/references/currency",
                //     icon: <DollarCircleOutlined />,
                // },
                // {
                //     label: content.menu_measurement,
                //     path: "/references/measurement",
                //     icon: <ControlOutlined />,
                // },
                // {
                //     label: content.menu_payment_due_type,
                //     path: "/references/payment-due-type",
                //     icon: <PayCircleOutlined />,
                // },
                {
                    label: content.menu_product_manufacturer,
                    path: "/references/product-manufacturer",
                    icon: <CopyrightOutlined />,
                },
                {
                    label: content.menu_product_type,
                    path: "/references/product-type",
                    icon: <BarcodeOutlined />,
                },
                {
                    label: content.menu_product,
                    path: "/references/product",
                    icon: <DropboxOutlined />,
                },
                {
                    label: content.menu_province,
                    path: "/references/province",
                    icon: <BankOutlined />,
                },
                {
                    label: content.menu_tuman,
                    path: "/references/tuman",
                    icon: <ApartmentOutlined />,
                },
                {
                    label: content.menu_user,
                    path: "/references/user",
                    icon: <UserOutlined />,
                },
                {
                    label: content.menu_merchant,
                    path: "/references/merchant",
                    icon: <UserOutlined />,
                },
                {
                    label: content.menu_rate,
                    path: "/references/rate",
                    icon: <DollarOutlined />,
                },
                {
                    label: content.menu_notification_type,
                    path: "/references/notification-type",
                    icon: <NotificationOutlined />,
                },
                {
                    label: content.menu_notification,
                    path: "/references/notification",
                    icon: <BellOutlined />,
                },
            ],
        },
        {
            label: content.menu_order,
            path: "/order",
            icon: <UnorderedListOutlined />,
            children: null,
        },
    ];

    return (
        <Menu mode="inline" defaultSelectedKeys={[props.location.pathname]}>
            {
                mainMenus.map((menu) => (
                    menu.children && Array.isArray(menu.children) ? (
                        <SubMenu
                            key={menu.path}
                            title={
                                <span>
                                    {menu.icon}
                                    <span>{menu.label}</span>
                                </span>
                            }
                        >
                            {
                                menu.children.map((childMenu) => (
                                    <Menu.Item key={childMenu.path} onClick={() => props.history.push(childMenu.path)}>
                                        <Link to={childMenu.path}>
                                            {childMenu.icon}
                                            {childMenu.label}
                                        </Link>
                                    </Menu.Item>
                                ))
                            }
                        </SubMenu>
                    ) : (
                            <Menu.Item key={menu.path}>
                                <Link to={menu.path}>
                                    {menu.icon}
                                    <span>{menu.label}</span>
                                </Link>
                            </Menu.Item>
                        )
                ))
            }
        </Menu>
    )
}

const Sidebar = (props) => {
    const content = lang_content[props.lang];

    if (window.innerWidth > 1300) {
        return (
            <Sider trigger={null} theme='light' collapsible collapsed={props.collapsed}>
                <Menus {...props} content={content} />
                <div className="app-version-box">
                    <p>v - {APP_VERSION}</p>
                </div>
            </Sider>
        )
    } else {
        return (
            <Drawer
                title={content.sidebar_heading}
                placement="left"
                closable={false}
                onClose={props.onClose}
                visible={!props.collapsed}
                bodyStyle={{
                    padding: 0
                }}
                footer={
                    <div className="app-version-box">
                        <p>v - {APP_VERSION}</p>
                    </div>
                }
            >
                <Menus {...props} content={content} />
            </Drawer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
    }
}

export default withRouter(connect(mapStateToProps)(Sidebar));