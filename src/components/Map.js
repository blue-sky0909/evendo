import React, { Component } from "react";
import MapView from 'react-native-maps'
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import PropTypes from 'prop-types';

export default class ProductMap extends Component {

    static propTypes = {       
        testID: PropTypes.string
    }
    constructor(props) {
        super(props)

        this.state = {
            location: null,
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
            coordinate: {},
            title: ""
        }
    }

    componentWillMount() {
        const params = this.props.navigation.state.params
        this.setState({ latitude: params.location.latitude })
        this.setState({ longitude: params.location.longitude })
        this.setState({coordinate: {
            latitude: params.location.latitude,
            longitude: params.location.longitude
        }})
        const fullAddress = params.location.address + params.location.cityName + params.location.country 
        this.setState({ title: fullAddress })
    }
       
    onRegionChange(region) {
        this.setState({ region });
    }

    render() {
        const { latitude, longitude, coordinate, title, latitudeDelta, longitudeDelta } = this.state
        return (
            <MapView
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                }}
                style={styles.map}
            >
                <MapView.Marker 
                    coordinate={coordinate}                    
                    description={title}
                   />
            </MapView>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    }
})