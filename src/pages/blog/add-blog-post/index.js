import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Row, Col, Card, Divider, Button } from 'antd'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToMarkdown from 'draftjs-to-markdown'
import draftToHtml from 'draftjs-to-html'
import Editor from 'draft-js-plugins-editor'
import moment from 'moment'
import createToolbarPlugin from 'draft-js-static-toolbar-plugin'
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
} from 'draft-js-buttons'
import uuidv4 from 'uuid/v4'
import './styles/draft.css'
import './styles/plugin.css'
import editorStyles from './styles/editorStyles.css'
import styles from './styles/style.module.scss'

const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin
const plugins = [toolbarPlugin]

const gridStyle = {
  width: '10%',
}

class ToolbarComponent extends React.Component {
  render() {
    return (
      <Row type="flex" justify="space-between" align="bottom">
        <Col>
          <Divider dashed style={{ width: 850 }} />
          <Toolbar>
            {externalProps => (
              <Card size="small" style={{ width: 850, height: 68 }}>
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
            )}
          </Toolbar>
        </Col>
      </Row>
    )
  }
}

@withRouter
@connect(({ profile }) => ({ profile }))
@injectIntl
class BlogAddPost extends React.Component {
  constructor(props) {
    super(props)
    const contentBlock = htmlToDraft('<p>Let&apos;s hear it.</p>')
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState,
        showSearch: true,
      }
    }
  }

  componentDidMount() {
    this.setFormState()
  }

  setFormState = () => {
    const { profile } = this.props
    const { posts, currentPost } = profile
    const { id, status } = currentPost
    let post = {}

    if (status !== 'new') {
      ;[post] = posts.filter(postObj => postObj.id === id)
      const { html, markdown, url, title, draft } = post
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.setState({
          editorState,
          title,
          html,
          markdown,
          id,
          url,
          draft,
          status: 'existing',
        })
      }
    } else {
      const { title, markdown, html } = post
      this.setState({
        id,
        title,
        markdown,
        html,
        datePublished: post.date_published,
        status: 'new',
        draft: true,
      })
    }
  }

  setFormState1 = () => {
    const { id } = this.props

    if (id) console.log("there's an ID!")
    else {
      console.log("it's a new post")
      this.setState({})
    }
  }

  onSubmit = (e, context) => {
    e.preventDefault()
    const { dispatch } = this.props

    console.log(this.state)

    const { id, title, html, markdown, url, status } = this.state

    if (context === 'save') {
      dispatch({
        type: 'profile/EDIT_POST',
        payload: { id, title, html, markdown, url, status },
      })
    } else if (context === 'publish') {
      const date = moment().format('YYYY-MM-DD[T]HH:mm:ss')

      dispatch({
        type: 'profile/EDIT_POST',
        payload: { id, title, html, markdown, url, status, draft: false, date_published: date },
      })
    }

    this.setState({
      status: 'existing',
    })
  }

  convertToReadable = editorState => {
    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const markdown = draftToMarkdown(rawContentState)
    const html = draftToHtml(rawContentState)

    return { html, markdown }
  }

  onChange = (changeType, e) => {
    if (changeType === 'title') {
      e.preventDefault()
      this.setState({
        title: e.target.value,
      })
      // this.decideToDispatch(this.state)
    }

    if (changeType === 'editor') {
      const { html, markdown } = this.convertToReadable(e)
      this.setState({
        editorState: e,
        html,
        markdown,
      })
      // this.decideToDispatch(this.state)
    }
  }

  focus = () => {
    this.editor.focus()
  }

  hideLiveSearch = () => {
    this.setState({
      showSearch: false,
    })
  }

  render() {
    const { showSearch, editorState, title } = this.state
    const { dispatch, match } = this.props
    const { params } = match
    let { id, status } = params

    if (!id) {
      id = uuidv4()
      status = 'new'
    }

    dispatch({
      type: 'profile/CURRENT_POST',
      payload: { status, id, saved: 'false' },
    })

    return (
      <div className={styles.addPost}>
        <div className="d-inline-block mr-4">
          <div
            className={`${
              showSearch ? `${styles.livesearch} ${styles.livesearchVisible}` : styles.livesearch
            }`}
            id="livesearch"
          >
            <Link to="/blog/feed/">
              <button className={styles.close} type="button" onClick={this.hideLiveSearch}>
                <span className="utils__visibilityHidden">Закрыть</span>
                <i className="icmn-cross" />
              </button>
            </Link>
            <div className="container-fluid">
              <div className={styles.wrapper}>
                <div className={styles.logoContainer}>
                  <img className={styles.logo} src="resources/images/logo.png" alt="" />
                </div>
                <div className={styles.bodyInput}>
                  <div>
                    <input
                      type="title"
                      className={styles.searchInput}
                      id="titleInput"
                      placeholder="Title"
                      ref={this.handleNode}
                      defaultValue={title}
                      onChange={e => this.onChange('title', e)}
                    />
                    <div
                      role="button"
                      className={editorStyles.editor}
                      onClick={this.focus}
                      tabIndex={0}
                      onKeyDown={this.focus}
                    >
                      <Row>
                        <Col span={18}>
                          <Editor
                            editorState={editorState}
                            onChange={editorStateObj => this.onChange('editor', editorStateObj)}
                            plugins={plugins}
                            ref={element => {
                              this.editor = element
                            }}
                          />
                        </Col>
                      </Row>
                      <ToolbarComponent />
                    </div>
                  </div>
                </div>
                <Row>
                  <Button type="primary" onClick={e => this.onSubmit(e, 'save')}>
                    Save
                  </Button>
                  <Divider type="vertical" />
                  <Button type="secondary" onClick={e => this.onSubmit(e, 'publish')}>
                    Publish
                  </Button>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BlogAddPost
