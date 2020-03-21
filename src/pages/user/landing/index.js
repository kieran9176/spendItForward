import React, { Component, useState } from 'react'
import { AutoComplete } from 'antd'
import { Helmet } from 'react-helmet'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

const { Option } = AutoComplete

@connect(({ user }) => ({ user }))
class Landing extends Component {
  onSubmit = event => {
    event.preventDefault()
    console.log(event.values)
  }

  render() {
    const Complete = () => {
      const [result, setResult] = useState([])

      const handleSearch = value => {
        let res = []

        if (!value || value.indexOf('@') >= 0) {
          res = []
        } else {
          res = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`)
        }

        setResult(res)
      }

      const children = result.map(email => (
        <Option key={email} value={email}>
          {email}
        </Option>
      ))

      return (
        <AutoComplete
          style={{
            width: '100%',
          }}
          onSearch={handleSearch}
          placeholder="Bars, Restaurants"
        >
          {children}
        </AutoComplete>
      )
    }

    return (
      <div>
        <Helmet title="Login" />
        <div className={`${styles.title} login-heading`}>
          <h1>
            <strong>SPEND IT --&gt; FORWARD</strong>
          </h1>
          <p>
            <strong>Let&#39;s get started.</strong>
          </p>
        </div>
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <Complete />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing
