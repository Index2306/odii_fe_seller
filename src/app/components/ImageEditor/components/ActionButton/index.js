import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components/macro';

import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default memo(function ActionButton({
  setLoading,
  disableExport,
  productId,
  images,
  emitAction,
  disableDelete,
  disableReset,
  currToolAction,
  imagesLength,
  isApplyAll,
  setIsApplyAll,
  isApplyToNew,
  setIsApplyToNew,
  selectedImage,
  disableApply,
  ...props
}) {
  return (
    <ActionButtonWrapper {...props}>
      <SecondaryButton
        emitAction={emitAction}
        setLoading={setLoading}
        currToolAction={currToolAction}
        images={images}
        isApplyAll={isApplyAll}
        setIsApplyAll={setIsApplyAll}
        isApplyToNew={isApplyToNew}
        setIsApplyToNew={setIsApplyToNew}
        selectedImage={selectedImage}
        disableApply={disableApply}
        disableDelete={disableDelete}
        disableReset={disableReset}
      ></SecondaryButton>
      <PrimaryButton
        disableExport={disableExport}
        disableDelete={disableDelete}
        productId={productId}
        images={images}
        emitAction={emitAction}
        setLoading={setLoading}
      ></PrimaryButton>
    </ActionButtonWrapper>
  );
});

export const ActionButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #ebebf0;
`;
