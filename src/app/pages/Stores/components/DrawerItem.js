import React from 'react';
import { DrawerItem as Item } from '../styles/Main';

export default function DrawerItem(props) {
  const [visible, setVisible] = React.useState(true);
  const handleShowBody = () => {
    setVisible(!visible);
  };
  return (
    <Item>
      <div className="drawer-item-title" onClick={handleShowBody}>
        <span>{props.title}</span>

        <i
          className={`far ${!visible ? 'fa-chevron-down' : 'fa-chevron-up'}`}
        />
      </div>

      {!visible ? null : (
        <div className="drawer-item-body">{props.children}</div>
      )}
    </Item>
  );
}
