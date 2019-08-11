import Amplify, { Auth } from 'aws-amplify';
import { notification } from 'antd'

Amplify.configure({
  Auth: {

    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: 'us-east-2_2hwpEnfaj',

    // REQUIRED - Amazon Cognito Region
    region: 'us-east-2',

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-2_2hwpEnfaj',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '4m03impsp8i9lmp6g6ko6ilmb2',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //   domain: '.yourdomain.com',
    //   // OPTIONAL - Cookie path
    //   path: '/',
    //   // OPTIONAL - Cookie expiration in days
    //   expires: 365,
    //   // OPTIONAL - Cookie secure flag
    //   // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    //   secure: true
    // },
    //
    // // OPTIONAL - customized storage object
    // storage: new MyStorage(),
    //
    // // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

// export async function login(email, password) {
//   return firebaseAuth()
//     .signInWithEmailAndPassword(email, password)
//     .then(() => true)
//     .catch(error => {
//       notification.warning({
//         message: error.code,
//         description: error.message,
//       })
//     })
// }

// export async function login(email, password) {
//   try {
//     // const user = await Auth.signIn(username, password);
//     const user = await Auth.signIn(email, password);
//     console.log("USER: ", user)
//   } catch (error) {
//     notification.warning({
//         message: error.code,
//         description: error.message,
//       })
//   }
// }

export async function login(email, password) {
  return Auth.signIn(email, password)
    .then(() => true)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function currentAccount() {
  return Auth.currentAuthenticatedUser();
}

export async function logout() {
  return Auth.signOut()
    .then(() => true)
    .catch(err => console.log(err));
}

// You can get the current config object
// const currentConfig = Auth.configure();
