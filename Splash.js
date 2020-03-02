import React from 'react';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import { firebaseApp } from './src/Public/config/firebase';

class Splash extends React.Component {
  componentDidMount() {
    const dbRef = firebaseApp.database();
    const authRef = firebaseApp.auth();
    authRef.onAuthStateChanged(user => {
      if (user) {
        dbRef.ref(`users/${user.uid}`).on('value', snap => {
          let snapVal = snap.val();
          this.props.setAppData('my', {
            uid: snap.key,
            profile: snapVal,
          });
          dbRef.ref(`/contacts/${user.uid}`).on('value', snap2 => {
            let snapVal2 = snap2.val();
            const newContactList = snapVal2 == null ? {} : snapVal2;
            this.props.setAppData('contacts', newContactList);
            this.props.setLoginData({ user, isLogin: true });
          });
        });
      } else {
        this.props.setLoginData({ isLogin: false });
      }
    });
    SplashScreen.hide();
  }
  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  setLoginData: data => {
    dispatch({
      type: 'AUTH_SET_LOGIN_DATA',
      data,
    });
  },
  setAppData: (key, data) => {
    dispatch({
      type: 'APP_SET_DATA',
      key,
      data,
    });
  },
  unsetAppData: key => {
    dispatch({
      type: 'APP_UNSET_DATA',
      key,
    });
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Splash);
