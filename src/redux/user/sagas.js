import { all, takeEvery, put, call, delay } from 'redux-saga/effects'
import { notification } from 'antd'
import Amplify, { Auth } from 'aws-amplify'
import awsmobile from 'aws-exports'
import AWS from 'aws-sdk'
import util from 'util'
import { LOAD_CURRENT_PROFILE } from '../profile/sagas'
import actions from './actions'

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-2',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-2_NxYax0giI',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2tqnr5livk9hffpi3uu407ue7d',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
  },
})

Amplify.configure(awsmobile)

AWS.config.update({
  accessKeyId: process.env.REACT_APP_COGNITO_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_COGNITO_SECRET_ACCESS_KEY,
  region: 'us-east-2',
})

const cognito = new AWS.CognitoIdentityServiceProvider()

export function* LOGIN({ payload }) {
  const { email, password } = payload

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const user = yield Auth.signIn(email, password).catch(error => {
    notification.warning({
      message: 'Not Authenticated',
      description: error.message,
    })
  })

  if (user) {
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in to your Éirí console!',
    })

    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: true,
      },
    })

    const { username, attributes } = user
    const { sub } = attributes

    // Call LOAD_CURRENT_PROFILE after we've fetched the 'sub' attribute from Cognito
    yield call(LOAD_CURRENT_PROFILE, username, sub)

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
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOGIN_AFTER_SIGNUP(userSub, username, email, password) {
  const params = {
    UserPoolId: 'us-east-2_NxYax0giI',
    Username: username,
  }

  const adminGetUserAsync = util.promisify(cognito.adminGetUser.bind(cognito))
  const { UserStatus } = yield adminGetUserAsync(params).catch(err => console.log(err))

  if (UserStatus === 'CONFIRMED') {
    const payloadObj = {
      payload: {
        email,
        password,
      },
    }
    yield call(LOGIN, payloadObj)
  } else {
    console.log('check again')
    yield delay(5000)
    yield call(LOGIN_AFTER_SIGNUP, userSub, username, email, password)
  }
}

export function* SIGNUP({ payload }) {
  const { email, password } = payload

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const signupPayload = {
    username: email,
    password,
    attributes: {
      email: '',
    },
  }

  const userObj = yield Auth.signUp(signupPayload)
    // .then(() => true)
    .catch(error => {
      notification.warning({
        message: 'Not Authenticated',
        description: error.message,
      })
    })

  if (userObj) {
    notification.success({
      message: 'Signed Up',
      description: `Please verify ${email}`,
    })

    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: true,
      },
    })

    const { user } = userObj
    const { username } = user
    const { userSub } = userObj

    yield call(LOGIN_AFTER_SIGNUP, userSub, username, email, password)
  } else {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
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

  const user = yield Auth.currentAuthenticatedUser().catch(error => {
    console.log(error)
  })

  if (user) {
    notification.success({
      message: 'Logged In',
      description: 'You have successfully confirmed authentication.',
    })

    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: true,
      },
    })

    const { username, attributes } = user
    const { sub, email } = attributes

    // Call LOAD_CURRENT_PROFILE after we've fetched the 'sub' attribute from Cognito
    yield call(LOAD_CURRENT_PROFILE, username, sub)

    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: sub,
        name: username,
        email,
        avatar: null,
        role: 'Administrator',
        authorized: true,
      },
    })

    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: '',
        name: '',
        role: '',
        email: '',
        avatar: '',
        authorized: false,
      },
    })

    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOGOUT() {
  yield Auth.signOut()
    .then(() => true)
    .catch(err => console.log('logout error', err))

  console.log('hit user logout saga')

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
    takeEvery(actions.SIGNUP, SIGNUP),
    takeEvery(actions.LOGIN_AFTER_SIGNUP, LOGIN_AFTER_SIGNUP),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
