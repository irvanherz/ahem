import auth from '../../Auth/reducer';
import app from '../../App/reducer';
import {combineReducers} from 'redux';

export default combineReducers({auth, app});
