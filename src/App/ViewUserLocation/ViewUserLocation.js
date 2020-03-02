import React, { createRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { View, Image, StyleSheet } from 'react-native';
import { firebaseApp } from '../../Public/config/firebase';
import { Avatar, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

class ViewUserLocation extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  state = {
    userId: '',
    userProfile: {},
  };
  componentDidMount() {
    const id = this.props.route.params.userId;
    const dbRef = firebaseApp.database();
    dbRef
      .ref(`users/${id}`)
      .once('value')
      .then(snap => {
        const snapVal = snap.val();
        this.setState({ userProfile: snapVal });
        this.setState({ userId: id });
      });
  }

  handleMyLocation = () => {
    const myPosition = this.props.app.my.profile.position
      ? this.props.app.my.profile.position
      : { latitude: -6.121435, longitude: 106.774124 };
    this.mapRef.current.animateToRegion(
      {
        latitude: myPosition.latitude,
        longitude: myPosition.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      2000,
    );
  };

  render() {
    const myPosition = this.props.app.my.profile.position
      ? this.props.app.my.profile.position
      : { latitude: -6.121435, longitude: 106.774124 };
    const friendPosition = this.state.userProfile.position
      ? this.state.userProfile.position
      : { latitude: -6.121435, longitude: 106.774124 };
    return (
      <View style={styles.container}>
        <MapView
          ref={this.mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: friendPosition.latitude,
            longitude: friendPosition.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            onPress={() =>
              this.props.navigation.navigate('ContactInfo', {
                userId: this.state.userId,
              })
            }
            coordinate={{
              latitude: friendPosition.latitude,
              longitude: friendPosition.longitude,
            }}>
            <Avatar
              rounded
              source={
                this.state.userProfile.photoURL
                  ? { uri: this.state.userProfile.photoURL }
                  : require('../../Public/asset/images/avatar.png')
              }
            />
          </Marker>
          <Marker
            onPress={() => this.props.navigation.navigate('Profile')}
            coordinate={{
              latitude: myPosition.latitude,
              longitude: myPosition.longitude,
            }}>
            <Avatar
              rounded
              source={
                this.props.app.my.profile.photoURL
                  ? { uri: this.props.app.my.profile.photoURL }
                  : require('../../Public/asset/images/avatar.png')
              }
            />
          </Marker>
        </MapView>
        <Icon
          onPress={() => this.handleMyLocation()}
          raised
          name="my-location"
          type="MaterialIcon"
          color="#517fa4"
          containerStyle={styles.fab}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  map: {
    height: '100%',
    width: '100%',
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
)(ViewUserLocation);
