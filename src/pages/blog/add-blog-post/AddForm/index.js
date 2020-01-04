import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Form, Input, Icon, Row, Col } from 'antd'
import Avatar from 'components/ImageUpload/Avatar'
import SimpleStaticToolbarEditor from "../../../../components/Editor/SimpleToolbarEditor"
import styles from './style.module.scss'

const FormItem = Form.Item

@withRouter
@Form.create()
@connect(({ profile }) => ({ profile }))
@injectIntl
class AddForm extends React.Component {

  state = {
    showSearch: true,
    // searchText: '',
  };

  showLiveSearch = () => {
    setTimeout(() => {
      this.searchInput.focus()
    }, 100)
    this.setState({
      showSearch: true,
    })
  };

  hideLiveSearch = () => {
    this.searchInput.blur()
    this.setState({
      showSearch: false,
      // searchText: '',
    })
  };

  handleNode = node => {
    this.searchInput = node
  };

  getPost = () => {
    const {match, profile, form} = this.props;
    const { posts } = profile;
    let post = {};

    if (match.params.id) {

      post = posts.filter(_ => _.id === match.params.id).pop();

      const {id} = post;

      form.getFieldDecorator('id', {
        initialValue: id
      });
      return post
    }

    form.getFieldDecorator('id', {
      initialValue: null
    });
    return null
  };

  render() {

    const {
      intl: {formatMessage}
    } = this.props;
    const { form } = this.props;
    const { showSearch } = this.state;

    const post = this.getPost();

    return (
      <div className="d-inline-block mr-4">
        <Input
          className={styles.extInput}
          placeholder={formatMessage({id: 'topBar.typeToSearch'})}
          prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}} />}
          style={{width: 200}}
          onFocus={this.showLiveSearch}
        />
        <div
          className={`${
            showSearch ? `${styles.livesearch} ${styles.livesearchVisible}` : styles.livesearch
            }`}
          id="livesearch"
        >
          <button className={styles.close} type="button" onClick={this.hideLiveSearch}>
            <Link to='/blog/feed/'>
              <span className="utils__visibilityHidden">Закрыть</span>
              <i className="icmn-cross" />
            </Link>
          </button>
          <div className="container-fluid">
            <div className={styles.wrapper}>
              <div className={styles.logoContainer}>
                <img className={styles.logo} src="resources/images/logo.png" alt="" />
              </div>
              <div className={styles.logoContainer}>
                <Avatar form={form} post={post} />
              </div>
              <Row>
                <Col span={18}>
                  <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                      {form.getFieldDecorator('title', {
                        defaultValue: post ? post.title : "Insert Title ... "
                      })(
                        <input
                          type="title"
                          className={styles.searchInput}
                          id="titleInput"
                          placeholder="Title"
                          ref={this.handleNode}
                        />
                      )}
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <div className={styles.bodyInput}>
                <SimpleStaticToolbarEditor form={form} post={post} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddForm
