import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { folderReducer } from './folderReducer';

export const RootReducer = combineReducers({
    user: userReducer,
    folder: folderReducer
});

export default RootReducer;