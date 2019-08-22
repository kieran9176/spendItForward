import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
// import { login, currentAccountProfile, logout } from 'services/cognito-user'
import { login, logout } from 'services/cognito-user'
import actions from './actions'

export function* LOGIN({ payload }) {
  const { email, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(login, email, password)
  if (success) {
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in to Clean UI React Admin Template!',
    })
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  // const account = yield call(currentAccount)
  const account = { username: "Kieran", attributes: {
    sub: "dee652d3-30d5-460d-bea1-4e8df10101d7",
    email: "kderfus@gmail.com"
  }}

  // const profile = yield call(currentAccountProfile(account.attributes.sub))

  console.log("RESPONSE:", account)
  // console.log("PROFILE:", profile)

  if (account) {
    console.log("ACCOUNT: ", account)
    const { username } = account
    const { sub, email } = account.attributes
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: sub,
        name: username,
        email,
        avatar: null,
        role: 'admin',
        authorized: true,
      },
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  yield call(logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
