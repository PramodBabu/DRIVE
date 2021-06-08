import * as actionTypes from '../actionTypes';

export const folderReducer = (state = null, action) => {
    switch(action.type) {
        case actionTypes.UPDATE_ROOT_FOLDER:
            return action.payload;
        default:
            return state;
    }   
}