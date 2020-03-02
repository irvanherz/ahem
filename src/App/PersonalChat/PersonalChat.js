import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { firebaseApp } from '../../Public/config/firebase';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Icon, Avatar } from 'react-native-elements';

class PersonalChat extends React.Component {
  state = {
    chatId: '',
    messages: [],
  };

  componentWillMount() {
    const dbRef = firebaseApp.database();
    const myUid = this.props.app.my.uid;
    const toUid = this.props.route.params.receiver;

    if (this.props.route.params.chatId !== undefined) {
      this.setState({ chatId: this.props.route.params.chatId });
      this.addChatListener(this.props.route.params.chatId);
    } else {
      const myChats = Object.keys(this.props.app.chats);
      const existingChat = myChats.find(id => {
        if (this.props.app.chats[id].members[toUid] !== undefined) {
          return true;
        } else {
          return false;
        }
      });
      if (existingChat !== undefined) {
        this.setState({ chatId: existingChat });
        this.addChatListener(existingChat);
      } else {
        dbRef
          .ref('chats')
          .push({
            lastMessage: {
              text: '',
              createdAt: firebase.database.ServerValue.TIMESTAMP,
              user: { _id: '' },
            },
            members: {
              [myUid]: this.props.app.my.profile,
              [toUid]: this.props.app.contacts[toUid],
            },
          })
          .then(snap => {
            this.setState({ chatId: snap.key });
            this.addChatListener(snap.key);
          });
      }
    }
  }

  addChatListener(chatId) {
    const dbRef = firebaseApp.database();

    dbRef.ref(`messages/${chatId}`).on('child_added', snap => {
      const snapVal = snap.val();
      if (snapVal != null) {
        console.log('child_added');
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, [snapVal]),
        }));
      }
    });
  }

  componentWillUnmount() {
    const dbRef = firebaseApp.database();
    dbRef.ref(`messages/${this.state.chatId}`).off('child_added');
  }

  handleLocation() {
    this.props.navigation.navigate('SelectLocation');
  }

  onSend(messages = []) {
    const message = messages[0];
    message.createdAt = firebase.database.ServerValue.TIMESTAMP;
    const dbRef = firebaseApp.database();
    dbRef
      .ref(`messages/${this.state.chatId}`)
      .push(message)
      .then(() => {
        dbRef
          .ref(`chats/${this.state.chatId}`)
          .update({ lastMessage: message });
      });
  }

  render() {
    return (
      <GiftedChat
        inverted={true}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        renderAvatar={props => {
          const userId = props.currentMessage.user._id;
          const userProfile = this.props.app.chats[this.state.chatId].members[
            userId
          ];
          return (
            <Avatar
              rounded
              size="40"
              source={
                userProfile && userProfile.photoURL
                  ? { uri: userProfile.photoURL }
                  : require('../../Public/asset/images/avatar.png')
              }
            />
          );
        }}
        user={{
          _id: this.props.app.my.uid,
        }}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setLoginData: data => {
    dispatch({
      type: 'AUTH_SET_LOGIN_DATA',
      data,
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
)(PersonalChat);
