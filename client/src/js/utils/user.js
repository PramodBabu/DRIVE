import axios from 'axios';

export const getPeople = async (token) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/getPeople`,
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const getFriends = async (token) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/getFriends`,
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const addFriend = async (token, email) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/addFriend`,
        {
            email
        },
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const acceptRequest = async (token, email, requestId) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/acceptRequest`,
        {
            email,
            requestId
        },
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const rejectRequest = async (token, email, requestId) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/rejectRequest`,
        {
            email,
            requestId
        },
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const cancelRequest = async (token, email, requestId) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/cancelRequest`,
        {
            email,
            requestId
        },
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const getRequests = async (token, email) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/getRequests`,
        {
            headers: {
                authtoken: token
            }
        }
    )
}