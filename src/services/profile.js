import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'graphql/mutations'

export async function helloWorld() {
  return "Hello World"
}

export async function editProfile(mutation, data) {

  switch (mutation) {
    case "updateIntro":
      // console.log({ id: data.intro[0].id, content: data.intro[0].content })
      return API.graphql(graphqlOperation(mutations.updateIntro, { input: { id: data.intro[0].id, content: data.intro[0].content }}))
    default:
      return "Could not update profile"
  }
}
