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

export function formatUrl(url) {
  console.log('url substr', url.substr(0, 8))
  if (!url) return null
  if (url.substr(0, 8) === 'https://') return url
  return `https://${url}`
}

export async function getProfile(accountId) {
  return API.graphql(graphqlOperation(queries.getProfile, { account_id: accountId }))
}

export async function createProfile(username) {
  return API.graphql(
    graphqlOperation(mutations.createProfile, {
      input: {
        username,
        // first_name: null,
        // last_name: null,
      },
    }),
  )
}

export async function createProfileResources(accountId, repoName) {
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  })

  AWS.config.update({ region: 'us-east-2' })

  const payload = JSON.stringify(`{\"accountId\": \"${accountId}\",\"repoName\": \"${repoName}\"}`)

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
  if (!delete obj.changed || !delete obj.changedValue) {
    throw new Error()
  }
  return obj
}

const filterData = (mutation, data) => {
  const { skills, coursework, post } = data

  switch (mutation) {
    case 'editExperience':
      return data.filter(obj => obj.changed !== false)
    case 'editLeadership':
      return data.filter(obj => obj.changed !== false)
    case 'updateSkills':
      return skills.filter(skillsObj => skillsObj.action)
    case 'updateCoursework':
      return coursework.filter(
        courseworkObj => courseworkObj.action === 'add' || courseworkObj.action === 'remove',
      )
    case 'editArticles':
      console.log('editArticles Filter Data data', data)
      return data.filter(articleObj => articleObj.changed !== false)
    case 'editBrags':
      return data.filter(bragObj => bragObj.changed !== false)
    case 'editSocials':
      return data.filter(socialObj => socialObj.changedValue !== false)
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
      return data.id
        ? { input: data }
        : {
            input: {
              title: data.title,
              description: data.caption,
              image_url: data.image_url,
              markdown: data.markdown,
              html: data.html,
              date_published: data.date_published,
              series: 'posts',
              draft: true,
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
            return API.graphql(graphqlOperation(mutations.updateIntro, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createIntro, { input: payload }))
        }),
      )
    case 'editExperience':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            return API.graphql(graphqlOperation(mutations.updateExperience, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createExperience, { input: payload }))
        }),
      )
    case 'deleteExperience':
      return API.graphql(graphqlOperation(mutations.deleteExperience, { input: payloads.data }))
    case 'updateSkills':
      return Promise.all(
        payloads.map(payload => {
          return payload.input.id
            ? API.graphql(graphqlOperation(mutations.deleteSkill, payload))
            : API.graphql(graphqlOperation(mutations.createSkill, payload))
        }),
      )
    case 'updateCoursework':
      return Promise.all(
        payloads.map(payload => {
          return payload.input.id
            ? API.graphql(graphqlOperation(mutations.deleteCoursework, payload))
            : API.graphql(graphqlOperation(mutations.createCoursework, payload))
        }),
      )
    case 'editName':
      return API.graphql(graphqlOperation(mutations.updateName, { input: payloads[0] }))
    case 'editAsset':
      if (payloads.id) {
        return API.graphql(graphqlOperation(mutations.updateAsset, { input: payloads }))
      }
      payloads = pop(payloads)
      return API.graphql(graphqlOperation(mutations.createAsset, { input: payloads }))
    case 'editLeadership':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            return API.graphql(graphqlOperation(mutations.updateLeadership, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createLeadership, { input: payload }))
        }),
      )
    case 'deleteLeadership':
      return API.graphql(graphqlOperation(mutations.deleteLeadership, { input: payloads.data }))
    case 'editArticles':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            return API.graphql(graphqlOperation(mutations.updateArticle, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createArticle, { input: payload }))
        }),
      )
    case 'deleteArticle':
      return API.graphql(graphqlOperation(mutations.deleteArticle, { input: payloads.data }))
    case 'editReferences':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            return API.graphql(graphqlOperation(mutations.updateReference, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createReference, { input: payload }))
        }),
      )
    case 'deleteReference':
      return API.graphql(graphqlOperation(mutations.deleteReference, { input: payloads.data }))
    case 'editBrags':
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
    case 'editSocials':
      return Promise.all(
        payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload)
            return API.graphql(graphqlOperation(mutations.updateSocial, { input: payload }))
          }
          payload = pop(payload)
          return API.graphql(graphqlOperation(mutations.createSocial, { input: payload }))
        }),
      )
    case 'deleteSocials':
      return API.graphql(graphqlOperation(mutations.deleteSocial, { input: payloads.data }))
    case 'editPost':
      if (payloads.status !== 'new') {
        payloads = {
          id: payloads.id,
          title: payloads.title,
          html: payloads.html,
          markdown: payloads.markdown,
          draft: payloads.draft,
          date_published: payloads.date_published,
          image_url: payloads.url,
        }
        return API.graphql(graphqlOperation(mutations.updatePost, { input: payloads }))
      }
      payloads = {
        id: payloads.id,
        title: payloads.title,
        html: payloads.html,
        markdown: payloads.markdown,
        draft: payloads.draft,
        series: 'posts',
        image_url: payloads.url,
      }
      return API.graphql(graphqlOperation(mutations.createPost, { input: payloads }))
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
    // case 'updatePost':
    //   return API.graphql(graphqlOperation(mutations.updatePost, { input: payloads }));
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
    case 'editReferences':
      return performOperations(mutation, data)
    case 'deleteReference':
      return performOperations(mutation, data)
    case 'editSocials':
      return performOperations(mutation, data)
    case 'deleteSocials':
      return performOperations(mutation, data)
    case 'createPost':
      return performOperations(mutation, data)
    case 'editName':
      return performOperations(mutation, data)
    case 'editPost':
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
