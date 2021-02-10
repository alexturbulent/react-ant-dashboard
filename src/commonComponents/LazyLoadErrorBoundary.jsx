import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor() {
        super();
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log('error in err boundary', error);

        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log('err boundary did catch', error);

        /* Hard reload if first time, else show message below */
        // if (!getCookie(APP_VERSION)) {
        //     window.location.reload(true);
        // } else {
        //     setCookie(APP_VERSION, 1);
        // }
    }

    render() {
        if (this.state.hasError) {
            return <p>Loading failed! Please reload or contact with administration.</p>;
        }

        return this.props.children;
    }
}