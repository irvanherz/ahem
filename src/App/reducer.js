const initialState = {
  chats: {},
  contacts: {},
  my: { profile: {} },
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'APP_SET_DATA':
      return {
        ...state,
        [action.key]: action.data,
      };
    case 'APP_UNSET_DATA':
      let newData = { ...state };
      delete newData[action.key];
      return newData;
    default:
      return state;
  }
};

export default app;
