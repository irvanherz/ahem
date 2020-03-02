import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { View, Image, StyleSheet } from 'react-native';

class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={this.mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: -8.004555,
            longitude: 112.132598,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker coordinate={{ latitude: -8.004555, longitude: 112.132598 }} />
        </MapView>
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
});

export default SelectLocation;
