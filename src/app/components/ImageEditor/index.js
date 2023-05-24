import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { isEmpty, debounce, throttle, cloneDeep } from 'lodash';
import { removeLayer } from 'assets/images/icons';

import { uploadImage } from 'utils/request';

import { transparent } from 'assets/images';

import { fabric } from 'fabric';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './fonts/index.css';

import FontFaceObserver from 'fontfaceobserver';

import styled from 'styled-components/macro';
import ListImage from './components/ListImage';
import ToolBar from './components/ToolBar';
import ActionButton from './components/ActionButton';
import { genImgUrl } from 'utils/helpers';
import request from 'utils/request';

const DESIGN_PREVIEW_DEFAULT_WIDTH = 520;
const DESIGN_PREVIEW_DEFAULT_HEIGHT = 520;
const SOURCE_DESIGN_TOOL_WIDTH = 500;
const SOURCE_DESIGN_TOOL_HEIGHT = 500;
const IMAGE_ADDED_SCALE_RATE = 0.25;
const LIST_IMAGE_ITEM_FULL_HEIHGT = 87;

export const FONT_SIZE_UNIT = 14;
export const CHAR_SPACING_UNIT = 100;
export const NONE_OPTION_VALUE = 'none';
export const NONE_FIELD_VALUE = null;
export const SHADOW_DEFAULT_VALUE_PART_BEFORE = '3px 6px 5px ';
export const TEXT_FIELD = 'text';
export const COLOR_FIELD = 'fill';
export const FONT_FAMILY_FIELD = 'fontFamily';
export const FONT_SIZE_FIELD = 'fontSize';
export const FONT_RATE = 'fontRate';
export const CHAR_SPACING_FIELD = 'charSpacing';
export const STROKE_FIELD = 'stroke';
export const SHADOW_FIELD = 'shadow';
export const LINE_HEIGHT_FIELD = 'lineHeight';
export const ANGLE_FIELD = 'angle';
export const ARC_FIELD = 'arc';

//config text editor

export const FONT_FAMILY_OPTIONS = [
  { text: 'Roboto', value: 'Roboto' },
  { text: 'Pacifico', value: 'Pacifico' },
  { text: 'Parisienne', value: 'Parisienne' },
  { text: 'Pattaya', value: 'Pattaya' },
  { text: 'Quantico', value: 'Quantico' },
  { text: 'Rye', value: 'Rye' },
];

export const COLOR_OPTIONS = [
  { text: '#000000', value: '#000000' },
  { text: '#ffffff', value: '#ffffff' },
  { text: '#e8e8e8', value: '#e8e8e8' },
  { text: '#bababa', value: '#bababa' },
  { text: '#989898', value: '#989898' },
  { text: '#696969', value: '#696969' },
  { text: '#606060', value: '#606060' },
  { text: '#3a3a3a', value: '#3a3a3a' },
  { text: '#d36371', value: '#d36371' },
  { text: '#f69d91', value: '#f69d91' },
  { text: '#c70f28', value: '#c70f28' },
  { text: '#ed1c24', value: '#ed1c24' },
  { text: '#b34436', value: '#b34436' },
  { text: '#f27981', value: '#f27981' },
  { text: '#ffb18a', value: '#ffb18a' },
  { text: '#f7c194', value: '#f7c194' },
  { text: '#f5873f', value: '#f5873f' },
  { text: '#f26522', value: '#f26522' },
  { text: '#bc5500', value: '#bc5500' },
  { text: '#603913', value: '#603913' },
  { text: '#bf854b', value: '#bf854b' },
  { text: '#d07f2b', value: '#d07f2b' },
  { text: '#dd9d26', value: '#dd9d26' },
  { text: '#fff2b3', value: '#fff2b3' },
  { text: '#ffe94d', value: '#ffe94d' },
  { text: '#ffc829', value: '#ffc829' },
  { text: '#e5e43b', value: '#e5e43b' },
  { text: '#d2b648', value: '#d2b648' },
  { text: '#e7ffd7', value: '#e7ffd7' },
  { text: '#a1c75b', value: '#a1c75b' },
  { text: '#74b87e', value: '#74b87e' },
  { text: '#789472', value: '#789472' },
  { text: '#393500', value: '#393500' },
  { text: '#253a21', value: '#253a21' },
  { text: '#bfd8c6', value: '#bfd8c6' },
  { text: '#74a952', value: '#74a952' },
  { text: '#006838', value: '#006838' },
  { text: '#31a28e', value: '#31a28e' },
  { text: '#a9c4ba', value: '#a9c4ba' },
  { text: '#70898d', value: '#70898d' },
  { text: '#4bb7bc', value: '#4bb7bc' },
  { text: '#008b97', value: '#008b97' },
  { text: '#00505a', value: '#00505a' },
  { text: '#a2e5f4', value: '#a2e5f4' },
  { text: '#43b3d4', value: '#43b3d4' },
  { text: '#3399b5', value: '#3399b5' },
  { text: '#006993', value: '#006993' },
  { text: '#6ea5d9', value: '#6ea5d9' },
  { text: '#0e3d84', value: '#0e3d84' },
  { text: '#4460a7', value: '#4460a7' },
  { text: '#0f1e3c', value: '#0f1e3c' },
  { text: '#8091be', value: '#8091be' },
  { text: '#7275b2', value: '#7275b2' },
  { text: '#46276b', value: '#46276b' },
  { text: '#8a6aa7', value: '#8a6aa7' },
  { text: '#b195c2', value: '#b195c2' },
  { text: '#b6a9b2', value: '#b6a9b2' },
  { text: '#e9bdd5', value: '#e9bdd5' },
  { text: '#d072a6', value: '#d072a6' },
  { text: '#cd368c', value: '#cd368c' },
  { text: '#c52d89', value: '#c52d89' },
  { text: '#84175e', value: '#84175e' },
  { text: '#b17d8c', value: '#b17d8c' },
  { text: '#512d32', value: '#512d32' },
  { text: '#ffcad0', value: '#ffcad0' },
  { text: '#cf4952', value: '#cf4952' },
  { text: '#c15860', value: '#c15860' },
  { text: '#7c1123', value: '#7c1123' },
];

