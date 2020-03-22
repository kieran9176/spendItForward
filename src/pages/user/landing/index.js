import React, { Component, useState } from 'react'
import { AutoComplete, Button, InputNumber, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { loadStripe } from '@stripe/stripe-js'
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
      const [amountValue, setAmountValue] = useState(10)

      const handleCheckout = async () => {
        const stripe = await loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_API_KEY}`)
        const session = await createStripeCheckout({ ...SelectedBusiness, ...{ amountValue } })
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.data.id,
        })
        if (error) {
          notification.error({
            message: 'Checkout Error',
            description: error,
          })
        }
      }

      const handleSelect = businessId => {
        const selectedBusinessObj = result.filter(business => business.id === businessId)[0]
        setSelectedBusiness(selectedBusinessObj)
        setVisible(true)
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

      const onChange = value => {
        console.log('value!', value)
        setDisabled(false)
        setAmountValue(value)
      }

      const [result, setResult] = useState([])
      const [visible, setVisible] = useState(false)
      const [disabled, setDisabled] = useState(true)

      const children = result.map(business => (
        <Option key={Math.random()} value={business.id}>
          {business.name}
        </Option>
      ))

      const amountStyle = {
        fontSize: 20,
        size: 'large',
        width: '100%',
      }

      const buttonStyle = {
        width: '100%',
      }

      const amount = () => {
        return (
          <div>
            <div className="form-actions">
              <InputNumber
                defaultValue={10}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={onChange}
                style={amountStyle}
              />
            </div>
            <div className="form-actions">
              <Button
                type="primary"
                onClick={handleCheckout}
                style={buttonStyle}
                disabled={disabled}
              >
                Checkout
              </Button>
            </div>
          </div>
        )
      }

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
          {visible ? amount() : null}
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
