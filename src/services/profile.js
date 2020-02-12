import { API, graphqlOperation } from 'aws-amplify'
import AWS from 'aws-sdk'
import { notification } from 'antd'
import * as mutations from 'graphql/mutations'
import * as queries from 'graphql/queries'

export function notify(status, type) {
  if (status === 'success') {
    notification.success({
      message: 'Updates Saved',
      description: `You\'ve successfully updated your ${type}.`,
    })
  } else {
    notification.error({
      message: 'Error',
      description:
        'Our team of highly trained monkeys has been dispatched to deal with the situation.',
    })
  }
}

export async function getProfile(accountId) {
  console.log('received the call', accountId)
  return API.graphql(graphqlOperation(queries.getProfile, { account_id: accountId }))
}

export async function createProfile(username) {
  console.log('create a new profile!')
  return API.graphql(
    graphqlOperation(mutations.createProfile, {
      input: {
        username,
        first_name: 'TBD FirstName',
        last_name: 'TBD LastName',
      },
    }),
  )
}

export async function createProfileResources(accountId, repoName) {
  console.log('hit createProfileResources')

  // const accountId = 'dee652d3-30d5-460d-bea1-4e8df10101d7';
  // const repoName = 'kieran-hugo-2';

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  })

  AWS.config.update({ region: 'us-east-2' })

  // Create publish parameters

  console.log(accountId)
  console.log(repoName)

  const payload = JSON.stringify(`{\"accountId\": \"${accountId}\",\"repoName\": \"${repoName}\"}`)

  // const params = {
  //   Message: JSON.stringify("{\"accountId\":\"abc123\",\"repoName\":\"kieran-hugo-2\"}"), /* required */
  //   TopicArn: 'arn:aws:sns:us-east-2:273116933489:create-repo-sns'
  // };

  // "{\"id\":\"fbf9c7db-76f0-47ae-a445-1cf8609aa009\",\"accountId\":\"dee652d3-30d5-460d-bea1-4e8df10101d7\",\"devUrl\":\"https://dev.fakeurl.com\",\"prodUrl\":\"https://prod.fakeurl.com\",\"theme\":\"noah\",\"appId\":\"appid123\",\"repoName\":\"kieran-hugo-2\"}"

  // accountId, devUrl, prodUrl, theme, appId, repoName

  const params = {
    Message: payload /* required */,
    TopicArn: 'arn:aws:sns:us-east-2:273116933489:create-repo-sns',
  }

  // Create promise and SNS service object
  const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise()

  // Handle promise's fulfilled/rejected states
  publishTextPromise
    .then(function(data) {
      console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`)
      console.log(`MessageID is ${data.MessageId}`)
    })
    .catch(function(err) {
      console.error(err, err.stack)
    })
}

const pop = obj => {
  if (!obj.id) {
    if (!delete obj.id) {
      throw new Error()
    }
  }
  if (!delete obj.changed) {
    throw new Error()
  }
  return obj
}

const filterData = (mutation, data) => {
  const { skills, coursework, post } = data

  switch (mutation) {
    case 'editExperience':
      console.log('updateExperience FILTER DATA', data)
      return data.filter(obj => obj.changed !== false)
    case 'editLeadership':
      console.log('updateLeadership FILTER DATA', data)
      return data.filter(obj => obj.changed !== false)
    case 'updateSkills':
      console.log('filterData skills', skills)
      return skills.filter(skillsObj => skillsObj.action)
    case 'updateCoursework':
      return coursework.filter(
        courseworkObj => courseworkObj.action === 'add' || courseworkObj.action === 'remove',
      )
    case 'editArticles':
      console.log('updateArticles FILTER DATA', data)
      return data.filter(articleObj => articleObj.changed !== false)
    case 'editBrags':
      console.log('editBrags FILTER DATA', data)
      return data.filter(bragObj => bragObj.changed !== false)
    case 'updatePosts':
      return post
    default:
      notification.error({
        message: 'Could not filter data.',
      })
      return 'Could not filter data.'
  }
}

const createPayloads = (mutation, data) => {
  switch (mutation) {
    case 'updateSkills':
      return data.map(skillsObj => {
        if (skillsObj.action === 'add') return { input: { content: skillsObj.content } }
        if (skillsObj.action === 'remove' && skillsObj.id) return { input: { id: skillsObj.id } }
        return null
      })
    case 'updateCoursework':
      return data.map(courseworkObj => {
        if (courseworkObj.action === 'add')
          return { input: { course_name: courseworkObj.course_name } }
        if (courseworkObj.action === 'remove' && courseworkObj.id)
          return { input: { id: courseworkObj.id } }
        return null
      })
    case 'updatePosts':
      console.log('POSTS CREATE PAYLOAD data', data)
      return data.id
        ? { input: data }
        : {
            input: {
              title: data.title,
              caption: data.caption,
              image_url: data.image_url,
              markdown: data.markdown,
              html: data.html,
              date_published: data.date_published,
              series: data.series,
            },
          }
    default:
      return 'Could not create payload'
  }
}

const performOperations = async (mutation, payloads) => {
  switch (mutation) {
    case 'editIntro':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            console.log('performOperations editIntro', payload)
            return API.graphql(graphqlOperation(mutations.updateIntro, { input: payload }))
          }
          payload = pop(payload)
          console.log('performOperations createIntro', payload)
          return API.graphql(graphqlOperation(mutations.createIntro, { input: payload }))
        }),
      )
    case 'editExperience':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            console.log('performOperations editExperience', payload)
            return API.graphql(graphqlOperation(mutations.updateExperience, { input: payload }))
          }
          payload = pop(payload)
          console.log('performOperations createExperience', payload)
          return API.graphql(graphqlOperation(mutations.createExperience, { input: payload }))
        }),
      )
    case 'deleteExperience':
      return API.graphql(graphqlOperation(mutations.deleteExperience, { input: payloads.data }))
    case 'updateSkills':
      console.log('PERFORM SKILLS OPS PAYLOADS', payloads)
      return Promise.all(
        payloads.map(payload => {
          return payload.input.id
            ? API.graphql(graphqlOperation(mutations.deleteSkill, payload))
            : API.graphql(graphqlOperation(mutations.createSkill, payload))
        }),
      )
    case 'updateCoursework':
      console.log('PERFORM COURSEWORK OPS PAYLOADS', payloads)
      return Promise.all(
        payloads.map(payload => {
          return payload.input.id
            ? API.graphql(graphqlOperation(mutations.deleteCoursework, payload))
            : API.graphql(graphqlOperation(mutations.createCoursework, payload))
        }),
      )
    case 'editAsset':
      console.log('editAsset payload', payloads)
      if (payloads.id) {
        return API.graphql(graphqlOperation(mutations.updateAsset, { input: payloads }))
      }
      payloads = pop(payloads)
      console.log('no ID payload', payloads)
      return API.graphql(graphqlOperation(mutations.createAsset, { input: payloads }))
    case 'editLeadership':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            console.log('editLeadership', payload)
            return API.graphql(graphqlOperation(mutations.updateLeadership, { input: payload }))
          }
          payload = pop(payload)
          console.log('createLeadership', payload)
          return API.graphql(graphqlOperation(mutations.createLeadership, { input: payload }))
        }),
      )
    case 'deleteLeadership':
      console.log('removeLeadership payloads', payloads)
      return API.graphql(graphqlOperation(mutations.deleteLeadership, { input: payloads.data }))
    case 'editArticles':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            return API.graphql(graphqlOperation(mutations.updateArticle, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createArticle, { input: payload }))
        }),
      )
    case 'deleteArticle':
      return API.graphql(graphqlOperation(mutations.deleteArticle, { input: payloads.data }))
    case 'editBrags':
      console.log('performOperations: edit brags payloads', payloads)
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            return API.graphql(graphqlOperation(mutations.updateBrag, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createBrag, { input: payload }))
        }),
      )
    case 'deleteBrag':
      return API.graphql(graphqlOperation(mutations.deleteBrag, { input: payloads.data }))
    case 'updatePosts':
      return payloads.input.id
        ? API.graphql(graphqlOperation(mutations.updatePost, payloads))
        : API.graphql(graphqlOperation(mutations.createPost, payloads))
    case 'editEducation':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            return API.graphql(graphqlOperation(mutations.updateEducation, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createEducation, { input: payload }))
        }),
      )
    case 'deleteEducation':
      return API.graphql(graphqlOperation(mutations.deleteEducation, { input: payloads.data }))
    case 'createPost':
      return API.graphql(graphqlOperation(mutations.createPost, { input: payloads }))
    case 'updatePost':
      return API.graphql(graphqlOperation(mutations.updatePost, { input: payloads }))
    default:
      return 'Could not update profile'
  }
}

export async function editProfile(mutation, data) {
  switch (mutation) {
    case 'updateIntro':
      return API.graphql(
        graphqlOperation(mutations.updateIntro, {
          input: {
            id: data.intro[0].id,
            content: data.intro[0].content,
          },
        }),
      )
    case 'editIntro':
      return performOperations(mutation, data)
    case 'editExperience':
      return performOperations(mutation, filterData(mutation, data))
    case 'deleteExperience':
      return performOperations(mutation, data)
    case 'updateSkills':
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)))
    case 'updateCoursework':
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)))
    case 'editAsset':
      return performOperations(mutation, data)
    case 'editLeadership':
      return performOperations(mutation, filterData(mutation, data))
    case 'deleteLeadership':
      return performOperations(mutation, data)
    case 'editArticles':
      return performOperations(mutation, filterData(mutation, data))
    case 'deleteArticle':
      return performOperations(mutation, data)
    case 'createPost':
      return performOperations(mutation, data)
    case 'updatePost':
      return performOperations(mutation, data)
    case 'editEducation':
      return performOperations(mutation, data)
    case 'deleteEducation':
      return performOperations(mutation, data)
    case 'editBrags':
      return performOperations(mutation, filterData(mutation, data))
    case 'deleteBrag':
      return performOperations(mutation, data)
    default:
      return 'Could not update profile'
  }
}
