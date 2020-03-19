import { all, put, takeEvery } from 'redux-saga/effects'
import { editProfile, notify } from 'services/profile'
import actions from './actions'

export function* EDIT_ASSETS({ payload }) {
  // do something async
  console.log('EDIT_ASSETS PAYLOAD', payload)

  const payloadObj = { id: payload.id, type: payload.type, url: payload.url }
  const response = yield editProfile('editAsset', payloadObj)

  if (response.error) {
    notify('failure')
  } else {
    yield put({
      type: 'assets/SET_STATE',
      payload: {
        type: payload.type,
        url: response.data.updateAsset.url,
        id: response.data.updateAsset.id,
      },
    })
    notify('success', 'assets')
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.EDIT_ASSETS, EDIT_ASSETS)])
}
