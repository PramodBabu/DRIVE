import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { acceptRequest, getFriends, getRequests, cancelRequest, rejectRequest } from '../../utils/user';

import { Avatar, Card, Comment, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Meta } = Card;

const Friends = () => {

    const {user} = useSelector(state => ({...state}));
    
    const [friends, setFriends] = useState([]);
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);

    useEffect(() => {
        getAllFriends();
    },[]);

    const getAllFriends = () => {
        getFriends(user.token)
            .then(res => {
                // console.log(res.data);
                setFriends(res.data[0].friends);
            })
            .catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        refreshRequests();
    }, [])

    const refreshRequests = () => {
        getRequests(user.token)
            .then(res => {
                console.log(res.data);
                setSent(res.data.sent);
                setReceived(res.data.received);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const acceptFriendRequest = (email, requestId) => {
        acceptRequest(user.token, email, requestId)
            .then(() => {
                toast.success('friend added');
                getAllFriends();
                refreshRequests();
            })
            .catch(
                err => {
                    console.log(err);
                }
            );
    }

    const rejectFriendRequest = (email, requestId) => {
        rejectRequest(user.token, email, requestId)
            .then( () => {
                toast.success('friend removed');
                refreshRequests();
            })
            .catch( err => {
                console.log(err);
            });
    }

    const cancelFriendRequest = (email, requestId) => {
        cancelRequest(user.token, email, requestId)
            .then( () => {
                toast.success('friend request cancelled');
                refreshRequests();
            })
            .catch( err => {
                console.log(err);
            });
    }

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-4">
                <h5>Friends List</h5>
                {
                    friends && friends.length > 0 ? 
                        friends.map(item => (
                            <Comment
                                author={<h6>{item.name}</h6>}
                                avatar={<Avatar style={{ backgroundColor: '#008dff' }} icon={<UserOutlined />} />}
                                content={
                                <p className="text-left">
                                    {item.email}
                                </p>
                                }
                            />
                        ))
                    : <span className="text-secondary">No friends in list</span>
                }
                </div>
                <div className="col-md-4">
                    <h5>Received Requests</h5>
                    {/* {JSON.stringify(received)} */}
                        {received && received.length > 0 ? received.map(item => (
                            <Card
                            key={item._id}
                            style={{ width: 300 }}
                            actions={[
                            <div onClick={() => acceptFriendRequest(item.from.email, item._id)} >
                                <UserAddOutlined key="edit" className="text-success" />
                                <p>Add Friend</p>
                            </div>,
                            <div onClick={() => rejectFriendRequest(item.from.email)} >
                                <DeleteOutlined key="edit" className="text-success" />
                                <p>Reject Request</p>
                            </div>
                            ]}
                        >
                            <Meta
                            avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                            title={item.from.name}
                            description={item.from.email}
                            />
                        </Card>
                        )) : null}
                </div>
                <div className="col-md-4">
                    <h5>Sent Requests</h5>
                        {sent && sent.length > 0 ? sent.map(item => (
                            <Card
                                key={item._id}
                                style={{ width: 300 }}
                                actions={[
                                    <div onClick={() => cancelFriendRequest(item.to.email)} >
                                        <DeleteOutlined className="text-danger" key="edit" />
                                        Delete Request
                                    </div>
                                ]}
                            >
                                <Meta
                                avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                                title={item.to.name}
                                description={item.to.email}
                                />
                            </Card>
                        )) : null}
                </div>
            </div>
        </div>
    );
}

export default Friends;