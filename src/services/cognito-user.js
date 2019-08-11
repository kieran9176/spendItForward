import Amplify, { Auth } from 'aws-amplify';
import { notification } from 'antd'

Amplify.configure({
  Auth: {

    // REQUIRED - Amazon Cognito Region
    region: 'us-east-2',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-2_2hwpEnfaj',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '4m03impsp8i9lmp6g6ko6ilmb2',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,
  }
});

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
