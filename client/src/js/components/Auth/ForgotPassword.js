import React, {useState, useEffect} from 'react';
import { auth } from '../../config/firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ForgotPassword = ({ history }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({...state}));

    useEffect (() => {
        if( user && user.token ) {
            history.push('/');
        }
    }, [user] );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
            handleCodeInApp: true,

        };

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail('');
                toast.success('Check email for password change')
            })
            .catch((err) => {
                toast.error(err.message);
            })
            .finally (() => {
                setLoading(false);
            })
    }

    return (
        <div className="container col-md-6 offset-md-3 p-5"> 
        {loading ? <h4 className="text-danger">Loading ...</h4> : <h4>Forgot Password</h4>}
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control md-3" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus placeholder="Enter email"/>
            <button className="btn btn-raised" disabled={!email}>Submit</button>
        </form>
        </div>
    );
}

export default ForgotPassword ;
