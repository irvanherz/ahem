import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { firebaseApp } from '../../Public/config/firebase';
import { ListItem, Divider } from 'react-native-elements';

class SelectContact extends React.Component {
  componentDidMount() {
    const myUid = this.props.app.my.uid;
    const dbRef = firebaseApp.database();

    dbRef.ref(`/contacts/${myUid}`).once('value', snap => {
      const snapVal = snap.val();
      const newContactList = snapVal == null ? {} : snapVal;
      this.props.setAppData('contacts', newContactList);
    });

    dbRef.ref(`/contacts/${myUid}`).on('child_added', snap => {
      const newContactList = this.props.app.contacts;
      newContactList[snap.key] = snap.val();
      this.props.setAppData('contacts', newContactList);
    });
  }

  renderHeader() {
    return (
      <>
        <ListItem
          title="Add a contact"
          leftAvatar={{ icon: { name: 'add' } }}
          onPress={() => this.props.navigation.navigate('FindContact')}
          containerStyle={{ backgroundColor: '#E5FFD5' }}
        />
        <Divider />
      </>
    );
  }
  renderItem(userId) {
    return (
      <>
        <ListItem
          title={this.props.app.contacts[userId].displayName}
          subtitle={this.props.app.contacts[userId].email}
          subtitleProps={{ numberOfLines: 1 }}
          leftAvatar={{
            source:
              this.props.app.contacts[userId] &&
              this.props.app.contacts[userId].photoURL
                ? { uri: this.props.app.contacts[userId].photoURL }
                : require('../../Public/asset/images/avatar.png'),
          }}
          onPress={() =>
            this.props.navigation.replace('PersonalChat', { receiver: userId })
          }
        />
        <Divider />
      </>
    );
  }

  render() {
    const contactUidList = Object.keys(this.props.app.contacts);
    return (
      <>
        <FlatList
          style={styles.container}
          data={contactUidList}
          ListHeaderComponent={() => this.renderHeader()}
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={item => `${item.id}`}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderBottomWidth: 1,
  },
  listContainer: {
    borderColor: '#AAA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  listAvatar: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 8,
  },
  listRightContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  listRightTopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listRightTopText: {
    fontWeight: 'bold',
  },
  listRightBottomContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  listRightBottomText: {},
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
)(SelectContact);
