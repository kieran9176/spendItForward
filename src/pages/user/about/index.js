import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import styles from './style.module.scss'

class About extends Component {
  render() {
    return (
      <div>
        <Helmet title="About" />
        <div className={`${styles.title} login-heading`}>
          <h1>
            <strong>SPEND IT FORWARD</strong>
          </h1>
        </div>
        <div className={styles.inner}>
          <div>
            As a result of COVID-19, small businesses are being forced to close down or slow
            operations. We give customers the ability to spend money with their local businesses in
            advance. Pay now, get your purchase when things are back to normal.
          </div>
        </div>
      </div>
    )
  }
}

export default About
