import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { Row, Col, Form, Select, Input, Slider } from 'antd';
import { debounce } from 'lodash';
import styled from 'styled-components/macro';

import {
  FONT_SIZE_UNIT,
  FONT_FAMILY_OPTIONS,
  COLOR_OPTIONS,
  NONE_OPTION_VALUE,
  NONE_FIELD_VALUE,
  SHADOW_DEFAULT_VALUE_PART_BEFORE,
  TEXT_FIELD,
  COLOR_FIELD,
  FONT_FAMILY_FIELD,
  FONT_SIZE_FIELD,
  CHAR_SPACING_FIELD,
  STROKE_FIELD,
  SHADOW_FIELD,
  LINE_HEIGHT_FIELD,
  ANGLE_FIELD,
  ARC_FIELD,
  DEFAULT_VALUES,
  CHAR_SPACING_UNIT,
} from '../../..';
import { ACTION_ADD, DEFAULT_TAB_INDEX } from '.';

const { Option } = Select;

const VALUE_STEP_SIZE = 0.1;

export default memo(function EditText({
  emitAction,
  setLoading,
  updateCurrentAction,
  toolbarActionType,
  currToolAction,
  currentAction,
  selectedPlainText,
  setCurrentTabIndex,
}) {
  const textInputRef = useRef(null);
  const [isInternalUpdated, setInternalUpdated] = useState(false);
  const [form] = Form.useForm();

  const updateText = () => {
    const id = selectedPlainText?.id;
    if (!selectedPlainText?.id) {
      return;
    }
    const originValues = form.getFieldsValue();
    const normalData = normalizeValues(originValues);
    emitAction({
      type: 'UPDATE_TEXT',
      data: { origin: { ...originValues, id }, normal: { ...normalData, id } },
    });
  };

  const debounceUpdateText = useCallback(debounce(updateText, 200));

  useEffect(() => {
    emitAction({
      type: 'UPDATE_TOOL_ACTION',
      data: toolbarActionType,
    });
  }, []);

  useEffect(() => {
    if (!selectedPlainText && isInternalUpdated) {
      setCurrentTabIndex(DEFAULT_TAB_INDEX);
      return;
    }
    if (!selectedPlainText && !isInternalUpdated) {
      form.setFieldsValue(DEFAULT_VALUES);
      emitAction({
        type: 'ADD_TEXT',
        data: {
          origin: DEFAULT_VALUES,
          normal: normalizeValues(DEFAULT_VALUES),
        },
      });
      setInternalUpdated(true);
    } else {
      form.setFieldsValue(deNormalizeValues(selectedPlainText));
      setInternalUpdated(true);
    }
    setTimeout(setFocusInputTextDefault, 150);
  }, [selectedPlainText]);

  const setFocusInputTextDefault = () => {
    const textInput = textInputRef.current?.resizableTextArea.textArea;
    if (!textInput) {
      return;
    }
    textInput.selectionStart = 0;
    textInput.selectionEnd = textInput.value.length;
    textInput.focus();
  };

  const changeRangeValue = (fieldName, increaseValue) => {
    const currValue = form.getFieldValue(fieldName);
    form.setFieldsValue({ [fieldName]: currValue + increaseValue });
    updateText();
  };

  const normalizeValues = valueObj => {
    const valueObjClone = { ...valueObj };
    valueObjClone[STROKE_FIELD] =
      valueObjClone[STROKE_FIELD] === NONE_OPTION_VALUE
        ? NONE_FIELD_VALUE
        : valueObjClone[STROKE_FIELD];

    valueObjClone[SHADOW_FIELD] =
      valueObjClone[SHADOW_FIELD] === NONE_OPTION_VALUE
        ? NONE_FIELD_VALUE
        : valueObjClone[SHADOW_FIELD];

    valueObjClone[SHADOW_FIELD] =
      valueObjClone[SHADOW_FIELD] !== NONE_FIELD_VALUE
        ? SHADOW_DEFAULT_VALUE_PART_BEFORE + valueObjClone[SHADOW_FIELD]
        : NONE_FIELD_VALUE;

    valueObjClone[FONT_SIZE_FIELD] *= FONT_SIZE_UNIT;
    valueObjClone[CHAR_SPACING_FIELD] *= CHAR_SPACING_UNIT;

    valueObjClone[ANGLE_FIELD] += valueObjClone[ANGLE_FIELD] < 180 ? 0 : -360;
    return valueObjClone;
  };

  const deNormalizeValues = valueObj => {
    const valueObjClone = { ...valueObj };
    valueObjClone[ANGLE_FIELD] += valueObjClone[ANGLE_FIELD] < 180 ? 0 : -360;
    return valueObjClone;
  };

  const colorOptionsStyle = value => ({
    background: value,
    display: 'inline-flex',
    borderRadius: '100%',
    width: '15px',
    height: '15px',
    marginRight: '4px',
  });

  const colorOptionsWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const noneOptionElement = (
    <Option value={NONE_OPTION_VALUE}>
      <div style={colorOptionsWrapperStyle}>
        <i className="fa fa-ban"></i>&nbsp;&nbsp;None
      </div>
    </Option>
  );

  return (
    <ListTextWrapper>
      <div className="text-edit-content">
        <Form form={form}>
          <div
            className="text-edit__title"
            onClick={() => {
              setCurrentTabIndex(DEFAULT_TAB_INDEX);
              // emitAction({
              //   type: 'SET_SELECTED_TEXT',
              //   data: null,
              // });
            }}
          >
            <i className="fas fa-long-arrow-alt-left"></i>
            <span className="edit-title">
              {currentAction === ACTION_ADD ? 'Tạo mới chữ' : 'Sửa chữ'}
            </span>
          </div>
          <Row>
            <Col className="text-edit-item mt-0" span="24">
              {/* <div className="edit-item__title">Nội dung</div> */}
              <div className="edit-item__content">
                <Form.Item name={TEXT_FIELD}>
                  <Input.TextArea
                    ref={textInputRef}
                    rows={2}
                    placeholder="Nhập nội dung chữ"
                    className="text-value ant-input"
                    onChange={debounceUpdateText}
                  ></Input.TextArea>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="text-edit-form">
            <Row gutter="26">
              <Col className="text-edit-item" span="24">
                <div className="edit-item__title">Kiểu font</div>
                <div className="edit-item__content">
                  <Form.Item name={FONT_FAMILY_FIELD}>
                    <Select
                      className="base-input"
                      onChange={debounceUpdateText}
                    >
                      {FONT_FAMILY_OPTIONS.map(({ text, value }) => (
                        <Option key={value} value={value}>
                          {text}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row gutter="19">
              <Col className="text-edit-item" span="12">
                <div className="edit-item__title">Font size</div>
                <div className="edit-item__content">
                  <div className="input-group">
                    <div
                      className="input-prepend-icon"
                      onClick={() => {
                        changeRangeValue(FONT_SIZE_FIELD, -VALUE_STEP_SIZE);
                      }}
                    >
                      <i className="far fa-minus"></i>
                    </div>
                    <Form.Item name={FONT_SIZE_FIELD}>
                      <Input
                        type="number"
                        onChange={debounceUpdateText}
                      ></Input>
                    </Form.Item>
                    <div
                      className="input-append-icon"
                      onClick={() => {
                        changeRangeValue(FONT_SIZE_FIELD, VALUE_STEP_SIZE);
                      }}
                    >
                      <i className="far fa-plus"></i>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="text-edit-item" span="12">
                <div className="edit-item__title">Color</div>
                <div className="edit-item__content">
                  <Form.Item name={COLOR_FIELD}>
                    <Select
                      className="base-input slect-with-icon"
                      onChange={debounceUpdateText}
                    >
                      {COLOR_OPTIONS.map(({ text, value }) => (
                        <Option key={value} value={value}>
                          <div style={colorOptionsWrapperStyle}>
                            <div
                              className="circle-color"
                              style={colorOptionsStyle(value)}
                            ></div>
                            {text}
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter="19">
              <Col className="text-edit-item" span="12">
                <div className="edit-item__title">Outline</div>
                <div className="edit-item__content">
                  <Form.Item name={STROKE_FIELD}>
                    <Select
                      className="base-input slect-with-icon"
                      onChange={debounceUpdateText}
                    >
                      {noneOptionElement}
                      {COLOR_OPTIONS.map(({ text, value }) => (
                        <Option key={value} value={value}>
                          <div style={colorOptionsWrapperStyle}>
                            <div
                              className="circle-color"
                              style={colorOptionsStyle(value)}
                            ></div>
                            {text}
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="text-edit-item" span="12">
                <div className="edit-item__title">Shadow</div>
                <div className="edit-item__content">
                  <Form.Item name={SHADOW_FIELD}>
                    <Select
                      className="base-input slect-with-icon"
                      onChange={debounceUpdateText}
                    >
                      {noneOptionElement}
                      {COLOR_OPTIONS.map(({ text, value }) => (
                        <Option key={value} value={value}>
                          <div style={colorOptionsWrapperStyle}>
                            <div
                              className="circle-color"
                              style={colorOptionsStyle(value)}
                            ></div>
                            {text}
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter="19">
              <Col className="text-edit-item" span="12">
                <div className="edit-item__title">Letter spacing</div>
                <div className="edit-item__content">
                  <div className="input-group">
                    <div
                      className="input-prepend-icon"
                      onClick={() => {
                        changeRangeValue(CHAR_SPACING_FIELD, -VALUE_STEP_SIZE);
                      }}
                    >
                      <i className="far fa-minus"></i>
                    </div>
                    <Form.Item name={CHAR_SPACING_FIELD}>
                      <Input
                        type="number"
                        onChange={debounceUpdateText}
                      ></Input>
                    </Form.Item>
                    <div
                      className="input-append-icon"
                      onClick={() => {
                        changeRangeValue(CHAR_SPACING_FIELD, VALUE_STEP_SIZE);
                      }}
                    >
                      <i className="far fa-plus"></i>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="text-edit-item" span="12">
                <div className="edit-item__title">Line height</div>
                <div className="edit-item__content">
                  <div className="input-group">
                    <div
                      className="input-prepend-icon"
                      onClick={() => {
                        changeRangeValue(LINE_HEIGHT_FIELD, -VALUE_STEP_SIZE);
                      }}
                    >
                      <i className="far fa-minus"></i>
                    </div>
                    <Form.Item name={LINE_HEIGHT_FIELD}>
                      <Input
                        type="number"
                        onChange={debounceUpdateText}
                      ></Input>
                    </Form.Item>
                    <div
                      className="input-append-icon"
                      onClick={() => {
                        changeRangeValue(LINE_HEIGHT_FIELD, VALUE_STEP_SIZE);
                      }}
                    >
                      <i className="far fa-plus"></i>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="text-edit-item" span="24">
                <div className="edit-item__title">Rotate</div>
                <div className="edit-item__content">
                  <div className="slider-wrapper">
                    <Form.Item name={ANGLE_FIELD}>
                      <Slider
                        min={-180}
                        max={180}
                        onChange={debounceUpdateText}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="arc-slider-row">
              <Col className="text-edit-item arc-control" span="24">
                <div className="edit-item__title">Arc</div>
                <div className="edit-item__content">
                  <div className="slider-wrapper">
                    <Form.Item name={ARC_FIELD}>
                      <Slider min={-180} max={180} />
                    </Form.Item>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </ListTextWrapper>
  );
});

export const ListTextWrapper = styled.div`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  .text-edit__title {
    cursor: pointer;
    margin-bottom: 15px;
    color: #333333;
    .edit-title {
      margin-left: 5px;
      font-weight: 500;
    }
  }
  .text-value {
    resize: none;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    outline: none;
    padding: 10px 11px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-select {
    width: 100%;
  }
  .ant-slider {
    padding: 0;
    margin: -10px 6px 0 6px;
  }
  .slect-with-icon {
    .ant-select-selector {
      padding: 0 0 0 6px;
      display: flex;
      .ant-select-selection-item {
        padding-right: 0;
        display: inline-flex;
        align-items: center;
      }
    }
    .ant-select-arrow {
      right: 6px;
    }
  }
  .ant-select-item-option-content {
    display: flex;
    align-items: center !important;
  }
  .ant-slider:hover .ant-slider-track,
  .ant-slider-track {
    background: #ebebf0;
    height: 6px;
  }
  .ant-slider-rail {
    height: 6px;
  }
  .ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open) {
    border-color: #ebebf0;
  }
  .ant-slider-handle {
    border: 1px solid #ebebf0;
    box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.1);
    width: 18px;
    height: 18px;
  }
  .ant-input,
  .ant-select-selector {
    border: 1px solid #ebebf0 !important;
    border-radius: 4px !important;
    transition: all 0.2s !important;
  }
  .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    box-shadow: none !important;
  }
  .ant-select-selector .ant-select-selection-search-input {
    height: 32px !important;
  }
  .ant-input:focus,
  .ant-input-focused {
    box-shadow: none;
    border: 1px solid #40a9ff !important;
  }
  .text-edit-item {
    margin-top: 20px;
    .edit-item__content {
      margin-top: 10px;
    }
    .edit-item__title {
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.02rem;
    }
    .input-group {
      display: flex;
      input {
        border-radius: 0 !important;
      }
    }
    .input-prepend-icon,
    .input-append-icon {
      cursor: pointer;
      font-size: 12px;
      flex-grow: 1;
      flex-shrink: 0;
      width: 25px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ebebf0;
      border-radius: 4px;
      i {
        transition: all ease-out 0.15s;
        transform: scale(1);
      }
      &:active i {
        transform: scale(0.8);
      }
    }
    .input-prepend-icon {
      border-right: none !important;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }

    .input-append-icon {
      border-left: none !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .select-with-icon {
      padding: 0 9px 0 6px;
    }
    .circle-color {
      display: inline-flex;
      border-radius: 100%;
      width: 15px;
      height: 15px;
      margin-right: 4px;
    }
    .slider-wrapper {
      margin: 0 6px;
    }
  }
  .arc-control {
    margin-top: 7px;
  }
  .arc-slider-row {
    margin-top: -10px;
  }
`;
