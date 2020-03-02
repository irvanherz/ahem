import React from 'react';
import { StyleSheet, ToastAndroid, Text } from 'react-native';
import {
  ListItem,
  List,
  Icon,
  Avatar,
  Divider,
  Input,
} from 'react-native-elements';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { firebaseApp } from '../../../Public/config/firebase';
import Modal, {
  ModalContent,
  BottomModal,
  ModalTitle,
  ModalFooter,
  ModalButton,
} from 'react-native-modals';

class Profile extends React.Component {
  state = {
    showEditName: false,
    name: '',
    showEditPhoneNumber: false,
    phoneNumber: '',
    showEditBio: false,
    bio: '',
  };

  handleEditName() {
    const dbRef = firebaseApp.database();
    const authRef = firebaseApp.auth();
    let updateObject = {};

    authRef.currentUser
      .updateProfile({ displayName: this.state.name })
      .then(() => {
        const name = this.state.name;
        updateObject[`users/${this.props.app.my.uid}/displayName`] = name;
        return dbRef
          .ref('contacts')
          .orderByChild(`${this.props.app.my.uid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              updateObject[
                `contacts/${key}/${this.props.app.my.uid}/displayName`
              ] = name;
            });
          });
      })
      .then(() => {
        const name = this.state.name;
        return dbRef
          .ref('chats')
          .orderByChild(`members/${this.props.app.my.uid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              updateObject[
                `chats/${key}/members/${this.props.app.my.uid}/displayName`
              ] = name;
            });
          });
      })
      .then(() => {
        return dbRef
          .ref()
          .update(updateObject)
          .then(() => {
            ToastAndroid.show('Name changed succesfully.', ToastAndroid.SHORT);
          });
      })
      .catch(() => {
        ToastAndroid.show(
          'Failed to change name. Try again later.',
          ToastAndroid.SHORT,
        );
      });
  }

  handleEditBio() {
    const dbRef = firebaseApp.database();
    const authRef = firebaseApp.auth();
    let updateObject = {};

    const bio = this.state.bio;
    updateObject[`users/${this.props.app.my.uid}/bio`] = bio;
    return dbRef
      .ref('contacts')
      .orderByChild(`${this.props.app.my.uid}`)
      .startAt('')
      .once('value')
      .then(snap => {
        const snapVal = snap.val();
        const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
        otherUserKeys.forEach(key => {
          updateObject[`contacts/${key}/${this.props.app.my.uid}/bio`] = bio;
        });
      })
      .then(() => {
        const bio = this.state.bio;
        return dbRef
          .ref('chats')
          .orderByChild(`members/${this.props.app.my.uid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              updateObject[
                `chats/${key}/members/${this.props.app.my.uid}/bio`
              ] = bio;
            });
          });
      })
      .then(() => {
        return dbRef
          .ref()
          .update(updateObject)
          .then(() => {
            ToastAndroid.show('Bio changed succesfully.', ToastAndroid.SHORT);
          });
      })
      .catch(() => {
        ToastAndroid.show(
          'Failed to change bio. Try again later.',
          ToastAndroid.SHORT,
        );
      });
  }

  handleEditPhoneNumber() {
    const dbRef = firebaseApp.database();
    const authRef = firebaseApp.auth();
    let updateObject = {};

    const phoneNumber = this.state.phoneNumber;
    updateObject[`users/${this.props.app.my.uid}/phoneNumber`] = phoneNumber;
    return dbRef
      .ref('contacts')
      .orderByChild(`${this.props.app.my.uid}`)
      .startAt('')
      .once('value')
      .then(snap => {
        const snapVal = snap.val();
        const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
        otherUserKeys.forEach(key => {
          updateObject[
            `contacts/${key}/${this.props.app.my.uid}/phoneNumber`
          ] = phoneNumber;
        });
      })
      .then(() => {
        const phoneNumber = this.state.phoneNumber;
        return dbRef
          .ref('chats')
          .orderByChild(`members/${this.props.app.my.uid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              updateObject[
                `chats/${key}/members/${this.props.app.my.uid}/phoneNumber`
              ] = phoneNumber;
            });
          });
      })
      .then(() => {
        return dbRef
          .ref()
          .update(updateObject)
          .then(() => {
            ToastAndroid.show('Phone number changed succesfully.', ToastAndroid.SHORT);
          });
      })
      .catch(() => {
        ToastAndroid.show(
          'Failed to change phone number. Try again later.',
          ToastAndroid.SHORT,
        );
      });
  }

  handleLogout() {
    firebaseApp
      .auth()
      .signOut()
      .then(success => {
        this.props.setAppData('chats', {});
        ToastAndroid.show('Logout success', ToastAndroid.SHORT);
      });
  }
  handleChangePhoto() {
    let storageRef = firebaseApp.storage().ref();
    let authRef = firebaseApp.auth();
    let dbRef = firebaseApp.database();
    let updateObject = {};

    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      fetch(image.path)
        .then(res => {
          return res.blob();
        })
        .then(blob => {
          const extension = image.path.split('.').pop();
          return storageRef
            .child(`pictures/${this.props.app.my.uid}.${extension}`)
            .put(blob);
        })
        .then(snap => {
          return snap.ref.getDownloadURL();
        })
        .then(url => {
          return authRef.currentUser
            .updateProfile({ photoURL: url })
            .then(() => url);
        })
        .then(url => {
          updateObject[`users/${this.props.app.my.uid}/photoURL`] = url;
          return dbRef
            .ref('contacts')
            .orderByChild(`${this.props.app.my.uid}`)
            .startAt('')
            .once('value')
            .then(snap => {
              const snapVal = snap.val();
              const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
              otherUserKeys.forEach(key => {
                updateObject[
                  `contacts/${key}/${this.props.app.my.uid}/photoURL`
                ] = url;
              });
              return url;
            });
        })
        .then(url => {
          return dbRef
            .ref('chats')
            .orderByChild(`members/${this.props.app.my.uid}`)
            .startAt('')
            .once('value')
            .then(snap => {
              const snapVal = snap.val();
              const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
              otherUserKeys.forEach(key => {
                updateObject[
                  `chats/${key}/members/${this.props.app.my.uid}/photoURL`
                ] = url;
              });
            })
            .then(() => {
              return dbRef
                .ref()
                .update(updateObject)
                .then(() => {
                  ToastAndroid.show('Photo changed succesfully.', ToastAndroid.SHORT);
                });
            })
            .catch(() => {
              ToastAndroid.show(
                'Failed to change photo. Try again later.',
                ToastAndroid.SHORT,
              );
            });
        });
    });
  }

  renderEditName() {
    return (
      <Modal.BottomModal
        visible={this.state.showEditName}
        swipeDirection="down"
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Edit Name" />}
        onHardwareBackPress={() => this.setState({ showEditName: false })}
        onTouchOutside={e => this.setState({ showEditName: false })}
        onSwipeOut={e => this.setState({ showEditName: false })}>
        <ModalContent>
          <Input
            defaultValue={this.props.app.my.profile.displayName}
            placeholder="Name"
            onChangeText={text => this.setState({ name: text })}
          />
        </ModalContent>
        <ModalFooter>
          <ModalButton
            text="Cancel"
            onPress={() => this.setState({ showEditName: false })}
          />
          <ModalButton
            text="OK"
            onPress={() => {
              this.handleEditName();
              this.setState({ showEditName: false });
            }}
          />
        </ModalFooter>
      </Modal.BottomModal>
    );
  }

  renderEditPhoneNumber() {
    return (
      <Modal.BottomModal
        visible={this.state.showEditPhoneNumber}
        swipeDirection="down"
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Edit Phone Number" />}
        onHardwareBackPress={() =>
          this.setState({ showEditPhoneNumber: false })
        }
        onTouchOutside={e => this.setState({ showEditPhoneNumber: false })}
        onSwipeOut={e => this.setState({ showEditPhoneNumber: false })}>
        <ModalContent>
          <Input
            defaultValue={this.props.app.my.profile.phoneNumber}
            placeholder="081234567890"
            onChangeText={text => this.setState({ phoneNumber: text })}
          />
        </ModalContent>
        <ModalFooter>
          <ModalButton
            text="Cancel"
            onPress={() => this.setState({ showEditPhoneNumber: false })}
          />
          <ModalButton
            text="OK"
            onPress={() => {
              this.handleEditPhoneNumber();
              this.setState({ showEditPhoneNumber: false });
            }}
          />
        </ModalFooter>
      </Modal.BottomModal>
    );
  }

  renderEditBio() {
    return (
      <Modal.BottomModal
        visible={this.state.showEditBio}
        swipeDirection="down"
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Edit Bio" />}
        onHardwareBackPress={() => this.setState({ showEditBio: false })}
        onTouchOutside={e => this.setState({ showEditBio: false })}
        onSwipeOut={e => this.setState({ showEditBio: false })}>
        <ModalContent>
          <Input
            defaultValue={this.props.app.my.profile.bio}
            placeholder="Type something..."
            onChangeText={text => this.setState({ bio: text })}
          />
        </ModalContent>
        <ModalFooter>
          <ModalButton
            text="Cancel"
            onPress={() => this.setState({ showEditBio: false })}
          />
          <ModalButton
            text="OK"
            onPress={() => {
              this.handleEditBio();
              this.setState({ showEditBio: false });
            }}
          />
        </ModalFooter>
      </Modal.BottomModal>
    );
  }

  render() {
    return (
      <>
        <ListItem
          leftIcon={
            <Avatar
              onPress={() => this.handleChangePhoto()}
              source={
                this.props.app.my.profile.photoURL
                  ? { uri: this.props.app.my.profile.photoURL }
                  : require('../../../Public/asset/images/avatar.png')
              }
              size="large"
              showEditButton={true}
              rounded
              title="U"
            />
          }
          title={this.props.app.my.profile.displayName}
        />
        <ListItem
          title="Display name"
          subtitle={this.props.app.my.profile.displayName}
          leftIcon={{ name: 'account-circle' }}
          rightIcon={{ name: 'chevron-right' }}
          onPress={() => this.setState({ showEditName: true })}
        />
        <ListItem
          title="Email"
          subtitle={this.props.app.my.profile.email}
          leftIcon={{ name: 'mail' }}
          rightIcon={{ name: 'chevron-right' }}
        />
        <ListItem
          title="Phone number"
          subtitle={this.props.app.my.profile.phoneNumber}
          leftIcon={{ name: 'call' }}
          rightIcon={{ name: 'chevron-right' }}
          onPress={() => this.setState({ showEditPhoneNumber: true })}
        />
        <ListItem
          title="Bio"
          subtitle={this.props.app.my.profile.bio}
          leftIcon={{ name: 'note' }}
          rightIcon={{ name: 'chevron-right' }}
          onPress={() => this.setState({ showEditBio: true })}
        />
        <Divider style={{ marginBottom: 32 }} />
        <Divider />
        <ListItem
          onPress={() => this.handleLogout()}
          title="Logout"
          leftIcon={{ name: 'exit-to-app' }}
        />
        <Divider />
        {this.renderEditName()}
        {this.renderEditPhoneNumber()}
        {this.renderEditBio()}
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
)(Profile);
