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
import Switch from 'react-native-customisable-switch';
import _ from 'lodash'
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment'
import Communications from 'react-native-communications';
import Dimensions from 'Dimensions';
import Verify from './Verify'
import * as ordersActions from "../actions/orders";
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

class Detail extends Component {
    static navigationOptions = {
        title: "Detail"
    };

    constructor(props) {
        super(props)

        this.state = {
            order: {},
            period: {},
            imageUrl: 'https://s3.eu-central-1.amazonaws.com/evendo-qa/images/',
            imageSize: 270,
            orderLines: [],
            totalAmount: 0,
            index: -1,
            connectedOrderlines: []
        }
    }

    componentWillMount() {
        const params = this.props.navigation.state.params
        if(params.connectedOrderlines.length == 0) {
            this.state.connectedOrderlines.push(params.orderLine)
            this.setState({ connectedOrderlines: this.state.connectedOrderlines })
        } else {
            this.setState({ connectedOrderlines: params.connectedOrderlines })
        }
        this.setState({ order: params.orderLine })
        this.setState({ orderLines: params.orderLines })
        this.setState({ index: params.index })        
        this.getPeriod(params.orderLine.productDateTime, params.orderLine.product.durationInMinutes)
        setTimeout(()=> {
            this.calculdateTotalSum(this.state.connectedOrderlines)
        }, 100)        
        MessageBarManager.unregisterMessageBar();
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
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
        const period = {
            first:(startHour < 10 ? ("0"+ startHour) : startHour) + ":" + (startMinute < 10 ? ("0" + startMinute) : startMinute),
            end: (endHour < 10 ? ("0" + endHour) : endHour) + ":" + (endMinute < 10 ? ("0" + endMinute) : endMinute),
        }

        this.setState({ period })
    }

    calculdateTotalSum(connectedOrderlines) {
        let totalAmount = 0
        connectedOrderlines.forEach((element)=>{
            totalAmount += element.totalAmount
        })
        this.setState({ totalAmount })
    }

    findLocation = (location) => {
        const navigate = this.props.navigation.navigate;       
        navigate('Map', { title: 'Map', location: location })
    }

    getTotal = (product) => {
        let total = 0
        product.forEach(function(element) {
            total += element.price * element.quantity
        });
        return total
    }

    setValidateVoucher = (voucherCodeEnding) => {
        this.props.setValidateVoucher(voucherCodeEnding)
        .then((res)=>{            
            if(res.status == 200) {
                this.showMessage("success", "Voucher was validated successfully")
            } else if(res.status == 400){
                this.showMessage("info", "Voucher is already validated.")
            }                
            else {
                this.showMessage("warning", "You are not authorized to vlaidate this voucher.")
            }                
        })

    }
    
    showMessage = (status, message) => {
        MessageBarManager.showAlert({
            alertType: status,
            title: status,
            message: message,
            position: 'bottom',
            animationType: 'SlideFromBottom',
            messageStyle: styles.messageStyle
        });
    }

