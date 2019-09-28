// import { all, takeEvery, put, call } from 'redux-saga/effects'
import { all, takeEvery, put } from 'redux-saga/effects'
import { editProfile } from 'services/profile'
import actions from './actions'

export function* LOAD_CURRENT_PROFILE(sub) {
  yield put({
    type: 'profile/SET_STATE',
    payload: {
      loading: true,
    },
  })

  // const profile = yield call(currentAccountProfile(profile.attributes.sub))

  const profile = {
    "username": "Kieran",
      "first_name": "Kieran",
      "last_name": "Derfus",
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
      "experience": [
      {
        "position": "Intern",
        "company": "Stifel",
        "start_date": "2015-01-01",
        "end_date": "2018-01-01",
        "id": "d7932c8a-f063-4dca-be48-a4eb3fc5804a"
      },
      {
        "position": "Intern",
        "company": "EY",
        "start_date": "2015-01-01",
        "end_date": "2018-01-01",
        "id": "73bdf560-401d-4e3b-8dca-1e48dcf160c8"
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
    const { username, firstName, lastName, articles, experience, references, intro } = profile
    yield put({
      type: 'profile/SET_STATE',
      payload: {
        username,
        firstName,
        lastName,
        articles,
        experience,
        references,
        intro,
        sub
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

export function EDIT_PROFILE( { payload }) {
  const { mutation, data } = payload
  try {
    editProfile(mutation, data)
  }
  catch (err) {
    console.log(err)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_PROFILE, EDIT_PROFILE),
    takeEvery(actions.LOAD_CURRENT_PROFILE, LOAD_CURRENT_PROFILE),
  ])
}
