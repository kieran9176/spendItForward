/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect } from 'react-redux'
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToMarkdown from 'draftjs-to-markdown';
import draftToHtml from 'draftjs-to-html';
import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import { Row, Col, Card, Divider } from 'antd'
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
      saved: "false",
    }
  }

  async componentDidMount() {
    const { dispatch } = this.props;

    try {

      setInterval(async () => {

        // this.setState({
        //   saving: true
        // });

        await this.handleSubmit();

        // this.setState({
        //   saving: false
        // });

        dispatch({
          type: 'profile/CURRENT_POST',
          payload: { saved: "true" }
        });

        this.setState({ saved: "true" })

      }, 30000);

    } catch(e) {
      console.log(e);
    }
  }

  componentWillReceiveProps(props) {
    const { profile } = props;
    const { currentPost } = profile;
    const { saved } = currentPost;
    this.setState({ saved })
  }

  handleSubmit = () => {

    const { profile, dispatch } = this.props;
    const { posts, currentPost } = profile;
    const { id, status } = currentPost;
    const post = posts.filter(postObj => postObj.id === id)[0];

    if (status === "true") {
      dispatch({
        type: 'profile/SAVE_POST',
        payload: {
          mutation: 'createPost',
          post
        }
      });
      dispatch({
        type: 'profile/CURRENT_POST',
        payload: { status: false, id }
      })
    } else {
      dispatch({
        type: 'profile/SAVE_POST',
        payload: {
          mutation: 'updatePost',
          post
        }
      })
    }
  };

  render() {
    // const { saving } = this.state;
    // const { profile } = this.props;
    // const { currentPost } = profile;
    const { saved } = this.state;

    // const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    if (saved === "true") {
      return (<p>Saved</p>)
    }
    return (<p>Saving every 30 seconds ...</p>)
    // return (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />)
  }
}

@connect(({ profile }) => ({ profile }))
export default class CustomToolbarEditor extends React.Component {

  constructor(props) {
    super(props);
    const contentBlock = htmlToDraft('<p>Let&apos;s hear it.</p>');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      }
    }
  }

  componentDidMount () {
    this.setFormState()
  }

  setFormState = () => {
    const { profile } = this.props;
    const { posts, currentPost } = profile;
    const { id } = currentPost;
    let post = {};

    if (id) {
      [post] = posts.filter(postObj => postObj.id === id);
      const { html, markdown, url, title } = post;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState,
          title,
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

  decideToDispatch = (state) => {
    const {dispatch} = this.props;
    if (state.html) {
      dispatch({
        type: 'profile/EDIT_POST_LOCALLY',
        payload: state
      });
      dispatch({
        type: 'profile/CURRENT_POST',
        payload: { saved: "false" }
      });
    }
  };

  onChange = (changeType, e) => {

    if (changeType === "title") {
      e.preventDefault();
      this.setState({
        title: e.target.value,
      });
      this.decideToDispatch(this.state);
    }

    if (changeType === "editor") {
      const {html, markdown} = this.convertToReadable(e);
      this.setState({
        editorState: e,
        html,
        markdown,
      });
      this.decideToDispatch(this.state);
    }
  };

  focus = () => {
    this.editor.focus();
  };

  render() {

    const { editorState, id, title } = this.state;

    return (
      <div>
        <Avatar type="postImage" id={id} />
        <input
          type="title"
          className={styles.searchInput}
          id="titleInput"
          placeholder="Title"
          ref={this.handleNode}
          defaultValue={title}
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
