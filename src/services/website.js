import { getProfile as getProfileQuery } from 'services/profile'
import AWS from 'aws-sdk'
import axios from 'axios'

const pbmgmt = axios.create({
  baseURL: 'https://i1nc1drhji.execute-api.us-east-2.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_EDIT_API_KEY,
  },
})

const buildStatusApi = axios.create({
  baseURL: 'https://i1nc1drhji.execute-api.us-east-2.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_GET_BUILD_STATUS_API_KEY,
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
      middleInitial: 'CY',
      lastInitial: 'PG',
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

  profileResponse.then(profileObj => {
    const payload = createPayload(profileObj, email)

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

export async function triggerProductionBuild(accountId, repoUrl) {
  const repoName = repoUrl.substr(37)

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  })

  AWS.config.update({ region: 'us-east-2' })

  const payload = JSON.stringify(`{\"accountId\": \"${accountId}\",\"repoName\": \"${repoName}\"}`)

  const params = {
    Message: payload /* required */,
    TopicArn: 'arn:aws:sns:us-east-2:273116933489:create-and-merge-pr-sns',
  }

  // Create promise and SNS service object
  const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise()

  // Handle promise's fulfilled/rejected states
  publishTextPromise
    .then(function(data) {
      console.log(`MessageID is ${data.MessageId}`)
    })
    .catch(function(err) {
      console.error(err, err.stack)
    })
}

export async function listAmplifyJobs(appId, branchName) {
  if (appId !== 'PENDING' && branchName) {
    const payload = {
      appId,
      branchName,
    }
    const response = await buildStatusApi.post('/get-build-status', payload)

    if (response.data === '') {
      return { status: 'SUCCEED' }
    }
    return response.data
  }
  return { status: 'PENDING' }
}
