import { combineReducers } from 'redux'
import { LOCATION_CHANGE } from 'react-router-redux'

function isChanging(state = false, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return true;
        default:
            return false;
    }
}
const Nav = combineReducers({
    isChanging
});

export default Nav;
