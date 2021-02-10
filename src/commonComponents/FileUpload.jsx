import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
// import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';

import { host, port, token } from '../server/host';

const headers = {
    "Authorization": `Bearer ${token}`,
    // "Content-Type": `multipart/form-data`,
}

const FileUpload = (props) => {
    const { fileList, name, content, multiple } = props;
    const fileListOfParent = fileList ? fileList : [];

    const [uploadedList, setFileList] = useState(fileListOfParent);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList && newFileList.length) {
            if (props.multiple) {

            } else {
                const response = newFileList[0]['response'];
                if (response) {
                    message.success(content.message_img_uploaded);
                    let path = response.payload[0]['path'];
                    props.handleChange(name, path);
                }
            }
        }
    };

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    }

    const onRemove = (file) => {
        props.handleChange(props.name, null);
    }

    return (
        <Upload
            name="file"
            action={`${host}:${port}/open/file/upload`}
            headers={headers}
            onChange={onChange}
            onPreview={onPreview}
            onRemove={onRemove}
            listType="picture"
            fileList={uploadedList}
        >
            {
                multiple ? (
                    uploadedList.length < 6 && (
                        <Button>
                            <UploadOutlined /> {props.content.upload_img_btn_label}
                        </Button>
                    )
                ) : (
                        uploadedList.length < 1 && (
                            <Button>
                                <UploadOutlined /> {props.content.upload_img_btn_label}
                            </Button>
                        )
                    )
            }
        </Upload>
        // <ImgCrop rotate aspect={1 / 1}>
        //     <Upload
        //         action={`${host}:${port}/file/upload`}
        //         listType="picture"
        //         headers={headers}
        //         fileList={fileList}
        //         onChange={onChange}
        //         onPreview={onPreview}
        //     >
        //         {fileList.length < 1 && (
        //             <Button>
        //                 <UploadOutlined />
        //                 {props.content.upload_img_btn_label}
        //             </Button>
        //         )}
        //     </Upload>
        // </ImgCrop>
    );
};

export default FileUpload;