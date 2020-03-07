import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Row } from 'antd'
import uuidv4 from 'uuid/v4'
import './styles/draft.css'
import './styles/plugin.css'
import styles from './styles/style.module.scss'
import Avatar from '../../components/ImageUpload/Avatar'

@withRouter
@connect(({ profile }) => ({ profile }))
@injectIntl
class FirstTimeLogin extends React.Component {
  state = {
    showSearch: true,
    firstName: null,
    lastName: null,
  }

  onChange = (changeType, e) => {
    const { dispatch } = this.props
    const { firstName } = this.state

    e.preventDefault()
    if (changeType === 'firstName') {
      this.setState({
        firstName: e.target.value,
      })
    } else if (changeType === 'lastName') {
      this.setState({
        lastName: e.target.value,
      })
      dispatch({
        type: 'profile/EDIT_FIRST_TIME_LOGIN',
        payload: { firstName, lastName: e.target.value, status: true },
      })
    }
  }

  focus = () => {
    this.editor.focus()
  }

  showLastName = () => {
    const { firstName } = this.state
    if (firstName) {
      return (
        <input
          type="title"
          className={styles.firstTimeInput}
          id="lastNameInput"
          placeholder="Last Name"
          ref={this.handleNode}
          onChange={e => this.onChange('lastName', e)}
        />
      )
    }
    return null
  }

  showImageUpload = () => {
    const { firstName, lastName } = this.state
    if (firstName && lastName) {
      return (
        <Row>
          <div className={styles.firstTimeBody}>
            <div className={styles.searchInput}>
              <h2>Mind uploading a pic?</h2>
            </div>
            <Avatar type="Primary" />
          </div>
        </Row>
      )
    }
    return null
  }

  render() {
    const { showSearch, firstName } = this.state
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
            <div className="container-fluid">
              <div className={styles.wrapper}>
                <div className={styles.logoContainer}>
                  <img className={styles.logo} src="resources/images/logo.png" alt="" />
                </div>
                <Row>
                  <div className={styles.firstTimeBody}>
                    <div className={styles.searchInput}>
                      Welcome,
                      <input
                        type="title"
                        className={styles.firstTimeInput}
                        id="firstNameInput"
                        placeholder="First Name"
                        ref={this.handleNode}
                        onChange={e => this.onChange('firstName', e)}
                        style={{ width: firstName ? `${firstName.length * 24.1}px` : '30%' }}
                      />
                      {this.showLastName()}
                    </div>
                  </div>
                </Row>
                {this.showImageUpload()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FirstTimeLogin
