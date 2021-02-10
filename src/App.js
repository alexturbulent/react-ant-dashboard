/* LIBRARIES */
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

/* FUNCTIONS */
import {
    // checkCookie,
    getCookie,
} from "./utils/useCookies";

/* CONSTANTS */
import { userAccessTokenName } from "./constants";

/* COMPONENTS */
import LazyLoadErrorBoundary from "./commonComponents/LazyLoadErrorBoundary";

/* PAGES */
const Dashboard = lazy(() => import("./rootDirectories/Dashboard/Dashboard"));
const Login = lazy(() => import("./rootDirectories/Login/Login"));

class App extends React.Component {
    render() {
        return (
            <Router>
                <LazyLoadErrorBoundary>
                    <Switch>
                        <Route path="/login" render={() => (
                            <Suspense fallback={""}>
                                <Login />
                            </Suspense>
                        )} />

                        {/* If you use JWT token uncomment and use this validation */}
                        {/* {
                            !checkCookie(userAccessTokenName) && (
                                <Route>
                                    <Redirect to="/login" />
                                </Route>
                            )
                        } */}
                        {
                            !getCookie(userAccessTokenName) && (
                                <Route>
                                    <Redirect to="/login" />
                                </Route>
                            )
                        }

                        <Redirect exact from="/" to="/dashboard" />

                        <Route path="/dashboard" render={() => (
                            <Suspense fallback={"Loading..."}>
                                <Dashboard />
                            </Suspense>
                        )} />

                        <Route render={() => <Redirect to="/login" />} />
                    </Switch>
                </LazyLoadErrorBoundary>
            </Router>
        )
    }
}

export default App;