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
  loading: false
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT_PROFILE:
      console.log("STATE", state, "ACTION.PAYLOAD.DATA", action.payload.data)
      return { ...state, ...action.payload.data }
    case actions.CREATE_POST:
      state.posts.push(action.payload.data.post);
      return state
    case actions.EDIT_POST:
      state.posts = state.posts.map(post => {
          if (post.id === action.payload.data.post.id) return action.payload.data.post;
          return post
        });
      return state;
    default:
      return state
  }
}
