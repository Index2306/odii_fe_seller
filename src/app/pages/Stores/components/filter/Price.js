import React from 'react';
import { Input } from 'app/components';
import styled from 'styled-components/macro';

export default function PriceFilter(props) {
  const [price, setPrice] = React.useState({});

  const handleChangeFrom = e => {
    const newPrice = {
      ...price,
      from_price: e.target.value.trim(),
    };
    setPrice(newPrice);
    props.onChangePrice(newPrice);
  };

  const handleChangeTo = e => {
    const newPrice = {
      ...price,
      to_price: e.target.value.trim(),
    };
    setPrice(newPrice);
    props.onChangePrice(newPrice);
  };

  return (
    <Price>
      <Input placeholder="Từ..." onChange={handleChangeFrom} />
      <Input placeholder="Đến..." onChange={handleChangeTo} />
    </Price>
  );
}

const Price = styled.div`
  display: flex;
  input:first-child {
    margin-right: ${({ theme }) => theme.space.s4 * 1.5}px;
  }
`;
