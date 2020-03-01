import { all, takeEvery, put } from 'redux-saga/effects'
import {
  editProfile,
  getProfile,
  createProfile,
  createProfileResources,
  notify,
} from 'services/profile'
import uuidv4 from 'uuid/v4'
import actions from './actions'

export function* LOAD_CURRENT_PROFILE(username, sub) {
  let profileResponse = yield getProfile(sub)

  if (!profileResponse.data.getProfile) {
    yield createProfile(username).then(async () => {
      profileResponse = await getProfile(sub)
      const id = uuidv4()
      createProfileResources(sub, id)
    })
  }

  const profile = profileResponse.data.getProfile

  if (profile) {
    const {
      articles,
      experience,
      references,
      intro,
      skills,
      coursework,
      leadership,
      posts,
      education,
      brags,
    } = profile
    let { assets } = profile
    if (!assets)
      assets = [{ id: null, type: 'primary', url: '' }, { id: null, type: 'secondary', url: '' }]

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
        education,
        brags,
        assets,
        siteMetadata: profile.site_metadata,
        sub,
        themeOptions: [
          {
            id: '152ab450-df2e-440c-bdcb-a0af51e2d708',
            productStatus: 'new',
            productImg:
              'https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/Screen Shot 2020-01-05 at 12.14.27 PM.png',
            productName: 'Noah',
            productPrice: 'Free',
            productOldPrice: '$500',
            productNote: 'Included with Subscription',
            productDemo: 'http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/',
          },
          {
            id: '152ab450-df2e-440c-bdcb-a0af51e2d709',
            productStatus: 'new',
            productImg:
              'https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/Screen Shot 2020-01-05 at 12.14.27 PM.png',
            productName: 'Erik',
            productPrice: 'Free',
            productOldPrice: '$500',
            productNote: 'Included with Subscription',
            productDemo: 'http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/',
          },
          {
            id: '152ab450-df2e-440c-bdcb-a0af51e2d710',
            productStatus: 'new',
            productImg:
              'https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/Screen Shot 2020-01-05 at 12.14.27 PM.png',
            productName: 'Greg',
            productPrice: 'Free',
            productOldPrice: '$500',
            productNote: 'Included with Subscription',
            productDemo: 'http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/',
          },
        ],
      },
    })

    yield put({
      type: 'profile/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
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
        siteMetadata: '',
        themeOptions: '',
        sub: '',
      },
    })

    yield put({
      type: 'profile/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export async function EDIT_PROFILE({ payload }) {
  const { mutation, data } = payload
  const response = editProfile(mutation, data)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify(mutation)
  })
}

export async function EDIT_NAME({ payload }) {
  console.log('EDIT_NAME data', payload)

  const response = editProfile('editName', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'name')
  })
}

export async function EDIT_POST({ payload }) {
  console.log("SAVE_POST here's what we'll save:", payload)

  const response = editProfile('editPost', payload)
  response.then(values => {
    console.log('editProfile RESPONSE', response)
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'posts')
  })
}

export async function EDIT_PRIMARY({ payload }) {
  console.log('edit primary payload', payload)

  const payloadObj = { id: payload.id, type: 'primary', url: payload.url }
  const response = editProfile('editAsset', payloadObj)

  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'assets')
  })
}

export async function EDIT_SECONDARY({ payload }) {
  console.log('edit secondary payload', payload)

  const payloadObj = { id: payload.id, type: 'secondary', url: payload.url }
  const response = editProfile('editAsset', payloadObj)

  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'assets')
  })
}

export async function EDIT_RESUME({ payload }) {
  console.log('edit resume payload', payload)

  const payloadObj = { id: payload.id, type: 'resume', url: payload.url }
  const response = editProfile('editAsset', payloadObj)

  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'assets')
  })
}

export async function SELECT_THEME({ payload }) {
  console.log('select theme', payload)

  return payload
}

export async function EDIT_EDUCATION({ payload }) {
  const response = editProfile('editEducation', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'education')
  })
  return payload
}

export async function DELETE_EDUCATION(payload) {
  const response = editProfile('deleteEducation', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'education')
  })
  return payload
}

