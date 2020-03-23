import React, { Component, useState } from 'react'
import { AutoComplete, Button, InputNumber, notification, Spin } from 'antd'
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
        setDisabled(false)
      }

      const searchYelp = async value => {
        setLoading(true)
        const yelpResponse = await searchBusinesses(value)
        setLoading(false)
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
        setAmountValue(value)
      }

      const [result, setResult] = useState([])
      const [disabled, setDisabled] = useState(true)
      const [loading, setLoading] = useState(false)

      const children = result.map(business => (
        <Option key={Math.random()} value={business.id}>
          {business.name}
        </Option>
      ))

      const spinStyle = {
        textAlign: 'center',
        borderRadius: '4px',
        margin: '20px 0',
        marginBottom: '20px',
        padding: '30px 50px',
      }

      const spin = (
        <Option key={Math.random()} style={{ backgroundColor: '#FFF' }}>
          <div style={spinStyle}>
            <Spin />
          </div>
        </Option>
      )

      const amountStyle = {
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
                defaultValue={amountValue}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={onChange}
                style={amountStyle}
                max={100}
                min={1}
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
            {loading ? spin : children}
          </AutoComplete>
          {amount()}
        </div>
      )
    }

    return (
      <div>
        <Helmet title="Landing" />
        <div className={`${styles.title} login-heading`}>
          <h1>
            <strong>SPEND IT FORWARD</strong>
          </h1>
        </div>
        <div className={styles.inner}>
          <Complete />
        </div>
      </div>
    )
  }
}

export default Landing
