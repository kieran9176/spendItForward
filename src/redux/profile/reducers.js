import actions from './actions'

const initialState = {
  username: "",
  firstName: "",
  lastName: "",
  articles: [
    {
      title: "",
      caption: "",
      url: ""
    },
    {
      title: "",
      caption: "",
      url: ""
    }
  ],
  references: [
    {
      content: "",
      author_name: "",
      author_company: "",
      author_position: ""
    },
    {
      content: "",
      author_name: "",
      author_company: "",
      author_position: ""
    }
  ],
  leadership: [
    {
      position: "",
      organization: "",
      id: "",
      account_id: ""
    }
  ],
  other: [
    {
      id: "",
      content: ""
    },
    {
      id: "",
      content: ""
    }
  ],
  intro: [
    {
      account_id: "",
      content: "",
      id: ""
    }
  ],
  siteMetadata: [{}],
  themeOptions: [{}],
  education: [{}],

  loading: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload };
    case actions.EDIT_PROFILE:
      console.log("STATE", state, "ACTION.PAYLOAD.DATA", action.payload.data)
      return { ...state, ...action.payload.data };
    case actions.CREATE_POST:
      state.posts.push(action.payload.data.post);
      return state;
    case actions.EDIT_POST:
      state.posts = state.posts.map(post => {
        if (post.id === action.payload.data.post.id) return action.payload.data.post;
        return post
      });
      return state;
    case actions.SELECT_THEME:
      state.siteMetadata = state.siteMetadata.map(metadata => {
        metadata.themeID = action.payload.data.themeID;
        metadata.theme = action.payload.data.themeName;
        return metadata
      });
      return state;
    case actions.EDIT_EDUCATION:
      state.education = action.payload;
      return state;
    case actions.DELETE_EDUCATION:
      state.education = state.education.filter(education => education.id !== action.data.id);
      return state;
    case actions.EDIT_ARTICLES:
      state.articles = action.payload;
      return state;
    case actions.DELETE_ARTICLES:
      state.articles = state.articles.filter(article => article.id !== action.data.id);
      return state;
    case actions.EDIT_BRAGS:
      state.brags = action.payload;
      return state;
    case actions.DELETE_BRAGS:
      state.brags = state.brags.filter(article => article.id !== action.data.id);
      return state;
    default:
      return state
  }
}
