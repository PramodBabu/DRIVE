import axios from 'axios';

export const createOrUpdateUser = async (token, data) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/create-or-update-user`,
        data,
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const currentUser = async (token) => {
    console.log(`${process.env.REACT_APP_API}`);
    return await axios.post(
        `${process.env.REACT_APP_API}/current-user`,
        {},
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const signInWithPhoneAndPassword = async (data) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/signInWithPhoneAndPassword`,
        data
    )
}