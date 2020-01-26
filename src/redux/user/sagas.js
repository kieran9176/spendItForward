import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import Amplify, { Auth } from 'aws-amplify'
import awsmobile from 'aws-exports'
import { LOAD_CURRENT_PROFILE } from '../profile/sagas'
import actions from './actions'

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-2',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-2_2hwpEnfaj',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '4m03impsp8i9lmp6g6ko6ilmb2',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
  },
})

Amplify.configure(awsmobile)

export function* LOGIN({ payload }) {
  const { email, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const user = yield Auth.signIn(email, password)
    // .then(() => true)
    .catch(error => {
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
    yield call(LOAD_CURRENT_PROFILE, user)

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

  // const user = yield Auth.signUp(email, password, attributes)
  const user = yield Auth.signUp(signupPayload)
    // .then(() => true)
    .catch(error => {
      notification.warning({
        message: 'Not Authenticated',
        description: error.message,
      })
    })

  if (user) {
    notification.success({
      message: 'Logged In',
      description: 'You have successfully signed up for Éirí!',
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
    yield call(LOAD_CURRENT_PROFILE, user)

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

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  console.log('Aha!')

  const user = yield Auth.currentAuthenticatedUser()
    // .then(() => true)
    .catch(error => {
      console.log(error)
      notification.warning({
        message: 'Not Authenticated',
        description: 'Trying to hack us? We just took a picture of you! :)',
      })
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
    const { sub } = attributes

    // Call LOAD_CURRENT_PROFILE after we've fetched the 'sub' attribute from Cognito
    yield call(LOAD_CURRENT_PROFILE, user)

    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: sub,
        name: username,
        email: 'fake@gmail.com',
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
    .catch(err => console.log(err))

  // yield call(logout);
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
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
