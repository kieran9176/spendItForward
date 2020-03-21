import { all, put, takeEvery } from 'redux-saga/effects'
import { editProfile, notify } from 'services/profile'
import actions from './actions'

export function* EDIT_SOCIALS({ payload }) {
  console.log('EDIT_SOCIALS SAGA', payload)

  const response = yield editProfile('editSocials', payload)

  const parsedResponse = response.map(asset => {
    return asset.data.updateSocial ? asset.data.updateSocial : asset.data.createSocial
  })

  console.log('parsedResponse', parsedResponse)

  if (response.error) {
    notify('failure')
  } else {
    yield put({
      type: 'socials/SET_STATE',
      intent: 'add/update',
      payload: [parsedResponse],
    })
    notify('success', 'assets')
  }
  return payload
}

export default function* rootSaga() {
  yield all([takeEvery(actions.EDIT_SOCIALS, EDIT_SOCIALS)])
}
