import axios from 'axios';

export const creatFolder = async (token, data) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/folder`,
        data,
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const getRootFolders = async (token) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/folders`,
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const getFoldersByParent = async (token, parentId) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/folders/` + parentId,
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const getShared = async (token) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/shared`,
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const changeFolderAccess = async (token, access, folderId) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/changeFolderAccess`,
        {
            access, folderId
        },
        {
            headers: {
                authtoken: token
            }
        }
    )
}

export const changeFileAccess = async (token, access, fileId) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/changeFileAccess`,
        {
            access, fileId
        },
        {
            headers: {
                authtoken: token
            }
        }
    )
}