import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button } from 'react-native-elements';
import { firebaseApp } from '../../Public/config/firebase';
import { connect } from 'react-redux';

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    isLoading: false,
  };
  handleLogin() {
    const authRef = firebaseApp.auth();
    const dbRef = firebaseApp.database();
    this.setState({ isLoading: true });
    authRef
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(userCredential => {
        const myUid = userCredential.user.uid;
        dbRef.ref(`users/${myUid}`).on('value', snap => {
          let snapVal = snap.val();
          this.props.setAppData('my', {
            uid: myUid,
            profile: snapVal,
          });
        });
        dbRef.ref(`/contacts/${myUid}`).on('value', snap2 => {
          let snapVal2 = snap2.val();
          const newContactList = snapVal2 == null ? {} : snapVal2;
          this.props.setAppData('contacts', newContactList);
        });
        this.setState({ isLoading: false });
        ToastAndroid.show('Login success', ToastAndroid.SHORT);
      })
      .catch(error => {
        var errorMessage = error.message;
        this.setState({ isLoading: false });
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ margin: 32 }}>
          <Image
            source={require('../../Public/asset/images/logo256.png')}
            style={{
              width: 128,
              height: 128,
              alignSelf: 'center',
              marginBottom: 32,
            }}
          />
          <Input
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
            placeholder="Email"
            containerStyle={{
              backgroundColor: '#FFF',
              borderRadius: 30,
              marginBottom: 32,
              elevation: 8,
            }}
            leftIconContainerStyle={{
              marginLeft: 0,
            }}
            inputContainerStyle={{
              paddingLeft: 0,
              borderBottomWidth: 0,
            }}
            leftIcon={<MaterialIcon name="person" size={20} />}
          />
          <Input
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            secureTextEntry
            placeholder="Password"
            containerStyle={{
              backgroundColor: '#FFF',
              borderRadius: 30,
              marginBottom: 32,
              elevation: 8,
            }}
            leftIconContainerStyle={{
              marginLeft: 0,
            }}
            inputContainerStyle={{
              paddingLeft: 0,
              borderBottomWidth: 0,
            }}
            leftIcon={<MaterialIcon name="vpn-key" size={20} />}
          />
          <Button
            title="Login"
            loading={this.state.isLoading}
            disabled={this.state.isLoading}
            buttonStyle={{ borderRadius: 30 }}
            onPress={() => this.handleLogin()}
            // onPress={() => this.props.navigation.navigate('App')}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderTopColor: '#AAA',
                borderBottomColor: '#FFF',
                borderWidth: 1,
                flex: 1,
              }}
            />
            <Text style={{ margin: 8, color: '#FFF' }}>OR</Text>
            <View
              style={{
                borderTopColor: '#AAA',
                borderBottomColor: '#FFF',
                borderWidth: 1,
                flex: 1,
              }}
            />
          </View>
          <Button
            buttonStyle={{ borderRadius: 30 }}
            onPress={() => this.props.navigation.push('Register')}
            title="Register"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#051E34',
    justifyContent: 'center',
  },
});

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
)(Login);
