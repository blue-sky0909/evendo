import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Switch from 'react-native-customisable-switch';
import Dimensions from 'Dimensions';

export default class Verify extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hideSwitch: false
        }
    }

    componentWillMount() {
        const { isValidated } = this.props
        if(isValidated) {
            this.setState({ hideSwitch: true })
        }       
    }

    showItinerary = () => {
        const navigate = this.props.navigation.navigate;       
        navigate('Event', { title: 'Event' })
    }

    setValidate = (value) => {       
        if(value) {
            const { voucherCodeEnding } = this.props
            this.setState({ hideSwitch: true })
            this.props.setValidateVoucher(voucherCodeEnding)
        } else {
            const navigate = this.props.navigation.navigate;       
            navigate('Event', { title: 'Event' })
        }        
    }

    render(){
        const { hideSwitch } = this.state

        return(
            <View>
                <View style={[styles.btnSupply, {backgroundColor: hideSwitch ? '#dddddd' : '#ff3a3b'}]}>
                    <Text style={styles.textSupply}>For supplier only!</Text>
                </View>
                <View>
                    <Text style={styles.comment}>If validated by customer the voucher will be deemed invalid</Text>
                </View>
                <View>
                    <Switch 
                        defaultValue={hideSwitch}
                        value={hideSwitch}
                        activeText={"Return to Itinerary"}
                        inactiveText={"Validate voucher"}
                        fontSize={16}
                        activeTextColor={'#ffffff'}
                        inactiveTextColor={'#ffffff'}
                        activeBackgroundColor={'#ed8323'}
                        inactiveBackgroundColor={'#ed8323'}
                        switchWidth={Dimensions.get('window').width - 30}
                        switchHeight={60}
                        switchBorderRadius={60}
                        switchBorderWidth={0}
                        buttonWidth={60}
                        buttonHeight={60}
                        buttonBorderRadius={30}
                        buttonBorderColor={'rgba(0, 0, 0, 1)'}
                        buttonBorderWidth={0}
                        animationTime={150}
                        padding={true}
                        onChangeValue={(value) => this.setValidate(value)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btnSupply: {
        height: 60,
        marginTop: 30,
        marginLeft: -15,
        marginRight: -15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textSupply: {
        color: '#ffffff',
        fontSize: 16
    },
    comment: {
        color: '#777777',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 30,
        marginBottom: 30
    },
    itineraryView: {        
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnReturn: {
        backgroundColor: '#ed8323',        
        borderRadius: 60,
        height: 60,
        width: Dimensions.get('window').width - 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    textReturn: {
        color: '#ffffff',
        fontSize: 16
    },
    switch: {
        flexDirection: 'row',       
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        width: Dimensions.get('window').width - 30,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ed8323',
        padding: 10
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ffffff'
    },
    switchText: {
        fontSize: 16,
        color: '#ffffff',
        // marginLeft: 30
    }
})