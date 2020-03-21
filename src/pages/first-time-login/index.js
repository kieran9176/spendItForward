import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Row } from 'antd'
import './styles/draft.css'
import './styles/plugin.css'
import styles from './styles/style.module.scss'
import Avatar from '../../components/ImageUpload/Avatar'
import style from '../apps/profile/style.module.scss'
import NameForm from '../apps/profile/NameForm'

@withRouter
@connect(({ profile }) => ({ profile }))
class FirstTimeLogin extends React.Component {
  state = {
    showSearch: true,
  }

  focus = () => {
    this.editor.focus()
  }

  render() {
    const { showSearch } = this.state

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
                <h1>
                  <strong>Welcome to Frame.</strong>
                </h1>
                <h3>Enter your name and upload a picture, and we&apos;ll get started!</h3>
                <div className={style.profile}>
                  <div className="row">
                    <div className="col-xl-4">
                      <div className="card">
                        <hr />
                        <NameForm type="Name" />
                      </div>
                      <hr />
                      <div
                        className={`card ${style.header}`}
                        style={{ backgroundImage: `url("resources/images/photos/4.jpeg")` }}
                      >
                        <div className="card-body">
                          <Row gutter={24} className={style.imageRow}>
                            <Col span={12}>
                              <div className={style.imageLabel}>Primary</div>
                            </Col>
                            <Col span={12}>
                              <Avatar type="Primary" />
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FirstTimeLogin
