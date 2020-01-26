import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'react-draft-wysiwyg'
import { withRouter } from 'react-router-dom'
// import { API, graphqlOperation } from 'aws-amplify';
// import * as mutations from 'graphql/mutations'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToMarkdown from 'draftjs-to-markdown';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Form, Input, Button, Radio, Upload, Icon, message } from 'antd'
import AWS from "aws-sdk";
import styles from './style.module.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group
// const { Dragger } = Upload

// const rawContentState = convertToRaw(editorState.getCurrentContent());
// const markup = draftToMarkdown(contentState, hashConfig, customEntityTransform, config);

@withRouter
@Form.create()
@connect(({ profile }) => ({ profile }))
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
        fileList: [],
        uploading: false
      };
    }
  }

  componentDidMount () {
    const { form } = this.props
    const{ html } = form.getFieldsValue()

    console.log("HTML", html)

    // html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      })
    }
}

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props
    const { editorState } = this.state;

    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const markdown = draftToMarkdown(rawContentState)
    const html = draftToHtml(rawContentState)

    form.validateFields((err) => {
      if (err) {
        console.log(err)
      } else {
        console.log("SUCCESS")
        form.setFieldsValue({
          markdown,
          html,
          date_published: "2019-11-15"
        })

        const post = form.getFieldsValue()

        console.log("POST", post)

        dispatch({
          type: 'profile/EDIT_PROFILE',
          payload: {
            mutation: "updatePosts",
            data: { post }
          }
        });

        // const payload = form.getFieldsValue();

        // if (payload.id) API.graphql(graphqlOperation(mutations.updatePost, {input: payload }))
        // else {
        //   API.graphql(graphqlOperation(mutations.createPost, {input: payload }))
        //     .then(data => console.log("DATA", data))
        // }
      }
    });
  };

  onSuccess = (result, file) => {
    console.log("onSuccess", result, file.name);
  };

  onError = (err) => {
    console.log("onError", err);
  };

  onProgress = ({percent}, file) => {
    console.log("onProgress", `${percent}%`, file.name);
  };

  handleUpload = () => {
    const {fileList} = this.state;
    const formData = new FormData();
    const {form} = this.props;
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    AWS.config.update({

    });

    const S3 = new AWS.S3();

    const objParams = {
      Bucket: "cf-simple-s3-origin-cloudfrontfors3-273116933489",
      Key: `kieranpaul-source/${fileList[0].name}`,
      Body: fileList[0],
      ContentType: fileList[0].type
    };

    S3.putObject(objParams)
      .on("httpUploadProgress", ({loaded, total}) => {
        this.onProgress(
          {
            percent: Math.round((loaded / total) * 100)
          },
          fileList[0]
        );
      })
      .send((err, data) => {
        if (err) {
          this.onError();
          console.log("Something went wrong");
          console.log(err.code);
          console.log(err.message);
          this.setState({uploading: false})
        } else {
          console.log("data", data);
          this.onSuccess(data, fileList[0]);
          message.success(`${fileList[0].name} file uploaded successfully`);
          this.setState({uploading: false});
          const encoded = encodeURI(`https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/${fileList[0].name}`)
          form.setFieldsValue({
            image_url: encoded
          });
        }
      });
  };

  render() {
    const { form, match, profile } = this.props
    const { posts } = profile
    const { getFieldDecorator } = form
    const { editorState, uploading, fileList } = this.state

    console.log("ID", match.params.id)

    if (match.params.id) {
      getFieldDecorator('id', { initialValue: match.params.id })
      const post = posts.filter(_ => _.id === match.params.id ).pop()

      console.log("POST", post)

      getFieldDecorator('title', { initialValue: post.title })
      getFieldDecorator('caption', { initialValue: post.caption })
      getFieldDecorator('markdown', { initialValue: post.markdown })
      getFieldDecorator('html', { initialValue: post.html })
      getFieldDecorator('date_published', { initialValue: post.date_published })
      getFieldDecorator('series', { initialValue: post.series })
    }
    else {
      getFieldDecorator('id', {initialValue: null})
      getFieldDecorator('title', {initialValue: ""})
      getFieldDecorator('caption', {initialValue: ""})
      getFieldDecorator('markdown', {initialValue: ""})
      getFieldDecorator('html', {initialValue: '<p>Sing us a song, piano man.</p>'})
      getFieldDecorator('date_published', {initialValue: ""})
      getFieldDecorator('series', {initialValue: ""})
    }

    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <Form className="mt-3" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <FormItem label="Title">
            {form.getFieldDecorator('title')(<Input placeholder="Post title" />)}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Caption">
            {form.getFieldDecorator('caption')(<Input placeholder="Post caption" />)}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Type">
            {form.getFieldDecorator('series')(
              <RadioGroup>
                <Radio value="books">Book</Radio>
                <Radio value="experience">Experience</Radio>
              </RadioGroup>,
            )}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Cover Image">
            {form.getFieldDecorator('image_url', {
              initialValue: "",
            })(
              <div>
                <Upload {...props}>
                  <Button style={{marginRight: 16}}>
                    <Icon type="upload"/> Select File
                  </Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  style={{marginTop: 16}}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
              </div>
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
        <FormItem>
          <div className={styles.submit}>
            <span className="mr-3">
              <Button type="primary" htmlType="submit">
                Save
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
