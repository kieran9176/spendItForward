import React, { Component, useState } from 'react'
import { AutoComplete } from 'antd'
import { Helmet } from 'react-helmet'
// import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import searchBusinesses from '../../../services/spend'

const { Option } = AutoComplete

@connect(({ user }) => ({ user }))
class Landing extends Component {
  render() {
    let typingTimer
    const doneTypingInterval = 1000

    const Complete = () => {
      const handleSelect = businessId => {
        const selectedBusiness = result.filter(business => business.id === businessId)[0]
        console.log(selectedBusiness)
      }

      const searchYelp = async value => {
        const yelpResponse = await searchBusinesses(value)
        const { businesses } = yelpResponse.data
        return businesses
      }

      const handleSearch = value => {
        clearTimeout(typingTimer)
        if (value) {
          typingTimer = setTimeout(doneTyping, doneTypingInterval, value)
        }
      }

      const doneTyping = async value => {
        const businesses = await searchYelp(value)
        let res = []

        if (!value) {
          res = []
        } else {
          res = businesses
        }
        setResult(res)
      }

      const [result, setResult] = useState([])

      const children = result.map(business => (
        <Option key={Math.random()} value={business.id}>
          {business.name}
        </Option>
      ))

      return (
        <AutoComplete
          style={{
            width: '100%',
          }}
          placeholder="Bars, Restaurants"
          onSearch={handleSearch}
          onSelect={handleSelect}
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
