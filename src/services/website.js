import axios from 'axios'

const pbmgmt = axios.create({
  baseURL: 'https://i1nc1drhji.execute-api.us-east-2.amazonaws.com/dev',
  headers: {'Content-Type': 'application/json'}
});

// const fakeDataEscaped = {
//   "input": "{ \"DESTINATION_BUCKET\": \"development.kieranpaul.com\", \"SOURCE_S3_BUCKET_PATH\": \"kieranpaul-source\", \"value\": {\r\n    \"languageCode\": \"en-us\",\r\n    \"baseURL\": \"http:\/\/www.connorreardon.com.s3-website.us-east-2.amazonaws.com\",\r\n    \"params\": {\r\n      \"courses\": [\r\n        {\r\n          \"course\": \"Intermediate Finesse\"\r\n        },\r\n        {\r\n          \"course\": \"Quantitative Analysis for Finance\"\r\n        },\r\n        {\r\n          \"course\": \"Management Accounting\"\r\n        },\r\n        {\r\n          \"course\": \"Organizational Behavior\"\r\n        }\r\n      ],\r\n      \"leadership\": [\r\n        {\r\n          \"title\": \"Campus Coordinator ('17-'19)\",\r\n          \"organization\": \"Deacs vs. Cancer\",\r\n          \"link\": \"https:\/\/team.curethekids.org\/campaign\/deacs-vs-cancer-2018\/c174401\"\r\n        },\r\n        {\r\n          \"title\": \"Active Member ('17-'19)\",\r\n          \"organization\": \"Alpha Sigma Phi Fraternity\",\r\n          \"link\": \"http:\/\/alphasigmaphi.org\/\"\r\n        }\r\n      ],\r\n      \"lastInitial\": \"RN\",\r\n      \"intro\": \"Hi, I\u2019m Connor. I study finance and math at Wake Forest University. My interests include studying the global marketplace and engaging people from different cultures and backgrounds. Upon graduation in May 2020, I\u2019m looking for a full-time position where I can further explore the world of finance.\",\r\n      \"skill_2\": \"Research Analyst at the\",\r\n      \"article_1_caption\": \"From Musings on Markets - Finance Professor Aswath Damodaran on Lyft pre-IPO\",\r\n      \"article_1\": \"Lyft Off? The First Ride Sharing IPO!\",\r\n      \"image\": \"default.jpg\",\r\n      \"resume\": \".\/pdf\/ReardonResume.pdf\",\r\n      \"skill_2_link_word\": \"Deacon Fund Investment Club\",\r\n      \"article_2\": \"Uber's Coming out Party: Personal Mobility Pioneer or Car Service on Steroids?\",\r\n      \"professional_1\": \"Business Development Team Intern ('19)\",\r\n      \"professional_2_link_word\": \"The Black Dog Tavern Co.\",\r\n      \"skill_1_link\": \"https:\/\/adventiscg.com\/\",\r\n      \"email\": \"rearcd16@wfu.edu\",\r\n      \"professional_2\": \"Corporate Operations Intern ('19)\",\r\n      \"reference_3_author\": \"Guha Rajan, Deacon Fund Club Member\",\r\n      \"article_1_link\": \"http:\/\/aswathdamodaran.blogspot.com\/2019\/03\/lyft-off-first-ride-sharing-ipo.html\",\r\n      \"article_3_caption\": \"You guessed it - Finance Professor Aswath Damodaran on Tesla\",\r\n      \"skill_1\": \"Financial Modeling Level II Certification from\",\r\n      \"reference_1_author\": \"Daniel J. Pucillo, COO of Black Dog Tavern Co.\",\r\n      \"professional_1_link_word\": \"Fiera Capital\",\r\n      \"lastName\": \"Reardon\",\r\n      \"skill_2_link\": \"http:\/\/www.deacon-fund.com\/\",\r\n      \"firstName\": \"Connor\",\r\n      \"article_3_link\": \"https:\/\/papers.ssrn.com\/sol3\/papers.cfm?abstract_id=2429778\",\r\n      \"twitter\": \"\",\r\n      \"reference_2\": \"Connor is a thoughtful individual, often pausing in conversation to deliberate the words he says. In this, he arrives as thoughts and conversations far more intricate and involved than those that are expected of him.\",\r\n      \"professional_2_link\": \"https:\/\/www.theblackdog.com\/pages\/the-black-dog-tavern\",\r\n      \"middleInitial\": \"D\",\r\n      \"reference_1\": \"Connor assimilated into our unique work environment instantly. His ability to conceptualize projects allowed him to work independently and efficiently.\u00A0\u00A0He was able to take on the workload of more senior team members and quickly became a sought after and valuable member of many cross-functional teams.\",\r\n      \"styleBaseURL\": \"http:\/\/www.connorreardon.com.s3-website.us-east-2.amazonaws.com\",\r\n      \"article_2_link\": \"https:\/\/www.bloombergquint.com\/opinion\/ubers-coming-out-party-personal-mobility-pioneer-or-car-service-on-steroids\",\r\n      \"article_3\": \"Tesla: Anatomy of a Run-Up Value Creation or Investor Sentiment?\",\r\n      \"facebook\": \"https:\/\/www.facebook.com\/connor.reardon.35\",\r\n      \"reference_2_author\": \"Guha Rajan, Deacon Fund Club Member\",\r\n      \"article_2_caption\": \"More from Musings on Markets - Prof. Damodaran on Uber\",\r\n      \"professional_1_link\": \"https:\/\/us.fieracapital.com\/\",\r\n      \"skill_1_link_word\": \"Adventis\",\r\n      \"linkedin\": \"https:\/\/www.linkedin.com\/in\/connor-reardon-677658147\/\",\r\n      \"reference_3\": \"Connor is a thoughtful individual, often pausing in conversation to deliberate the words he says. In this, he arrives as thoughts and conversations far more intricate and involved than those that are expected of him.\",\r\n      \"firstInitial\": \"C\"\r\n    },\r\n    \"title\": \"Kieran Derfus\"\r\n  }\r\n}",
//   "stateMachineArn": "arn:aws:states:us-east-2:273116933489:stateMachine:HelloWorldExample"
// }

