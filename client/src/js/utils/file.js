import axios from 'axios';

export const uploadFile = async (token, formData) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/uploadFile`,
        formData,
        {
            headers: {
                authtoken: token,
                'content-type': 'multipart/form-data'
            }
        }
    )
}
