import React from 'react';
import firebase from 'firebase';

class Navigator extends React.Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('Login');
      }
    });
    if (firebase.auth().currentUser) {
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  render() {
    return null;
  }
}

export default Navigator;
