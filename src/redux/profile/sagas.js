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
    const {username, articles, experience, references, intro, skills, coursework, leadership, posts, education, brags, assets} = profile;
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
        siteMetadata: [
          {
            id: "152ab450-df2e-440c-bdcb-a0af51e2d707",
            account_id: sub,
            development_url: "http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/",
            production_url: "http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/",
            destination_bucket: "development.kieranpaul.com",
            source_s3_bucket_path: "kieranpaul-source",
            theme: "Noah",
            themeID: "152ab450-df2e-440c-bdcb-a0af51e2d708"
          }
        ],
        sub,
        themeOptions: [
          {
            id: "152ab450-df2e-440c-bdcb-a0af51e2d708",
            productStatus: "new",
            productImg: "https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/Screen Shot 2020-01-05 at 12.14.27 PM.png",
            productName: "Noah",
            productPrice: "Free",
            productOldPrice: "$500",
            productNote: "Included with Subscription",
            productDemo: "http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/"
          },
          {
            id: "152ab450-df2e-440c-bdcb-a0af51e2d709",
            productStatus: "new",
            productImg: "https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/Screen Shot 2020-01-05 at 12.14.27 PM.png",
            productName: "Erik",
            productPrice: "Free",
            productOldPrice: "$500",
            productNote: "Included with Subscription",
            productDemo: "http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/"
          },
          {
            id: "152ab450-df2e-440c-bdcb-a0af51e2d710",
            productStatus: "new",
            productImg: "https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/Screen Shot 2020-01-05 at 12.14.27 PM.png",
            productName: "Greg",
            productPrice: "Free",
            productOldPrice: "$500",
            productNote: "Included with Subscription",
            productDemo: "http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/"
          }
        ]
      }
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
        siteMetadata: '',
        themeOptions: '',
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

export async function SAVE_POST({ payload }) {
  const { mutation, post } = payload;

  console.log("here's what we'll save:", payload);

  const response = editProfile(mutation, post);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify(mutation)
  });
}

export async function EDIT_PRIMARY({ payload }) {

  console.log("edit primary payload", payload);

  const response = editProfile("editAsset", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "assets")
  });
}

export async function EDIT_SECONDARY({ payload }) {
  // const { mutation, data } = payload

  console.log("edit secondary payload", payload);

  const response = editProfile("editAsset", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "assets")
  });
}

export async function SELECT_THEME({ payload }) {

  console.log("select theme", payload)

  return payload

}

export async function EDIT_EDUCATION({ payload }) {
  const response = editProfile("editEducation", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "education")
  });
  return payload
}

export async function DELETE_EDUCATION(payload) {
  const response = editProfile("deleteEducation", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "education")
  });
  return payload
}

export async function EDIT_ARTICLES({ payload }) {
  console.log("EDIT_ARTICLES SAGA", payload);
  const response = editProfile("editArticles", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "articles")
  });
  return payload
}

export async function DELETE_ARTICLES(payload) {
  console.log("DELETE_ARTICLES SAGA", payload);
  const response = editProfile("deleteArticle", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "articles")
  });
  return payload
}

export async function EDIT_EXPERIENCE({ payload }) {
  console.log("EDIT_EXPERIENCE SAGA", payload);
  const response = editProfile("editExperience", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "experience")
  });
  return payload
}

export async function DELETE_EXPERIENCE(payload) {
  console.log("DELETE_EXPERIENCE SAGA", payload);
  const response = editProfile("deleteExperience", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "experience")
  });
  return payload
}

export async function EDIT_LEADERSHIP({ payload }) {
  console.log("EDIT_LEADERSHIP SAGA", payload);
  const response = editProfile("editLeadership", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "leadership")
  });
  return payload
}

export async function DELETE_LEADERSHIP(payload) {
  console.log("DELETE_LEADERSHIP SAGA", payload);
  const response = editProfile("deleteLeadership", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "leadership")
  });
  return payload
}

export async function EDIT_BRAGS({ payload }) {
  console.log("EDIT_BRAGS SAGA", payload);
  const response = editProfile("editBrags", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "brags")
  });
  return payload
}

export async function DELETE_BRAGS(payload) {
  console.log("DELETE_BRAGS SAGA", payload);
  const response = editProfile("deleteBrag", payload);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify("success", "brags")
  });
  return payload
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_PROFILE, EDIT_PROFILE),
    takeEvery(actions.SAVE_POST, SAVE_POST),
    takeEvery(actions.EDIT_PRIMARY, EDIT_PRIMARY),
    takeEvery(actions.EDIT_SECONDARY, EDIT_SECONDARY),
    takeEvery(actions.SELECT_THEME, SELECT_THEME),
    takeEvery(actions.EDIT_EDUCATION, EDIT_EDUCATION),
    takeEvery(actions.DELETE_EDUCATION, DELETE_EDUCATION),
    takeEvery(actions.EDIT_ARTICLES, EDIT_ARTICLES),
    takeEvery(actions.DELETE_ARTICLES, DELETE_ARTICLES),
    takeEvery(actions.EDIT_EXPERIENCE, EDIT_EXPERIENCE),
    takeEvery(actions.DELETE_EXPERIENCE, DELETE_EXPERIENCE),
    takeEvery(actions.EDIT_LEADERSHIP, EDIT_LEADERSHIP),
    takeEvery(actions.DELETE_LEADERSHIP, DELETE_LEADERSHIP),
    takeEvery(actions.EDIT_BRAGS, EDIT_BRAGS),
    takeEvery(actions.DELETE_BRAGS, DELETE_BRAGS),
    takeEvery(actions.LOAD_CURRENT_PROFILE, LOAD_CURRENT_PROFILE),
  ])
}
