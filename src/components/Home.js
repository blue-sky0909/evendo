import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    StyleSheet,
    Image,
    TextInput,
    ScrollView
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import _ from 'lodash';
import Dimensions from 'Dimensions';
import * as ordersActions from "../actions/orders";
import Product from './Product'
import Logout from './Logout'

class Home extends Component {
    static navigationOptions = {
        title: "Home"
    };
    
    constructor(props) {
        super(props)

        this.state = {
            orders: [],
            eventName: "",
            index: -1,
            connectedOrderlines: []
        }
    }

    componentWillMount() {
        const { orderInfo } = this.props
        const params = this.props.navigation.state.params
        let orderLines = orderInfo.data[params.index].orderLines
        this.getConnectedOrderlines(params.orders.orderLines.slice())
        this.setState({ index: params.index })
        const eventName = "My Event " + (params.index + 1)
        this.setState({ eventName: eventName })        
    }

    getConnectedOrderlines(orders) {
        let connectedOrderlines = []
        let orderLines = orders
        if(orderLines.length > 1) {
            for (let i = 0; i < orderLines.length - 1; i++) {
                const nextItem = orderLines[i+1]
                if(nextItem.hasOwnProperty('connectedTo')) {                
                    if(orderLines[i].id == orderLines[i+1].connectedTo) {                
                        connectedOrderlines.push(orderLines[i])
                        connectedOrderlines.push(orderLines[i+1])
                        orderLines.splice(i+1, 1)
                    }   
                }        
            }
            this.setState({ connectedOrderlines })                                 
        } else {
            this.setState({ connectedOrderlines: orderLines })
        }
        this.setState({ orders: orderLines })     
    }
    
    render() {
        const { navigation } = this.props
        const { orders, eventName, index, connectedOrderlines } = this.state
        let visible = true
        if(!_.isEmpty(orders)) {
            visible = false
            return (
                <View>
                    <View style={styles.scrollView}>
                        <ScrollView>
                            <View style={styles.home}>                
                                <Text style={styles.event}>{eventName}</Text>
                                {
                                    orders.map((order)=>
                                        <Product 
                                            orderLine={order}
                                            key={order.id}
                                            navigation={navigation}
                                            connectedOrderlines={connectedOrderlines}
                                            orderLines={orders}
                                            index={index}/>
                                    )
                                }
                            </View>
                        </ScrollView>
                    </View>                    
                    <View style={styles.logout}>
                        <Logout navigation={ navigation }/>
                    </View>
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
)(Home);

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#ffffff',
        height: Dimensions.get('window').height - 150,
    },
    home: {
        padding: 15
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