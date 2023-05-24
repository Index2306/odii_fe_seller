import React from 'react';
import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux';
import * as Store from '../styles';
import Item from './Item';
import DisconnectModal from './DisconnectModal';
import { selectStores } from '../slice/selectors';
import { useStoresSlice } from '../slice';

export default function StoreListing(props) {
  const stores = useSelector(selectStores);
  const [isShowCategories, setIsShowCategories] = React.useState(false);
  const [dataModal, setDataModal] = React.useState({});
  const { actions } = useStoresSlice();
  const dispatch = useDispatch();

  const cancel = () => {
    setIsShowCategories(false);
    setDataModal({});
  };

  const handleAction = data => {
    setDataModal(data);
    setIsShowCategories(true);
  };

  const callBackOk = () => {
    dispatch(actions.updateTypeConnect(dataModal));
    cancel();
  };

  return (
    <Store.List>
      {stores.map(store => (
        <Item
          store={store}
          key={store.id}
          handleAction={handleAction}
          setUrlIframe={props.setUrlIframe}
        />
      ))}
      {isShowCategories && (
        <DisconnectModal
          className="modal-1"
          isModalVisible={isShowCategories}
          callBackCancel={cancel}
          callBackOk={callBackOk}
          dataModal={dataModal}
        />
      )}
    </Store.List>
  );
}
