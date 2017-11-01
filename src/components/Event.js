import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from "react-native";
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ordersActions from "../actions/orders";
import Spinner from 'react-native-loading-spinner-overlay';
import NoOrders from './Error';

class Event extends Component {

    static navigationOptions = {
        title: "Event",
        header: null
    };

    static propTypes = {
        style: React.PropTypes.func
    }
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.props.getOrders()
    }

    onSelect(index, value){
        setTimeout(() => {
            const navigate = this.props.navigation.navigate;
            navigate('Home', { title: 'Home', orders: value, index: index })
        }, 100)
    }

    render() {
        const { navigation, orderInfo } = this.props
        let visible = true
        if(orderInfo.loaded) {       
            visible = false
            return (
                <View style={styles.eventPage}>
                    
                    {
                        orderInfo.data.length > 0 ?
                        <ScrollView>
                             <RadioGroup
                                size={24}
                                thickness={2}
                                color='#dddddd'
                                activeColor="#ed8323"
                                highlightColor='#dddddd'
                                selectedIndex={0}
                                onSelect = {(index, value) => this.onSelect(index, value)}
                            >
                                {
                                    orderInfo.data.map((element, index) =>
                                        <RadioButton 
                                            value={element}
                                            color='#ed8323'
                                            style={styles.radioButton}
                                            key={index}>  
                                            <Text style={styles.radioText}>My Event {index + 1}</Text>                      
                                        </RadioButton>
                                    )                                    
                                }
                            </RadioGroup>
                        </ScrollView>
                        : <View>                        
                            <NoOrders navigation={navigation}/>
                        </View>
                    }
                </View>
            )
        } else {
            return (
                <View>
                    <Spinner 
                        visible={visible} 
                        textContent={"Loading..."}
                        color={"#ed8323"}
                        overlayColor={'#ffffff'}
                        animation={'fade'}
                        textStyle={{color: '#ed8323'}} />
                </View>
            )
        }        
    }
}

export default connect(
    state => ({
        loginToken: state.login.data,
        orderInfo: state.order
    }),
    dispatch => bindActionCreators(ordersActions, dispatch)
)(Event);

const styles = StyleSheet.create({
    eventPage: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 50
    },
    radioButton: {
        padding: 15
    },
    radioText: {
        fontSize: 16,
        color: '#777777'
    }
})