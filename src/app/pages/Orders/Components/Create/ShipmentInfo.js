import React, { useState, useEffect, memo } from 'react';
import { Row, Col, Collapse } from 'antd';

import request from 'utils/request';
import { isEmpty } from 'lodash';

import { ShipmentInfoWrapper } from '../../styles/OrderDetail';
import { logoGHN, logoGHTK } from 'assets/images/platform';
import { Radio } from 'app/components';
import { formatMoney } from 'utils/helpers';
import moment from 'moment';

const { Panel } = Collapse;

const DEFAULT_TRANSPORT_OPTION = '0_0';

export default function StoreInfo({
  dataShipment,
  setShipmentService,
  setShippingFee,
  setInsuranceFee,
  setOnlyShipFee,
}) {
  const [shipments, setShipments] = useState([]);
  const [currentOption, setCurrentOption] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    const response = await request(
      `product-service/seller/get-shipments?only_platform=true`,
      {
        method: 'get',
      },
    );
    if (response.is_success) {
      setShipments(
        response.data.map(item => {
          if (item.status) {
            return item.platform;
          }
        }),
      );
    }
  };

  const transport = React.useMemo(
    () => [
      {
        id: 'GHTK',
        name: 'Giao hàng tiết kiệm',
        icon: logoGHTK,
        options: dataShipment?.data_ghtk.success
          ? [
              {
                short_name: 'Chuyển phát mặc định',
                total: dataShipment?.data_ghtk?.fee?.fee,
                insurance_fee: dataShipment?.data_ghtk?.fee?.insurance_fee,
                service_fee: dataShipment?.data_ghtk?.fee?.ship_fee_only,
              },
            ]
          : [],
        color: '#069255',
      },
      {
        id: 'GHN',
        name: 'Giao hàng nhanh',
        icon: logoGHN,
        options: dataShipment?.data_ghn?.fee,
        message: dataShipment?.data_ghn?.messageError,
        color: '#f26522',
      },
    ],
    [dataShipment],
  );

  useEffect(() => {
    if (dataShipment) {
      let index;
      if (currentOption) {
        index = currentOption.split('_');
      } else {
        index = DEFAULT_TRANSPORT_OPTION.split('_');
      }
      const value = transport[index[0]].options[index[1]];
      setShipmentService(value?.service_id);
      setShippingFee(value?.total);
      setInsuranceFee(value?.insurance_fee);
      setOnlyShipFee(value?.service_fee);
    }
  }, [dataShipment]);

  const handleOnChange = e => {
    setCurrentOption(e.target.value);
    const index = e.target.value.split('_');
    const value = transport[index[0]].options[index[1]];
    setShipmentService(value?.service_id);
    setShippingFee(value?.total);
    setInsuranceFee(value?.insurance_fee);
    setOnlyShipFee(value?.service_fee);
  };

  return (
    <ShipmentInfoWrapper className="box-df">
      <div className="shipment-info__top create">
        <div className="mt-4">
          <span className="section-title lh-1">Phương thức giao vận</span>
        </div>
        <div className="shipment-platform-wrapper">
          <Radio.Group
            onChange={handleOnChange}
            defaultValue={DEFAULT_TRANSPORT_OPTION}
          >
            <Collapse activeKey={dataShipment ? shipments : null}>
              {transport
                .filter(item => shipments.includes(item.id))
                .map((platform, ind) => (
                  <Panel
                    header={
                      <>
                        <div className="d-flex align-items-center">
                          <img src={platform.icon} />
                          <div className="text">{platform.name}</div>
                        </div>
                        <div className="text-warning">{platform.message}</div>
                      </>
                    }
                    key={platform.id}
                    showArrow={false}
                    forceRender={true}
                  >
                    {platform.options?.map((i, index) => (
                      <Radio value={[ind, index].join('_')}>
                        <div className="content">
                          <div className="text-radio">{i.short_name}</div>
                          <div className="text-money">
                            {formatMoney(i.total)}
                          </div>
                          {i.leadtime && (
                            <div className="text-radio">
                              Ngày giao dự kiến:{' '}
                              {moment
                                .unix(i.leadtime)
                                .format('DD-MM-YYYY HH:mm:ss')}
                            </div>
                          )}
                        </div>
                      </Radio>
                    ))}
                  </Panel>
                ))}
            </Collapse>
          </Radio.Group>
        </div>
      </div>
    </ShipmentInfoWrapper>
  );
}
