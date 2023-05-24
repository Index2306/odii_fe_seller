import React from 'react';
import CustomModal from 'app/components/Modal';
import Styled from 'styled-components';
import { A, Image } from 'app/components';
import { CustomStyle } from 'styles/commons';

export default function CategoriesModal({ ...res }) {
  const { dataModal } = res;
  let platformText = '',
    linkHref = '',
    pageSupportText = '',
    actionDeniedText = '',
    linkedText = '',
    menuImgLink = '',
    listAppImgLink = '',
    disconnectImgLink = '';

  switch (dataModal.platform) {
    case 'shopee':
      platformText = 'Shopee';
      linkHref = 'https://banhang.shopee.vn/portal/partner-platform/shop';
      pageSupportText =
        'Đến mục “Thiết lập Shop/Nền tảng đối tác (Kết nối API)';
      actionDeniedText = 'Bỏ liên kết';
      linkedText = 'danh sách ứng dụng liên kết với Shopee';
      menuImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/shopee-menu.png';
      listAppImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/shopee-list-app.png';
      disconnectImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/shopee-disconnect.png';
      break;
    case 'lazada':
      platformText = 'Lazada';
      linkHref = 'https://sellercenter.lazada.vn/iop/auth/index';
      pageSupportText = 'Đến mục “Hỗ trợ/Ứng dụng bên thứ ba';
      actionDeniedText = 'Hủy bỏ quyền';
      linkedText = 'danh sách ứng dụng liên kết với Lazada';
      menuImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/lazada-menu.png';
      listAppImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/lazada-list-app.png';
      disconnectImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/lazada-disconnect.png';

      break;
    case 'tiktok':
      platformText = 'TikTok';
      linkHref = 'https://seller-vn.tiktok.com/open/partner-management';
      pageSupportText = 'Đến mục “Tài khoản của tôi/ Quản lý đối tác';
      actionDeniedText = 'Hủy ủy quyền';
      linkedText = 'danh sách đối tác được ủy quyền';
      menuImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/tiktok-menu.png';
      listAppImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/tiktok-list-app.png';
      disconnectImgLink =
        'https://s3.ap-southeast-1.amazonaws.com/odii.asia/tiktok-disconnect.png';
      break;
    default:
      break;
  }

  return (
    <CustomModal
      {...res}
      width={1000}
      title={`HƯỚNG DẪN NGẮT KẾT NỐI CỬA HÀNG TRÊN ${dataModal.platform.toUpperCase()}`}
      // disableOk={disableOk}
    >
      <Wrapper>
        <CustomStyle pb={{ xs: 's4' }}>
          <CustomStyle
            className="d-flex"
            pb={{ xs: 's2' }}
            fontWeight="medium"
            fontSize={{ xs: 'f3' }}
          >
            <CustomStyle
              mr={{ xs: 's3' }}
              style={{ textDecoration: 'underline' }}
            >
              Bước 1:
            </CustomStyle>
            <CustomStyle>
              {`Đăng nhập cửa hàng ${platformText} người bán`}
            </CustomStyle>
          </CustomStyle>
          <CustomStyle>
            <A target="_blank" href={linkHref}>
              {`Đến trang cửa hàng ${platformText} người bán`}
            </A>
          </CustomStyle>
        </CustomStyle>
        <CustomStyle pb={{ xs: 's4' }}>
          <CustomStyle
            className="d-flex"
            pb={{ xs: 's2' }}
            fontWeight="medium"
            fontSize={{ xs: 'f3' }}
          >
            <CustomStyle
              mr={{ xs: 's3' }}
              style={{ textDecoration: 'underline' }}
            >
              Bước 2:
            </CustomStyle>
            <CustomStyle>{pageSupportText}</CustomStyle>
          </CustomStyle>
          <CustomStyle>
            <Image src={menuImgLink}></Image>
          </CustomStyle>
          <CustomStyle pb={{ xs: 's2' }}>
            {`Tại đây sẽ thấy ${linkedText}`}
          </CustomStyle>
          <CustomStyle>
            <Image src={listAppImgLink}></Image>
          </CustomStyle>
        </CustomStyle>
        <CustomStyle pb={{ xs: 's4' }}>
          <CustomStyle
            className="d-flex"
            pb={{ xs: 's2' }}
            fontWeight="medium"
            fontSize={{ xs: 'f3' }}
          >
            <CustomStyle
              mr={{ xs: 's3' }}
              style={{ textDecoration: 'underline' }}
            >
              Bước 3:
            </CustomStyle>
            <CustomStyle>{actionDeniedText}</CustomStyle>
          </CustomStyle>
          <CustomStyle>
            <Image src={disconnectImgLink}></Image>
          </CustomStyle>
          <CustomStyle pb={{ xs: 's2' }}>
            Sau khi hoàn thành trên{' '}
            {dataModal.platform.charAt(0).toUpperCase() +
              dataModal.platform.slice(1)}{' '}
            thì ấn [Xác nhận] để hoàn thành ngắt kết nối
          </CustomStyle>
        </CustomStyle>
        {/* <Wrapper></Wrapper> */}
      </Wrapper>
    </CustomModal>
  );
}

const Wrapper = Styled.div`
border: 1px solid ${({ theme }) => theme.stroke};
background: ${({ theme }) => theme.whitePrimary};
border-radius: 4px;
padding: 12px;
/* width: calc(230px * ${({ total }) => total}); */
overflow: scroll;
height: 410px;
`;
