import React, { Component, useState } from 'react'
import { AutoComplete, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { loadStripe } from '@stripe/stripe-js'
// import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { searchBusinesses, createStripeCheckout } from '../../../services/spend'

const { Option } = AutoComplete

@connect(({ user }) => ({ user }))
class Landing extends Component {
  render() {
    let typingTimer
    const doneTypingInterval = 400

    const Complete = () => {
      const [SelectedBusiness, setSelectedBusiness] = useState({})

      const handleCheckout = async () => {
        const stripe = await loadStripe('pk_test_c9Cn5LjrnyRlocPlGdthMSKv003cAp3yZR')
        const session = await createStripeCheckout(SelectedBusiness)

        const { error } = await stripe.redirectToCheckout({
          sessionId: session.data.id,
        })

        if (error) {
          console.log('Yikes boss')
        }
      }

      const handleSelect = businessId => {
        const selectedBusinessObj = result.filter(business => business.id === businessId)[0]
        console.log(selectedBusinessObj)
        setSelectedBusiness(selectedBusinessObj)
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
        <div>
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
          <div className="form-actions">
            <Button type="primary" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </div>
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
