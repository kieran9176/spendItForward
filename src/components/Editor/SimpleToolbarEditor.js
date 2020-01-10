/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'graphql/mutations'
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToMarkdown from 'draftjs-to-markdown';
import draftToHtml from 'draftjs-to-html';
import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import { Row, Col, Card, Divider, Spin, Icon } from 'antd'
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  CodeBlockButton,
} from 'draft-js-buttons';
import './Draft.css'
import './plugin.css'
import editorStyles from './editorStyles.css';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];
// const text = 'In this editor a toolbar shows up once you select part of the text …';

const gridStyle = {
  width: '10%',
};

@connect(({ profile }) => ({ profile }))
class SavedStatus extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      redirect: false,
      postID: null
    }
  }

  async componentDidMount() {
    const { form, dispatch } = this.props;

    try {

      setInterval(async () => {
        this.setState({
          saving: true
        });

        const res = await this.handleSubmit();

        this.setState({
          saving: false
        });

        if (res.data.createPost) {
          const postID = res.data.createPost.id;
          form.setFieldsValue({ id: postID });
          const post = form.getFieldsValue();

          dispatch({
            type: 'profile/CREATE_POST',
            payload: {
              mutation: "createPost",
              data: { post }
            }
          });

          this.setState({
            redirect: true,
            postID
          })
        }

        else {
          form.setFieldsValue({id: res.data.updatePost.id});
          const post = form.getFieldsValue();

          dispatch({
            type: 'profile/EDIT_POST',
            payload: {
              mutation: "updatePost",
              data: { post }
            }
          });
        }
      }, 30000);

    } catch(e) {
      console.log(e);
    }
  }

  handleSubmit = () => {

    const { form, editorState } = this.props;
    const { id } = form.getFieldsValue();

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markdown = draftToMarkdown(rawContentState);
    const html = draftToHtml(rawContentState);

    form.validateFields ((err) => {
      if (err) {
        console.log(err)
      }

      form.setFieldsValue({
        markdown,
        html,
      });
    });

    const post = form.getFieldsValue();

    if (id) {
      return API.graphql(graphqlOperation(mutations.updatePost, { input: post }))
    }
    return API.graphql(graphqlOperation(mutations.createPost, {
        input: {
          title: post.title,
          html: post.html,
          markdown: post.markdown,
          image_url: post.image_url,
          series: post.series,
          date_published: post.date_published
        }
      })
    );
  };

  render() {
    const { saving, redirect, postID } = this.state;

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    if (redirect) {
      return <Redirect to={`/blog/edit-blog-post/${postID}`} />
    }
    if (saving) {
      return (<Spin indicator={antIcon} />)
    }
    return (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />)
  }
}

@connect(({ profile }) => ({ profile }))
export default class CustomToolbarEditor extends React.Component {

  constructor(props) {
    super(props);

    const { post } = props;
    let html = '<p>What&apos;s your story, morning glory?</p>';

    if (post) {
      const existingHTML = post.html;
      html = existingHTML;
    }

    const contentBlock = htmlToDraft(html);

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState
      }
    }
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {

    const { editorState } = this.state;
    const { form, post } = this.props;

    form.getFieldDecorator('html', {
      initialValue: post ? post.html : <p>What&apos;s your story?</p>
    });

    form.getFieldDecorator('markdown', {
      initialValue: post ? post.markdown : "What's your story?"
    });

    return (
      <div>
        <div role="button" className={editorStyles.editor} onClick={this.focus} tabIndex={0} onKeyDown={this.focus}>
          <Row>
            <Col span={18}>
              <Editor
                editorState={editorState}
                onChange={this.onChange}
                plugins={plugins}
                ref={(element) => {
                  this.editor = element;
                }}
              />
            </Col>
            <SavedStatus form={form} editorState={editorState} post={post} />
          </Row>
          <Row type="flex" justify="space-between" align="bottom">
            <Col>
              <Divider dashed style={{width: 850}} />
              <Toolbar>
                {
                  (externalProps) => (
                    <Card size="small" style={{width: 850, height: 68}}>
                      <Card.Grid style={gridStyle}>
                        <BoldButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <ItalicButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <UnderlineButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <CodeButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <UnorderedListButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <OrderedListButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <CodeBlockButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <HeadlineOneButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <HeadlineTwoButton {...externalProps} />
                      </Card.Grid>
                      <Card.Grid style={gridStyle}>
                        <HeadlineThreeButton {...externalProps} />
                      </Card.Grid>
                    </Card>
                  )
                }
              </Toolbar>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
