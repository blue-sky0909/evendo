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
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';
import * as forgotActions from "../actions/forgot";
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

class Forgot extends Component {
    static navigationOptions = {
        title: "Forgot Password"
    };

    constructor(props) {
        super(props)

        this.state = {
            email: "",
            valdiate: true,
            emailError: ""
        }
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
    }
       
    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    resetPassword = () => {
        const { email } = this.state
        const navigate = this.props.navigation.navigate;
        const valdiate = this.valdiate(email)
        this.setState({ valdiate })
        if(valdiate == true) {
            this.props.forgotPassword(email)
            .then((res) => {
                if(res == true) {
                    this.showMessage("Success", "We sent mail to your email")
                    navigate('Login', { title: 'Login' })
                } else {
                    this.showMessage("Error", "Please insert correct Email Address")
                }
            })
        }        
    }

    showMessage = (title, message) => {
        MessageBarManager.showAlert({
            alertType: 'warning',
            title: title,
            message: message,
            position: 'bottom',
            animationType: 'SlideFromLeft',
        });
    }

    valdiate(email) {
        if(email == "") {
            this.setState({emailError: "insert your emailaddress"})
            return false
        } else {
            this.setState({emailError: ""})
            return true
        }
    }

    render() {
        const { loginToken } = this.props
        const { valdiate, emailError } = this.state
        
        return (
            <View style={styles.forgot}>               
                <MessageBarAlert ref="alert" />    
                <View style={styles.imageView}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logoImg}/>  
                </View>
                <View style={styles.commentView}>
                    <Text style={styles.comment}>Confirm your eamil-address and we'll send you instructions to reset your password.</Text>
                </View>
                <View style={styles.textView}>
                    <TextInput
                        keyboardType="email-address"
                        returnKeyType="next"
                        autoCapitalize = "none"
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                        style={emailError == "" ? styles.text : styles.textError}
                        placeholder="Your email address..."
                        underlineColorAndroid='transparent'
                        />
                        <View style={ emailError == "" ? styles.iconView : styles.iconViewError }>
                        <Icon name="md-mail" size={30} color="#333333" style={emailError == "" ? styles.icon : styles.iconError}/> 
                    </View>
                </View>
                {
                    emailError !="" ? 
                        <View>
                            <Text style={styles.error}>{emailError.toUpperCase()}</Text> 
                        </View>
                    : null
                }               
                <View style={styles.loginView}>
                    <TouchableOpacity onPress={() => this.resetPassword()}>                        
                        <View style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Forgot Password</Text>
                        </View>
                    </TouchableOpacity>                
                </View>  
            </View>

        )
    }
}

const styles = StyleSheet.create({
    forgot: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    imageView: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
    },   
    logoImg: {
        width: 200,
        height: 50,
        resizeMode: 'contain'
    },
    commentView: {
        marginBottom: 30,
        marginLeft: 30,
        marginRight: 30
    },
    comment: {
        color: '#5d5d5d',
        fontSize: 16,
        textAlign: 'center',
    },
    textView: {
        flexDirection: 'row',      
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
        
    },
    text: {
        borderRadius: 7,
        borderColor: '#dddddd',
        borderWidth: 1,
        height: 50,
        paddingLeft: 70,
        color: '#000000',
        width: Dimensions.get('window').width - 40    
    },
    textError: {
        borderRadius: 7,
        borderColor: '#ff3a3b',
        borderWidth: 2,
        height: 50,
        paddingLeft: 70,
        color: '#000000',
        width: Dimensions.get('window').width - 40  
    },
    iconViewError: {
        position: 'absolute',
        left: 18,
        top: 0,
        backgroundColor: '#ff3a3b',
        height: 50,
        width: 50,
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconView: {
        position: 'absolute',
        left: 22,
        top: 0,
        backgroundColor: 'transparent',
        height: 50,
        width: 50,        
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        
    },
    iconError: {
        color: '#ffffff'
    },
    error: {
        color: '#ff3a3b',
        fontSize: 12,
        paddingLeft: 25,
        marginTop: -10,
        marginBottom: 15
    },
    loginView: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotBtn: {        
        backgroundColor: '#ed8323',        
        borderRadius: 60,
        height: 60,
        width: Dimensions.get('window').width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },
    forgotText: {
        color: '#ffffff',
        fontSize: 16
    }
})

export default connect(
    state => ({
        loginToken: state.login.data
    }),
    dispatch => bindActionCreators(forgotActions, dispatch)
)(Forgot);
