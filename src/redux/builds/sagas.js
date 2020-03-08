import { all, put, takeEvery, delay } from 'redux-saga/effects'
import { listAmplifyJobs } from '../../services/website'
import actions from './actions'

const callListAmplifyJobs = async appId => {
  let developResponse = {
    status: 'PENDING',
  }
  let masterResponse = {
    status: 'PENDING',
  }

  if (appId) {
    developResponse = await listAmplifyJobs(appId, 'develop')
    masterResponse = await listAmplifyJobs(appId, 'master')
  }

  return { developResponse, masterResponse }
}

export function* EDIT_BUILDS({ payload }) {
  const { appId, developResponse, masterResponse } = payload

  if (developResponse.status === 'PENDING' || masterResponse.status === 'PENDING') {
    yield put({
      type: 'builds/SET_STATE',
      payload,
    })

    const response = yield callListAmplifyJobs(appId)

    yield put({
      type: 'builds/SET_STATE',
      payload: response,
    })
  } else {
    yield put({
      type: 'builds/SET_STATE',
      payload,
    })

    yield delay(10000)
    let response = yield callListAmplifyJobs(appId)

    yield put({
      type: 'builds/SET_STATE',
      payload: response,
    })

    yield delay(100000)
    response = yield callListAmplifyJobs(appId)

    yield put({
      type: 'builds/SET_STATE',
      payload: response,
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.EDIT_BUILDS, EDIT_BUILDS)])
}
