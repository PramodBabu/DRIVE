import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './js/components/Auth/Login';
import Register from './js/components/Auth/Register';
import Home from './js/components/Home/Home';
import HeaderComponent from './js/components/UI/nav/HeaderComponent';
import ForgotPassword from './js/components/Auth/ForgotPassword';
import UserRoute from './js/routes/userRoute';

//firebase
import { auth } from './js/config/firebase';

//react and redux
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { currentUser } from './js/utils/auth';
import * as actionTypes from './js/store/actionTypes';
import DashBoard from './js/components/dashboard/Dashboard';
import RegisterComplete from './js/components/Auth/RegisterComplete';
import AboutUs from './js/components/AboutUs/AboutUs';
import ContactUs from './js/components/ContactUs/ContactUs';
import Friends from './js/components/Friends/Friends';
import People from './js/components/Friends/People';
import Shared from './js/components/dashboard/Shared';

const App = () => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then(
              res => {
                  console.log(res);
                  dispatch({
                      type: actionTypes.LOGGED_IN_USER,
                      payload: {
                          email: res.data.email || '',
                          token: idTokenResult.token,
                          name: res.data.name || '',
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
                  dispatch({
                    type: actionTypes.LOGOUT,
                    payload: {}
                });
              }
          );
      }
    })
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="App">
        <HeaderComponent />
        <ToastContainer />
        {/* <div className="mt-3 h-100"> */}
            <Switch>
              <Route path='/' exact component={Home} ></Route>
              <Route path='/login' exact component={Login} ></Route>
              <Route path='/register' exact component={Register} ></Route>
              <Route path='/forgot/password' component={ForgotPassword} />
              <Route path='/register/complete' component={RegisterComplete} />
              <Route path='/aboutUs' exact component={AboutUs} ></Route>
              <Route path='/contactUs' exact component={ContactUs} ></Route>
              <UserRoute exact path='/user/dashboard' component={DashBoard} />
              <UserRoute exact path='/user/friends' component={Friends} />
              <UserRoute exact path='/user/people' component={People} />
              <UserRoute exact path='/user/shared' component={Shared} />
              <Redirect to='/' />
            </Switch>
          </div>
    // </div>
  );
}

export default App;
