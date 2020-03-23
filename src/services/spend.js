import axios from 'axios'

let checkoutBaseUrl = ''
let checkoutRoute = ''
if (process.env.NODE_ENV === 'production') {
  checkoutBaseUrl = 'https://ksepaeguo0.execute-api.us-east-2.amazonaws.com/default'
  checkoutRoute = '/create-stripe-checkout'
} else {
  console.log('DEV ENVIRONMENT')
  checkoutBaseUrl = 'https://1tjoax1tti.execute-api.us-east-2.amazonaws.com/default'
  checkoutRoute = '/dev-create-stripe-checkout'
}

const spend = axios.create({
  baseURL: 'https://ksepaeguo0.execute-api.us-east-2.amazonaws.com/default',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_YELP_API_KEY,
  },
})

const searchBusinesses = async searchValue => {
  const payload = {
    params: {
      term: searchValue,
      location: 'Charlotte, NC',
    },
  }
  return spend.post('/search-yelp', payload)
}

const checkout = axios.create({
  baseURL: checkoutBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_STRIPE_API_KEY,
  },
})

const createStripeCheckout = async businessObj => {
  return checkout.post(checkoutRoute, businessObj)
}

export { searchBusinesses, createStripeCheckout }