const fakeData = JSON.stringify(
  {
    "DESTINATION_BUCKET": "development.kieranpaul.com", "SOURCE_S3_BUCKET_PATH": "kieranpaul-source", "value": {
    "languageCode": "en-us",
    "baseURL": "http://www.connorreardon.com.s3-website.us-east-2.amazonaws.com",
    "params": {
      "courses": [
        {
          "course": "Is it working?"
        },
        {
          "course": "Quantitative Analysis for Finance"
        },
        {
          "course": "Management Accounting"
        },
        {
          "course": "Organizational Behavior"
        }
      ],
      "leadership": [
        {
          "title": "Campus Coordinator ('17-'19)",
          "organization": "Deacs vs. Cancer",
          "link": "https://team.curethekids.org/campaign/deacs-vs-cancer-2018/c174401"
        },
        {
          "title": "Active Member ('17-'19)",
          "organization": "Alpha Sigma Phi Fraternity",
          "link": "http://alphasigmaphi.org/"
        }
      ],
      "articles": [
        {
          "title": "Lyft Off? The First Ride Sharing IPO!",
          "caption": "From Musings on Markets - Finance Professor Aswath Damodaran on Lyft pre-IPO",
          "url": "http://aswathdamodaran.blogspot.com/2019/03/lyft-off-first-ride-sharing-ipo.html"
        },
        {
          "title": "Yikes!",
          "caption": "From Musings on Markets - Finance Professor Aswath Damodaran on Lyft pre-IPO",
          "url": "http://aswathdamodaran.blogspot.com/2019/03/lyft-off-first-ride-sharing-ipo.html"
        },
        {
          "title": "Yikes Again!",
          "caption": "From Musings on Markets - Finance Professor Aswath Damodaran on Lyft pre-IPO",
          "url": "http://aswathdamodaran.blogspot.com/2019/03/lyft-off-first-ride-sharing-ipo.html"
        }
      ],
      "lastInitial": "RN",
      "intro": "Hi, I’m Tom Derfus. I study finance and math at Wake Forest University. My interests include studying the global marketplace and engaging people from different cultures and backgrounds. Upon graduation in May 2020, I’m looking for a full-time position where I can further explore the world of finance.",
      "skill_2": "Research Analyst at the",
      "article_1_caption": "From Musings on Markets - Finance Professor Aswath Damodaran on Lyft pre-IPO",
      "article_1": "Lyft Off? The First Ride Sharing IPO!",
      "image": "default.jpg",
      "resume": "./pdf/ReardonResume.pdf",
      "skill_2_link_word": "Deacon Fund Investment Club",
      "article_2": "Uber's Coming out Party: Personal Mobility Pioneer or Car Service on Steroids?",
      "professional_1": "Business Development Team Intern ('19)",
      "professional_2_link_word": "The Black Dog Tavern Co.",
      "skill_1_link": "https://adventiscg.com/",
      "email": "rearcd16@wfu.edu",
      "professional_2": "Corporate Operations Intern ('19)",
      "reference_3_author": "Guha Rajan, Deacon Fund Club Member",
      "article_1_link": "http://aswathdamodaran.blogspot.com/2019/03/lyft-off-first-ride-sharing-ipo.html",
      "article_3_caption": "You guessed it - Finance Professor Aswath Damodaran on Tesla",
      "skill_1": "Financial Modeling Level II Certification from",
      "reference_1_author": "Daniel J. Pucillo, COO of Black Dog Tavern Co.",
      "professional_1_link_word": "Fiera Capital",
      "lastName": "Derfus",
      "skill_2_link": "http://www.deacon-fund.com/",
      "firstName": "Tom",
      "article_3_link": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2429778",
      "twitter": "",
      "reference_2": "Connor is a thoughtful individual, often pausing in conversation to deliberate the words he says. In this, he arrives as thoughts and conversations far more intricate and involved than those that are expected of him.",
      "professional_2_link": "https://www.theblackdog.com/pages/the-black-dog-tavern",
      "middleInitial": "D",
      "reference_1": "Connor assimilated into our unique work environment instantly. His ability to conceptualize projects allowed him to work independently and efficiently.  He was able to take on the workload of more senior team members and quickly became a sought after and valuable member of many cross-functional teams.",
      "styleBaseURL": "http://www.connorreardon.com.s3-website.us-east-2.amazonaws.com",
      "article_2_link": "https://www.bloombergquint.com/opinion/ubers-coming-out-party-personal-mobility-pioneer-or-car-service-on-steroids",
      "article_3": "Tesla: Anatomy of a Run-Up Value Creation or Investor Sentiment?",
      "facebook": "https://www.facebook.com/connor.reardon.35",
      "reference_2_author": "Guha Rajan, Deacon Fund Club Member",
      "article_2_caption": "More from Musings on Markets - Prof. Damodaran on Uber",
      "professional_1_link": "https://us.fieracapital.com/",
      "skill_1_link_word": "Adventis",
      "linkedin": "https://www.linkedin.com/in/connor-reardon-677658147/",
      "reference_3": "Connor is a thoughtful individual, often pausing in conversation to deliberate the words he says. In this, he arrives as thoughts and conversations far more intricate and involved than those that are expected of him.",
      "firstInitial": "C"
    },
    "title": "Kieran Derfus"
  }
})

export async function triggerDevelopmentBuild (profile) {
  console.log("TRIGGER DEV BUILD", profile)
  pbmgmt.post('/edit-then-build', {
    "input": `${fakeData}`,
    "stateMachineArn": "arn:aws:states:us-east-2:273116933489:stateMachine:HelloWorldExample"
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}

export async function triggerProductionBuild (profile) {
  console.log(profile)
}
