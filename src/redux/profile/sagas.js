// import { all, takeEvery, put, call } from 'redux-saga/effects'
import { all, takeEvery, put } from 'redux-saga/effects'
// import { notification } from 'antd'
// import { login, currentAccountProfile, logout } from 'services/cognito-user'
// import { login, logout } from 'services/cognito-user'
import actions from './actions'

export function* LOAD_CURRENT_PROFILE() {
  yield put({
    type: 'profile/SET_STATE',
    payload: {
      loading: true,
    },
  })

  // const profile = yield call(currentAccountProfile(profile.attributes.sub))
  const profile = {
    "username": "Kieran",
    "firstName": "Kieran",
    "lastName": "Derfus",
    "articles": [
    {
      "title": "The Rising Tide",
      "caption": "Lifts All Boats",
      "url": "https://www.youtube.com/watch?v=1XB1BENAUWo"
    },
    {
      "title": "Just when I thought I was out ...",
      "caption": "They pull me back in.",
      "url": "https://www.youtube.com/watch?v=1XB1BENAUWo"
    }
  ],
    "references": [
    {
      "content": "Kieran has been a great addition to the team.",
      "author_name": "Fazir Manthodi",
      "author_company": "EY",
      "author_position": "Managing Director"
    },
    {
      "content": "Kieran has been a great addition to the team.",
      "author_name": "Ragav",
      "author_company": "EY",
      "author_position": "Senior 2"
    }
  ],
    "leadership": [
    {
      "position": "President",
      "organization": "Plead the 5th",
      "id": "5076334e-40b8-45c7-96f9-7e6952972cc0",
      "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
    }
  ],
    "other": [
    {
      "id": "dea70429-5ba7-4521-b196-4142960d3ef4",
      "content": "{\"certification\":\"Reactive Microservices\"}"
    },
    {
      "id": "06676554-b773-462a-84e1-1e7a863fbddf",
      "content": "{\"certification\":\"AWS Certified Cloud Practioner\"}"
    }
  ],
    "intro": [
    {
      "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
    }
  ]
}

  if (profile) {
    console.log("PROFILE: ", profile)
    const { username, firstName, lastName } = profile
    yield put({
      type: 'profile/SET_STATE',
      payload: {
        username,
        firstName,
        lastName,
      },
    })
  }
  yield put({
    type: 'profile/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* EDIT_PROFILE() {
  yield put({
    type: 'profile/SET_STATE',
    payload: {
      loading: true,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_PROFILE, EDIT_PROFILE),
    takeEvery(actions.LOAD_CURRENT_PROFILE, LOAD_CURRENT_PROFILE),
    LOAD_CURRENT_PROFILE(), // run once on app load to get user profile
  ])
}
