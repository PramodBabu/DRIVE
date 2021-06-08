import React, {useState , useEffect} from 'react';
import firebase, { auth, googleAuthProvider } from '../../config/firebase';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { GoogleOutlined, PhoneOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import * as actionTypes from '../../store/actionTypes';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { createOrUpdateUser , signInWithPhoneAndPassword } from '../../utils/auth';

const Login = ({history}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    // const [switchmode, setSwitchmode] = useState(false);
    const [phoneOtp, setPhoneOtp] = useState('');
    const [identifier, setIdentifier] = useState('');

    const dispatch = useDispatch();

    const { user } = useSelector((state) => ({ ...state }));

    useEffect (() => {
        let intended = history.location.state;
        if (intended) {
            return;
        } else {   
            if( user && user.token ) {
                history.push('/');
            }
        }
    }, [user, history] );

    const roleBasedRedirect = (res) => {

        let intended = history.location.state;
        if (intended) {
            history.push(intended.from);
        } else {
            if(res.data.role === 'ADMIN') {
                history.push('/admin/dashboard');
            } else if(res.data.role === 'SELLER') {
                history.push('/seller/dashboard');
            } else {
                history.push('/user/dashboard');
            }
        }
    }

    const handleSubmit = async () => {
        // e.preventDefault();
        setLoading(true);
        try {
            const result = await auth.signInWithEmailAndPassword(identifier, password);
            console.log(result);
            const {user} = result ;
            const idTokenResult = await user.getIdTokenResult();
            console.log(idTokenResult);
            createOrUpdateUser(idTokenResult.token)
                .then(res => {
                    setLoading(false);
                    console.log(res);
                    dispatch({
                        type: actionTypes.LOGGED_IN_USER,
                        payload: {
                            email: res.data.email,
                            token: idTokenResult.token,
                            name: res.data.name,
                            role: res.data.role,
                            phone: res.data.phone_number,
                            id: res.data._id
                        }
                        });
                    roleBasedRedirect(res);
                    toast.success('user logged in');
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                });
            // props.history.push('/');
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (identifier.search('@') === -1) {
            setPhone(identifier);
            handlePhoneSubmit();
        } else {
            setEmail(identifier);
            handleSubmit();
        }
    }

    const handlePhoneSubmit = async () => {
        setLoading(true);
        try {
            // let recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container',{defaultCountry: "IN"});
            // let result = await firebase.auth().signInWithPhoneNumber(phone, recaptcha);
            // let res = await result.confirm(prompt('enter otp', '123456'));
            const resultForPhoneAuth = await signInWithPhoneAndPassword({phoneNumber: identifier, password: password});
            const pass = password;
            const res = await firebase.auth().signInWithEmailAndPassword(resultForPhoneAuth.data.email, pass);
            const {user} = res ;
            if( res.additionalUserInfo.isNewUser ) {
                let dUser = firebase.auth().currentUser;
                await dUser.delete();
                setLoading(false);
                toast.warning('User not registered. Please register first');
                dispatch({
                    type: actionTypes.LOGOUT,
                    payload: null
                });
            } else {
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
                    .then(
                        res => {
                            setLoading(false);
                            console.log(res);
                            dispatch({
                                type: actionTypes.LOGGED_IN_USER,
                                payload: {
                                    email: res.data.email,
                                    token: idTokenResult.token,
                                    name: res.data.name,
                                    role: res.data.role,
                                    phone: res.data.phone_number,
                                    id: res.data._id
                                }
                            });
                            roleBasedRedirect(res);
                        }
                    )
                    .catch(
                        err => {
                            setLoading(false);
                            console.log(err);
                        }
                    );
            }
        } catch (error) {
            setLoading(false);
            toast.error('invalid data');
        }
    }

    const handlePhoneOtpSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            let recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container',{defaultCountry: "IN"});
            let result = await firebase.auth().signInWithPhoneNumber(phoneOtp, recaptcha);
            let res = await result.confirm(prompt('enter otp', ''));
            const {user} = res ;
            if( res.additionalUserInfo.isNewUser ) {
                let dUser = firebase.auth().currentUser;
                await dUser.delete();
                setLoading(false);
                toast.warning('User not registered. Please register first');
                dispatch({
                    type: actionTypes.LOGOUT,
                    payload: null
                });
                history.push('/register');
            } else {
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
                    .then(
                        res => {
                            setLoading(false);
                            console.log(res);
                            dispatch({
                                type: actionTypes.LOGGED_IN_USER,
                                payload: {
                                    email: res.data.email,
                                    token: idTokenResult.token,
                                    name: res.data.name,
                                    role: res.data.role,
                                    phone: res.data.phone_number,
                                    id: res.data._id
                                }
                            });
                            roleBasedRedirect(res);
                        }
                    )
                    .catch(
                        err => {
                            setLoading(false);
                            console.log(err);
                        }
                    );
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        }
    }

    const googleLogin = async () => {
        auth.signInWithPopup(googleAuthProvider)
            .then(
                async (result) => {
                    const {user} = result;
                    const idTokenResult = await user.getIdTokenResult();
                    createOrUpdateUser(idTokenResult.token)
                        .then(
                            res => {
                                console.log(res);
                                dispatch({
                                    type: actionTypes.LOGGED_IN_USER,
                                    payload: {
                                        email: res.data.email,
                                        token: idTokenResult.token,
                                        name: res.data.name,
                                        role: res.data.role,
                                        phone: res.data.phone_number,
                                        id: res.data._id
                                    }
                                });
                            }
                        )
                        .catch(
                            err => {
                                console.log(err);
                            }
                        );
                    toast.success('User logged in with Google');
                    history.push('/');
                })
            .catch((err) => {
                toast.error(err.message);
            });
    }

    const phoneForm = () => (
        <form onSubmit={handleFormSubmit}>
            <div className="form-group">
                <input type="text" className="form-control" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Email" />
            </div>
            <div className="form-group">
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
            </div>
            <Button
                onClick={handleFormSubmit}
                type="primary"
                className="mb-3"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <PhoneOutlined />}
                size="medium"
                disabled = {loading}
                loading={loading}
            >
                {loading ? 'loading' : 'Login with email/password'}
            </Button>
            {/* <Button
                onClick={googleLogin}
                type="danger"
                className="mb-3"
                block
                shape="round"
                icon={<GoogleOutlined />}
                size="medium"
            >
                Login with google
            </Button> */}

            <Link to="/forgot/password" className="float-right text-danger"> forgot Password</Link>
        </form>    
    );

    const phoneOtpForm = () => (
        <form onSubmit={handlePhoneOtpSubmit}>
            <div className="form-group">
                <input type="text" className="form-control" value={phoneOtp} onChange={e => setPhoneOtp(e.target.value)} placeholder="phone" />
            </div>
            <Button
                onClick={handlePhoneOtpSubmit}
                type="primary"
                className="mb-3"
                block
                shape="round"
                icon={<PhoneOutlined />}
                size="medium"
                disabled = {!phoneOtp}
                loading={loading}
            >
                Login with OTP
            </Button>
            <div id="recaptcha-container"></div>
        </form>    
    );
        
    return (
        // padding 5
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {!loading ? <h4>Login</h4> : <h4 className="text-danger">Loading ...</h4>}
                    {/* {loginForm()} */}
                    {phoneForm()}
                    {/* {phoneOtpForm()} */}
                </div>
            </div>
        </div>
    );
};

export default Login;