import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import _ from 'lodash';
import Dimensions from 'Dimensions';
import Logout from './Logout'

export default class NoOrders extends Component {
    static navigationOptions = {
        title: "404",
        header: null
    };   
    
    render() {
        const { navigation } = this.props
        return (
            <View>
                <View style={styles.scrollView}>
                    <Text style={styles.error}>404</Text>
                </View>                    
                <View style={styles.logout}>
                    <Logout navigation={ navigation }/>
                </View>
            </View>            
        )       
    }
}


const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#ffffff',
        height: Dimensions.get('window').height - 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {        
        fontSize: 100,
        color: '#ed8323'
    },
    logout: {
        backgroundColor: '#ffffff',
        height: 150,
        marginLeft: -15,
        marginRight: -15
    },
    event: {
        color: '#333333',
        fontSize: 24,
        fontWeight: 'bold',
        paddingBottom: 15,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 2
    }
})