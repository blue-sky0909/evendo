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
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import moment from 'moment'
import _ from 'lodash'
import Dimensions from 'Dimensions';
import * as ordersActions from "../actions/orders";

class Product extends Component {

    static navigationOptions = {
        title: "Product"
    };

    constructor(props) {
        super(props)
        this.state = {
            travelTime: {},
            period: {}
        }
    }

    componentWillMount() {
        const { orderLine } = this.props
        this.getTravelTime(orderLine.orderId)
        this.getPeriod(orderLine.productDateTime, orderLine.product.durationInMinutes )
    }

    showMore = (orderLine, orderLines, index, connectedOrderlines) => {
        const navigate = this.props.navigation.navigate;
        navigate('More', { 
            title: 'Details',
            orderLine: orderLine,
            orderLines: orderLines,
            index: index,
            connectedOrderlines: connectedOrderlines
        })
    }
    
    getTravelTime = (orderId) => {
        const { orderLine } = this.props
        this.props.getDistance(orderId)
        .then((res)=> {
            const distance = res.order.travelTimes
            const travelTime = _.find(distance, item => item.partyPlanFromEventId == orderLine.id)
            this.setState({ travelTime })
        })
    }

    getPeriod = (start, duration) => {
        const d1 = new Date(start);
        const startMinute = d1.getUTCMinutes();
        const startHour = d1.getUTCHours();
        let timeInMillis = d1.getTime();

        timeInMillis += duration * 60000;
        const d2 = new Date(timeInMillis);
        const endMinute = d2.getUTCMinutes();
        const endHour = d2.getUTCHours();

        const timeDiff = (Math.abs(d2.getTime() - d1.getTime())) / (1000 * 3600) ;
        const period = {
            first:(startHour < 10 ? ("0"+ startHour) : startHour) + ":" + (startMinute < 10 ? ("0" + startMinute) : startMinute),
            end: (endHour < 10 ? ("0" + endHour) : endHour) + ":" + (endMinute < 10 ? ("0" + endMinute) : endMinute),
            period: timeDiff
        }

        this.setState({ period })
    }
    
    render() {
        const { orderLine, orderLines, index, connectedOrderlines } = this.props
        const { period, travelTime } = this.state
        return (
            <View>
                <View>
                    <View style={styles.dateView}>
                        <Icon name="calendar" size={20} color="#333333"/>
                        <Text style={styles.date}>{moment(new Date(orderLine.productDate)).format('DD MMMM YYYY')}</Text>
                    </View>
                    <View style={styles.product}>
                        <View style={styles.content}>
                            <Text style={styles.tid}>Tid:</Text>                            
                            <Text style={styles.tidValue}>
                                { period.first } - { period.end } ({ orderLine.product.durationInMinutes / 60 } hours)
                            </Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.tid}>Product:</Text>
                            {
                                orderLine.product.productName == orderLine.product.variantName
                                ? <Text style={styles.tidValue}>{orderLine.product.productName}</Text>
                                : <Text style={styles.tidValue}>{orderLine.product.productName} {orderLine.product.variantName}</Text>
                            }                    
                        </View>
                        <View style={styles.btns}>
                            <TouchableOpacity onPress={() => this.showMore(orderLine, orderLines, index, connectedOrderlines)}>
                                <View style={styles.btnMore}>
                                    <Text style={styles.more}> See more </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            !_.isEmpty(travelTime)
                            ? <View style={styles.distanace}>
                                    <Icon name="car" size={20} color="#777777"/>                                    
                                    <Text style={styles.distanaceText}>Distance <Text style={styles.textBold}> {travelTime.travelTimeString}</Text></Text>
                              </View>
                            : null
                        }
                    </View>
                </View>
            </View>
        )
    }
}

export default connect(
    state => ({
        loginToken: state.login.data
    }),
    dispatch => bindActionCreators(ordersActions, dispatch)
)(Product);

const styles = StyleSheet.create({
    dateView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15
    },
    date: {
        color: '#777777',
        fontSize: 20,
        marginLeft: 15,
    },
    product: {
        marginTop: 15
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5
    },
    tid: {
        color: '#333333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tidValue: {
        color: '#777777',
        fontSize: 16,
        flexWrap: 'wrap',
        marginLeft: 15,
        flex: 1
    },
    btns: {
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    btnMore: {
        width: Dimensions.get('window').width - 40,
        height: 60,
        borderRadius: 30,
        borderColor: '#777777',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    more: {
        color: '#777777',
        fontSize: 16
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
        fontSize: 16
    },
    distanace: {
        backgroundColor: '#dddddd',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        marginTop: 30,
        marginLeft: -15,
        marginRight: -15
    },
    distanaceText: {
        fontSize: 16,
        color: '#777777',
        marginLeft: 40
    },
    textBold: {
        fontWeight: 'bold'
    }
})