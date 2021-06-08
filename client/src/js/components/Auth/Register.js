import React, {useState, useEffect} from 'react';
import firebase, {auth} from '../../config/firebase';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';

const Register = ({history}) => {

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const { user } = useSelector((state) => ({ ...state }));

    useEffect (() => {
        if( user && user.token ) {
            history.push('/');
        }
    }, [user, history] );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,

        };

        await auth.sendSignInLinkToEmail(email, config);
        toast.success(`Email is sent to ${email}, click the link to complete registration.`);
        window.localStorage.setItem('emailForRegistration', email);
        setEmail("");
    }

    const handleSubmitForPhoneNumber = async (e) => {
        e.preventDefault();
        let recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container',{defaultCountry: "IN"});
        firebase.auth().signInWithPhoneNumber(phone, recaptcha)
            .then( res => {
                let code = prompt('enter otp', '111111');
                if( code === null) return ;
                res.confirm(code)
                    .then(result => {
                        if(result.additionalUserInfo.isNewUser || !result.user.password) {
                            toast.success('please complete registration');
                            window.localStorage.setItem('phoneForRegistration', phone);
                            history.push('/register/complete');
                        }
                        console.log(result.user);
                    }).catch(err => {
                        console.log(err);
                    })
            })
            .catch( err => {
                console.log(err);
            })
    }

    const isValidPhone = (number) => {
        return true;
    }

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            <br />
            <button type="submit" className="btn btn-raised">Register</button>
        </form>
    );

    // const registerFormPhone = () => (
    //     <form onSubmit={handleSubmitForPhoneNumber}>
    //         <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} autoFocus />
    //         <br />
    //         <button id="phone-btn" type="submit" className="btn btn-raised" disabled={!isValidPhone(phone)}>Register with phone</button>
    //         {/* <input type="text" className="form-control" value={code} onChange={e => setCode(e.target.value)} autoFocus /> */}
    //         <div id="recaptcha-container"></div>
    //     </form>
    // );
        
    return (
        // padding 5
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {/* <h4>Register with email</h4>
                    {registerForm()} */}
                    <h4>Register with Email</h4>
                    {registerForm()}
                </div>
            </div>
        </div>
    );
};

export default Register;