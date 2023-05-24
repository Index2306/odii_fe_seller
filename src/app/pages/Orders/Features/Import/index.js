import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Row, Col } from 'antd';
import styled from 'styled-components/macro';
import { uploadImage } from 'utils/request';
import { SectionWrapper } from 'styles/commons';

import { Upload, message, Skeleton } from 'antd';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { globalActions } from 'app/pages/AppPrivate/slice';
import { themes } from 'styles/theme/themes';
import { useDispatch } from 'react-redux';
import { PageWrapper } from 'app/components';
import { orderSample } from 'assets/document';

const loadingIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;
const IMPORT_STATUS_WAITING = 'IMPORT_STATUS_WAITING';
const IMPORT_STATUS_SUCCESS = 'IMPORT_STATUS_SUCCESS';
const IMPORT_STATUS_ERROR = 'IMPORT_STATUS_ERROR';
const IMPORT_STATUS_BEGIN = IMPORT_STATUS_WAITING;

export function ImportOrder({ match, history }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [importStatus, setImportStatus] = useState(IMPORT_STATUS_BEGIN);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Đơn hàng',
          link: '/orders',
        },
        {
          name: 'Import đơn hàng',
        },
      ],
      title: 'Import đơn hàng',
      fixWidth: true,
    };

    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  function resetImport() {
    setFileName(null);
    setImportStatus(IMPORT_STATUS_BEGIN);
  }

  function beforeUpload(file) {
    // console.log('----- type', file.type);
    // const fileExtValids = ['application/vnd.ms-excel'];
    const maxSizeInMb = 15;

    // if (!fileExtValids.includes(file.type)) {
    //     message.error(
    //         `You can only upload [ ${fileExtValids.join(', ')} ] file!`,
    //     );
    //     return false;
    // }
    if (file.size / 1024 / 1024 > maxSizeInMb) {
      message.error(`Image must smaller than ${maxSizeInMb}MB!`);
      return false;
    }
    setFileName(file.name);

    return true;
  }

  const dummyRequest = ({ file, onSuccess }) => {
    uploadImage(file, 'oms/seller/order/import-excel')
      .then(result => {
        setImportStatus(IMPORT_STATUS_SUCCESS);
        onSuccess(result?.data);
      })
      .catch(err => {
        setImportStatus(IMPORT_STATUS_ERROR);
      });
  };

  const handleChangeFile = async (info, type) => {
    if (info.file.status === 'uploading') {
      //   isLoading = true;
      return;
    }
    if (info.file.status === 'error') {
    }
    if (info.file.status === 'done') {
      //TODO
    }
  };

  return (
    <PageWrapperDefault>
      <Row className="page-content" gutter={25}>
        <Col xs={12} md={12} lg={12}>
          <Upload
            customRequest={dummyRequest}
            beforeUpload={beforeUpload}
            showUploadList={false}
            onChange={file => handleChangeFile(file)}
            accept=".xls,.xlsx"
            className={fileName ? 'hidden' : 'upload-wrapper'}
          >
            <div className="upload-content">
              <i className="fa fa-upload upload-icon"></i>
              <div className="upload-description">
                <div className="description-lvl-1">Import Order File</div>
                <div className="description-lvl-2">
                  Kéo thả file định dạng .xls, .xlsx <br></br>hoặc click tại đây
                  để upload
                </div>
              </div>
            </div>
          </Upload>
          {fileName && (
            <div className="upload-process">
              <div className="process__file-name">{fileName}</div>
              <div className="process__status">
                {importStatus === IMPORT_STATUS_WAITING && (
                  <>
                    <Spin indicator={loadingIcon}></Spin>
                    <span className="loading-title">
                      Đang xử lý, xin chờ ...
                    </span>
                  </>
                )}
                {importStatus === IMPORT_STATUS_SUCCESS && (
                  <>
                    <span className="loading-title process-success">
                      <i className="fa fa-check-circle"></i>&nbsp;Import thành
                      công,&nbsp;
                    </span>
                    <span className="import-retry" onClick={resetImport}>
                      Bắt đầu lại
                    </span>
                  </>
                )}
                {importStatus === IMPORT_STATUS_ERROR && (
                  <>
                    <span className="loading-title process-error">
                      <i className="fa fa-times-circle"></i>&nbsp;Import thất
                      bại,&nbsp;
                    </span>
                    <span className="import-retry" onClick={resetImport}>
                      Thử lại
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </Col>
        <Col xs={12} md={12} lg={12}>
          <div className="sample-file-wrapper">
            <div className="sample-file-title">Hướng dẫn</div>
            <div className="sample-file-link">
              <div className="sample-file-link__title">
                Vui lòng download file mẫu dưới đây để biết thêm thông tin
              </div>
              <div className="sample-file-link__content">
                <i className="fa fa-download download-sample-icon"></i>
                <a href={orderSample}>Order Import Sample.xlsx</a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapperDefault>
  );
}

export const PageWrapperDefault = styled(PageWrapper)`
  max-width: 1000px;
  width: calc(100% - 3rem);
  .hidden {
    display: none;
  }
  .page-content {
    background: #fff;
    padding: 30px;
  }
  .page-detail-title {
    margin-bottom: 16px;
    font-weight: bold;
  }
  .page-action {
    display: flex;
    justify-content: end;
  }
  .upload-wrapper {
    & > .ant-upload.ant-upload-select {
      width: 100%;
    }
    width: 100%;
    .upload-icon {
      color: #66b0ff;
      font-size: 21px;
    }
    .upload-content {
      text-align: center;
      padding: 18px 20px;
      border: 2px dashed #b3daff;
      border-radius: 4px;
      cursor: pointer;
      transition: border-color 0.3s;
      &:hover {
        border-color: #0093ff;
      }
      .description-lvl-1 {
        font-weight: 600;
        margin-top: 5px;
      }
      .description-lvl-2 {
        color: rgba(0, 0, 0, 0.45);
        margin-top: 3px;
        font-size: 0.95rem;
        line-height: 1.4;
      }
    }
  }
  .sample-file-wrapper {
    background: #f9f9f9;
    padding: 30px 31px;
    .sample-file-title {
      font-weight: 600;
    }
    .sample-file-link {
      color: rgba(0, 0, 0, 0.45);
      margin-top: 7px;
      & > a {
        text-decoration: underline;
      }
    }
    .download-sample-icon {
      margin-right: 7px;
      font-size: 13px;
      color: #1890ff;
    }
    .sample-file-link__content {
      margin-top: 2px;
    }
  }
  .upload-process {
    text-align: center;
    min-height: 132px;
    padding: 18px 20px;
    border: 2px dashed #b3daff;
    border-radius: 4px;
    .process__file-name {
      font-weight: 600;
      margin-top: 20px;
    }
    .process__status {
      margin-top: 10px;
    }
    .loading-title {
      margin-left: 15px;
    }
    .process-success {
      color: green;
    }
    .process-error {
      color: red;
    }
    .import-retry {
      color: #1890ff;
      cursor: pointer;
    }
  }
`;
