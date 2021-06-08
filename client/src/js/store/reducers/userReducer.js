import * as actionTypes from '../actionTypes';

export const userReducer = (state = null, action) => {
    switch(action.type) {
        case actionTypes.LOGGED_IN_USER:
            return action.payload;
        case actionTypes.LOGOUT:
            return null;
        default:
            return state;
    }   
}