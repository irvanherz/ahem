import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import { GiftedChat, utils } from 'react-native-gifted-chat';
import { Badge, ListItem, Divider, Icon, Avatar } from 'react-native-elements';
import { firebaseApp } from '../../../Public/config/firebase';
import { connect } from 'react-redux';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from 'react-native-push-notification';

class ChatListItem extends React.Component {
  parseTime(timeString) {
    const now = moment();
    const chatTime = moment(timeString);
    if (now.diff(chatTime, 'days') < 1) {
      return chatTime.format('HH:mm');
    } else if (now.diff(chatTime, 'days') === 1) {
      return 'Yesterday';
    } else {
      return chatTime.format('DD/MM/YYYY');
    }
  }

  render() {
    const chatId = this.props.chatId;
    const chatObject = this.props.app.chats[chatId];
    const chatMembers = Object.keys(chatObject.members);
    const receiverId =
      chatMembers[0] !== this.props.app.my.uid
        ? chatMembers[0]
        : chatMembers[1];
    const receiver = chatObject.members[receiverId];
    return (
      <>
        <ListItem
          title={receiver.displayName}
          subtitle={chatObject.lastMessage.text}
          subtitleProps={{ numberOfLines: 1 }}
          rightTitle={this.parseTime(chatObject.lastMessage.createdAt)}
          onPress={() =>
            this.props.navigation.navigate('PersonalChat', {
              chatId: chatId,
            })
          }
          leftAvatar={
            <>
              <Avatar
                rounded
                large
                name="menu"
                source={
                  receiver.photoURL
                    ? { uri: receiver.photoURL }
                    : require('../../../Public/asset/images/avatar.png')
                }
                title="U"
                onPress={() =>
                  this.props.navigation.navigate('ContactInfo', {
                    userId: receiverId,
                  })
                }
              />
            </>
          }
        />
        <Divider />
      </>
    );
  }
}

class ChatList extends React.Component {
  sortChats(chats) {
    let chatEntries = Object.entries(chats);
    chatEntries = chatEntries.sort(
      (a, b) => b[1].lastMessage.createdAt - a[1].lastMessage.createdAt,
    );
    return Object.fromEntries(chatEntries);
  }

  updateMyLocation() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Ahem',
        message: 'Please allow Ahem to access your location.',
      },
    )
      .then(status => {
        return new Promise((resolve, reject) => {
          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              position => {
                resolve(position);
              },
              error => {
                reject(error);
              },
            );
          } else {
            reject(new Error('Location permission not granted'));
          }
        });
      })
      .catch(error => {
        ToastAndroid.show('Cannot access your location', ToastAndroid.SHORT);
      })
      .then(position => {
        const updateObject = {};
        const dbRef = firebaseApp.database();
        const myPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        updateObject[`/users/${this.props.app.my.uid}/position`] = myPosition;
        dbRef
          .ref('contacts')
          .orderByChild(`${this.props.app.my.uid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              updateObject[
                `contacts/${key}/${this.props.app.my.uid}/position`
              ] = myPosition;
            });
          })
          .then(() => {
            dbRef
              .ref('chats')
              .orderByChild(`members/${this.props.app.my.uid}`)
              .startAt('')
              .once('value')
              .then(snap => {
                const snapVal = snap.val();
                const otherUserKeys =
                  snapVal == null ? [] : Object.keys(snapVal);
                otherUserKeys.forEach(key => {
                  updateObject[
                    `chats/${key}/members/${this.props.app.my.uid}/position`
                  ] = myPosition;
                });
              });
          })
          .then(() => {
            dbRef.ref().update(updateObject);
          });
      });
  }

  componentDidMount() {
    const myUid = this.props.app.my.uid;
    const dbRef = firebaseApp.database();
    this.updateMyLocation();

    //Get my '/chats'
    dbRef
      .ref('/chats')
      .orderByChild(`members/${myUid}`)
      .startAt('')
      .on('child_added', snap => {
        const newChat = snap.val();
        if (newChat.members[myUid] !== undefined) {
          let newChatList = this.props.app.chats;
          newChatList[snap.key] = newChat;
          newChatList = this.sortChats(newChatList);
          this.props.setAppData('chats', newChatList);
          //show notif
          const fromUid = newChat.lastMessage.user._id;
          if (fromUid !== this.props.app.my.uid) {
            const notifTitle = 'New message';
            const notifMessage = newChat.lastMessage.text;
            PushNotification.localNotification({
              title: notifTitle,
              message: notifMessage,
            });
          }
        }
      });
    dbRef
      .ref('/chats')
      .orderByChild(`members/${myUid}`)
      .startAt('')
      .on('child_changed', snap => {
        let newChat = snap.val();
        let newChats = this.props.app.chats;
        newChats[snap.key] = newChat;
        newChats = this.sortChats(newChats);
        this.props.setAppData('chats', newChats);
        //show notif
        const fromUid = newChat.lastMessage.user._id;
        if (fromUid !== this.props.app.my.uid) {
          const notifTitle = 'New message';
          const notifMessage = newChat.lastMessage.text;
          PushNotification.localNotification({
            title: notifTitle,
            message: notifMessage,
          });
        }
      });
  }

  render() {
    const chatIdList = Object.keys(this.props.app.chats);
    return (
      <>
        <FlatList
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 90 }}
          data={chatIdList}
          renderItem={({ item }) => (
            <>
              <ChatListItem {...this.props} chatId={item} />
            </>
          )}
          keyExtractor={item => `${item.id}`}
        />
        <Icon
          raised
          onPress={() => this.props.navigation.navigate('SelectContact')}
          name="message"
          type="MaterialIcon"
          color="#071E34"
          containerStyle={styles.fab}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

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
)(ChatList);
