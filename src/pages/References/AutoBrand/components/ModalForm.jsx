import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Form, Input, Select, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import { createCarBrand, updateCarBrand } from "../../../../server/config";
import { host, port } from "../../../../server/host";

import FileUpload from '../../../../commonComponents/FileUpload';

import "../../../pages.scss";

const { Option } = Select;

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            isSubmitting: false,
            params: {
                label: null,
                file_path: null,
                status: {
                    id: null
                }
            }
        }
    }

    onFinish = () => {
        this.setState({ isSubmitting: true }, () => {
            if (this.props.edit) {
                updateCarBrand(this.state.params).then((res) => {
                    if (res) {
                        this.setState({ isSubmitting: false, visible: false });
                        this.props.getList();
                        message.success('Success');
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                })
            } else {
                createCarBrand(this.state.params).then((res) => {
                    if (res) {
                        this.setState({ isSubmitting: false, visible: false });
                        this.props.getList();
                        message.success('Success');
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                })
            }
        });
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    }

    handleFileChange = (name, path) => {
        if (name && this.state.params[name] !== path) {
            this.setState({
                params: {
                    ...this.state.params,
                    [name]: path,
                }
            })
        }
    }

    handleSelectChange = (name, value) => {
        if (name) {
            this.setState({
                params: {
                    ...this.state.params,
                    [name]: {
                        id: value
                    },
                }
            })
        }
    }

    showModal = () => {
        const { edit, statuses } = this.props;
        const { params } = this.state;

        if (this.props.edit) {
            const obj = this.props.getObj();
            this.setState({
                visible: true,
                params: { ...obj },
            });
        } else {
            const statusId = edit ? params.status['id'] : statuses.length ? statuses[0]['id'] : null;
            this.setState({
                visible: true,
                params: {
                    ...params,
                    status: {
                        id: statusId,
                    }
                }
            });
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    render() {
        const {
            edit,
            statuses,
        } = this.props;

        const {
            isSubmitting,
        } = this.state;

        const {
            label,
            status,
            file_path,
        } = this.state.params;

        const status_id = status['id'];

        const { langs, lang } = this.props;
        const content = langs[lang];

        const fileList = file_path ? [{
            uid: 1,
            url: `${host}:${port}${file_path}`
        }] : [];

        return (
            <React.Fragment>
                {
                    edit ? (
                        <Button onClick={this.showModal} title={content.btn_edit}>
                            <EditOutlined />
                        </Button>
                    ) : (
                            <Button type="primary" onClick={this.showModal} title={content.btn_add}>
                                <PlusOutlined />
                            </Button>
                        )
                }
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={edit ? content.edit_modal_heading : content.add_modal_heading}
                    visible={this.state.visible}
                    footer={false}
                    width={350}
                    className="car-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        initialValues={{
                            label,
                            status_id,
                            file_path,
                        }}
                    >
                        <Form.Item
                            label={content.label}
                            name="label"
                            rules={[
                                {
                                    required: true,
                                    message: 'Label required!',
                                },
                            ]}
                        >
                            <Input placeholder={content.label} name="label" onChange={this.handleInputChange} />
                        </Form.Item>


                        <Form.Item
                            name="upload"
                            label={content.upload_img}
                        >
                            <FileUpload
                                handleChange={this.handleFileChange}
                                name="file_path"
                                content={content}
                                fileList={fileList}
                            />
                        </Form.Item>

                        <Form.Item
                            label={content.status}
                            name="status_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Status required!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={content.status}
                                onChange={(value) => this.handleSelectChange('status', value)}
                            >
                                {
                                    statuses.map((status) => (
                                        <Option value={status.id} key={status.id}>
                                            {status[`label_${lang}`]}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        <Row className="form-footer" justify="end" gutter={[8]}>
                            <Col>
                                <Form.Item>
                                    <Button onClick={this.handleCancel} disabled={isSubmitting}>
                                        {content.btn_cancel}
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                        {content.btn_submit}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statuses: state.status_ref,
        lang: state.lang,
        langs: state.langs,
    }
}

export default connect(mapStateToProps)(ModalForm);