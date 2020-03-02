import React from 'react';
import { View } from 'react-native';
import { ListItem, Avatar, Divider } from 'react-native-elements';
import { firebaseApp } from '../../Public/config/firebase';
import { connect } from 'react-redux';

class ContactInfo extends React.Component {
  state = {
    id: '',
    profile: {},
  };
  componentDidMount() {
    const id = this.props.route.params.userId;
    const dbRef = firebaseApp.database();
    dbRef
      .ref(`users/${id}`)
      .once('value')
      .then(snap => {
        const snapVal = snap.val();
        this.setState({ profile: snapVal });
        this.setState({ id });
      });
  }

  handleChat() {
    const receiverId = this.props.route.params.userId;
    this.props.navigation.navigate('PersonalChat', { receiver: receiverId });
  }

  handleLocation() {
    const userId = this.props.route.params.userId;
    this.props.navigation.navigate('ViewUserLocation', { userId });
  }

  render() {
    return (
      <>
        <ListItem
          leftIcon={
            <Avatar
              source={
                this.state.profile.photoURL
                  ? { uri: this.state.profile.photoURL }
                  : require('../../Public/asset/images/avatar.png')
              }
              size="large"
              rounded
            />
          }
          title={this.state.profile.displayName}
        />
        <ListItem
          title="Display name"
          subtitle={this.state.profile.displayName}
          leftIcon={{ name: 'account-circle' }}
        />
        <ListItem
          title="Email"
          subtitle={this.state.profile.email}
          leftIcon={{ name: 'mail' }}
        />
        <ListItem
          title="Phone number"
          subtitle={this.state.profile.phoneNumber}
          leftIcon={{ name: 'call' }}
        />
        <ListItem
          title="Bio"
          subtitle={this.state.profile.bio}
          leftIcon={{ name: 'chat' }}
        />
        <Divider style={{ marginBottom: 32 }} />
        <Divider />
        <ListItem
          onPress={() => this.handleChat()}
          title="Chat"
          leftIcon={{ name: 'chat' }}
        />
        <ListItem
          onPress={() => this.handleLocation()}
          title="Show Location"
          leftIcon={{ name: 'my-location' }}
        />
        <Divider />
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
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
)(ContactInfo);
