import React, { memo } from 'react';

import { Button } from 'app/components';

import styled from 'styled-components/macro';

export default memo(function PrimaryButton({
  productId,
  images,
  emitAction,
  disableExport,
  setLoading,
  disableDelete,
  ...props
}) {
  return (
    <ButtonActionWrapper {...props}>
      <Button
        context="secondary"
        color="orange"
        disabled={disableDelete}
        className="btn-reset btn-sm br-6"
        width={32}
        onClick={() => {
          emitAction({ type: 'REMOVE_BACKGROUND' });
        }}
      >
        <i className="fa fa-trash-alt"></i>
      </Button>
      <Button
        context="secondary"
        color="blue"
        disabled={disableExport}
        className="btn-reset btn-sm br-6"
        width={82}
        onClick={() => {
          emitAction({ type: 'RESET_ALL' });
        }}
      >
        Reset
      </Button>
      <Button
        disabled={disableExport}
        color="blue"
        className="btn-save btn-sm br-6"
        width={82}
        onClick={() => {
          emitAction({
            type: 'SAVE_PRODUCT_IMAGES',
          });
        }}
      >
        Lưu ảnh
      </Button>
    </ButtonActionWrapper>
  );
});

export const ButtonActionWrapper = styled.div`
  padding: 12px 0 11px 0;
  .br-6 {
    border-radius: 6px;
  }
  display: inline-flex;
  & > button {
    margin-right: 15px;
  }
  .btn-save {
    margin-right: 21px;
  }
`;
