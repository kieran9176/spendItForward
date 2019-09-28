import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToMarkdown from 'draftjs-to-markdown';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Form, Input, Button, Radio, Select, Upload, Icon } from 'antd'
import styles from '../style.module.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { Dragger } = Upload

// const rawContentState = convertToRaw(editorState.getCurrentContent());
// const markup = draftToMarkdown(contentState, hashConfig, customEntityTransform, config);

@Form.create()
class AddForm extends React.Component {
  constructor(props) {
    super(props);
    const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { form } = this.props
    const { editorState } = this.state;

    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const markdown = draftToMarkdown(rawContentState)
    const html = draftToHtml(rawContentState)

    form.validateFields((err, values) => {
      if (err) {
        console.log(err)
      } else {
        console.log(values)
        console.log(markdown)
        console.log(html)
      }
    });
  };

  render() {
    const { form } = this.props
    const { editorState } = this.state;

    return (
      <Form className="mt-3" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <FormItem label="Title">
            {form.getFieldDecorator('title')(<Input placeholder="Post title" />)}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Type">
            {form.getFieldDecorator('type')(
              <RadioGroup>
                <Radio value="text">Text</Radio>
                <Radio value="video">Video</Radio>
                <Radio value="image">Image</Radio>
                <Radio value="audio">Audio</Radio>
                <Radio value="vimeo">Vimeo</Radio>
              </RadioGroup>,
            )}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Category">
            {form.getFieldDecorator('category', {
              initialValue: ['travel', 'lifestyle'],
            })(
              <Select
                mode="tags"
                size="default"
                placeholder="Select post category"
                style={{ width: '100%' }}
              />,
            )}
          </FormItem>
        </div>
        <div className="form-group">
          <div className={styles.editor}>
            <Editor
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>
        </div>
        <div className="form-group">
          <FormItem>
            {form.getFieldDecorator('Files')(
              <Dragger>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data
                  or other band files
                </p>
              </Dragger>,
            )}
          </FormItem>
        </div>
        <FormItem>
          <div className={styles.submit}>
            <span className="mr-3">
              <Button type="primary" htmlType="submit">
                Save and Post
              </Button>
            </span>
            <Button type="danger" htmlType="submit">
              Discard
            </Button>
          </div>
        </FormItem>
      </Form>
    )
  }
}

export default AddForm
