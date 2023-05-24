/* eslint-disable no-unused-vars */
import React, { memo, useRef, useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import styled from 'styled-components/macro';
import { Form } from 'app/components';
import ReactQuill, { Quill } from 'react-quill';
import { uploadImage } from 'utils/request';
import 'react-quill/dist/quill.snow.css';
import { CustomSectionWrapper } from './styled';
const Item = Form.Item;

var Clipboard = Quill.import('modules/clipboard');
let Inline = Quill.import('blots/inline');
let BlockEmbed = Quill.import('blots/block/embed');
var Delta = Quill.import('delta');

class LinkBlot extends Inline {
  static create(url) {
    let node = super.create();
    node.setAttribute('href', url);
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(node) {
    return node.getAttribute('href');
  }
}
LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';

class VideoBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute('src', url);
    // Set non-format related attributes with static values
    node.setAttribute('frameBorder', '0');
    node.setAttribute('height', '400');
    node.setAttribute('width', '100%');
    node.setAttribute('allowFullScreen', true);

    return node;
  }

  static formats(node) {
    // We still need to report unregistered embed formats
    let format = {};
    if (node.hasAttribute('height')) {
      format.height = node.getAttribute('height');
    }
    if (node.hasAttribute('width')) {
      format.width = node.getAttribute('width');
    }
    return format;
  }

  static value(node) {
    return node.getAttribute('src');
  }

  format(name, value) {
    // Handle unregistered embed formats
    if (name === 'height' || name === 'width') {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'iframe';
Quill.register(LinkBlot);
Quill.register(VideoBlot);

// var QuillReact = new Quill('#editor');

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'align',
  'background',
  'color',
  'script',
];

const MyEditor = function MyEditor({ value, onChange }) {
  const [editorHtml, setEditorHtml] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // if (!editorHtml && value) setEditorHtml(value);
    if (value) setEditorHtml(value);
  }, [value]);

  const imageHandler = async () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();

      formData.append('image', file);

      // const fileName = file.name;

      const range = quill.current.getEditorSelection();
      setIsLoading(true);
      const res = await uploadImage(file);
      setIsLoading(false);
      quill.current
        .getEditor()
        .insertEmbed(range.index, 'image', res?.data?.origin);
    };
  };
  const quill = useRef(null);
  const modules = useRef({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        // [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
          { color: [] },
          { background: [] },
          { align: [] },
        ],
        // [{ color: [] }, { background: [] }, { align: [] }], // dropdown with defaults from theme
        // [{ direction: 'rtl' }], // text direction
        ['link'],
        ['image', 'video'],
        ['clean'],
      ],
      // video: {},
      // imageResize: true,
      bounds: document.body,
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        // matchVisual: false,
      },
      handlers: {
        image: imageHandler,
        // video: function (value) {
        //   var videos = document.querySelectorAll('.ql-video');
        //   for (let i = 0; i < videos.length; i++) {
        //     var embedContainer = document.createElement('div');
        //     embedContainer.setAttribute('class', 'embed-container');
        //     var parent = videos[i].parentNode;
        //     parent.insertBefore(embedContainer, videos[i]);
        //     embedContainer.appendChild(videos[i]);
        //   }
        //   // if (value) {
        //   //   var href = prompt('Enter the URL');
        //   //   quill?.current?.format('link', href);
        //   // } else {
        //   //   quill?.current?.format('link', false);
        //   // }
        // },
      },
    },
    // table: true,
  });

  const handleChange = value => {
    setEditorHtml(value);
    onChange(value);
  };

  // quill?.current?.enable(false);
  return (
    <Spin tip="Đang tải..." spinning={isLoading}>
      <CustomEditor>
        <ReactQuill
          ref={quill}
          // enable={false}
          // readOnly={true}
          theme="snow"
          modules={modules?.current}
          formats={formats}
          // bounds={'.app'}
          value={editorHtml || ''}
          placeholder="Mô tả sản phẩm"
          onChange={handleChange}
          // modules={{
          //   toolbar: {
          //     container: [
          //       [{ header: [1, 2, 3, 4, 5, 6, false] }],
          //       ['bold', 'italic', 'underline'],
          //       [{ list: 'ordered' }, { list: 'bullet' }],
          //       [{ align: [] }],
          //       ['link', 'image'],
          //       ['clean'],
          //       [{ color: [] }],
          //     ],
          //     handlers: {
          //       image: imageHandler,
          //     },
          //   },
          //   // table: true,
          // }}
        />
      </CustomEditor>
    </Spin>
  );
};
export default memo(function Description({
  layout,
  platform,
  styleWrapper = {},
  hiddenTitle,
}) {
  // const { setFieldsValue } = form;
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  return (
    <CustomSectionWrapper {...styleWrapper} mt={{ xs: 's4' }}>
      {hiddenTitle || <div className="title">Mô tả sản phẩm</div>}
      <div className="">
        <Row gutter={24}>
          <Col xs={24}>
            <Item
              name="description"
              label=""
              getValueFromEvent={normFile}
              valuePropName="value"
              {...layout}
              rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
                {
                  min: 50,
                  message: 'Description must be minimum 50 characters.',
                },
                {
                  max: platform === 'shopee' ? 3000 : 10000,
                  message: `Description must be maximum ${
                    platform === 'shopee' ? 3000 : 10000
                  } characters.`,
                },
              ]}
            >
              <MyEditor />
            </Item>
          </Col>
        </Row>
      </div>
    </CustomSectionWrapper>
  );
});

const CustomEditor = styled.div`
  .ql-editor {
    height: 20rem;
    .embed-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      max-width: 100%;
    }
    .embed-container iframe,
    .embed-container object,
    .embed-container embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .ql-color,
  .ql-background,
  .ql-align {
    line-height: 16px;
    /* margin-bottom: 5px; */
  }
  .ql-video {
    /* width: 100%; */
    /* height: 400px; */
  }
`;
