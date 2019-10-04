import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'graphql/mutations'

export async function helloWorld() {
  return "Hello World"
}

export async function editProfile(mutation, data) {
  const { experience } = data
  switch (mutation) {
    case "updateIntro":
      return API.graphql(graphqlOperation(mutations.updateIntro, { input: { id: data.intro[0].id, content: data.intro[0].content }}))
    case "updateExperience":
      console.log("DATA", data)
      return API.graphql(graphqlOperation(mutations.updateExperience,
        {
          input: {
              id: experience.id,
              position: experience.position,
              company: experience.company,
              start_date: experience.start_date,
              end_date: experience.end_date,
              link: experience.link
            }
        })
      )
    case "deleteExperience":
      return API.graphql(graphqlOperation(mutations.deleteExperience,
        {
          input: {
              id: experience.id
            }
        }))
    default:
      return "Could not update profile"
  }
}
