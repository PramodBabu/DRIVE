import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPeople, addFriend } from '../../utils/user';

import { Avatar, Card } from 'antd';
import { EyeOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Meta } = Card;

const People = () => {

    const {user} = useSelector(state => ({...state}));
    
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getPeople(user.token)
            .then(res => {
                setUsers(res.data)
            })
            .catch(err => {
            console.log(err);
        })
    },[]);

    const handleFriendRequest = (email) => {
        addFriend(user.token, email)
            .then(res => {
                toast.success('request sent');
            })
            .catch(err => {
                toast.error('something went wrong');
                console.log(err);
            })
    }

    return (
        <div className="container">
            <h2 className="text-left mt-5 text-primary">{'Find People'}</h2>
            <div className="container">
            {
                users && users.length > 0 ? 
                    users.map(item => (
                        <Card
                            key={item._id}
                            style={{ width: 600, textAlign: 'center', marginTop: '15px', border: '1px solid #989898', borderRadius: '5px' }}
                            actions={[
                            <div onClick={() => handleFriendRequest(item.email)}><SendOutlined key="edit" className="text-info" /><br />Send Request</div>,
                            ]}
                            hoverable
                        >
                            <Meta
                            avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                            title={item.name}
                            description={item.email}
                            />
                        </Card>
                    ))
                : <span>No people have signed up for our app</span>
            }    
            </div>
        </div>
    );
}

export default People;