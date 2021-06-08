import React, {useState} from 'react';

import { Menu } from 'antd';
import {
  StarOutlined,
  UserAddOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardFilled,
  ContactsOutlined,
  BookOutlined,
  StockOutlined
} from '@ant-design/icons';
import {Link} from 'react-router-dom';

import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as actionTypes from '../../../store/actionTypes';

const { SubMenu, Item } = Menu;


const HeaderComponent = () => {
    const [current, setCurrent] = useState('home');

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    const dispatch = useDispatch();
    const history = useHistory();
    const { user, cart } = useSelector((state) => ({ ...state }));

    const logout = () => {
      console.log('logggin user out');
      firebase.auth().signOut();
      dispatch({
        type: actionTypes.LOGOUT,
        payload: null
      });
      history.push('/home');
    }
    
    return (
      <div className="sticky-header">
        <Menu onClick={handleClick} selectedKeys={[current]} theme="dark" mode="horizontal">
          <Item key="home" icon={<StarOutlined />}>
            <Link to="/">Home</Link>
          </Item>
          
          { !user && <Item key="login" icon={<UserOutlined />}  className="float-right">
            <Link to="/login">Login</Link>
          </Item> }

          { !user && 
            <Item key="register" icon={<UserAddOutlined />} className="float-right">
              <Link to="/register">Register</Link>
            </Item>
          }

          { user && 
            <SubMenu key="SubMenu"  title={user.name || 'User'} icon={<SettingOutlined />} className="float-right">
              <Item key="dashboard" icon={<DashboardFilled />}><Link to="/user/dashboard">Dashboard</Link></Item>
              <Item key="logout" icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
            </SubMenu>
          }

            <Item key="aboutUs" icon={<BookOutlined />} className="float-right">
              <Link to="/aboutUs">About Us</Link>
            </Item>
            
            <Item key="contactUs" icon={<ContactsOutlined />} className="float-right">
              <Link to="/contactUs">Contact Us</Link>
            </Item>
            {
              user && <Item key="People" icon={<ContactsOutlined />} className="float-right">
                <Link to="/user/people">Find People</Link>
              </Item>
            }
            {
              user &&
                <Item key="Friends" icon={<ContactsOutlined />} className="float-right">
                  <Link to="/user/friends">Friends</Link>
                </Item>
            }
            {
              user &&
                <Item key="shared" icon={<StockOutlined />} className="float-right">
                  <Link to="/user/shared">Shared With Me</Link>
                </Item>
            }
        </Menu>
      </div>
    );
};

export default HeaderComponent;