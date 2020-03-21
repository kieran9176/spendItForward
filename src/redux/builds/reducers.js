import actions from './actions'

const initialState = {
  developResponse: null,
  masterResponse: null,
}

export default function buildsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT_BUILDS:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
