/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'graphql/mutations'
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
// import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
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

class SavedStatus extends Component {

  constructor(props) {
    super(props)
    this.state = { saving: false }
  }

  componentDidMount () {
    console.log("called componentDidMount")
    this.handleSubmit()
      .then(apiResponse => {
        console.log("handle submit response", apiResponse);
        this.setState({ saving: false })
        this.waitAFewSeconds()
          .then(waitingOverResponse => {
            console.log(waitingOverResponse)
            this.setState({ saving: true })
            this.componentDidMount()
          })
      });
  }

  handleSubmit = () => {

    const { titleForm, editorState } = this.props

    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const markdown = draftToMarkdown(rawContentState)
    const html = draftToHtml(rawContentState)

    titleForm.validateFields ((err) => {
      if (err) {
        console.log(err)
      }
      titleForm.setFieldsValue({
        id: "4105afc5-9f34-43f2-81fc-87f09b1a6d58",
        title: "All Quiet on the Western Front",
        caption: "How you like me now?",
        markdown,
        html,
        date_published: "2019-11-15",
        series: "books"
      });
    });

    const post = titleForm.getFieldsValue()
    const { id } = post;
    if (id) {
      console.log("post with an ID", post)
      return API.graphql(graphqlOperation(mutations.updatePost, {input: post}))
    }
    return API.graphql(graphqlOperation(mutations.createPost, {input: post}));
  };

  waitAFewSeconds = () => {

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('waited 30 seconds');
      }, 30000);
    });
  };

  render() {
    const { saving } = this.state;

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    if (saving) {
      return (<Spin indicator={antIcon} />)
    }
    return (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />)
  }
}

export default class CustomToolbarEditor extends Component {

  constructor(props) {
    super(props);
    const html = '<p>Ever since I heard the howling wind ...</p>';
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

    const {editorState} = this.state
    const { titleForm } = this.props
    const { getFieldDecorator } = titleForm

    getFieldDecorator('id', {initialValue: null})
    getFieldDecorator('title', {initialValue: ""})
    getFieldDecorator('caption', {initialValue: ""})
    getFieldDecorator('markdown', {initialValue: ""})
    getFieldDecorator('html', {initialValue: '<p>Sing us a song, piano man.</p>'})
    getFieldDecorator('date_published', {initialValue: ""})
    getFieldDecorator('series', {initialValue: ""})

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
            <SavedStatus editorState={editorState} titleForm={titleForm} />
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
