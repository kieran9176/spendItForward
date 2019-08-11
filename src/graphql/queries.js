/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const articles = `query Articles {
  articles {
    id
    account_id
    title
    caption
    url
  }
}
`;
export const getProfile = `query GetProfile($account_id: String!) {
  getProfile(account_id: $account_id) {
    id
    account_id
    username
    first_name
    last_name
    articles {
      id
      account_id
      title
      caption
      url
    }
    references {
      id
      account_id
      content
      author_name
      author_position
      author_company
    }
    experience {
      id
      account_id
      position
      date
      company
      link
    }
    leadership {
      id
      account_id
      position
      date
      organization
      link
    }
    other {
      id
      account_id
      content
    }
    intro {
      id
      account_id
      content
    }
    skills {
      id
      account_id
      content
    }
    coursework {
      id
      account_id
      course_name
    }
    contact {
      id
      account_id
      email
      phone
    }
  }
}
`;
export const listProfiles = `query ListProfiles(
  $filter: TableProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      username
      first_name
      last_name
      articles {
        id
        account_id
        title
        caption
        url
      }
      references {
        id
        account_id
        content
        author_name
        author_position
        author_company
      }
      experience {
        id
        account_id
        position
        date
        company
        link
      }
      leadership {
        id
        account_id
        position
        date
        organization
        link
      }
      other {
        id
        account_id
        content
      }
      intro {
        id
        account_id
        content
      }
      skills {
        id
        account_id
        content
      }
      coursework {
        id
        account_id
        course_name
      }
      contact {
        id
        account_id
        email
        phone
      }
    }
    nextToken
  }
}
`;
export const getArticle = `query GetArticle($id: ID!) {
  getArticle(id: $id) {
    id
    account_id
    title
    caption
    url
  }
}
`;
export const listArticles = `query ListArticles(
  $filter: TableArticleFilterInput
  $limit: Int
  $nextToken: String
) {
  listArticles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      title
      caption
      url
    }
    nextToken
  }
}
`;
export const queryArticlesByIdAccountIdIndex = `query QueryArticlesByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryArticlesByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      title
      caption
      url
    }
    nextToken
  }
}
`;
export const getReference = `query GetReference($id: ID!) {
  getReference(id: $id) {
    id
    account_id
    content
    author_name
    author_position
    author_company
  }
}
`;
export const listReferences = `query ListReferences(
  $filter: TableReferenceFilterInput
  $limit: Int
  $nextToken: String
) {
  listReferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      content
      author_name
      author_position
      author_company
    }
    nextToken
  }
}
`;
export const queryReferencesByIdAccountIdIndex = `query QueryReferencesByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryReferencesByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      content
      author_name
      author_position
      author_company
    }
    nextToken
  }
}
`;
export const getExperience = `query GetExperience($id: ID!) {
  getExperience(id: $id) {
    id
    account_id
    position
    date
    company
    link
  }
}
`;
export const listExperiences = `query ListExperiences(
  $filter: TableExperienceFilterInput
  $limit: Int
  $nextToken: String
) {
  listExperiences(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      position
      date
      company
      link
    }
    nextToken
  }
}
`;
export const queryExperiencesByIdAccountIdIndex = `query QueryExperiencesByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryExperiencesByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      position
      date
      company
      link
    }
    nextToken
  }
}
`;
export const getLeadership = `query GetLeadership($id: ID!) {
  getLeadership(id: $id) {
    id
    account_id
    position
    date
    organization
    link
  }
}
`;
export const listLeaderships = `query ListLeaderships(
  $filter: TableLeadershipFilterInput
  $limit: Int
  $nextToken: String
) {
  listLeaderships(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      position
      date
      organization
      link
    }
    nextToken
  }
}
`;
export const queryLeadershipsByIdAccountIdIndex = `query QueryLeadershipsByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryLeadershipsByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      position
      date
      organization
      link
    }
    nextToken
  }
}
`;
export const getOther = `query GetOther($id: ID!) {
  getOther(id: $id) {
    id
    account_id
    content
  }
}
`;
export const listOthers = `query ListOthers(
  $filter: TableOtherFilterInput
  $limit: Int
  $nextToken: String
) {
  listOthers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      content
    }
    nextToken
  }
}
`;
export const queryOthersByIdAccountIdIndex = `query QueryOthersByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryOthersByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      content
    }
    nextToken
  }
}
`;
export const getIntro = `query GetIntro($id: ID!) {
  getIntro(id: $id) {
    id
    account_id
    content
  }
}
`;
export const listIntros = `query ListIntros(
  $filter: TableIntroFilterInput
  $limit: Int
  $nextToken: String
) {
  listIntros(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      content
    }
    nextToken
  }
}
`;
export const queryIntrosByIdAccountIdIndex = `query QueryIntrosByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryIntrosByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      content
    }
    nextToken
  }
}
`;
export const getSkill = `query GetSkill($id: ID!) {
  getSkill(id: $id) {
    id
    account_id
    content
  }
}
`;
export const listSkills = `query ListSkills(
  $filter: TableSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  listSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      content
    }
    nextToken
  }
}
`;
export const querySkillsByIdAccountIdIndex = `query QuerySkillsByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  querySkillsByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      content
    }
    nextToken
  }
}
`;
export const getCoursework = `query GetCoursework($id: ID!) {
  getCoursework(id: $id) {
    id
    account_id
    course_name
  }
}
`;
export const listCourseworks = `query ListCourseworks(
  $filter: TableCourseworkFilterInput
  $limit: Int
  $nextToken: String
) {
  listCourseworks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      course_name
    }
    nextToken
  }
}
`;
export const queryCourseworksByIdAccountIdIndex = `query QueryCourseworksByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryCourseworksByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      course_name
    }
    nextToken
  }
}
`;
export const getContact = `query GetContact($id: ID!) {
  getContact(id: $id) {
    id
    account_id
    email
    phone
  }
}
`;
export const listContacts = `query ListContacts(
  $filter: TableContactFilterInput
  $limit: Int
  $nextToken: String
) {
  listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      account_id
      email
      phone
    }
    nextToken
  }
}
`;
export const queryContactsByIdAccountIdIndex = `query QueryContactsByIdAccountIdIndex(
  $account_id: String!
  $first: Int
  $after: String
) {
  queryContactsByIdAccountIdIndex(
    account_id: $account_id
    first: $first
    after: $after
  ) {
    items {
      id
      account_id
      email
      phone
    }
    nextToken
  }
}
`;
