import React, {useState, useEffect} from 'react';
import firebase, {auth} from '../../config/firebase';
import {toast} from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as actionTypes from '../../store/actionTypes';
import {createOrUpdateUser} from '../../utils/auth';
import {Menu, Button} from 'antd';

const RegisterComplete = ({history}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('SUBSCRIBER');
    // const [pincode, setPincode] = useState('');
    // const [country, setCountry] = useState('');
    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'));
        setPhone(window.localStorage.getItem('phoneForRegistration'));
    },[]);

    const dispatch = useDispatch();

    const handleRegisterComplete = async (e) => {
        e.preventDefault();
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);

            if( !result.additionalUserInfo.isNewUser ) {
                toast.error('email is already in use. Please Login');
                throw new Error('email is already in use. Please Login');
            }
            if (result.user.emailVerified) {
                //remove email from local storage
                window.localStorage.removeItem('emailForRegistration'); 
                let updateUser = auth.currentUser;
                await updateUser.updatePassword(password).then(() => {console.log('updated user pass')});
                await updateUser.updateProfile({displayName: name}).then(() => {console.log('updated username')});
                const idTokenResult = await updateUser.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token) // more fields for user 
                    .then(res => {
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
                            toast.success('Registration complete')
                    }).catch(
                        err => {
                            console.log(err);
                            toast.error('registration failed');
                        }
                    );
                history.push('/');
                // var applicationVerifier = new firebase.auth.RecaptchaVerifier(
                //     'recaptcha-container');
                // var provider = new firebase.auth.PhoneAuthProvider();
                // await provider.verifyPhoneNumber(phone, applicationVerifier)
                //     .then(function(verificationId) {
                //         var verificationCode = window.prompt('Please enter the verification','111111');
                //         let phoneCred = firebase.auth.PhoneAuthProvider.credential(verificationId,
                //             verificationCode);
                //         updateUser.linkWithCredential(phoneCred);
                          
                // });  
            }    
        } catch (error) {
            toast.error(error.message);
        }
    }   

    const handleSubmit = async (e) => {
        e.preventDefault();
        let currentUser = await auth.currentUser;
        

        if (!email || !password) {
            toast.error('user data missing/malformed');
            return;
        }

        if(password.length < 8) {
            toast.error("password should be longer than 8 characters");
            return;
        }

        if(currentUser && currentUser.email) {
            try {
                const result = await auth.signInWithEmailLink(email, window.location.href);
    
                if( !result.additionalUserInfo.isNewUser ) {
                    toast.error('email is already in use. Please Login');
                    throw new Error('email is already in use. Please Login');
                }
                if (result.user.emailVerified) {
                    //remove email from local storage
                    window.localStorage.removeItem('emailForRegistration'); 
                    let updateUser = auth.currentUser;
                    await updateUser.updatePassword(password).then(() => {console.log('updated user pass')});
                    await updateUser.updateProfile({displayName: name}).then(() => {console.log('updated username')});
                    var applicationVerifier = new firebase.auth.RecaptchaVerifier(
                        'recaptcha-container');
                    var provider = new firebase.auth.PhoneAuthProvider();
                    await provider.verifyPhoneNumber(phone, applicationVerifier)
                        .then(function(verificationId) {
                            var verificationCode = window.prompt('Please enter the verification','111111');
                            let phoneCred = firebase.auth.PhoneAuthProvider.credential(verificationId,
                                verificationCode);
                            updateUser.linkWithCredential(phoneCred);
                            const idTokenResult = updateUser.getIdTokenResult();
                            createOrUpdateUser(idTokenResult.token) // more fields for user 
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
                            history.push('/');  
                        });  
                }    
            } catch (error) {
                toast.error(error.message);
            }
        } else if(currentUser && currentUser.phoneNumber) {
            try {
                // const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
                const updateUser = auth.currentUser;
                // const confirmationResult = await updateUser.reauthenticateWithPhoneNumber(phone, recaptchaVerifier);
                // await confirmationResult.confirm(prompt('Enter your SMS code'));
                await updateUser.updateProfile({ displayName: name });
                var cred = firebase.auth.EmailAuthProvider.credential(
                    email, password);
                const result = await updateUser.linkWithCredential(cred);
                const {user} = result ;
                const idTokenResult = await user.getIdTokenResult();
                const data = {
                    role: role
                }
                createOrUpdateUser(idTokenResult.token, data)  // more fields for user 
                            .then(
                                res => {
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
                                    history.push('/');
                            })
                            .catch(
                                err => {
                                    console.log(err);
                                }
                            );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
         }
    }

    const handleRoleDropDown = (e) => {
        console.log(e.key);
        setRole(e.key);
    }

    const menu = (
        <Menu onClick={handleRoleDropDown} selectedKeys={[role]}>
          <Menu.Item key="ADMIN">
            Admin
          </Menu.Item>
          <Menu.Item key="SELLER">
            Seller
          </Menu.Item>
          <Menu.Item key="SUBSCRIBER">
            Subscriber
          </Menu.Item>
        </Menu>
      );

    const completeRegisterForm = () => (
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email || ''} onChange={e => setEmail(e.target.value)} placeholder="email" />
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
            <input type="text" className="form-control" value={phone || ''} onChange={e => setPhone(e.target.value)} placeholder="phone number" />
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="username" required/>
            <div id='recaptcha-container'></div>
            {/* <input type="text" className="form-control" value={country} onChange={e => setCountry(e.target.value)} placeholder="password" />
            <input type="text" className="form-control" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="password" /> */} 
            <br />
            {/* <button type="submit" className="btn btn-raised">Register</button> */}
            <Button
                onClick={handleRegisterComplete}
                type="danger"
                className="mb-3"
                block
                shape="round"
                size="medium"
            >
                Complete Registration
            </Button>
        </form>
    );
        
    return (
        // padding 5
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {completeRegisterForm()}
                </div>
            </div>
        </div>
    );
};

export default RegisterComplete;