export const DEFAULT_VALUES = {
  [TEXT_FIELD]: 'ODII',
  [FONT_FAMILY_FIELD]: FONT_FAMILY_OPTIONS[0].value,
  [COLOR_FIELD]: COLOR_OPTIONS[0].value,
  [FONT_SIZE_FIELD]: 3.5,
  // [FONT_RATE]: 2.1,
  [CHAR_SPACING_FIELD]: 0.01,
  [STROKE_FIELD]: NONE_OPTION_VALUE,
  [SHADOW_FIELD]: NONE_OPTION_VALUE,
  [LINE_HEIGHT_FIELD]: 1.1,
  [ANGLE_FIELD]: 0,
  [ARC_FIELD]: 0,
};

const PRODUCT_IMAGE_BASE_URL =
  'product-service/seller/edit-store-product-image';

// const CROP_MIN_SIZE = 100;

export const TOOL_ACTION_CROP_BACKGROUND = 'ACTION_CROP_BACKGROUND';
export const TOOL_ACTION_SET_FRAME_TEMPLATE = 'ACTION_SET_FRAME_TEMPLATE';
export const TOOL_ACTION_ADD_IMAGE = 'ACTION_ADD_IMAGE';
export const TOOL_ACTION_ADD_TEXT = 'ACTION_ADD_TEXT';

const LAYER_TYPE_FILE = 'File';
const LAYER_TYPE_TEXT = 'Text';
const LAYER_TYPE_CROP_BOX = 'CropBox';

const loadingIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

