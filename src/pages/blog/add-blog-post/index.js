import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Form } from 'antd'
import SimpleStaticToolbarEditor from '../../../components/Editor/SimpleToolbarEditor'
import styles from './style.module.scss'

@withRouter
@Form.create()
@connect(({ profile }) => ({ profile }))
@injectIntl
class BlogAddPost extends React.Component {
  state = {
    showSearch: true,
  }

  hideLiveSearch = () => {
    this.setState({
      showSearch: false,
    })
  }

  render() {
    const { showSearch } = this.state
    const { form, match, dispatch } = this.props
    const { params } = match
    const { id, status } = params

    console.log('addForm match', match)

    if (status === 'true') {
      dispatch({
        type: 'profile/CREATE_POST',
        post: {
          id,
          html: '<p>Let&apos;s hear it.</p>',
          markdown: "Let's hear it.",
          url: '',
          title: 'Insert title ...',
          series: '',
        },
      })
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
                <Link to="/blog/feed/">
                  <span className="utils__visibilityHidden">Закрыть</span>
                  <i className="icmn-cross" />
                </Link>
              </button>
            </Link>
            <div className="container-fluid">
              <div className={styles.wrapper}>
                <div className={styles.logoContainer}>
                  <img className={styles.logo} src="resources/images/logo.png" alt="" />
                </div>
                <div className={styles.bodyInput}>
                  <SimpleStaticToolbarEditor form={form} match={match} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BlogAddPost
