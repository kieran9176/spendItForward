import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
// import { login, currentAccountProfile, logout } from 'services/cognito-user'
// import { login, logout } from 'services/cognito-user'
import { logout } from 'services/cognito-user'
import { Auth } from 'aws-amplify';
import { LOAD_CURRENT_PROFILE } from "../profile/sagas"
import actions from './actions'

export function* LOGIN({payload}) {
  const {email, password} = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const user = yield Auth.signIn(email, password);

  console.log("User", user)

  // const success = yield call(login, email, password)

  if (user) {
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in to your Éirí console!',
    })

    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: true,
      }
    });

    const {username, attributes} = user


    // const { username } = account
    const {sub} = attributes

    // Call LOAD_CURRENT_PROFILE after we've fetched the 'sub' attribute from Cognito
    yield call(LOAD_CURRENT_PROFILE, sub)

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

    // yield put({
    //   type: 'user/LOAD_CURRENT_ACCOUNT',
    // })

    // yield call(LOAD_CURRENT_ACCOUNT, user)
  }
  else {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

// export function* LOAD_CURRENT_ACCOUNT() {
//
//   yield put({
//     type: 'user/SET_STATE',
//     payload: {
//       loading: true,
//     }
//   });
//
//   // const { username, attributes } = yield Auth.currentAuthenticatedUser();
//
//   const account = { username, attributes }
//
//   if (account) {
//
//     // const { username } = account
//     const { sub, email } = attributes
//
//     // Call LOAD_CURRENT_PROFILE after we've fetched the 'sub' attribute from Cognito
//     yield call(LOAD_CURRENT_PROFILE, sub)
//
//     yield put({
//       type: 'user/SET_STATE',
//       payload: {
//         id: sub,
//         name: username,
//         email,
//         avatar: null,
//         role: 'admin',
//         authorized: true,
//       },
//     })
//   }
//
//   yield put({
//     type: 'user/SET_STATE',
//     payload: {
//       loading: false,
//     },
//   })
// }

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
    // takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    // LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
