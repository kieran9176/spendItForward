import { API, graphqlOperation } from 'aws-amplify';
import { notification } from 'antd'
import * as mutations from 'graphql/mutations'
import * as queries from 'graphql/queries'

export async function helloWorld() {
  return "Hello World"
}

export function notify (mutation) {
  switch (mutation) {
    case "updateExperience":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully updated your experience.'
      });
    break;
    case "removeExperience":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully removed an experience item.'
      });
      break;
    case "updateSkills":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully updated your skills.'
      });
      break;
    case "updateCoursework":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully updated your coursework.'
      });
      break;
    case "updateLeadership":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully updated your leadership.'
      });
      break;
    case "removeLeadership":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully removed a leadership item.'
      });
      break;
    case "updateArticle":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully updated your articles.'
      });
      break;
    case "removeArticles":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully removed an article.'
      });
      break;
    case "updatePosts":
      notification.success({
        message: 'Updates Saved',
        description: 'You\'ve successfully updated your posts.'
      });
      break;
    default:
      notification.error({
        message: 'Error',
        description: 'Our team of highly trained monkeys has been dispatched to deal with the situation.',
      });
      break;
  }
}

export async function currentAccountProfile (accountId) {
  console.log("received the call", accountId)
  return API.graphql(graphqlOperation(queries.getProfile, { account_id: accountId }))
}

const filterData = (mutation, data) => {
  const { experience, skills, coursework, leadership, articles, post } = data;
  switch (mutation) {
    case "updateExperience":
      console.log("updateExperience FILTER DATA", data);
      return experience.filter(expObj => expObj.changed !== "false");
    case "removeExperience":
      console.log("removeExperience FILTER DATA", data);
      return experience;
    case "updateSkills":
      console.log("filterData skills", skills);
      return skills.filter(skillsObj => skillsObj.action);
    case "updateCoursework":
      return coursework.filter(courseworkObj => courseworkObj.action === "add" || courseworkObj.action === "remove");
    case "updateLeadership":
      console.log("updateLeadership FILTER DATA", data);
      return leadership.filter(leadObj => leadObj.changed !== "false");
    case "removeLeadership":
      console.log("removeLeadership FILTER DATA", data);
      return leadership;
    case "updateArticles":
      console.log("updateArticles FILTER DATA", data);
      return articles.filter(articleObj => articleObj.changed !== "false");
    case "removeArticles":
      console.log("removeArticle FILTER DATA", data);
      return articles;
    case "updatePosts":
      return post;
    default:
      return "Could not filter data."
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
    case "updateSkills":
      return data
        .map(skillsObj => {
          if (skillsObj.action === "add") return { input: { content: skillsObj.content }};
          if (skillsObj.action === "remove" && skillsObj.id) return { input: { id: skillsObj.id }};
          return null
      });
    case "updateCoursework":
      return data
        .map(courseworkObj => {
          if (courseworkObj.action === "add") return { input: { course_name: courseworkObj.course_name }};
          if (courseworkObj.action === "remove" && courseworkObj.id) return { input: { id: courseworkObj.id }};
          return null
        });
    case "updateLeadership":
      console.log("CREATE PAYLOADS DATA", data);
      return data.map(leadObj => {
        return leadObj.id ?
          {
            input: {
              id: leadObj.id,
              position: leadObj.position,
              organization: leadObj.organization,
              start_date: leadObj.start_date,
              end_date: leadObj.end_date,
              link: leadObj.link
            }
          }
          :
          {
            input: {
              position: leadObj.position,
              organization: leadObj.organization,
              start_date: leadObj.start_date,
              end_date: leadObj.end_date,
              link: leadObj.link
            }
          }
      });
    case "removeLeadership":
      return data.map(leadObj => {
        console.log("createPayloads removeLeadership leadObj", leadObj)
        return { input: { id: leadObj.id } }
      });
    case "updateArticles":
      console.log("CREATE PAYLOADS DATA", data);
      return data.map(articleObj => {
        return articleObj.id ?
          {
            input: {
              id: articleObj.id,
              caption: articleObj.caption,
              title: articleObj.title,
              url: articleObj.url
            }
          }
          :
          {
            input: {
              caption: articleObj.caption,
              title: articleObj.title,
              url: articleObj.url
            }
          }
      });
    case "removeArticles":
      return data.map(articleObj => {
        console.log("createPayloads removeArticle articleObj", articleObj)
        return { input: { id: articleObj.id } }
      });
    case "updatePosts":
      console.log("POSTS CREATE PAYLOAD data", data)
      return data.id ?
        { input: data }
        :
        {
          input: {
            title: data.title,
            caption: data.caption,
            image_url: data.image_url,
            markdown: data.markdown,
            html: data.html,
            date_published: data.date_published,
            series: data.series
          }
        }
    default:
      return "Could not create payload"
  }
};

