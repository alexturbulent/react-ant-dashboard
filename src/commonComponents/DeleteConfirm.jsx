import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

class DeleteConfirm extends React.Component {
    state = { visible: false, isSubmitting: false };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ isSubmitting: true });

        this.props.delete(this.props.list).then((res) => {
            if (res) {
                this.setState({ isSubmitting: false, visible: false });
                this.props.getList();
                message.success('Success');
            } else {
                this.setState({ isSubmitting: false, visible: false });
            }
        })
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { isSubmitting, visible } = this.state;
        
        const { langs, lang } = this.props;
        const content = langs[lang];

        return (
            <React.Fragment>
                <Button danger onClick={this.showModal}>
                    <DeleteOutlined />
                </Button>
                <Modal
                    title={content.delete_modal_heading}
                    centered
                    width={350}
                    visible={visible}
                    onOk={this.handleOk}
                    okType="danger"
                    okText={content.btn_delete}
                    cancelText={content.btn_cancel}
                    confirmLoading={isSubmitting}
                    onCancel={this.handleCancel}
                >
                    <Row align="middle" gutter={[8]}>
                        <Col>
                            <ExclamationCircleOutlined style={{ color: "orange", fontSize: "20px" }} />
                        </Col>
                        <Col>
                            {content.delete_confirm_content}
                        </Col>
                    </Row>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(DeleteConfirm);