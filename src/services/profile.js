import { API, graphqlOperation } from 'aws-amplify';
import { notification } from 'antd'
import * as mutations from 'graphql/mutations'
import * as queries from 'graphql/queries'

export function notify (status, type) {
  if (status === "success") {
    notification.success({
      message: 'Updates Saved',
      description: `You\'ve successfully updated your ${type}.`
    });
  } else {
    notification.error({
      message: 'Error',
      description: 'Our team of highly trained monkeys has been dispatched to deal with the situation.',
    });
  }
}

export async function currentAccountProfile (accountId) {
  console.log("received the call", accountId)
  return API.graphql(graphqlOperation(queries.getProfile, { account_id: accountId }))
}

const pop = (obj) => {
  if (!obj.id) {
    if (!delete obj.id) {
      throw new Error();
    }
  }
  if (!delete obj.changed) {
    throw new Error();
  }
  return obj;
};

const filterData = (mutation, data) => {
  const { skills, coursework, post } = data;

  switch (mutation) {
    case "editExperience":
      console.log("updateExperience FILTER DATA", data);
      return data.filter(obj => obj.changed !== false);
    case "editLeadership":
      console.log("updateLeadership FILTER DATA", data);
      return data.filter(obj => obj.changed !== false);
    case "updateSkills":
      console.log("filterData skills", skills);
      return skills.filter(skillsObj => skillsObj.action);
    case "updateCoursework":
      return coursework.filter(courseworkObj => courseworkObj.action === "add" || courseworkObj.action === "remove");
    case "editArticles":
      console.log("updateArticles FILTER DATA", data);
      return data.filter(articleObj => articleObj.changed !== false);
    case "editBrags":
      console.log("editBrags FILTER DATA", data);
      return data.filter(bragObj => bragObj.changed !== false);
    case "updatePosts":
      return post;
    default:
      notification.error({
        message: "Could not filter data."
      });
      return "Could not filter data."
  }
};

const createPayloads = (mutation, data) => {
  switch (mutation) {
    case "updateSkills":
      return data
        .map(skillsObj => {
          if (skillsObj.action === "add") return {input: {content: skillsObj.content}};
          if (skillsObj.action === "remove" && skillsObj.id) return {input: {id: skillsObj.id}};
          return null
        });
    case "updateCoursework":
      return data
        .map(courseworkObj => {
          if (courseworkObj.action === "add") return {input: {course_name: courseworkObj.course_name}};
          if (courseworkObj.action === "remove" && courseworkObj.id) return {input: {id: courseworkObj.id}};
          return null
        });
    case "updatePosts":
      console.log("POSTS CREATE PAYLOAD data", data)
      return data.id ?
        {input: data}
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
        };
    default:
      return "Could not create payload"
  }
};

const performOperations = async (mutation, payloads) => {
  switch (mutation) {
    case "editExperience":
      return Promise.all(payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload);
            console.log("performOperations editExperience", payload);
            return API.graphql(graphqlOperation(mutations.updateExperience, { input: payload }))
          }
          payload = pop(payload);
          console.log("performOperations createExperience", payload);
          return API.graphql(graphqlOperation(mutations.createExperience, { input: payload }))
        })
      );
    case "deleteExperience":
      return API.graphql(graphqlOperation(mutations.deleteExperience, { input: payloads.data }));
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
    case "editLeadership":
      console.log("perform leadership ops payloads", payloads)
      return Promise.all(payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload);
            console.log("editLeadership", payload);
            return API.graphql(graphqlOperation(mutations.updateLeadership, {input: payload}))
          }
          payload = pop(payload);
          console.log("createLeadership", payload);
          return API.graphql(graphqlOperation(mutations.createLeadership, {input: payload}))
        })
      );
    case "deleteLeadership":
      console.log("removeLeadership payloads", payloads)
      return API.graphql(graphqlOperation(mutations.deleteLeadership, { input: payloads.data }));
    case "editArticles":
      return Promise.all(payloads.map(payload => {
          if (payload.id) {
            return API.graphql(graphqlOperation(mutations.updateArticle, { input: payload }))
          }
          payload = pop(payload);
          return API.graphql(graphqlOperation(mutations.createArticle, { input: payload }))
        })
      );
    case "deleteArticle":
      return API.graphql(graphqlOperation(mutations.deleteArticle, { input: payloads.data }));
    case "editBrags":
      console.log("performOperations: edit brags payloads", payloads);
      return Promise.all(payloads.map(payload => {
          if (payload.id) {
            payload = pop(payload);
            return API.graphql(graphqlOperation(mutations.updateBrag, { input: payload }))
          }
          payload = pop(payload);
          return API.graphql(graphqlOperation(mutations.createBrag, { input: payload }))
        })
      );
    case "deleteBrag":
      return API.graphql(graphqlOperation(mutations.deleteBrag, { input: payloads.data }));
    case "updatePosts":
      return payloads.input.id ?
        API.graphql(graphqlOperation(mutations.updatePost, payloads))
        :
        API.graphql(graphqlOperation(mutations.createPost, payloads));
    case "editEducation":
      return Promise.all(payloads.map(payload => {
          if (payload.id) {
            return API.graphql(graphqlOperation(mutations.updateEducation, {input: payload }));
          }
          payload = pop(payload);
          return API.graphql(graphqlOperation(mutations.createEducation, { input: payload }))
        })
      );
    case "deleteEducation":
      return API.graphql(graphqlOperation(mutations.deleteEducation, { input: payloads.data }));
    default:
      return "Could not update profile"
  }
};

export async function editProfile(mutation, data) {
  switch (mutation) {
    case "updateIntro":
      return API.graphql(graphqlOperation(mutations.updateIntro, {
        input: {
          id: data.intro[0].id,
          content: data.intro[0].content
        }
      }));
    case "editExperience":
      return performOperations(mutation, filterData(mutation, data));
    case "deleteExperience":
      return performOperations(mutation, data);
    case "updateSkills":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "updateCoursework":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "editLeadership":
      return performOperations(mutation, filterData(mutation, data));
    case "deleteLeadership":
      return performOperations(mutation, data);
    case "editArticles":
      return performOperations(mutation, filterData(mutation, data));
    case "deleteArticle":
      return performOperations(mutation, data);
    case "createPost":
      return "post created";
    case "updatePosts":
      return performOperations(mutation, createPayloads(mutation, filterData(mutation, data)));
    case "editEducation":
      return performOperations(mutation, data);
    case "deleteEducation":
      return performOperations(mutation, data);
    case "editBrags":
      return performOperations(mutation, filterData(mutation, data));
    case "deleteBrag":
      return performOperations(mutation, data);
    default:
      return "Could not update profile"
  }
}
