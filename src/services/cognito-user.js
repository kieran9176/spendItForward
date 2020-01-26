// // import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
// import Amplify from 'aws-amplify';
// // import { notification } from 'antd'
// // import * as queries from 'graphql/queries'
// import awsmobile from 'aws-exports'
//
// Amplify.configure({
//   Auth: {
//
//     // REQUIRED - Amazon Cognito Region
//     region: 'us-east-2',
//
//     // OPTIONAL - Amazon Cognito User Pool ID
//     userPoolId: 'us-east-2_2hwpEnfaj',
//
//     // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
//     userPoolWebClientId: '4m03impsp8i9lmp6g6ko6ilmb2',
//
//     // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
//     mandatorySignIn: false,
//   },
// });
//
// Amplify.configure(awsmobile)
//
// // export async function login(email, password) {
// //   console.log("login got used!")
// //   return Auth.signIn(email, password)
// //     .then(() => true )
// //     .catch(error => {
// //       notification.warning({
// //         message: error.code,
// //         description: error.message,
// //       })
// //     })
// // }
// //
// // export async function currentAccountProfile (sub) {
// //   console.log("currentAccountProfile got used!")
// //   return API.graphql(graphqlOperation(queries.getProfile, { account_id: sub }))
// // }
// //
// //
// // export async function logout() {
// //   console.log("logout got used!")
// //   return Auth.signOut()
// //     .then(() => true)
// //     .catch(err => console.log(err));
// // }
