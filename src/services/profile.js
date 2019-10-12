import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'graphql/mutations'
import * as queries from 'graphql/queries'

export async function helloWorld() {
  return "Hello World"
}

export async function currentAccountProfile (accountId) {
  console.log("received the call", accountId)
  return API.graphql(graphqlOperation(queries.getProfile, { account_id: accountId }))
}

const filterData = (mutation, data) => {
  const { experience } = data;
  switch (mutation) {
    case "updateExperience":
      console.log("updateExperience FILTER DATA", data);
      return experience.filter(expObj => expObj.changed !== "false");
    case "removeExperience":
      console.log("updateExperience FILTER DATA", data);
      return experience;
    default:
      return "Could not perform CRUD operation."
  }
};

const createPayloads = (mutation, data) => {
  switch (mutation) {
    case "updateExperience":
      console.log("CREATE PAYLOADS DATA", data);
      return data.map(expObj => {
        return expObj.id ?
        {
          input: {
            id: expObj.id,
            position: expObj.position,
            company: expObj.company,
            start_date: expObj.start_date,
            end_date: expObj.end_date,
            link: expObj.link
          }
        }
        :
        {
          input: {
            position: expObj.position,
            company: expObj.company,
            start_date: expObj.start_date,
            end_date: expObj.end_date,
            link: expObj.link
          }
        }
    });
    case "removeExperience":
      return data.map(expObj => {
        console.log("createPayloads removeExperience expObj", expObj)
        return { input: { id: expObj.id } }
      });
    default:
      return "Could not create payload"
  }
};

const performOperations = async (mutation, payloads) => {
  switch (mutation) {
    case "updateExperience":
      return Promise.all([payloads.forEach(payload => {
          console.log("PERFORM OPS PAYLOAD", payload)
          return payload.input.id ?
            API.graphql(graphqlOperation(mutations.updateExperience, payload))
            :
            API.graphql(graphqlOperation(mutations.createExperience, payload))
        })
      ]);
    case "removeExperience":
      console.log("performOperations payloads", payloads)
      try {
        console.log(API.graphql(graphqlOperation(mutations.deleteExperience, payloads[0])));
        return "success"
      }
      catch (error) {
        console.log(error);
        return error
      }
    default:
      return "Could not perform operations"
  }
};

export async function editProfile(mutation, data) {
  // const { experience } = data
  switch (mutation) {
    case "updateIntro":
      return API.graphql(graphqlOperation(mutations.updateIntro, { input: { id: data.intro[0].id, content: data.intro[0].content }}))
    case "updateExperience":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "removeExperience":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
      // return API.graphql(graphqlOperation(mutations.deleteExperience,
      //   {
      //     input: {
      //         id: experience.id
      //       }
      //   }))
    default:
      return "Could not update profile"
  }
}
