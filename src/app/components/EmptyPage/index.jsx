import * as React from 'react';
import { useLocation } from 'react-router';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components/macro';
import { orders, productsSelected, transaction } from 'assets/images/empty';

export default function NotFoundPage({ children }) {
  const { pathname } = useLocation();

  const { src, title, description, type, width } = React.useMemo(() => {
    let data = {};
    switch (true) {
      case pathname.includes('selected-products'):
        data = {
          src: productsSelected,
          title: 'Không tìm thấy sản phẩm',
          description:
            'Tìm kiếm sản phẩm từ hàng triệu nhà cung cấp uy tín trên toàn thế giới. <br /> Bắt đầu việc kinh doanh của bạn ngay hôm nay.',
        };
        break;
      case pathname.includes('selling-products'):
        data = {
          src: productsSelected,
          title: 'Không tìm thấy sản phẩm đang bán',
          description:
            'Tìm kiếm sản phẩm từ hàng triệu nhà cung cấp uy tín trên toàn thế giới. <br /> Bắt đầu việc kinh doanh của bạn ngay hôm nay.',
        };
        break;
      case pathname.includes('stores/detail'):
        data = {
          type: 'style-2',
          src: orders,
          width: 400,
          title: 'Chưa có sản phẩm',
          description:
            'Thực hiện đồng bộ để lấy sản phẩm từ Shopee về hệ thống.',
        };
        break;
      case pathname.includes('stores'):
        data = {
          src: productsSelected,
          title: 'Chưa có cửa hàng nào được kết nối',
          description:
            'Bạn đang kinh doanh bán hàng trên nền tảng nào? Vui lòng chọn và kết nối với cửa hàng kinh doanh của bạn.',
        };
        break;
      case pathname.includes('orders/create'):
        data = {
          type: 'style-1',
          src: orders,
          title: 'Chưa có sản phẩm trong đơn',
          description: 'Vui lòng thêm sản phẩm để tạo đơn hàng',
        };
        break;
      case pathname.includes('orders/update'):
        data = {
          type: 'style-1',
          src: orders,
          width: 350,
          title: 'Không tìm thấy đơn hàng',
          description: 'Rất tiếc, đơn hàng không tồn tại trong hệ thống.',
        };
        break;
      case pathname.includes('orders'):
        data = {
          // type: 'style-1',
          src: orders,
          width: 350,
          title: 'Chưa có đơn hàng',
          description: 'Rất tiếc, bạn chưa có đơn hàng nào được tạo.',
        };
        break;
      case pathname.includes('mywallet/withdrawal'):
        data = {
          type: 'style-1',
          src: transaction,
          width: 350,
          title: 'Chưa có tài khoản nhận tiền',
          description:
            'Bạn chưa có bất kỳ thông tin tài khoản ngân hàng nào. Xin vui lòng thêm tài khoản để rút tiền',
        };
        break;
      case pathname.includes('mywallet'):
        data = {
          type: 'style-1',
          src: transaction,
          width: 350,
          title: 'Lịch sử giao dịch',
          description: 'Bạn chưa thực hiện bất kỳ giao dịch nào',
        };
        break;
      case pathname.includes('affiliate'):
        data = {
          type: 'style-1',
          src: transaction,
          width: 350,
          title: 'Tổng quan tiếp thị',
          description:
            'Bạn chưa tiếp thị thành công Seller bán hàng nào. Hãy cố gắng !',
        };
        break;

      default:
        break;
    }
    return data;
  }, [pathname]);

  return (
    <Wrapper className={type || ''}>
      {/* <Row justify="center" align="middle">
        <Col xs={24} lg={col || 12}> */}
      <CustomStyle width="100%" maxWidth={width || 550} px={{ xs: 's4' }}>
        <img src={src} alt="emptyBg" className="img" />
        <div className="title">{title}</div>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
        {children}
      </CustomStyle>
      {/* </Col>
      </Row> */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100vh - 120px);
  .img {
    max-width: 100%;
    margin-bottom: ${({ theme }) => theme.space.s8}px;
  }
  .title {
    font-size: 28px;
    margin-bottom: ${({ theme }) => theme.space.s4}px;
    font-weight: 700;
  }
  .description {
    font-size: ${({ theme }) => theme.fontSizes.f3}px;
    margin-bottom: ${({ theme }) => theme.space.s5}px;
    color: ${({ theme }) => theme.gray3};
  }
  &.style-1 {
    height: auto;
    background: #fff;
    .img {
      margin-bottom: ${({ theme }) => theme.space.s3}px;
    }
    .title {
      color: ${({ theme }) => theme.primary};
      font-size: 22px;
      margin-bottom: ${({ theme }) => theme.space.s3}px;
    }
    .description {
      font-size: ${({ theme }) => theme.fontSizes.f2}px;
      margin-bottom: ${({ theme }) => theme.space.s4}px;
      color: ${({ theme }) => theme.gray2};
    }
  }
  &.style-2 {
    .title {
      font-weight: 700;
      font-size: 22px;
      line-height: 26px;
      color: #333333;
    }
    .description {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #4f4f4f;
      max-width: 400px;
    }
  }
`;
