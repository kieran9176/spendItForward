import { getProfile as getProfileQuery } from 'services/profile'
import axios from 'axios'

const pbmgmt = axios.create({
  baseURL: 'https://i1nc1drhji.execute-api.us-east-2.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_EDIT_API_KEY,
  },
})

const createPayload = profile => {
  const { getProfile } = profile.data
  const {
    assets,
    coursework,
    leadership,
    references,
    skills,
    education,
    experience,
    articles,
    intro,
    socials,
    posts,
  } = getProfile

  return {
    languageCode: 'en-us',
    baseURL: 'http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/',
    title: `${getProfile.first_name} ${getProfile.last_name}`,
    params: {
      first_name: getProfile.first_name,
      last_name: getProfile.last_name,
      build: 'development',
      middleInitial: '_éi',
      lastInitial: 'rí_',
      email: 'kieranderfus@gmail.com',
      site_metadata: getProfile.site_metadata,
      assets,
      coursework,
      leadership,
      references,
      skills,
      education,
      experience,
      articles,
      intro,
      socials,
      posts,
    },
  }
}

export async function triggerDevelopmentBuild(sub) {
  const profileResponse = getProfileQuery(sub)

  console.log('TRIGGER DEV BUILD')

  profileResponse.then(profileObj => {
    const payload = createPayload(profileObj)

    console.log('Payload', payload)

    pbmgmt
      .post('/edit-config', payload)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export async function triggerProductionBuild(profile) {
  console.log(profile)
}
