import actions from './actions'

const initialState = {
  username: '',
  firstName: '',
  lastName: '',
  articles: [
    {
      title: '',
      caption: '',
      url: '',
    },
    {
      title: '',
      caption: '',
      url: '',
    },
  ],
  references: [
    {
      content: '',
      author_name: '',
      author_company: '',
      author_position: '',
    },
    {
      content: '',
      author_name: '',
      author_company: '',
      author_position: '',
    },
  ],
  leadership: [
    {
      position: '',
      organization: '',
      id: '',
      account_id: '',
    },
  ],
  other: [
    {
      id: '',
      content: '',
    },
    {
      id: '',
      content: '',
    },
  ],
  intro: [
    {
      account_id: '',
      content: '',
      id: '',
    },
  ],
  siteMetadata: [{}],
  themeOptions: [{}],
  education: [{}],

  loading: false,
}

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT_PROFILE:
      return { ...state, ...action.payload.data }
    case actions.EDIT_NAME:
      state.firstName = action.payload[0].first_name
      state.lastName = action.payload[0].last_name
      return state
    case actions.CURRENT_POST:
      state.currentPost = {
        id: action.payload.id ? action.payload.id : state.currentPost.id,
        status: action.payload.status ? action.payload.status : state.currentPost.id,
        saved: action.payload.saved ? action.payload.saved : state.currentPost.saved,
      }
      return state
    case actions.CREATE_POST:
      state.posts.push(action.post)
      return state
    case actions.EDIT_POST_LOCALLY:
      state.posts = state.posts.map(post => {
        if (post.id === action.payload.id) {
          return {
            id: action.payload.id,
            title: action.payload.title || post.title,
            html: action.payload.html || post.html,
            markdown: action.payload.markdown || post.markdown,
            image_url: action.payload.url || post.image_url,
            date_published: action.payload.date_published || post.date_published,
          }
        }
        return post
      })
      return state
    case actions.EDIT_POST:
      if (action.payload.status === 'new') {
        state.posts.push(action.payload)
        return state
      }
      state.posts = state.posts.map(post => {
        if (post.id === action.payload.id) return action.payload
        return post
      })
      return state
    case actions.EDIT_PRIMARY:
      state.assets = state.assets.map(asset => {
        if (asset.type === 'primary') {
          asset.url = action.payload.url
          return asset
        }
        return asset
      })
      return state
    case actions.EDIT_SECONDARY:
      state.assets = state.assets.map(asset => {
        if (asset.type === 'secondary') {
          asset.url = action.payload.url
          return asset
        }
        return asset
      })
      return state
    case actions.EDIT_RESUME:
      state.assets = state.assets.map(asset => {
        if (asset.type === 'resume') {
          asset.url = action.payload.url
          return asset
        }
        return asset
      })
      return state
    case actions.SELECT_THEME:
      state.siteMetadata = state.siteMetadata.map(metadata => {
        metadata.themeID = action.payload.data.themeID
        metadata.theme = action.payload.data.themeName
        return metadata
      })
      return state
    case actions.EDIT_INTRO:
      state.intro = [action.payload[0]]
      return state
    case actions.EDIT_EDUCATION:
      state.education = action.payload
      return state
    case actions.DELETE_EDUCATION:
      state.education = state.education.filter(education => education.id !== action.data.id)
      return state
    case actions.EDIT_ARTICLES:
      state.articles = action.payload
      return state
    case actions.DELETE_ARTICLES:
      state.articles = state.articles.filter(article => article.id !== action.data.id)
      return state
    case actions.EDIT_EXPERIENCE:
      state.experience = action.payload
      return state
    case actions.DELETE_EXPERIENCE:
      state.experience = state.experience.filter(exp => exp.id !== action.data.id)
      return state
    case actions.EDIT_LEADERSHIP:
      state.leadership = action.payload
      return state
    case actions.DELETE_LEADERSHIP:
      state.leadership = state.leadership.filter(leadership => leadership.id !== action.data.id)
      return state
    case actions.EDIT_REFERENCES:
      state.references = action.payload
      return state
    case actions.DELETE_REFERENCES:
      state.references = state.references.filter(reference => reference.id !== action.data.id)
      return state
    case actions.EDIT_SOCIALS:
      state.socials = action.payload
      return state
    case actions.DELETE_SOCIALS:
      state.socials = state.socials.filter(social => social.id !== action.data.id)
      return state
    case actions.EDIT_BRAGS:
      state.brags = action.payload
      return state
    case actions.DELETE_BRAGS:
      state.brags = state.brags.filter(article => article.id !== action.data.id)
      return state
    case actions.EDIT_FIRST_TIME_LOGIN:
      state.firstTimeLogin = action.payload
      return state
    case actions.EDIT_BUILD_STATUS:
      // eslint-disable-next-line no-case-declarations
      const buildStatus = action.payload
      // eslint-disable-next-line no-case-declarations
      state.buildStatus = buildStatus
      return state
    default:
      return state
  }
}
