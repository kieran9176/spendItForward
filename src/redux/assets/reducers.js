import actions from './actions'

const initialState = []

export default function assetsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      if (state.length) {
        return state.map(asset => {
          if (asset.type !== action.payload.type) return asset
          return {
            ...asset,
            ...action.payload,
          }
        })
      }
      return [...state, ...action.payload]
    case actions.EDIT_ASSETS:
      return state.map(asset => {
        if (asset.type !== action.payload.type) return asset
        return {
          ...asset,
          ...action.payload,
        }
      })
    // if (action.payload.type === 'primary') {
    //   return state.map((asset => {
    //     if (asset.type !== 'primary') return asset;
    //     // else?
    //     return {
    //       ...asset,
    //       ...action.payload
    //     }
    //   }))
    // }
    // return [...state, ...action.payload];
    default:
      return state
  }
}
