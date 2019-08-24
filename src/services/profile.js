// import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
// import { notification } from 'antd'
// import * as queries from 'graphql/queries'
//
// export async function login(email, password) {
//   return Auth.signIn(email, password)
//     .then(() => true)
//     .catch(error => {
//       notification.warning({
//         message: error.code,
//         description: error.message,
//       })
//     })
// }
//
// export async function editProfile(action) {
//   switch (action.type) {
//     case actions.SET_STATE:
//       return { ...state, ...action.payload }
//     default:
//       return state
//   }
//   return Auth.signIn(email, password)
//     .then(() => true)
//     .catch(error => {
//       notification.warning({
//         message: error.code,
//         description: error.message,
//       })
//     })
// }
