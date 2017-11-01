import React, { Component } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    StyleSheet,
    Image,
    TextInput
} from "react-native";

import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export default class Voucher extends Component {

    static navigationOptions = {
        title: "Voucher"
    };       

    findLocation = () => {
    }

    voucher = () => {
        
    }

    
    render() {
        return (
            <View style={styles.voucher}>
                <Text style={styles.event}>CD-Indspilning - 20 personer</Text>
                <View style={styles.content}>
                    <Text style={styles.tid}>Date:</Text>
                    <Text style={styles.tidValue}>12 August 2017</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.tid}>Tid:</Text>
                    <Text style={styles.tidValue}>K1 16:00-17:30(1.5t)</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.tid}>Product:</Text>
                    <Text style={styles.tidValue}>CD-Indspilning - 20 personer</Text>
                </View>
                <View style={styles.imageView}>
                    <Image source={require('../assets/images/flower.jpg')} style={styles.productImg}/>  
                </View>
                <View style={styles.btns}>
                    <TouchableOpacity onPress={()=> this.findLocation()}>
                        <View style={styles.btnMore}>
                            <Text style={styles.more}>Find Location </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.voucher()}>
                        <View style={styles.btnVoucher}>
                            <Text style={styles.textVoucher}>Voucher</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>                
        )
    }
}

const styles = StyleSheet.create({
    voucher: {
        flex: 1,
        padding: 15,
        backgroundColor: '#ffffff'
    },
    event: {
        color: '#333333',
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 15
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tid: {
        color: '#333333',
        fontSize: 20,
        fontWeight: 'bold',
    },
    tidValue: {
        color: '#777777',
        fontSize: 20,
        flexWrap: 'wrap',
        marginLeft: 15,
    },
    imageView: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
    },   
    productImg: {
        width: 250,
        height: 250,
        resizeMode: 'contain'
    },
    btns: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30
    },
    btnMore: {
        width: 160,
        height: 60,
        borderRadius: 30,
        borderColor: '#777777',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    more: {
        color: '#777777',
        fontSize: 20
    },
    btnVoucher: {
        width: 160,
        height: 60,
        borderRadius: 30,
        borderColor: '#ed8323',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ed8323'
    },
    textVoucher: {
        color: '#ffffff',
        fontSize: 20
    }
})