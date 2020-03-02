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

class Register extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    isLoading: false,
  };

  handleLogin() {
    this.props.navigation.navigate('Login');
  }
  handleRegister() {
    let dbRef = firebaseApp.database();
    let authRef = firebaseApp.auth();
    this.setState({ isLoading: true });
    authRef
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCredential => {
        dbRef
          .ref('/users')
          .child(userCredential.user.uid)
          .set({
            displayName: this.state.name,
            email: this.state.email,
          })
          .then(() => {
            userCredential.user
              .updateProfile({
                displayName: this.state.name,
              })
              .then(() => {
                this.setState({ isLoading: false });
                ToastAndroid.show(
                  'User registration success!',
                  ToastAndroid.LONG,
                );
              });
          })
          .catch(error => {
            this.setState({ isLoading: false });
            ToastAndroid.show(
              `Firebase DB error: ${error.message}`,
              ToastAndroid.LONG,
            );
          });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        ToastAndroid.show(
          `Firebase Auth error: ${error.message}`,
          ToastAndroid.LONG,
        );
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
            onChangeText={text => this.setState({ name: text })}
            value={this.state.name}
            placeholder="Name"
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
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            placeholder="Email"
            placeholderTextColor="#AAA"
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
            loading={this.state.isLoading}
            disabled={this.state.isLoading}
            title="Register"
            buttonStyle={{ borderRadius: 30 }}
            onPress={() => this.handleRegister()}
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
            title="Login"
            buttonStyle={{ borderRadius: 30 }}
            onPress={() => this.handleLogin()}
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

export default Register;
