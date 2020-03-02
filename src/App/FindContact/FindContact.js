import React from 'react';
import {
  ListItem,
  Icon,
  SearchBar,
  Input,
  Divider,
} from 'react-native-elements';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  View,
} from 'react-native';
import { firebaseApp } from '../../Public/config/firebase';
import { connect } from 'react-redux';

class FindContact extends React.Component {
  state = {
    q: '',
    users: {},
    userIds: [],
  };

  handleSearch() {
    const dbRef = firebaseApp.database();
    dbRef
      .ref('users')
      .orderByChild('displayName')
      .startAt(this.state.q)
      .endAt(this.state.q + '\uf8ff')
      .once('value', snap => {
        const snapVal = snap.val();
        if (snapVal !== null) {
          let snapKeys = Object.keys(snapVal);
          const myUid = this.props.app.my.uid;
          snapKeys = snapKeys.filter(key => key !== myUid);
          this.setState({ users: snapVal, userIds: snapKeys });
        }
      });
  }

  handleAddContact(newUserId) {
    const newUserData = this.state.users[newUserId];
    const dbRef = firebaseApp.database();
    dbRef
      .ref(`contacts/${this.props.app.my.uid}`)
      .child(newUserId)
      .set(newUserData)
      .then(() => {
        ToastAndroid.show('Add friend success!', ToastAndroid.SHORT);
      });
  }

  renderAddContact(newUserId) {
    if (this.props.app.contacts.hasOwnProperty(newUserId)) {
      return <Icon name="add" iconStyle={{ color: '#AAA' }} />;
    } else {
      return (
        <Icon
          name="add"
          iconStyle={{ color: 'blue' }}
          onPress={() => this.handleAddContact(newUserId)}
        />
      );
    }
  }

  renderListItem(userId) {
    return (
      <>
        <ListItem
          title={this.state.users[userId].displayName}
          subtitle={this.state.users[userId].email}
          subtitleProps={{ numberOfLines: 1 }}
          rightIcon={() => this.renderAddContact(userId)}
          leftAvatar={{
            source:
              this.state.users[userId] && this.state.users[userId].photoURL
                ? { uri: this.state.users[userId].photoURL }
                : require('../../Public/asset/images/avatar.png'),
          }}
        />
        <Divider />
      </>
    );
  }

  render() {
    return (
      <>
        <View style={{ padding: 8, backgroundColor: '#FFF' }}>
          <Input
            placeholder="Find a friend"
            leftIcon={{ name: 'search' }}
            onChangeText={text => this.setState({ q: text })}
            onSubmitEditing={() => this.handleSearch()}
            leftIconContainerStyle={{ marginLeft: 0 }}
            containerStyle={{ borderRadius: 24, borderWidth: 1 }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
          />
        </View>
        <Divider />
        <FlatList
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 90 }}
          data={this.state.userIds}
          renderItem={({ item }) => this.renderListItem(item)}
          keyExtractor={item => `${item}`}
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
});

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
)(FindContact);
