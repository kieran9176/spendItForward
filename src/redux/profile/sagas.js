// import { all, takeEvery, put, call } from 'redux-saga/effects'
import { all, takeEvery, put } from 'redux-saga/effects'
import { editProfile, currentAccountProfile, notify } from 'services/profile'
// import { editProfile, notify } from 'services/profile'
import actions from './actions'

export function* LOAD_CURRENT_PROFILE(sub) {
  yield put({
    type: 'profile/SET_STATE',
    payload: {
      loading: true,
    },
  });

  const profileResponse = yield currentAccountProfile(sub);

  // const profile = profileResponse.data.getProfile;

  // const profileResponse = {
  //   "data": {
  //     "getProfile": {
  //       "username": "Kieran",
  //       "first_name": "Kieran",
  //       "last_name": "Derfus",
  //       "articles": [
  //         {
  //           "title": "Uber / Lyft Off",
  //           "caption": "2019 was a terrible year for IPOs",
  //           "url": "https://google.com"
  //         }
  //       ],
  //       "references": [
  //         {
  //           "content": "Kieran has been a great addition to the team.",
  //           "author_name": "Fazir Manthodi",
  //           "author_company": "EY",
  //           "author_position": "Managing Director"
  //         },
  //         {
  //           "content": "Kieran has been a great addition to the team.",
  //           "author_name": "Ragav",
  //           "author_company": "EY",
  //           "author_position": "Senior 2"
  //         }
  //       ],
  //       "leadership": [
  //         {
  //           "position": "Philanthropy Chairman",
  //           "organization": "Alpha Sigma Phi",
  //           "id": "746083a0-94e6-47ed-bbc3-b5b2ed8e3923",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
  //         },
  //         {
  //           "position": "President",
  //           "organization": "Plead the Fifth",
  //           "id": "966142e8-1c98-438f-8ae9-ea61d3c835e7",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
  //         }
  //       ],
  //       "other": [
  //         {
  //           "id": "dea70429-5ba7-4521-b196-4142960d3ef4",
  //           "content": "{\"certification\":\"Reactive Microservices\"}"
  //         },
  //         {
  //           "id": "06676554-b773-462a-84e1-1e7a863fbddf",
  //           "content": "{\"certification\":\"AWS Certified Cloud Practioner\"}"
  //         }
  //       ],
  //       "intro": [
  //         {
  //           "content": "This for my sister, that for my maple. It's not going the road I'd known as a child of God ... nor to become stable. (So what if I lose? I'm satisfied)",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7",
  //           "id": "91a91833-ba96-44b8-ac4d-130717ef2dea"
  //         }
  //       ],
  //       "skills": [
  //         {
  //           "content": "Client Relationship Management",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7",
  //           "id": "1e910e47-731e-4482-933b-3cec2193a169"
  //         },
  //         {
  //           "content": "Product Management",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7",
  //           "id": "b6126fef-a0e8-49e5-95a5-e835a9df1b50"
  //         },
  //         {
  //           "content": "Investment Sourcing",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7",
  //           "id": "6881f9e4-9daf-4fec-b900-99b7fd312341"
  //         }
  //       ],
  //       "coursework": [
  //         {
  //           "id": "81226c4c-a499-4bcf-ae7a-87c09d845f04",
  //           "course_name": "Entrepreneurship",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
  //         },
  //         {
  //           "id": "a750d773-c5a6-496d-9289-cfde38e2a28b",
  //           "course_name": "Linear Algebra",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
  //         },
  //         {
  //           "id": "f293154b-e569-44ba-a12a-1734e44ca27b",
  //           "course_name": "Data Structures & Algorithms",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
  //         },
  //         {
  //           "id": "24b51052-ec9b-4703-8570-c342e5bcb7bc",
  //           "course_name": "Macroeconomics",
  //           "account_id": "dee652d3-30d5-460d-bea1-4e8df10101d7"
  //         }
  //       ],
  //       "contact": [
  //         {
  //           "email": "kieranderfus@gmail.com",
  //           "phone": "2015721988",
  //           "id": "b5d283ba-458c-4bab-afeb-9051c2f3655c"
  //         }
  //       ],
  //       "site_metadata": [
  //         {
  //           "development_url": "http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/",
  //           "production_url": "https://www.kieranpaul.com",
  //           "theme": "hugo"
  //         }
  //       ],
  //       "experience": [
  //         {
  //           "position": "Technical Co-Founder",
  //           "company": "Chune Supply",
  //           "link": "https://chunesupply.com",
  //           "start_date": "2018-01-01",
  //           "end_date": "2019-12-31",
  //           "id": "77e329f6-b2be-4898-97e8-7b0bfa7590d8"
  //         },
  //         {
  //           "position": "TAP Staff",
  //           "company": "EY",
  //           "link": "https://consulting.ey.com",
  //           "start_date": "2018-10-05",
  //           "end_date": "2019-12-31",
  //           "id": "cd532d29-90d9-4a70-bcf0-245712d21e59"
  //         }
  //       ]
  //     }
  //   }
  // }

  const profile = profileResponse.data.getProfile;

  if (profile) {
    const { username, articles, experience, references, intro, skills, coursework, leadership, posts } = profile
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
    })
  }
  yield put({
    type: 'profile/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export async function EDIT_PROFILE( { payload }) {
  const { mutation, data } = payload
  const response = editProfile(mutation, data);
  response.then(values => {
    if (values === "Could not update profile") notify("failure");
    else notify(mutation)
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_PROFILE, EDIT_PROFILE),
    takeEvery(actions.LOAD_CURRENT_PROFILE, LOAD_CURRENT_PROFILE),
  ])
}
