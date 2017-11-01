import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    AsyncStorage
} from "react-native";
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Icon from 'react-native-vector-icons/Ionicons';
import * as loginActions from "../actions/login";
import Dimensions from 'Dimensions';
import Spinner from 'react-native-loading-spinner-overlay';
var { FBLoginManager } = require('react-native-facebook-login');
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import config from '../config/config'

class Login extends Component {
    static navigationOptions = {
        title: "Login",
        header: null
    };

    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            show: false,
            emailError: "",
            passwordError: "",
            valdiate: true,
            buttonDisabled: false,
            showLogin: false
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('token').then((token)=>{
            if(token) {
                const navigate = this.props.navigation.navigate;
                navigate('Event', { title: 'Event' })
            } else {
                this.setState({ showLogin: true })
            }
        })     
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
    }
       
    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    facebookLogin =() => {
        const self = this
        const navigate = this.props.navigation.navigate;
        FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web); // defaults to Native        
        FBLoginManager.loginWithPermissions(["email", "user_friends"], function(error, data){
            if (!error) {
                self.props.fbCreate(data.credentials.token)
                navigate('Event', { title: 'Event' })
            } else {
                self.showMessage("Please use correct Facebook account")
            }
        })
    }

    googleLogin = () => {
        const navigate = this.props.navigation.navigate;
        GoogleSignin.signIn()
        .then((user) => {
            this.props.googleLogin(user.idToken)
            .then((res) => {
                if(res == true) {
                    navigate('Event', { title: 'Event' })
                } else {
                    this.showMessage("Please create Evendo app account")
                }
            })
        })
        .catch((err) => {
            console.log('WRONG SIGNIN', err);
            this.showMessage("Please use correct Google account")
        })
        .done();
    }

    login = () => {
        this.setState({ buttonDisabled: true })
        const navigate = this.props.navigation.navigate;       
        const { email, password } = this.state
        const valdiate = this.valdiate(email, password)
        this.setState({ valdiate })
        if(valdiate == true) {
            this.props.loginAction(email, password)
            .then((res) => {    
                if(res == true) {                 
                    navigate('Event', { title: 'Event' })
                } else {
                    this.showMessage("Email or Password is not correctly, Please try again")
                }
            });
        }
    }

    valdiate(email, password) {
        if(email == "") {
            this.setState({emailError: "Please insert your emailaddress"})
            if(password == "") {
                this.setState({passwordError: "Please insert your password"})
            } else {
                this.setState({passwordError: ""})
            }
            return false
        } else {
            this.setState({emailError: ""})
            if(password == "") {
                this.setState({passwordError: "Please insert your password"})
                return false
            } else {
                this.setState({passwordError: ""})
            }
        }

        return true
    }

    forgotPassword = () => {
        const navigate = this.props.navigation.navigate;
        navigate('Forgot', { title: 'Forgot Password' })
    }

    showMessage = (message) => {
        MessageBarManager.showAlert({
            alertType: 'warning',
            title: "Error",
            message: message,
            position: 'top',
            animationType: 'SlideFromLeft',
        });
    }
    render() {
        const { loginToken } = this.props
        const { 
            email,
            password,
            show,
            emailError,
            passwordError,
            valdiate,
            buttonDisabled,
            showLogin
        } = this.state
        let visible = true
        
        GoogleSignin.configure({
            iosClientId: config.key.iosClientId,
            webClientId : config.key.webClientId,
        })
        .then(() => {
            // you can now call currentUserAsync()
        });
        return (
            
            <View style={styles.signUp}>
                <ScrollView>           
                    <MessageBarAlert ref="alert" />
                        <View style={styles.imageView}>
                            <Image source={require('../assets/images/logo.png')} style={styles.logoImg}/>  
                        </View>
                        <View style={styles.loginImg}>
                            <TouchableOpacity onPress={() => this.facebookLogin()}>                        
                                <View style={styles.facebookImg}>
                                    <Image source={require('../assets/images/facebook.png')} style={styles.facebookIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.googleLogin()}>
                                <View style={styles.googleImg}>
                                    <Image source={require('../assets/images/google.png')} style={styles.googleIcon}/>
                                </View>
                            </TouchableOpacity>                      
                        </View>    
                        <View style={styles.textView}>
                            <TextInput
                                keyboardType="email-address"
                                returnKeyType="next"
                                autoCapitalize = "none"
                                value={email}
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
                            !valdiate ? 
                                <View>
                                    <Text style={styles.error}>{emailError.toUpperCase()}</Text> 
                                </View>
                            : null
                        }
                        <View style={styles.textView}>
                            <TextInput
                                secureTextEntry={true}
                                value={password}
                                onChangeText={(password) => this.setState({password})}
                                style={passwordError == "" ? styles.text : styles.textError}
                                placeholder="Your password..."
                                underlineColorAndroid='transparent'
                                />
                            <View style={ passwordError == "" ? styles.iconView : styles.iconViewError }>
                                <Icon name="md-lock" size={30} color="#333333" style={passwordError == "" ? styles.icon : styles.iconError}/> 
                            </View>                                       
                        </View>
                        {
                            !valdiate ? 
                                <View>
                                    <Text style={styles.error}>{passwordError.toUpperCase()}</Text> 
                                </View>
                            : null
                        }
                        <View style={styles.loginView}>
                            <TouchableOpacity onPress={() => this.login()}>                        
                                <View style={styles.loginBtn}>
                                    <Text style={styles.loginText}>Login</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.forgotPassword()}>                        
                                <View>
                                    <Text style={styles.forgot}>Forgot Password?</Text>
                                </View>
                            </TouchableOpacity>                  
                        </View> 
                </ScrollView>    
            </View>
        )        
    }
}

const styles = StyleSheet.create({
    signUp: {
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
    loginImg: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',       
        marginBottom: 50,
    },
    facebookImg: {
        backgroundColor: '#3b5998',
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    facebookIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    googleImg: {
        backgroundColor: '#de4b39',
        borderColor: '#de4b39',
        width: 80,
        height: 80,
        borderRadius: 40,
        marginLeft: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    textView: {
        flexDirection: 'row',      
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,     
    },
    text: {
        borderRadius: 7,
        borderColor: '#dddddd',
        borderWidth: 1,
        height: 50,
        paddingLeft: 70,
        color: '#000000',
        width: Dimensions.get('window').width - 40,
        textDecorationLine: "underline",
        textDecorationColor: "transparent"
    },
    textError: {
        borderRadius: 7,
        borderColor: '#ff3a3b',
        borderWidth: 2,
        height: 50,
        paddingLeft: 70,
        color: '#000000',
        width: Dimensions.get('window').width - 40,
        textDecorationLine: "underline",
        textDecorationColor: "transparent"
    },
    iconViewError: {
        position: 'absolute',
        left: 18,
        top: 0,
        backgroundColor: '#ff3a3b',
        height: 50,
        width: 50,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconView: {
        position: 'absolute',
        left: 18,
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
    loginBtn: {        
        backgroundColor: '#ed8323',        
        borderRadius: 60,
        height: 60,
        width: Dimensions.get('window').width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },
    loginText: {
        color: '#ffffff',
        fontSize: 16
    },
    forgot: {
        color: '#5d5d5d',
        fontSize: 14
    }
})

export default connect(
    state => ({
        loginToken: state.login.data
    }),
    dispatch => bindActionCreators(loginActions, dispatch)
)(Login);
