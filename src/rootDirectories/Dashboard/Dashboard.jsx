import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout, PageHeader, Spin, message } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import { setLang } from "../../redux/actions";
import { langCookieName } from "../../constants";
import { setCookie, getCookie } from "../../utils/useCookies";

import LazyLoadErrorBoundary from "../../commonComponents/LazyLoadErrorBoundary";
import TopNavUserMenu from "./components/TopNavUserMenu";
import Sidebar from "./components/Sidebar";

import "../../index.scss";
import "./dashboard.scss";

const Home = lazy(() => import('../../pages/Home/Home'));
const Profile = lazy(() => import('../../pages/Profile/Profile'));
const NotFound = lazy(() => import('../../pages/NotFound/NotFound'));
const AutoBrand = lazy(() => import('../../pages/References/AutoBrand/AutoBrand'));
const User = lazy(() => import('../../pages/References/User/User'));
const Order = lazy(() => import('../../pages/Order/Order'));
const OrderForm = lazy(() => import('../../pages/Order/components/OrderForm'));

const { Content } = Layout;

class Dashboard extends React.Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        })
    }

    goToMenu = (key) => {
        if (key) {
            this.props.history.push(key);
        } else {
            message.info('Not found this kind of menu');
        }
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
        return (
            <Router basename="/dashboard">
                <Layout>

                    <Sidebar collapsed={this.state.collapsed} onClose={this.toggle} />

                    <Layout className="site-layout">
                        <PageHeader
                            ghost={false}
                            onBack={false}
                            title={
                                React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: this.toggle,
                                })
                            }
                            extra={[
                                <TopNavUserMenu key="userControlBtn" />
                            ]}
                        >
                        </PageHeader>

                        <Content
                            className="site-layout-background"
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                            }}
                        >
                            <LazyLoadErrorBoundary>
                                <Switch>
                                    <Route path='/references/user' render={() => renderComponentWithSuspense(<User />)} />
                                    <Route path='/references/auto-brand' render={() => renderComponentWithSuspense(<AutoBrand />)} />
                                    <Route path='/order/order-form' render={() => renderComponentWithSuspense(<OrderForm />)} />
                                    <Route exact path='/order' render={() => renderComponentWithSuspense(<Order />)} />
                                    <Route path='/profile' render={() => renderComponentWithSuspense(<Profile />)} />
                                    <Route exact path='/' render={() => renderComponentWithSuspense(<Home />)} />
                                    <Route render={() => renderComponentWithSuspense(<NotFound />)} />
                                </Switch>
                            </LazyLoadErrorBoundary>
                        </Content>
                    </Layout>
                </Layout>
            </Router>
        )
    }
}

function renderComponentWithSuspense(component) {
    return (
        <Suspense fallback={<Spin />}>
            {component}
        </Suspense>
    )
}

export default withRouter(connect(null, { setLang })(Dashboard));