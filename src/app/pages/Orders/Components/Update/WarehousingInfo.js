import React from 'react';
import { WarehousingInfoWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';

import { Image } from 'app/components';

export default function WarehousingInfo({ order }) {
  const isLoading = isEmpty(order);

  const getWarehousingAddress = order => {
    const address = order?.from_location;
    let addressParts = [
      address?.ward_name,
      address?.district_name,
      address?.province,
      address?.country,
    ];
    addressParts = addressParts.filter(address => address);
    return addressParts.join(', ');
  };

  const isNotEmptyInfo = order?.supplier_warehousing?.id;

  return (
    !isLoading && (
      <WarehousingInfoWrapper className="box-df">
        <div className="warehousing-info__top">
          <div>
            <span className="section-title">Nhà cung cấp</span>
          </div>
        </div>
        <div className="warehousing-info__content">
          {isNotEmptyInfo ? (
            <>
              <Image
                alt=""
                src={order?.supplier_warehousing?.thumb?.location}
                height="20px"
                width="20px"
                className="warehousing-icon"
              />

              <span className="warehousing-name">
                {order?.supplier_warehousing?.name}
              </span>
            </>
          ) : (
            <span className="value-empty">Không</span>
          )}
        </div>
        {isNotEmptyInfo && (
          <div className="warehousing-info__bottom">
            <div className="bottom-content__item">
              <div>Địa chỉ</div>
              <div>{getWarehousingAddress(order)}</div>
            </div>
          </div>
        )}
      </WarehousingInfoWrapper>
    )
  );
}
