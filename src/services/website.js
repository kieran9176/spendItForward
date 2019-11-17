import { currentAccountProfile } from 'services/profile'
import axios from 'axios'

const pbmgmt = axios.create({
  baseURL: 'https://i1nc1drhji.execute-api.us-east-2.amazonaws.com/dev',
  headers: {'Content-Type': 'application/json'}
});

const createPayload = (profile) => {
  const { getProfile } = profile.data;
  const { assets, coursework, leadership, references, skills, experience, articles, intro, socials, posts } = getProfile;
  return JSON.stringify(
    {
      "languageCode": "en-us",
      "baseURL": "http://development.kieranpaul.com.s3-website.us-east-2.amazonaws.com/",
      "title": "Kieran Derfus",
      "params": {
        first_name: getProfile.first_name,
        last_name: getProfile.last_name,
        "build": "development",
        "middleInitial": "_éi",
        "lastInitial": "rí_",
        "email": "kieranderfus@gmail.com",
        site_metadata: getProfile.site_metadata,
        assets,
        coursework,
        leadership,
        references,
        skills,
        experience,
        articles,
        intro,
        socials,
        posts
      }
    }
  );
};

export async function triggerDevelopmentBuild (sub) {

  const profileResponse = currentAccountProfile(sub);

  console.log("TRIGGER DEV BUILD");

  profileResponse.then(profileObj => {

    const payload = createPayload(profileObj)

    pbmgmt.post('/edit-then-build', {
      "input": `${payload}`,
      "stateMachineArn": "arn:aws:states:us-east-2:273116933489:stateMachine:HelloWorldExample"
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  })
}

export async function triggerProductionBuild (profile) {
  console.log(profile)
}
