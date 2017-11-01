import React, { Component } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    AsyncStorage,
    Image
} from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Dimensions from 'Dimensions';

export default class Logout extends Component {
    logout = () => {
        AsyncStorage.removeItem('token', (err) => {
            const navigate = this.props.navigation.navigate;
            navigate('Login', { title: 'Login' })
        });
        
    }
   
    event = () => {
        setTimeout(() => {
            const navigate = this.props.navigation.navigate;
            navigate('Event', { title: 'Event' })
        }, 100)
    }

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <View style={styles.logout}>
                    <View>                    
                        <TouchableOpacity onPress={() => this.event()}>
                            <View style={styles.btn}>
                                <Image source={require('../assets/images/events.png')} style={styles.eventIcon}/>
                                <Text style={styles.comment}>{'events'.toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>                        
                    </View> 
                    <View>
                        <TouchableOpacity onPress={() => this.logout()}>
                            <View style={styles.btn}>
                                <Icon name="sign-out" size={30} color="#777777"/>
                                <Text style={styles.comment}>{'Log out'.toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopColor: '#dddddd',
        borderTopWidth: 2,
        paddingTop: 5,
        paddingBottom: 5
    },
    btn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    comment: {
        fontSize: 14,
        color: '#777777',
        marginTop: 10
    },
    eventIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    }
})