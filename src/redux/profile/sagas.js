import { all, takeEvery, put } from 'redux-saga/effects'
import { editProfile, currentAccountProfile, notify } from 'services/profile'
import actions from './actions'

export function* LOAD_CURRENT_PROFILE(sub) {
  yield put({
    type: 'profile/SET_STATE',
    payload: {
      loading: true
    }
  });

  const profileResponse = yield currentAccountProfile(sub);
  const profile = profileResponse.data.getProfile;

  console.log("profileResponse", profileResponse);

  if (profile) {
    const {username, articles, experience, references, intro, skills, coursework, leadership, posts} = profile
    yield put({
      type: 'profile/SET_STATE',
      payload: {
        username,
        firstName: profile.first_name,
        lastName: profile.last_name,
        articles,
        skills,
        experience,
        references,
        coursework,
        leadership,
        intro,
        posts,
        sub
      },
    });

    yield put({
      type: 'profile/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }

  else {

    yield put({
      type: 'profile/SET_STATE',
      payload: {
        username: '',
        firstName: '',
        lastName: '',
        articles: '',
        skills: '',
        experience: '',
        references: '',
        coursework: '',
        leadership: '',
        intro: '',
        posts: '',
        sub: ''
      }
    });

    yield put({
      type: 'profile/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export async function EDIT_PROFILE( { payload }) {
  const { mutation, data } = payload
  const response = editProfile(mutation, data);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify(mutation)
  });
}

export async function CREATE_POST( { payload }) {
  // const { mutation, data } = payload

  console.log("create post payload", payload)
  // const response = editProfile(mutation, data);
  // response.then(values => {
  //   if (values === "Could not update profile") notify("failure");
  //   else notify(mutation)
  // });
}

export async function EDIT_POST( { payload }) {
  // const { mutation, data } = payload

  console.log("create post payload", payload)

  // const response = editProfile(mutation, data);
  // response.then(values => {
  //   if (values === "Could not update profile") notify("failure");
  //   else notify(mutation)
  // });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_PROFILE, EDIT_PROFILE),
    takeEvery(actions.CREATE_POST, CREATE_POST),
    takeEvery(actions.EDIT_POST, EDIT_POST),
    takeEvery(actions.LOAD_CURRENT_PROFILE, LOAD_CURRENT_PROFILE),
  ])
}
