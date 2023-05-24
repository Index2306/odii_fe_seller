import React from 'react';
import { Input } from 'app/components';
import styled from 'styled-components/macro';

export default function PriceFilter(props) {
  const [price, setPrice] = React.useState({});

  React.useEffect(() => {
    if (!props.valueFrom && !props.valueTo) {
      setPrice({});
    }
  }, [props]);

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
      <Input
        placeholder="Từ..."
        onChange={handleChangeFrom}
        value={props.valueFrom}
      />
      <Input
        placeholder="Đến..."
        onChange={handleChangeTo}
        value={props.valueTo}
      />
    </Price>
  );
}

const Price = styled.div`
  display: flex;
  input:first-child {
    margin-right: ${({ theme }) => theme.space.s4 * 1.5}px;
  }
`;
