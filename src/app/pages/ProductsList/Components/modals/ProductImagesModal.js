import React from 'react';
import styled from 'styled-components';
import { PicturesWall } from 'app/components/Uploads';
import { Modal } from 'app/components';

export default function ProductImagesModal({
  layout,
  store_product_images = [],
  setVariations,
  toggleImagesModal,
  setValue,
  variations,
  detailVariations,
  ...res
}) {
  const handlePickImage = thumb => () => {
    const newVariations = variations.slice(0);
    for (const iterator of detailVariations) {
      newVariations[iterator] = {
        ...newVariations[iterator],
        store_product_image_id: thumb.id,
        thumb,
      };
    }

    setVariations(newVariations);
    toggleImagesModal();
  };

  const handleAddImage = listImage => {
    setValue({ store_product_images: listImage });
  };

  return (
    <div>
      <Modal
        {...res}
        title={`Chọn ảnh đại diện cho biến thể ${
          variations[detailVariations]?.option_1 || ''
        } ${variations[detailVariations]?.option_2 || ''}`}
        width={600}
        footer={null}
        callBackCancel={toggleImagesModal}
      >
        <PicturesWall
          maxImages={8}
          data={store_product_images}
          onChange={handleAddImage}
          url="product-service/product/upload-product-image"
          showUploadList={{ showRemoveIcon: false, showPreviewIcon: false }}
          itemRender={(originNode, file) => (
            <WrapperImage onClick={handlePickImage(file)}>
              {originNode}
            </WrapperImage>
          )}
        />
      </Modal>
    </div>
  );
}

const WrapperImage = styled.div`
  cursor: pointer;
`;
