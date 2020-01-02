/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addProfile = `mutation AddProfile($first_name: String, $last_name: String) {
  addProfile(first_name: $first_name, last_name: $last_name) {
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
export const addArticle = `mutation AddArticle(
  $account_id: String!
  $id: ID
  $title: String!
  $caption: String!
  $url: AWSURL!
) {
  addArticle(
    account_id: $account_id
    id: $id
    title: $title
    caption: $caption
    url: $url
  ) {
    id
    account_id
    title
    caption
    url
  }
}
`;
export const createProfile = `mutation CreateProfile($input: CreateProfileInput!) {
  createProfile(input: $input) {
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
export const updateProfile = `mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
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
export const deleteProfile = `mutation DeleteProfile($input: DeleteProfileInput!) {
  deleteProfile(input: $input) {
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
export const createArticle = `mutation CreateArticle($input: CreateArticleInput!) {
  createArticle(input: $input) {
    id
    account_id
    title
    caption
    url
  }
}
`;
export const updateArticle = `mutation UpdateArticle($input: UpdateArticleInput!) {
  updateArticle(input: $input) {
    id
    account_id
    title
    caption
    url
  }
}
`;
export const deleteArticle = `mutation DeleteArticle($input: DeleteArticleInput!) {
  deleteArticle(input: $input) {
    id
    account_id
    title
    caption
    url
  }
}
`;
export const createReference = `mutation CreateReference($input: CreateReferenceInput!) {
  createReference(input: $input) {
    id
    account_id
    content
    author_name
    author_position
    author_company
  }
}
`;
export const updateReference = `mutation UpdateReference($input: UpdateReferenceInput!) {
  updateReference(input: $input) {
    id
    account_id
    content
    author_name
    author_position
    author_company
  }
}
`;
export const deleteReference = `mutation DeleteReference($input: DeleteReferenceInput!) {
  deleteReference(input: $input) {
    id
    account_id
    content
    author_name
    author_position
    author_company
  }
}
`;
export const createExperience = `mutation CreateExperience($input: CreateExperienceInput!) {
  createExperience(input: $input) {
    position
    start_date
    end_date
    company
    link
  }
}
`;
export const updateExperience = `mutation UpdateExperience($input: UpdateExperienceInput!) {
  updateExperience(input: $input) {
    id
    position
    start_date
    end_date
    company
    link
  }
}
`;
export const deleteExperience = `mutation DeleteExperience($input: DeleteExperienceInput!) {
  deleteExperience(input: $input) {
    id
  }
}
`;
export const createLeadership = `mutation CreateLeadership($input: CreateLeadershipInput!) {
  createLeadership(input: $input) {
    id
    account_id
    position
    start_date
    end_date
    organization
    link
  }
}
`;
export const updateLeadership = `mutation UpdateLeadership($input: UpdateLeadershipInput!) {
  updateLeadership(input: $input) {
    id
    account_id
    position
    start_date
    end_date
    organization
    link
  }
}
`;
export const deleteLeadership = `mutation DeleteLeadership($input: DeleteLeadershipInput!) {
  deleteLeadership(input: $input) {
    id
  }
}
`;
export const createOther = `mutation CreateOther($input: CreateOtherInput!) {
  createOther(input: $input) {
    id
    account_id
    content
  }
}
`;
export const updateOther = `mutation UpdateOther($input: UpdateOtherInput!) {
  updateOther(input: $input) {
    id
    account_id
    content
  }
}
`;
export const deleteOther = `mutation DeleteOther($input: DeleteOtherInput!) {
  deleteOther(input: $input) {
    id
    account_id
    content
  }
}
`;
export const createIntro = `mutation CreateIntro($input: CreateIntroInput!) {
  createIntro(input: $input) {
    id
    account_id
    content
  }
}
`;
export const updateIntro = `mutation UpdateIntro($input: UpdateIntroInput!) {
  updateIntro(input: $input) {
    id
    account_id
    content
  }
}
`;
export const deleteIntro = `mutation DeleteIntro($input: DeleteIntroInput!) {
  deleteIntro(input: $input) {
    id
    account_id
    content
  }
}
`;
export const createSkill = `mutation CreateSkill($input: CreateSkillInput!) {
  createSkill(input: $input) {
    id
    content
  }
}
`;
export const updateSkill = `mutation UpdateSkill($input: UpdateSkillInput!) {
  updateSkill(input: $input) {
    id
    account_id
    content
  }
}
`;
export const deleteSkill = `mutation DeleteSkill($input: DeleteSkillInput!) {
  deleteSkill(input: $input) {
    id
    content
  }
}
`;
export const createCoursework = `mutation CreateCoursework($input: CreateCourseworkInput!) {
  createCoursework(input: $input) {
    id
    course_name
  }
}
`;
export const updateCoursework = `mutation UpdateCoursework($input: UpdateCourseworkInput!) {
  updateCoursework(input: $input) {
    id
    account_id
    course_name
  }
}
`;
export const deleteCoursework = `mutation DeleteCoursework($input: DeleteCourseworkInput!) {
  deleteCoursework(input: $input) {
    id
    account_id
    course_name
  }
}
`;
export const createContact = `mutation CreateContact($input: CreateContactInput!) {
  createContact(input: $input) {
    id
    account_id
    email
    phone
  }
}
`;
export const updateContact = `mutation UpdateContact($input: UpdateContactInput!) {
  updateContact(input: $input) {
    id
    account_id
    email
    phone
  }
}
`;
export const deleteContact = `mutation DeleteContact($input: DeleteContactInput!) {
  deleteContact(input: $input) {
    id
    account_id
    email
    phone
  }
}
`;
export const createPost = `mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    title
    caption
    markdown
    html
    image_url
    date_published
    series
  }
}
`;
export const updatePost = `mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    id
    title
    caption
    markdown
    html
    image_url
    date_published
    series
  }
}
`;
