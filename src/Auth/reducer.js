const initialState = {
  user: {},
  isLogin: true,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_SET_LOGIN_DATA':
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export default auth;
