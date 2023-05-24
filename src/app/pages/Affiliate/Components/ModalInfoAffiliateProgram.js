import React, { useState, useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useAffiliateSlice } from '../slice';
import { Modal, Checkbox } from 'antd';
import { Button } from 'app/components';
import { isEmpty } from 'lodash';
import { affiliateModal } from 'assets/images/icons';
import styled from 'styled-components';

export default memo(function ModalInfoAffiliateProgram({
  layout,
  dataAffiliateCode,
  isShowModalInfoAffiliateProgram,
  setIsShowModalInfoAffiliateProgram,
}) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const [isReadAndApprove, setIsReadAndApprove] = useState(false);

  useEffect(() => {
    if (!isEmpty(dataAffiliateCode)) {
      if (!dataAffiliateCode?.is_verified) {
        setIsShowModalInfoAffiliateProgram(true);
      } else {
        setIsShowModalInfoAffiliateProgram(false);
      }
    }
  }, [dataAffiliateCode]);

  const handleVerify = async () => {
    setIsShowModalInfoAffiliateProgram(false);
    await dispatch(actions.verifyAffiliate({}));
  };

  return (
    <CustomModal
      name="modal-info-affiliate-programs"
      visible={isShowModalInfoAffiliateProgram}
      footer={null}
      onCancel={() => setIsShowModalInfoAffiliateProgram(false)}
      destroyOnClose={true}
      width="680px"
      closable={false}
    >
      <div className="modal-header">
        <div className="img">
          <img src={affiliateModal} alt=""></img>
        </div>
        <div className="modal-title">
          Tiếp thị đối tác bán hàng - ngập tràn ưu đãi với chương trình
          Affiliate
        </div>
      </div>
      <div className="modal-content">
        <span className="title mb-14">Giới thiệu về Affiliate</span>
        <span>
          Affiliate - Tiếp thị liên kết đối tác bán hàng là chương trình giúp
          người bán của Việt Nam dễ dàng gia tăng doanh thu bằng cách chia sẻ
          link tiếp thị các sản phẩm và dịch vụ của trên mạng xã hội. Hay nói
          cách khác, bạn sẽ đóng vai trò trung gian, giới thiệu người bán hàng
          tiềm năng đến với và nhận ngay mức hoa hồng cực kỳ hấp dẫn từ chính và
          người bán hàng được tiếp thị khi có đơn hàng phát sinh trên hệ thống
          và thực hiện hoàn tất thanh toán đơn hàng.
        </span>
        <span className="title mt-14 mb-14">
          Affiliate mang lại những lợi ích gì ?
        </span>
        <span>
          - Không mất chi phí bắt đầu <br />
          - Tạo ra nguồn kiếm tiền tốt hoàn toàn thụ động <br />
          - Linh động về thời gian và địa điểm làm việc <br />- Với mỗi đơn hàng
          mà người tiếp thị giới thiệu thành công. Bên bán sẽ trả cho người tiếp
          thị một mức phần trăm của giá trị đơn hàng. (Hoặc có thể thay đổi theo
          chính sách )
        </span>
        <span className="title mt-14 mb-14 star">Chính sách và Điều khoản</span>
        <span>Đang xây dựng chính sách và điều khoản</span>
      </div>
      <div className="modal-footer">
        {!dataAffiliateCode?.is_verified ? (
          <>
            <Checkbox onChange={() => setIsReadAndApprove(!isReadAndApprove)}>
              Tôi đã đọc và đồng ý với điều khoản & chính sách{' '}
            </Checkbox>
            <Button
              className="btn-sm"
              color="blue"
              onClick={handleVerify}
              disabled={!isReadAndApprove}
            >
              Xác nhận
            </Button>
          </>
        ) : (
          <div className="row-action">
            <Button
              className="btn-sm"
              color="blue"
              onClick={() => setIsShowModalInfoAffiliateProgram(false)}
            >
              Đã hiểu
            </Button>
          </div>
        )}
      </div>
    </CustomModal>
  );
});

const CustomModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 6px;
  }
  .modal-header {
    margin: -24px;
    padding: 24px;
    display: flex;
    background: #f7f7f9;
    border-radius: 6px 6px 0px 0px;
    .img {
      margin-right: 12px;
    }
    .modal-title {
      align-self: center;
      font-weight: 500;
      font-size: 24px;
      line-height: 30px;
      color: #333333;
    }
  }
  .mb-14 {
    margin-bottom: 14px;
  }
  .mt-14 {
    margin-top: 14px;
  }
  .modal-content {
    margin-top: 52px;
    max-height: 440px;
    overflow: auto;
    .title {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      display: flex;
      align-items: center;
      color: #333333;
    }
    /* .star {
      &::after{

      }
    } */
  }
  .modal-footer {
    margin: 24px -24px -24px;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    background: #f7f7f9;
    border-radius: 0px 0px 6px 6px;
    .row-action {
      width: 100%;
      display: flex;
      justify-content: end;
    }
  }
`;