export default memo(function ImageEditor({ productId, images, onFinish }) {
  // console.log('Render design tool');
  const [fabricCanvas, setfabricCanvas] = useState(null);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [currToolAction, setCurrToolAction] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isExported, setExported] = useState(false);
  const [isModified, setModified] = useState(false);
  const [isApplyAll, setIsApplyAll] = useState(false);
  const [isApplyToNew, setIsApplyToNew] = useState(false);

  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageScrollbar, setImageScrollbar] = useState(null);
  const [originProductImages, setOriginProductImages] = useState([]);
  const [frameLayers, setFrameLayers] = useState([]);
  const [frameLayersClone, setFrameLayersClone] = useState([]);
  const [imgUploadLayers, setImgUploadLayers] = useState([]);
  const [plainTextLayers, setPlainTextLayers] = useState([]);
  const [selectedPlainText, setSelectedPlainText] = useState(null);

  const [currentCropBox, setCurrentCropBox] = useState(null);
  const [currentCropBoxClone, setCurrentCropBoxClone] = useState(null);

  // const [layers, setLayers] = useState([]);
  const canvasRef = useRef(null);
  const btnDeleteRef = useRef(null);

  //use effect
  useEffect(() => {
    const productImages = sortImages(cloneDeep(images));
    setProductImages(productImages);
    setOriginProductImages(images);
    setDefaultSeletedImg(productImages);
  }, [images]);

  useEffect(() => {
    loadFont();
  }, []);

  useEffect(() => {
    initCanvas();
    // setupBasicFont();
  }, []);

  useEffect(() => {
    setCanvasBackground();
  }, [selectedImage]);

  useEffect(() => {
    initCanvasEvents();
  }, [activeLayerId, fabricCanvas, selectedImage, plainTextLayers, selectedPlainText]);

  const loadFont = async () => {
    setLoading(true);
    const loadAll = [];
    FONT_FAMILY_OPTIONS.forEach(async fontOption => {
      const loadFont = await new Promise(resolve => {
        try {
          const font = new FontFaceObserver(fontOption.value, {});
          font.load().then(
            () => {
              console.log('load font ' + fontOption.value);
              resolve();
            },
            error => {
              try {
                console.log('error', fontOption.value);
                console.log(error);
              } catch {}
            },
          );
        } finally {
          resolve();
        }
        loadAll.push(loadFont);
      });
    });
    await Promise.all(loadAll);
    setLoading(false);
  };

  const saveProductImages = async () => {
    let exportResult;
    setLoading(true);
    if (isModified) {
      exportResult = await exportToImage();
    }
    try {
      for (let image of exportResult || productImages) {
        const { storeImageId, saveType, isThumb } = image;
        const isCreate = saveType === 'CREATE';
        const isUpdate = saveType === 'UPDATE';
        // image.oldId === undefined is not modified.
        if (isCreate || isUpdate) {
          const data = {
            store_product_id: productId,
            store_product_image_id: storeImageId,
            is_save_new: isCreate,
            is_thumb: isThumb,
            image,
          };
          delete image.storeImageId;
          delete image.saveType;
          await request(PRODUCT_IMAGE_BASE_URL, {
            method: 'post',
            data,
          });
        }
      }
      resetAll();
    } catch {}
    setLoading(false);
    onFinish();
  };

  const updateIsModified = () => {
    setModified(fabricCanvas._objects.length > 0);
  };

  const deletePlainText = textId => {
    const results = plainTextLayers.filter(text => text.id !== textId);
    fabricCanvas._objects.forEach(obj => {
      if (obj.id === textId) {
        fabricCanvas.remove(obj);
      }
    });
    setPlainTextLayers(results);
    if (textId === selectedPlainText?.id) {
      setSelectedPlainText(null);
    }
  };

  const onRemoved = e => {
    const deleteObj = e.target;
    if (deleteObj.layerType === LAYER_TYPE_TEXT) {
      deletePlainText(deleteObj.id);
    }
    updateIsModified();
  };

  const disableBtnDelete = useCallback(
    throttle(() => {
      btnDeleteRef.current.style.display = 'none';
    }, 250),
    [],
  );

  const updateLayers = () => {};

  const sortImages = images => {
    const thumb = images.splice(0, 1);
    return [...thumb, ...images.sort((a, b) => a.id - b.id)];
  };

  const onMovingObj = (e, isClouseInCanvas) => {
    disableBtnDelete();
    if (!isClouseInCanvas) {
      return;
    }
    var obj = e.target;
    const fabricCanvasHeight = obj.canvas.height;
    const fabricCanvasWidth = obj.canvas.width;

    const maxLeft = fabricCanvasWidth - obj.width * obj.scaleX;
    const maxTop = fabricCanvasHeight - obj.height * obj.scaleY;
    if (obj.top < 0) {
      obj.top = 0;
    } else if (obj.top > maxTop) {
      obj.top = maxTop;
    }

    if (obj.left < 0) {
      obj.left = 0;
    } else if (obj.left > maxLeft) {
      obj.left = maxLeft;
    }
  };

  const onRotated = e => {
    const currObj = e.target;
    updateLayers();
    updateBtnDeletePosition(e);
    if (currObj.layerType === LAYER_TYPE_TEXT) {
      const plainTextIndex = plainTextLayers.findIndex(
        text => text.id === currObj.id,
      );
      const newPlainText = updatePlainText(plainTextIndex, {
        angle: currObj.angle,
      });
      setSelectedPlainText(newPlainText);
    }
  };

  const updatePlainText = (index, newValues) => {
    if (index !== -1) {
      const plainTextsClone = [...plainTextLayers];
      const valueCombine = { ...plainTextsClone[index], ...newValues };
      plainTextsClone[index] = valueCombine;
      setPlainTextLayers(plainTextsClone);
      return valueCombine;
    }
  };

  const onScalingObj = (e, isClouseInCanvas) => {
    disableBtnDelete();
    if (!isClouseInCanvas) {
      return;
    }
    const corner = e.transform.corner;
    const fabricCanvasHeight = fabricCanvas.height;
    const fabricCanvasWidth = fabricCanvas.width;

    const obj = e.target;
    const objTop = obj.top;
    const objLeft = obj.left;
    const objWidth = obj.width;
    const objHeight = obj.height;
    const objScaleWidth = obj.width * obj.scaleX;
    const objScaleHeight = obj.height * obj.scaleY;

    const objScaleX = obj.scaleX;

    const isSacleToTop = corner === 'tl' || corner === 'tr';
    const isSacleToBottom = corner === 'bl' || corner === 'br';
    const isSacleToLeft = corner === 'tl' || corner === 'bl';
    const isSacleToRight = corner === 'tr' || corner === 'br';

    function updateNewScale(isScaleX, newValue) {
      if (isScaleX) {
        obj.scaleY = (obj.scaleY * newValue) / obj.scaleX;
        obj.scaleX = newValue;
      } else {
        obj.scaleX = (obj.scaleX * newValue) / obj.scaleY;
        obj.scaleY = newValue;
      }
      if (!isScaleX && corner === 'bl') {
        obj.left -= Math.floor((obj.scaleX - objScaleX) * objWidth);
      }
      if (!isScaleX && corner === 'tl') {
        obj.left -= Math.floor((obj.scaleX - objScaleX) * objWidth);
      }
    }

    if (isSacleToTop && objTop < 0) {
      obj.top = 0;
      const _scaleY = (objScaleHeight + objTop) / objHeight;
      updateNewScale(false, _scaleY);
    } else if (
      isSacleToBottom &&
      objTop + objScaleHeight > fabricCanvasHeight
    ) {
      const _scaleY = (fabricCanvasHeight - objTop) / objHeight;
      updateNewScale(false, _scaleY);
    } else if (isSacleToLeft && objLeft < 0) {
      obj.left = 0;
      const _scaleX = (objScaleWidth + objLeft) / objWidth;
      updateNewScale(true, _scaleX);
    } else if (isSacleToRight && objLeft + objScaleWidth > fabricCanvasWidth) {
      const _scaleX = (fabricCanvasWidth - objLeft) / objWidth;
      updateNewScale(true, _scaleX);
    } else {
      // const objectFullWidth = object.width * object.scaleX;
      // const objectFullHeight = object.height * object.scaleY;
      // const destSize = Math.min(objectFullWidth, objectFullHeight);
      // if (destSize < CROP_MIN_SIZE) {
      //   const scaleRate = CROP_MIN_SIZE / destSize;
      //   object.scaleX *= scaleRate;
      //   object.scaleY *= scaleRate;
      // }
    }
  };

  const setDefaultSeletedImg = productImages => {
    if (!isEmpty(productImages)) {
      setSelectedImage(productImages[0]);
    }
  };

  const setCanvasBackground = () => {
    if (!fabricCanvas) {
      return;
    }
    if (!isEmpty(selectedImage)) {
      addImage(selectedImage, true);
    }
  };

  const initCanvas = () => {
    // console.log('init canvas');
    const _canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      selection: false,
    });
    _canvas.setWidth(DESIGN_PREVIEW_DEFAULT_WIDTH);
    _canvas.setHeight(DESIGN_PREVIEW_DEFAULT_HEIGHT);

    _canvas.renderAll();
    setfabricCanvas(_canvas);
    return _canvas;
  };

  const initCanvasEvents = () => {
    if (!fabricCanvas) {
      return;
    }

    fabricCanvas.off('object:added');
    fabricCanvas.off('object:removed');
    fabricCanvas.off('object:moved');
    fabricCanvas.off('object:rotating');
    fabricCanvas.off('object:scaled');
    fabricCanvas.off('object:rotated');
    fabricCanvas.off('selection:created');
    fabricCanvas.off('selection:updated');
    fabricCanvas.off('selection:cleared');

    fabricCanvas.on('object:added', updateIsModified);
    // fabricCanvas.on('mouse:up', onMouseup);
    fabricCanvas.on('object:removed', onRemoved);
    // fabricCanvas.on('object:moving', onMovingObj);
    fabricCanvas.on('object:moved', updateBtnDeletePosition);
    // fabricCanvas.on('object:scaling', onScalingObj);
    fabricCanvas.on('object:rotating', disableBtnDelete);
    fabricCanvas.on('object:scaled', updateBtnDeletePosition);
    fabricCanvas.on('object:rotated', onRotated);
    fabricCanvas.on('selection:created', onLayerSelected);
    fabricCanvas.on('selection:updated', onLayerSelected);
    fabricCanvas.on('selection:cleared', onLayerUnselected);
  };

  const addLayerEvents = layer => {
    // TODO ...
  };

  const onLayerSelected = ({ selected }) => {
    const target = selected[0];
    if (target.layerType === LAYER_TYPE_TEXT) {
      const currPlainText = plainTextLayers.find(text => text.id === target.id);
      if (currPlainText) {
        setSelectedPlainText({ ...currPlainText });
      }
    } else {
      setSelectedPlainText(null);
    }
    setActiveLayerId(target.id);
    updateBtnDeletePosition({ target });
  };

  const onLayerUnselected = () => {
    setActiveLayerId(null);
    setSelectedPlainText(null);
    disableBtnDelete();
  };

  const setSelectedLayer = layerId => {
    const selectedLayer = fabricCanvas._objects.find(
      layer => layer.id === layerId,
    );
    if (selectedLayer) {
      fabricCanvas.setActiveObject(selectedLayer);
      fabricCanvas.renderAll();
    }
  };

  const setSelectedText = layerId => {
    if (!layerId) {
      setSelectedPlainText(null);
      return;
    }
    const selectedLayer = fabricCanvas._objects.find(
      layer => layer.id === layerId,
    );
    if (selectedLayer) {
      fabricCanvas.setActiveObject(selectedLayer);
      fabricCanvas.renderAll();
    }
    if (selectedLayer.layerType === LAYER_TYPE_TEXT) {
      const currPlainText = plainTextLayers.find(
        text => text.id === selectedLayer.id,
      );
      if (currPlainText) {
        setSelectedPlainText({ ...currPlainText });
      }
    }
  };

  const reOrderLayer = ({ sourceId, targetId }) => {
    const _objects = fabricCanvas._objects;
    const sourceIndex = _objects.findIndex(object => object.id === sourceId);
    const targetIndex = _objects.findIndex(object => object.id === targetId);
    const source = _objects[sourceIndex];
    source.moveTo(targetIndex);
    updateLayers();
  };

  const transformCoords = (layers, source, dest) => {
    const scaleX = dest.width / source.width;
    const scaleY = dest.height / source.height;
    const scaleRate = Math.min(scaleX, scaleY);
    const normalLayers = [];
    const backgroundLayers = [];
    layers.forEach(layer => {
      const layerClone = { ...layer };
      layerClone.top *= scaleRate;
      layerClone.left *= scaleRate;
      layerClone.scaleX *= scaleRate;
      layerClone.scaleY *= scaleRate;

      if (layerClone.globalCompositeOperation === 'destination-over') {
        layerClone.globalCompositeOperation = 'source-over';
        backgroundLayers.push(layerClone);
      } else {
        normalLayers.push(layerClone);
      }
    });
    return [...backgroundLayers, ...normalLayers];
  };

  const setFrameTemplateByLayers = async data => {
    setLoading(true);
    frameLayers.forEach(obj => fabricCanvas.remove(obj));

    const transformedLayer = transformCoords(
      data.layers,
      { width: SOURCE_DESIGN_TOOL_WIDTH, height: SOURCE_DESIGN_TOOL_HEIGHT },
      { width: fabricCanvas.width, height: fabricCanvas.height },
    );
    fabric.util.enlivenObjects(transformedLayer, function (objects) {
      objects.forEach(obj => {
        setLayerProps(obj, { selectable: false, evented: false });
        fabricCanvas.centerObject(obj);
        fabricCanvas.add(obj);
        if (fabricCanvas._objects.length > 0) {
          obj.moveTO(0);
        }
      });
      setFrameLayers(objects);
      setFrameLayersClone(cloneDeep(objects));
      setLoading(false);
    });
  };

  const setFrameTemplateByBackground = data => {
    frameLayers.forEach(obj => fabricCanvas.remove(obj));
    const file = data.thumb;
    setLoading(true);
    fabric.Image.fromURL(
      genImgUrl({
        location: file.location || file.resourcePath,
        width: 0,
        height: 0,
      }),
      img => {
        img.set({
          id: new Date().getTime(),
          layerType: LAYER_TYPE_FILE,
          resourceId: file.id,
          resourcePath: file.location,
          resourceName: file.name,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          globalCompositeOperation: 'source-over',
        });
        const scaleWidth = fabricCanvas.width / img.width;
        const scaleHeight = fabricCanvas.height / img.height;
        const scaleRate = scaleWidth < scaleHeight ? scaleWidth : scaleHeight;
        img.scaleToWidth(img.width * scaleRate);

        img.setCoords();
        fabricCanvas.centerObject(img);
        fabricCanvas.add(img);
        if (fabricCanvas._objects.length > 0) {
          img.moveTo(0);
        }
        setFrameLayers([img]);
        setFrameLayersClone(cloneDeep([img]));
        setLoading(false);
      },
      { crossOrigin: 'anonymous' },
    );
  };

  const resetToolState = async () => {
    switch (currToolAction) {
      case TOOL_ACTION_SET_FRAME_TEMPLATE:
        let newFrameLayerClone;
        newFrameLayerClone = cloneDeep(frameLayersClone);
        frameLayers.forEach(obj => fabricCanvas.remove(obj));
        frameLayersClone.forEach(obj => {
          setLayerProps(obj);
          fabricCanvas.centerObject(obj);
          fabricCanvas.add(obj);
        });
        setFrameLayers(frameLayersClone);
        setFrameLayersClone(newFrameLayerClone);
        break;
      case TOOL_ACTION_CROP_BACKGROUND:
        const newCropBoxClone = cloneDeep(currentCropBoxClone);
        fabricCanvas.remove(currentCropBox);
        fabricCanvas.add(currentCropBoxClone);
        fabricCanvas.setActiveObject(currentCropBoxClone);
        setCurrentCropBox(currentCropBoxClone);
        setCurrentCropBoxClone(newCropBoxClone);
        break;
      default:
        break;
    }
  };

  const resetAll = async () => {
    const productImagesDefault = [...originProductImages];
    setProductImages(productImagesDefault);
    fabricCanvas.clear();
    setSelectedImage(productImagesDefault[0]);
    setCanvasBackground();
    setCurrToolAction(null);
    setExported(false);
    setModified(false);
    clearData();
  };

  const alignLayer = type => {
    const currLayer = fabricCanvas.getActiveObject();
    const width = currLayer.width * currLayer.scaleX;
    const height = currLayer.height * currLayer.scaleY;
    switch (type) {
      case 'CENTER_H':
        currLayer.left = DESIGN_PREVIEW_DEFAULT_WIDTH / 2;
        break;
      case 'CENTER_V':
        currLayer.top = DESIGN_PREVIEW_DEFAULT_HEIGHT / 2;
        break;
      case 'LEFT':
        currLayer.left = width / 2;
        break;
      case 'RIGHT':
        currLayer.left = DESIGN_PREVIEW_DEFAULT_WIDTH - width / 2;
        break;
      case 'TOP':
        currLayer.top = height / 2;
        break;
      case 'BOTTOM':
        currLayer.top = DESIGN_PREVIEW_DEFAULT_HEIGHT - height / 2;
        break;
      default:
        break;
    }
    setTimeout(() => {
      updateBtnDeletePosition();
      updateLayers();
    });
  };

  const rotateLayer = data => {
    fabricCanvas.getActiveObject().angle = data;
    fabricCanvas.renderAll();
    updateBtnDeletePosition();
    updateLayers();
  };

  const unsetToolAction = data => {
    switch (data) {
      case TOOL_ACTION_SET_FRAME_TEMPLATE:
        frameLayers.forEach(obj => fabricCanvas.remove(obj));
        break;
      default:
        break;
    }
  };

  const updateToolAction = data => {
    if (data === currToolAction) {
      return;
    }
    setLoading(true);
    switch (data) {
      case TOOL_ACTION_CROP_BACKGROUND:
        const plainTextIdMap = new Map();
        plainTextLayers.forEach(text => plainTextIdMap.set(text.id, null));
        fabricCanvas._objects.forEach(obj => {
          if (plainTextIdMap.has(obj.id)) {
            fabricCanvas.remove(obj);
          }
        });
        // setPlainTextLayers([]);
        frameLayers.forEach(obj => fabricCanvas.remove(obj));
        imgUploadLayers.forEach(obj => fabricCanvas.remove(obj));
        // frameLayersClone.forEach(obj => fabricCanvas.remove(obj));
        fabricCanvas.off('object:moving');
        fabricCanvas.off('object:scaling');
        fabricCanvas.on('object:moving', e => onMovingObj(e, true));
        fabricCanvas.on('object:scaling', e => onScalingObj(e, true));
        break;
      case TOOL_ACTION_SET_FRAME_TEMPLATE:
        fabricCanvas.remove(currentCropBox);
        fabricCanvas.off('object:moving');
        fabricCanvas.off('object:scaling');
        fabricCanvas.on('object:moving', e => {
          onMovingObj(e);
        });
        fabricCanvas.on('object:scaling', e => onScalingObj(e));
        break;
      case TOOL_ACTION_ADD_IMAGE:
        fabricCanvas.remove(currentCropBox);
        fabricCanvas.off('object:moving');
        fabricCanvas.off('object:scaling');
        fabricCanvas.on('object:moving', e => {
          onMovingObj(e);
        });
        fabricCanvas.on('object:scaling', e => onScalingObj(e));
        break;
      case TOOL_ACTION_ADD_TEXT:
        fabricCanvas.remove(currentCropBox);
        fabricCanvas.off('object:moving');
        fabricCanvas.off('object:scaling');
        fabricCanvas.on('object:moving', e => {
          onMovingObj(e);
        });
        break;
      default:
        break;
    }
    setCurrToolAction(data);
    setLoading(false);
  };

  const navImage = data => {
    const { isNext, viewHeight } = data;
    const selectedImgIndex = productImages.findIndex(
      image => image.id === selectedImage.id,
    );
    const selectedImgIndexTarget = selectedImgIndex + (isNext ? 1 : -1);
    const topPositionTarget =
      LIST_IMAGE_ITEM_FULL_HEIHGT * selectedImgIndexTarget;
    const scrollTopPosition = imageScrollbar.getScrollTop();

    setSelectedImage(productImages[selectedImgIndexTarget]);
    if (
      topPositionTarget < scrollTopPosition ||
      topPositionTarget >
        scrollTopPosition + viewHeight - LIST_IMAGE_ITEM_FULL_HEIHGT
    ) {
      imageScrollbar.scrollTop(topPositionTarget);
    }
  };

  const focusOut = () => {
    setActiveLayerId(null);
    fabricCanvas.discardActiveObject().renderAll();
  };

  const clearData = () => {
    setSelectedPlainText(null);
    setPlainTextLayers([]);
  };

  const handleCrop = (background, cropBoxLayout) => {
    const width = cropBoxLayout.width * cropBoxLayout.scaleX;
    const height = cropBoxLayout.height * cropBoxLayout.scaleY;
    background.set({
      top: -cropBoxLayout.top,
      left: -cropBoxLayout.left,
      originX: null,
      originY: null,
    });
    fabricCanvas.setWidth(width);
    fabricCanvas.setHeight(height);
  };

  const exportToImage = async () => {
    let cropBoxLayout;
    const newImages = [];
    const isCropping = currToolAction === TOOL_ACTION_CROP_BACKGROUND;
    setLoading(true);
    focusOut();
    if (isCropping) {
      const { top, left, width, height, scaleX, scaleY } = currentCropBox;
      cropBoxLayout = { top, left, width, height, scaleX, scaleY };
      fabricCanvas.remove(currentCropBox);
      fabricCanvas.remove(currentCropBoxClone);
    }
    if (isApplyAll) {
      const backgroundObjs = await getListBackgroundObjAsync(
        isCropping,
        cropBoxLayout,
      );
      for (const bgObj of backgroundObjs) {
        if (isCropping) {
          handleCrop(bgObj, cropBoxLayout);
        } else {
          fabricCanvas.setWidth(bgObj.width * bgObj.scaleX);
          fabricCanvas.setHeight(bgObj.height * bgObj.scaleY);
        }
        fabricCanvas.centerObject(bgObj);
        fabricCanvas.setBackgroundImage(bgObj);
        fabricCanvas.renderAll();

        await new Promise(resolve => {
          canvasRef.current.toBlob(async blob => {
            uploadImage(blob).then(({ is_success, data }) => {
              if (is_success) {
                newImages.push({
                  ...data,
                  storeImageId: bgObj.resourceId,
                  saveType: isApplyToNew ? 'CREATE' : 'UPDATE',
                });
              }
              resolve();
            });
          });
        });
      }
      newImages[0].isThumb = true;
    } else {
      if (isCropping) {
        handleCrop(fabricCanvas.backgroundImage, cropBoxLayout);
        fabricCanvas.renderAll();
      }
      const blob = await new Promise(resolve => {
        canvasRef.current.toBlob(blob => {
          resolve(blob);
        });
      });
      const { is_success, data } = await uploadImage(blob);
      if (is_success) {
        newImages.push({
          ...data,
          isThumb: selectedImage.id === productImages[0]?.id,
          storeImageId: selectedImage.id,
          saveType: isApplyToNew ? 'CREATE' : 'UPDATE',
        });
      }
    }

    fabricCanvas.clear();
    clearData();
    updateIsModified();
    if (isApplyToNew) {
      const newProductImages = [...productImages, ...newImages];
      const imagesLength = newProductImages.length;
      setProductImages(newProductImages);
      setSelectedImage(newProductImages[imagesLength - 1]);
      // imageSlider.slideTo(lastIndex, 500);
      imageScrollbar.scrollTop(imagesLength * LIST_IMAGE_ITEM_FULL_HEIHGT);
      setCurrToolAction(null);
      setExported(true);
      setLoading(false);
      return newProductImages;
    } else if (isApplyAll) {
      const imagesLength = newImages.length;
      setProductImages(newImages);
      setSelectedImage(newImages[imagesLength - 1]);
      imageScrollbar.scrollTop(imagesLength * LIST_IMAGE_ITEM_FULL_HEIHGT);
      setCurrToolAction(null);
      setExported(true);
      setLoading(false);
      return newImages;
    } else {
      const currSelectedIndex = productImages.findIndex(
        image => image.id === selectedImage.id,
      );
      const productImagesClone = [...productImages];
      productImagesClone[currSelectedIndex] = newImages[0];
      setProductImages(productImagesClone);
      setSelectedImage(newImages[0]);
      setCurrToolAction(null);
      setExported(true);
      setLoading(false);
      return productImagesClone;
    }
  };

  const removeBackground = () => {
    let selectedIndex;
    setProductImages(
      productImages.filter((image, index) => {
        const isSeleted = image.id === selectedImage.id;
        if (isSeleted) {
          selectedIndex = index;
        }
        return !isSeleted;
      }),
    );
    setSelectedImage(productImages[selectedIndex - 1]);
  };

  const emitAction = ({ type, data }) => {
    switch (type) {
      case 'SET_LOADING':
        setLoading(data);
        break;
      case 'SAVE_PRODUCT_IMAGES':
        saveProductImages(data);
        break;
      case 'SET_FRAME_TEMPLATE':
        setFrameTemplateByBackground(data);
        break;
      case 'RESET_TOOL_STATE':
        resetToolState(data);
        break;
      case 'RESET_ALL':
        resetAll(data);
        break;
      case 'ADD_CROP_BOX':
        addCropBox(data, true);
        break;
      case 'EXPORT_TO_IMAGE':
        exportToImage(data);
        break;
      case 'REMOVE_BACKGROUND':
        removeBackground();
        break;
      case 'SET_SELECTED_IMAGE':
        setSelectedImage(data);
        break;
      case 'SET_SELECTED_TEXT':
        setSelectedText(data);
        break;
      case 'UPDATE_TOOL_ACTION':
        updateToolAction(data);
        break;
      case 'UNSET_TOOL_ACTION':
        unsetToolAction(data);
        break;
      case 'NAV_IMAGE':
        navImage(data);
        break;
      case 'ADD_IMAGE':
        addImage(data);
        break;
      case 'ADD_TEXT':
        addText(data);
        break;
      case 'DELETE_TEXT':
        deletePlainText(data);
        break;
      case 'UPDATE_TEXT':
        updateText(data);
        break;
      case 'SET_SELECTED':
        setSelectedLayer(data);
        break;
      case 'DELETE':
        deleteLayer(data);
        break;
      case 'RE_ORDER':
        reOrderLayer(data);
        break;
      case 'ALIGN':
        alignLayer(data);
        break;
      case 'ROTATE':
        rotateLayer(data);
        break;
      default:
        break;
    }
  };

  const updateBtnDeletePosition = e => {
    setTimeout(() => {
      const activeLayer = e.target;
      if (e.target.layerType === LAYER_TYPE_CROP_BOX) {
        return;
      }
      const btnDeleteElement = btnDeleteRef.current;
      const scaleX = DESIGN_PREVIEW_DEFAULT_WIDTH / fabricCanvas.width;
      const scaleY = DESIGN_PREVIEW_DEFAULT_HEIGHT / fabricCanvas.height;
      if (activeLayer) {
        const top = activeLayer.getCoords()[1].y * scaleY - 10 + 'px';
        const left = activeLayer.getCoords()[1].x * scaleX - 10 + 'px';
        const style = {
          display: 'block',
          top,
          left,
        };

        for (let styleAttr in style) {
          btnDeleteElement.style[styleAttr] = style[styleAttr];
        }
      }
    }, 180);
  };

  const deleteLayer = id => {
    const layer =
      id === undefined
        ? fabricCanvas.getActiveObject()
        : fabricCanvas._objects.find(l => l.id === id);
    fabricCanvas.remove(layer);
  };

  const setCropbox = layer => {
    setLayerProps(
      layer,
      {
        borderColor: 'rgba(0, 0, 0, 0.34)',
        borderScaleFactor: DESIGN_PREVIEW_DEFAULT_HEIGHT * 3,
        stroke: '#FFFFFF',
        strokeWidth: 2,
      },
      { mtr: false },
    );
  };

  const setLayerProps = (layer, props, controlVisible) => {
    fabric.Object.prototype.borderScaleFactor = 2;
    layer.set({
      ...(layer.layerType !== LAYER_TYPE_TEXT ? { fill: 'transparent' } : {}),
      transparentCorners: false,
      borderColor: '#3D56A6',
      borderScaleFactor: 2,
      cornerColor: '#FFFFFF',
      cornerStyle: 'circle',
      cornerSize: 16,
      // stroke: '#fff',
      // strokeWidth: 2,
      ...(props ? props : {}),
      // hasControls: false,
    });
    layer.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: true,
      br: true,
      tl: true,
      tr: true,
      ...(controlVisible ? controlVisible : {}),
      // mtr: false,
    });
  };

  const addImage = (file, isBackground, isNotLoading) => {
    !isNotLoading && setLoading(true);
    fabric.Image.fromURL(
      genImgUrl({
        location: file.location || file.resourcePath,
        width: 0,
        height: 0,
      }),
      img => {
        img.set({
          id: new Date().getTime(),
          layerType: LAYER_TYPE_FILE,
          resourceId: file.id,
          resourcePath: file.location,
          resourceName: (isBackground ? 'Background_' : 'Layer_') + file.name,
          originX: 'center',
          originY: 'center',
        });
        setLayerProps(img);
        if (isBackground) {
          const scaleWidth = DESIGN_PREVIEW_DEFAULT_WIDTH / img.width;
          const scaleHeight = DESIGN_PREVIEW_DEFAULT_HEIGHT / img.height;
          const scaleRate = scaleWidth < scaleHeight ? scaleWidth : scaleHeight;
          img.scaleToWidth(img.width * scaleRate);
          fabricCanvas.setWidth(img.width * scaleRate);
          fabricCanvas.setHeight(img.height * scaleRate);
        } else {
          img.scaleToWidth(
            DESIGN_PREVIEW_DEFAULT_WIDTH * IMAGE_ADDED_SCALE_RATE,
          );
          setImgUploadLayers([...imgUploadLayers, img]);
        }

        img.setCoords();
        addLayerEvents(img);
        fabricCanvas.centerObject(img);
        if (isBackground) {
          fabricCanvas.setBackgroundImage(img);
        } else {
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
        }
        !isNotLoading && setLoading(false);
      },
      { crossOrigin: 'anonymous' },
    );
  };

  const getListBackgroundObjAsync = async (isCropping, cropBoxLayout) => {
    const loadImagePromises = [];
    productImages.forEach(async file => {
      const loadImage = new Promise(resolve => {
        fabric.Image.fromURL(
          genImgUrl({
            location: file.location || file.resourcePath,
            width: 0,
            height: 0,
          }),
          img => {
            img.set({
              id: new Date().getTime(),
              layerType: LAYER_TYPE_FILE,
              resourceId: file.id,
              resourcePath: file.location,
              originX: 'center',
              originY: 'center',
            });
            setLayerProps(img);
            const scaleWidth = DESIGN_PREVIEW_DEFAULT_WIDTH / img.width;
            const scaleHeight = DESIGN_PREVIEW_DEFAULT_HEIGHT / img.height;
            const scaleRate =
              scaleWidth < scaleHeight ? scaleWidth : scaleHeight;
            img.scaleToWidth(img.width * scaleRate);
            img.top = 0;
            img.left = 0;
            // img.setCoords();
            // addLayerEvents(img);
            // if (isCropping) {
            //   handleCrop(img, cropBoxLayout);
            // } else {
            //   // fabricCanvas.setWidth(img.width * scaleRate);
            //   // fabricCanvas.setHeight(img.height * scaleRate);
            // }
            // // fabricCanvas.centerObject(img);

            // fabricCanvas.setBackgroundImage(img);
            resolve(img);
          },
          { crossOrigin: 'anonymous' },
        );
      });
      loadImagePromises.push(loadImage);
    });
    const backgroundObjs = await Promise.all(loadImagePromises);
    return backgroundObjs;
  };

  const addText = ({ origin, normal }) => {
    setLoading(true);
    const textObj = new fabric.Text(normal.text, {
      id: new Date().getTime(),
      layerType: LAYER_TYPE_TEXT,
      // fill: '#000',
      originX: 'center',
      originY: 'center',
      // angle: 0,
      // fontFamily: 'Roboto',
      shadow: '#000',
      // ...data,
    });
    textObj.set(normal);
    setLayerProps(textObj, null, {
      bl: false,
      br: false,
      tl: false,
      tr: false,
    });
    fabricCanvas.centerObject(textObj);
    fabricCanvas.add(textObj);
    const plainText = {
      ...origin,
      id: textObj.id,
    };
    setPlainTextLayers([...plainTextLayers, plainText]);
    setSelectedPlainText({ ...plainText });
    fabricCanvas.setActiveObject(textObj);
    setLoading(false);
    return plainText.id;
  };

  const updateText = ({ origin, normal }) => {
    const currId = origin.id;
    const currText = fabricCanvas._objects.find(obj => obj.id === currId);
    const currPlainTextIndex = plainTextLayers.findIndex(
      text => text.id === currId,
    );
    updatePlainText(currPlainTextIndex, origin);
    if (currText) {
      currText.set(normal);
      fabricCanvas.renderAll();
    }
  };

  const addCropBox = data => {
    const canvasWidth = fabricCanvas.width;
    const canvasHeight = fabricCanvas.height;
    const scaleByWidth = canvasWidth / canvasHeight < data;
    let boxWidth;
    let boxHeight;
    // const existedCropBox = fabricCanvas._objects.find(
    //   obj => obj.layerType === LAYER_TYPE_CROP_BOX,
    // );
    // if (existedCropBox) {
    fabricCanvas.remove(currentCropBoxClone);
    fabricCanvas.remove(currentCropBox);
    // }
    setLoading(true);

    if (!data) {
      //default crop
      boxWidth = canvasWidth * 0.75;
      boxHeight = canvasHeight * 0.75;
    } else {
      boxWidth = scaleByWidth ? canvasWidth : canvasHeight * data;
      boxHeight = scaleByWidth ? canvasWidth / data : canvasHeight;
    }

    const dragBox = new fabric.Rect({
      layerType: LAYER_TYPE_CROP_BOX,
      angle: 0,
      // left: data ? (canvasWidth - boxWidth) / 2 : 0,
      // top: data ? (canvasHeight - boxHeight) / 2 : 0,
      width: boxWidth,
      height: boxHeight,
      skewX: 0,
      skewY: 0,
    });
    setCropbox(
      dragBox,
      {
        borderColor: 'rgba(0, 0, 0, 0.34)',
        borderScaleFactor: DESIGN_PREVIEW_DEFAULT_HEIGHT * 3,
      },
      { mtr: false },
    );
    fabricCanvas.centerObject(dragBox);
    fabricCanvas.add(dragBox);
    fabricCanvas.setActiveObject(dragBox);
    setCurrentCropBox(dragBox);
    setCurrentCropBoxClone(cloneDeep(dragBox));
    setLoading(false);
  };

  return (
    <ImageEditorWrapper>
      {/* <GlobalFonts /> */}
      <Spin spinning={isLoading} indicator={loadingIcon}>
        <div className="image-editor">
          <ToolBar
            emitAction={emitAction}
            setLoading={setLoading}
            currToolAction={currToolAction}
            plainTextLayers={plainTextLayers}
            selectedPlainText={selectedPlainText}
            setSelectedPlainText={setSelectedPlainText}
          ></ToolBar>
          <div className="preview-area-wrapper">
            <div className="canvas-wrapper">
              <canvas ref={canvasRef}></canvas>
              <span
                className="canvas-delete-button"
                ref={btnDeleteRef}
                onClick={() => deleteLayer()}
              ></span>
            </div>
            <ActionButton
              emitAction={emitAction}
              setLoading={setLoading}
              currToolAction={currToolAction}
              productId={productId}
              images={productImages}
              isApplyAll={isApplyAll}
              setIsApplyAll={setIsApplyAll}
              isApplyToNew={isApplyToNew}
              setIsApplyToNew={setIsApplyToNew}
              selectedImage={selectedImage}
              disableExport={!isExported && !isModified}
              disableApply={!isModified}
              disableDelete={
                productImages.findIndex(img => img.id === selectedImage.id) <
                originProductImages.length
              }
              disableReset={!isExported && !isModified}
            ></ActionButton>
          </div>
          <ListImage
            setImageScrollbar={setImageScrollbar}
            images={productImages}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          ></ListImage>
        </div>
      </Spin>
    </ImageEditorWrapper>
  );
});

export const ImageEditorWrapper = styled.div`
  height: 100%;
  .ant-spin-nested-loading,
  .ant-spin-container,
  .image-editor {
    height: 100%;
  }
  & .image-editor {
    display: flex;

    .canvas-delete-button {
      position: absolute;
      cursor: pointer;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-image: url('${removeLayer}');
      background-size: 10px;
      background-color: #f34536;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 1003;
      display: none;
    }
    .preview-area-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      flex-shrink: 0;
      background: #f7f7f9;
      .canvas-wrapper {
        border: 1px solid #ebebf0;
        position: relative;
        width: ${DESIGN_PREVIEW_DEFAULT_WIDTH + 2}px;
        height: ${DESIGN_PREVIEW_DEFAULT_HEIGHT + 2}px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: repeat url('${transparent}');
      }
    }
    .list-layer-wrapper {
      margin-top: 30px;
    }
    .sidebar {
      flex-shrink: 0;
      flex-grow: 1;
      margin-left: 25px;
      width: calc(100% - 500px - 25px);
    }
  }
`;