const performOperations = async (mutation, payloads) => {
  switch (mutation) {
    case "updateExperience":
      return Promise.all(payloads.map(payload => {
          console.log("PERFORM EXPERIENCE OPS PAYLOAD", payload)
          return payload.input.id ?
            API.graphql(graphqlOperation(mutations.updateExperience, payload))
            :
            API.graphql(graphqlOperation(mutations.createExperience, payload))
        })
      );
    case "removeExperience":
      return API.graphql(graphqlOperation(mutations.deleteExperience, payloads[0]));
    case "updateSkills":
      console.log("PERFORM SKILLS OPS PAYLOADS", payloads);
      return Promise.all(payloads.map(payload => {
          return payload.input.id ?
            API.graphql(graphqlOperation(mutations.deleteSkill, payload))
            :
            API.graphql(graphqlOperation(mutations.createSkill, payload))
        })
      );
    case "updateCoursework":
      console.log("PERFORM COURSEWORK OPS PAYLOADS", payloads);
      return Promise.all(payloads.map(payload => {
          return payload.input.id ?
            API.graphql(graphqlOperation(mutations.deleteCoursework, payload))
            :
            API.graphql(graphqlOperation(mutations.createCoursework, payload))
        })
      );
    case "updateLeadership":
      return Promise.all(payloads.map(payload => {
          console.log("PERFORM LEADERSHIP OPS PAYLOAD", payload)
          return payload.input.id ?
            API.graphql(graphqlOperation(mutations.updateLeadership, payload))
            :
            API.graphql(graphqlOperation(mutations.createLeadership, payload))
        })
      );
    case "removeLeadership":
      return API.graphql(graphqlOperation(mutations.deleteLeadership, payloads[0]));
    case "updateArticles":
      return Promise.all(payloads.map(payload => {
          console.log("PERFORM ARTICLES OPS PAYLOAD", payload)
          return payload.input.id ?
            API.graphql(graphqlOperation(mutations.updateArticle, payload))
            :
            API.graphql(graphqlOperation(mutations.createArticle, payload))
        })
      );
    case "removeArticles":
      return API.graphql(graphqlOperation(mutations.deleteArticle, payloads[0]));
    case "updatePosts":
      console.log("PERFORM POSTS OPS PAYLOAD", payloads)
      return payloads.input.id ?
        API.graphql(graphqlOperation(mutations.updatePost, payloads))
        :
        API.graphql(graphqlOperation(mutations.createPost, payloads));
    default:
      return "Could not perform operations"
  }
};

export async function editProfile(mutation, data) {
  switch (mutation) {
    case "updateIntro":
      return API.graphql(graphqlOperation(mutations.updateIntro, { input: { id: data.intro[0].id, content: data.intro[0].content }}))
    case "updateExperience":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "removeExperience":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "updateSkills":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "updateCoursework":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "updateLeadership":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "removeLeadership":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "updateArticles":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "removeArticles":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "createPost":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "updatePosts":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    default:
      return "Could not update profile"
  }
}