export async function EDIT_ARTICLES({ payload }) {
  console.log('EDIT_ARTICLES SAGA', payload)
  const response = editProfile('editArticles', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'articles')
  })
  return payload
}

export async function DELETE_ARTICLES(payload) {
  console.log('DELETE_ARTICLES SAGA', payload)
  const response = editProfile('deleteArticle', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'articles')
  })
  return payload
}

export async function EDIT_REFERENCES({ payload }) {
  console.log('EDIT_REFERENCES SAGA', payload)
  const response = editProfile('editReferences', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'references')
  })
  return payload
}

export async function DELETE_REFERENCES(payload) {
  console.log('DELETE_REFERENCES SAGA', payload)
  const response = editProfile('deleteReference', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'references')
  })
  return payload
}

export async function EDIT_EXPERIENCE({ payload }) {
  console.log('EDIT_EXPERIENCE SAGA', payload)
  const response = editProfile('editExperience', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'experience')
  })
  return payload
}

export async function DELETE_EXPERIENCE(payload) {
  console.log('DELETE_EXPERIENCE SAGA', payload)
  const response = editProfile('deleteExperience', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'experience')
  })
  return payload
}

export async function EDIT_INTRO({ payload }) {
  console.log('EDIT_INTRO SAGA', payload)
  const response = editProfile('editIntro', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'Intro')
  })
  return payload
}

export async function EDIT_LEADERSHIP({ payload }) {
  console.log('EDIT_LEADERSHIP SAGA', payload)
  const response = editProfile('editLeadership', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'leadership')
  })
  return payload
}

export async function DELETE_LEADERSHIP(payload) {
  console.log('DELETE_LEADERSHIP SAGA', payload)
  const response = editProfile('deleteLeadership', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'leadership')
  })
  return payload
}

export async function EDIT_BRAGS({ payload }) {
  console.log('EDIT_BRAGS SAGA', payload)
  const response = editProfile('editBrags', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'brags')
  })
  return payload
}

export async function DELETE_BRAGS(payload) {
  console.log('DELETE_BRAGS SAGA', payload)
  const response = editProfile('deleteBrag', payload)
  response.then(values => {
    if (values === 'Could not update profile') notify('failure')
    else notify('success', 'brags')
  })
  return payload
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_PROFILE, EDIT_PROFILE),
    takeEvery(actions.EDIT_NAME, EDIT_NAME),
    takeEvery(actions.EDIT_POST, EDIT_POST),
    takeEvery(actions.EDIT_PRIMARY, EDIT_PRIMARY),
    takeEvery(actions.EDIT_SECONDARY, EDIT_SECONDARY),
    takeEvery(actions.EDIT_RESUME, EDIT_RESUME),
    takeEvery(actions.SELECT_THEME, SELECT_THEME),
    takeEvery(actions.EDIT_EDUCATION, EDIT_EDUCATION),
    takeEvery(actions.DELETE_EDUCATION, DELETE_EDUCATION),
    takeEvery(actions.EDIT_ARTICLES, EDIT_ARTICLES),
    takeEvery(actions.DELETE_ARTICLES, DELETE_ARTICLES),
    takeEvery(actions.EDIT_EXPERIENCE, EDIT_EXPERIENCE),
    takeEvery(actions.DELETE_EXPERIENCE, DELETE_EXPERIENCE),
    takeEvery(actions.EDIT_INTRO, EDIT_INTRO),
    takeEvery(actions.EDIT_LEADERSHIP, EDIT_LEADERSHIP),
    takeEvery(actions.DELETE_LEADERSHIP, DELETE_LEADERSHIP),
    takeEvery(actions.EDIT_BRAGS, EDIT_BRAGS),
    takeEvery(actions.DELETE_BRAGS, DELETE_BRAGS),
    takeEvery(actions.EDIT_REFERENCES, EDIT_REFERENCES),
    takeEvery(actions.DELETE_REFERENCES, DELETE_REFERENCES),
    takeEvery(actions.LOAD_CURRENT_PROFILE, LOAD_CURRENT_PROFILE),
  ])
}
