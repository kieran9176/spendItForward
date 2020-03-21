// import { getProfile as getProfileQuery } from 'services/profile'
import axios from 'axios'

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

export default searchBusinesses
