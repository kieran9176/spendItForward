/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
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
import Avatar from '../ImageUpload/Avatar'
import './Draft.css'
import './plugin.css'
import editorStyles from './editorStyles.css';
import styles from './style.module.scss'

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

const gridStyle = {
  width: '10%',
};

@connect(({ profile }) => ({ profile }))
class SavedStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      redirect: false,
      postID: null,
    }
  }

  async componentDidMount() {

    const { editor } = this.props;
    this.setState(editor);

    // try {
    //
    //   setInterval(async () => {
    //     this.setState({
    //       saving: true
    //     });
    //
    //     this.handleSubmit();
    //
    //     this.setState({
    //       saving: false
    //     });

        // if (res.data.createPost) {
        //   const postID = res.data.createPost.id;
        //   form.setFieldsValue({ id: postID });
        //   const post = form.getFieldsValue();
        //
        //   dispatch({
        //     type: 'profile/CREATE_POST',
        //     payload: {
        //       mutation: "createPost",
        //       data: { post }
        //     }
        //   });
        //
        //   this.setState({
        //     redirect: true,
        //     postID
        //   })
        // }

        // const { editorState, html, markdown, id } = this.state;

        // if (html) {
          // console.log(html);
          // console.log(editorState);
          // console.log(markdown);
          // console.log(id);
        // }

        // else {
          // console.log(html);
          // console.log(editorState);
          // console.log(markdown);
          // console.log(id);

          // form.setFieldsValue({id: res.data.updatePost.id});
          // const post = form.getFieldsValue();
          //
          // dispatch({
          //   type: 'profile/EDIT_POST',
          //   payload: {
          //     mutation: "updatePost",
          //     data: { post }
          //   }
          // });
        // }
      // }, 60000);
    //
    // } catch(e) {
    //   console.log(e);
    // }
  }

  handleSubmit = () => {


    // const { editorState } = this.state;
    // const { id } = form.getFieldsValue();

    // const rawContentState = convertToRaw(editorState.getCurrentContent());
    // const markdown = draftToMarkdown(rawContentState);
    // const html = draftToHtml(rawContentState);

    // this.setState({
    //   editorState,
    //   markdown,
    //   html,
    // })

    // const post = form.getFieldsValue();

    // if (id) {
    //   return API.graphql(graphqlOperation(mutations.updatePost, { input: post }))
    // }
    // return API.graphql(graphqlOperation(mutations.createPost, {
    //     input: {
    //       title: post.title,
    //       html: post.html,
    //       markdown: post.markdown,
    //       image_url: post.image_url,
    //       series: post.series,
    //       date_published: post.date_published
    //     }
    //   })
    // );
  };

  render() {
    const { saving, redirect, postID } = this.state;
    // const { match } = this.props;

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
    const contentBlock = htmlToDraft('<p>What&apos;s your story, morning glory?</p>');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
        changeCount: 0
      }
    }
  }

  componentDidMount () {
    const { match } = this.props;
    this.setFormState(match)
  }

  setFormState = (match) => {
    const { profile } = this.props;
    const { posts } = profile;
    const { params } = match;
    const { id } = params;
    let post = {};

    if (id) {
      [post] = posts.filter(postObj => postObj.id === id);
      console.log("setFormState post", post);

      const { html, markdown, url } = post;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState,
          html,
          markdown,
          id,
          url
        })
      }
    } else {
      this.setState(post)
    }
  };

  convertToReadable = (editorState) => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markdown = draftToMarkdown(rawContentState);
    const html = draftToHtml(rawContentState);

    return { html, markdown }
  };

  decideToDispatch = () => {
    const { changeCount } = this.state;
    // const { dispatch } = this.props;

    if (changeCount > 10) {

      const { editorState } = this.state;
      const { html, markdown } = this.convertToReadable(editorState);

      this.setState({
        html,
        markdown,
        changeCount: 0
      });

      console.log("DISPATCH THE FOLLOWING", this.state)

      // dispatch({
      //   type: 'profile/EDIT_POST_LOCALLY',
      //   payload: this.state
      // });

    }
  };

  onChange = (changeType, e) => {
    const { changeCount } = this.state;
    // const { dispatch } = this.props;

    if (changeType === "title") {
      e.preventDefault();
      this.decideToDispatch();
      this.setState({
        title: e.target.value,
        changeCount: changeCount + 1
      });
    }

    if (changeType === "editor") {
      this.decideToDispatch();
      this.setState({
        editorState: e,
        changeCount: changeCount + 1
      });
    }
  };

  focus = () => {
    this.editor.focus();
  };

  render() {

    const { editorState } = this.state;

    return (
      <div>
        <Avatar />
        <input
          type="title"
          className={styles.searchInput}
          id="titleInput"
          placeholder="Title"
          ref={this.handleNode}
          onChange={e => this.onChange("title", e)}
        />
        <div role="button" className={editorStyles.editor} onClick={this.focus} tabIndex={0} onKeyDown={this.focus}>
          <Row>
            <Col span={18}>
              <Editor
                editorState={editorState}
                onChange={editorStateObj => this.onChange("editor", editorStateObj)}
                plugins={plugins}
                ref={(element) => {
                  this.editor = element;
                }}
              />
            </Col>
            <SavedStatus editor={this.state} />
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
