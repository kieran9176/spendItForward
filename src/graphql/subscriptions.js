/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProfile = `subscription OnCreateProfile(
  $id: ID
  $account_id: String
  $username: String
  $first_name: String
  $last_name: String
) {
  onCreateProfile(
    id: $id
    account_id: $account_id
    username: $username
    first_name: $first_name
    last_name: $last_name
  ) {
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
`
export const onUpdateProfile = `subscription OnUpdateProfile(
  $id: ID
  $account_id: String
  $username: String
  $first_name: String
  $last_name: String
) {
  onUpdateProfile(
    id: $id
    account_id: $account_id
    username: $username
    first_name: $first_name
    last_name: $last_name
  ) {
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
`
export const onDeleteProfile = `subscription OnDeleteProfile(
  $id: ID
  $account_id: String
  $username: String
  $first_name: String
  $last_name: String
) {
  onDeleteProfile(
    id: $id
    account_id: $account_id
    username: $username
    first_name: $first_name
    last_name: $last_name
  ) {
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
`
export const onCreateArticle = `subscription OnCreateArticle(
  $id: ID
  $account_id: String
  $title: String
  $caption: String
  $url: AWSURL
) {
  onCreateArticle(
    id: $id
    account_id: $account_id
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
`
export const onUpdateArticle = `subscription OnUpdateArticle(
  $id: ID
  $account_id: String
  $title: String
  $caption: String
  $url: AWSURL
) {
  onUpdateArticle(
    id: $id
    account_id: $account_id
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
`
export const onDeleteArticle = `subscription OnDeleteArticle(
  $id: ID
  $account_id: String
  $title: String
  $caption: String
  $url: AWSURL
) {
  onDeleteArticle(
    id: $id
    account_id: $account_id
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
`
export const onCreateReference = `subscription OnCreateReference(
  $id: ID
  $account_id: String
  $content: String
  $author_name: String
  $author_position: String
) {
  onCreateReference(
    id: $id
    account_id: $account_id
    content: $content
    author_name: $author_name
    author_position: $author_position
  ) {
    id
    account_id
    content
    author_name
    author_position
    author_company
  }
}
`
export const onUpdateReference = `subscription OnUpdateReference(
  $id: ID
  $account_id: String
  $content: String
  $author_name: String
  $author_position: String
) {
  onUpdateReference(
    id: $id
    account_id: $account_id
    content: $content
    author_name: $author_name
    author_position: $author_position
  ) {
    id
    account_id
    content
    author_name
    author_position
    author_company
  }
}
`
export const onDeleteReference = `subscription OnDeleteReference(
  $id: ID
  $account_id: String
  $content: String
  $author_name: String
  $author_position: String
) {
  onDeleteReference(
    id: $id
    account_id: $account_id
    content: $content
    author_name: $author_name
    author_position: $author_position
  ) {
    id
    account_id
    content
    author_name
    author_position
    author_company
  }
}
`
export const onCreateExperience = `subscription OnCreateExperience(
  $id: ID
  $account_id: String
  $position: String
  $date: String
  $company: String
) {
  onCreateExperience(
    id: $id
    account_id: $account_id
    position: $position
    date: $date
    company: $company
  ) {
    id
    account_id
    position
    date
    company
    link
  }
}
`
export const onUpdateExperience = `subscription OnUpdateExperience(
  $id: ID
  $account_id: String
  $position: String
  $date: String
  $company: String
) {
  onUpdateExperience(
    id: $id
    account_id: $account_id
    position: $position
    date: $date
    company: $company
  ) {
    id
    account_id
    position
    date
    company
    link
  }
}
`
export const onDeleteExperience = `subscription OnDeleteExperience(
  $id: ID
  $account_id: String
  $position: String
  $date: String
  $company: String
) {
  onDeleteExperience(
    id: $id
    account_id: $account_id
    position: $position
    date: $date
    company: $company
  ) {
    id
    account_id
    position
    date
    company
    link
  }
}
`
export const onCreateLeadership = `subscription OnCreateLeadership(
  $id: ID
  $account_id: String
  $position: String
  $date: String
  $organization: String
) {
  onCreateLeadership(
    id: $id
    account_id: $account_id
    position: $position
    date: $date
    organization: $organization
  ) {
    id
    account_id
    position
    date
    organization
    link
  }
}
`
export const onUpdateLeadership = `subscription OnUpdateLeadership(
  $id: ID
  $account_id: String
  $position: String
  $date: String
  $organization: String
) {
  onUpdateLeadership(
    id: $id
    account_id: $account_id
    position: $position
    date: $date
    organization: $organization
  ) {
    id
    account_id
    position
    date
    organization
    link
  }
}
`
export const onDeleteLeadership = `subscription OnDeleteLeadership(
  $id: ID
  $account_id: String
  $position: String
  $date: String
  $organization: String
) {
  onDeleteLeadership(
    id: $id
    account_id: $account_id
    position: $position
    date: $date
    organization: $organization
  ) {
    id
    account_id
    position
    date
    organization
    link
  }
}
`
export const onCreateOther = `subscription OnCreateOther($id: ID, $account_id: String, $content: AWSJSON) {
  onCreateOther(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onUpdateOther = `subscription OnUpdateOther($id: ID, $account_id: String, $content: AWSJSON) {
  onUpdateOther(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onDeleteOther = `subscription OnDeleteOther($id: ID, $account_id: String, $content: AWSJSON) {
  onDeleteOther(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onCreateIntro = `subscription OnCreateIntro($id: ID, $account_id: String, $content: String) {
  onCreateIntro(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onUpdateIntro = `subscription OnUpdateIntro($id: ID, $account_id: String, $content: String) {
  onUpdateIntro(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onDeleteIntro = `subscription OnDeleteIntro($id: ID, $account_id: String, $content: String) {
  onDeleteIntro(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onCreateSkill = `subscription OnCreateSkill($id: ID, $account_id: String, $content: String) {
  onCreateSkill(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onUpdateSkill = `subscription OnUpdateSkill($id: ID, $account_id: String, $content: String) {
  onUpdateSkill(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onDeleteSkill = `subscription OnDeleteSkill($id: ID, $account_id: String, $content: String) {
  onDeleteSkill(id: $id, account_id: $account_id, content: $content) {
    id
    account_id
    content
  }
}
`
export const onCreateCoursework = `subscription OnCreateCoursework(
  $id: ID
  $account_id: String
  $course_name: String
) {
  onCreateCoursework(
    id: $id
    account_id: $account_id
    course_name: $course_name
  ) {
    id
    account_id
    course_name
  }
}
`
export const onUpdateCoursework = `subscription OnUpdateCoursework(
  $id: ID
  $account_id: String
  $course_name: String
) {
  onUpdateCoursework(
    id: $id
    account_id: $account_id
    course_name: $course_name
  ) {
    id
    account_id
    course_name
  }
}
`
export const onDeleteCoursework = `subscription OnDeleteCoursework(
  $id: ID
  $account_id: String
  $course_name: String
) {
  onDeleteCoursework(
    id: $id
    account_id: $account_id
    course_name: $course_name
  ) {
    id
    account_id
    course_name
  }
}
`
export const onCreateContact = `subscription OnCreateContact(
  $id: ID
  $account_id: String
  $email: AWSEmail
  $phone: AWSPhone
) {
  onCreateContact(
    id: $id
    account_id: $account_id
    email: $email
    phone: $phone
  ) {
    id
    account_id
    email
    phone
  }
}
`
export const onUpdateContact = `subscription OnUpdateContact(
  $id: ID
  $account_id: String
  $email: AWSEmail
  $phone: AWSPhone
) {
  onUpdateContact(
    id: $id
    account_id: $account_id
    email: $email
    phone: $phone
  ) {
    id
    account_id
    email
    phone
  }
}
`
export const onDeleteContact = `subscription OnDeleteContact(
  $id: ID
  $account_id: String
  $email: AWSEmail
  $phone: AWSPhone
) {
  onDeleteContact(
    id: $id
    account_id: $account_id
    email: $email
    phone: $phone
  ) {
    id
    account_id
    email
    phone
  }
}
`
export const onCreateSiteMetadata = `subscription OnCreateSiteMetadata(
  $id: ID
  $development_url: AWSURL
  $production_url: AWSURL
  $appId: String
  $repoUrl: String
) {
  onCreateSiteMetadata(
    id: $id
    development_url: $development_url
    production_url: $production_url
    appId: $appId
    repoUrl: $repoUrl
  ) {
    id
    development_url
    production_url
    appId
    repoUrl
  }
}
`

export const onCreateSiteMetadata2 = `subscription onCreateSiteMetadata($account_id: String) {
  onCreateSiteMetadata (
    account_id: $account_id
  ) {
    id
    development_url
    appId
    repoUrl
    theme
  }
}
`
