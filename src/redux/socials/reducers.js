import actions from './actions'

const initialState = []

export default function socialsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      // return [...state, ...action.payload];
      return action.payload
    case actions.EDIT_SOCIALS:
      console.log('EDIT_SOCIALS REDUCER', action.payload)
      return action.payload
    default:
      return state
  }
}
