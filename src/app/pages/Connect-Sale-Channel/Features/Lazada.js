import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import request from 'utils/request';
import notification from 'utils/notification';

export default function Lazada() {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lazadaCode = searchParams.get('code');
  const tenant_id = localStorage.getItem('tenant_id');

  React.useEffect(() => {
    connectStore();
  }, [lazadaCode]);

  const connectStore = async () => {
    const response = await request(
      `sales-channels-service/lazada/auth/grant?auth_code=${lazadaCode}?tenant_id=${tenant_id}`,
    )
      .then(response => response)
      .catch(error => error);

    if (response.is_success) {
      notification('success', 'Kết nối cửa hàng thành công', 'Thành công!', 7);
    } else if (
      response?.data?.error_code === 'already_connected_with_other_partner'
    ) {
      notification(
        'error',
        'Cửa hàng đã kết nối với 1 tài khoản khác. Nếu bạn là chủ của cửa hàng đó, vui lòng ngắt kết nối và kết nối lại!',
        'Thành công!',
        7,
      );
    } else {
      notification(
        'error',
        response?.data?.error_code,
        'Kết nối cửa hàng không thành công!',
        7,
      );
    }
    history.push('/stores');
  };

  return null;
}