    render() {
        const { order, period, imageSize, imageUrl, orderLines, totalAmount, index, connectedOrderlines } = this.state
        const { orderInfo } = this.props
        const isValidated = _.find(orderInfo.data[index].orderLines, item => item.id == order.id).isValidated
        const imageOriginalUrl = imageUrl + imageSize + "/" + order.product.imagePath
        let visible = true
        if(_.isEmpty(order)) {
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
        } else {
            visible = false
            return (
                <ScrollView>  
                    {
                        isValidated ? 
                        <View style={styles.isValidated}>
                            <Text style={styles.isValidatedText}>Voucher is already validated.</Text>
                        </View>
                        : null
                    }                
                    <View style={styles.detail}>
                        <MessageBarAlert ref="alert" />
                        
                        <View>
                            <View style={styles.content}>
                                <Text style={styles.tid}>Booking ID:</Text>
                                <Text style={styles.tidValue}>{order.orderId}</Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.tid}>Date:</Text>
                                <Text style={styles.tidValue}>{moment(new Date(order.productDate)).format('DD MMMM YYYY')}</Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.tid}>Tid:</Text>
                                <Text style={styles.tidValue}>
                                    {period.first} - {period.end} ({order.product.durationInMinutes / 60} hours)                                    
                                </Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.tid}>Product:</Text>
                                {
                                    order.product.productName == order.product.variantName
                                    ? <Text style={styles.tidValue}>{order.product.productName}</Text>
                                    : <Text style={styles.tidValue}>{order.product.productName} {order.product.variantName}</Text>
                                }                                
                            </View>
                        </View>      
                        <View style={styles.priceView}>
                            {
                                connectedOrderlines.map((order)=>
                                    order.segments.map((item, index) =>
                                        <View style={styles.price} key={index}>
                                            <Text style={styles.priceLabel}>{item.quantity} x {order.product.variantName}</Text>
                                            <Text style={styles.priceValue}>DKK {item.unitSellingPrice}</Text>
                                        </View>
                                    )
                                )                                
                            }
                        </View>
                        <View>
                            {

                                connectedOrderlines.map((order, index)=>   
                                    _.isNil(order.product.startupFee) ? null
                                    : <View style={styles.price} key={index}>
                                        <Text style={styles.priceLabel}>{order.product.variantName} StartupFee</Text>                                            
                                        <Text style={styles.priceValue}>DKK {order.product.startupFee}</Text>                                                                                       
                                    </View>
                                )                                
                            }
                        </View>
                        <View style={styles.price}>
                            <Text style={styles.totalPrice}>{'total'.toUpperCase()}</Text>
                            <Text style={styles.totalPrice}>DKK {totalAmount}</Text>
                        </View>
                        <View style={styles.productImageView}>
                            <Image source={{uri: imageOriginalUrl}} style={styles.productImage}/>
                        </View>
                        {
                            order.extraFields.length > 0
                            ? <View style={styles.extraView}>
                                {
                                    order.extraFields.map((item, index) => 
                                        <View key={index}>
                                            <Text style={styles.tid}>{item.question}</Text>
                                            <Text style={styles.extraValue}>{item.value}</Text>
                                        </View>
                                    )
                                }                            
                            </View>
                            : null
                        }                        
                        <View style={styles.supplyView}>
                            <Text style={styles.supplyItem}>{order.product.supplierName}</Text>
                            <Text style={styles.supplyItem}>{order.product.supplierAddress}</Text>
                            <Text style={styles.supplyItem}>{order.product.supplierZip} {order.product.supplierCity}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.findLocation(order.location)}>
                                <View style={styles.btnMore}>
                                    <View style={styles.actionName}>
                                        <Icon name="exclamation" size={30} color="#333333"/>
                                        <Text style={styles.actionItem}>Find Location</Text>
                                    </View>
                                    <Icon name="angle-right" size={30} color="#777777"/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Communications.web('https://evendo.com/da/product/evendo/' + order.product.productId + "-" + order.product.variantId)}>
                                <View style={styles.btnMore}>
                                    <View style={styles.actionName}>
                                        <Icon name="map-marker" size={30} color="#333333"/>
                                        <Text style={styles.actionItem}>Read more about product</Text>
                                    </View>
                                    <Icon name="angle-right" size={30} color="#777777"/>
                                </View>
                            </TouchableOpacity>   
                            <TouchableOpacity onPress={() => Communications.phonecall(order.product.supplierPhone, true)}>
                                <View style={styles.btnMore}>
                                    <View style={styles.actionName}>
                                        <Icon name="phone" size={30} color="#333333"/>
                                        <Text style={styles.actionItem}>Call supplier</Text>
                                    </View>
                                    <Icon name="angle-right" size={30} color="#777777"/>
                                </View>
                            </TouchableOpacity>                         
                        </View>
                        <Verify 
                            navigation={this.props.navigation}
                            voucherCodeEnding={order.voucherCodeEnding}
                            isValidated={isValidated}
                            setValidateVoucher={this.setValidateVoucher.bind(this)}/>
                    </View>
                </ScrollView>
                    
            )
        }
        
    }
}

export default connect(
    state => ({
        orderInfo: state.order
    }),
    dispatch => bindActionCreators(ordersActions, dispatch)
)(Detail);

const styles = StyleSheet.create({
    detail: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15
    },
    isValidated: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ed8323'
    },
    isValidatedText: {
        color: '#ffffff',
        fontSize: 16
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
    priceView: {
        marginTop: 30
    },
    price: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    priceLabel: {
        color: '#777777',
        fontSize: 16,
        flexWrap: 'wrap',
        flex: 1
    },
    priceValue: {
        color: '#777777',
        fontSize: 16,
        flexWrap: 'wrap'
    },
    totalPrice: {
        color: '#333333',
        fontSize: 16,
        flexWrap: 'wrap',
        fontWeight: 'bold'
    },
    productImageView: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: 270,
        height: 200,
        resizeMode: 'contain'
    },
    extraView: {
        borderTopColor: '#dddddd',
        borderTopWidth: 2,
        paddingTop: 15,
        marginTop: 15
    },
    extraValue: {
        fontSize: 16,
        color: '#777777',
        flexWrap: 'wrap',
        marginTop: 5,
        marginBottom: 5
    },
    supplyView: {
        borderTopColor: '#dddddd',
        borderTopWidth: 2,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 2,
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 15
    },
    supplyItem: {
        color: '#777777',
        fontSize: 16,
        marginBottom: 10
    },
    btnMore: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 15,
        paddingBottom: 15,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 2
    },
    actionName: {
        flexDirection: 'row'
    },
    actionItem: {
        color: '#777777',
        fontSize: 16,
        marginLeft: 15
    },
    messageStyle: {
        zIndex: 999,
        color: '#ffffff'
    }
})