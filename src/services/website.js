import { getProfile as getProfileQuery } from 'services/profile'
import axios from 'axios'

const pbmgmt = axios.create({
  baseURL: 'https://i1nc1drhji.execute-api.us-east-2.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_EDIT_API_KEY,
  },
})

const createPayload = (profile, email) => {
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
    baseURL: getProfile.site_metadata.development_url,
    title: `${getProfile.first_name} ${getProfile.last_name}`,
    params: {
      first_name: getProfile.first_name,
      last_name: getProfile.last_name,
      middleInitial: 'AW',
      lastInitial: 'MC',
      email,
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

export async function triggerDevelopmentBuild(sub, email) {
  const profileResponse = getProfileQuery(sub)

  console.log('TRIGGER DEV BUILD')

  profileResponse.then(profileObj => {
    const payload = createPayload(profileObj, email)

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
