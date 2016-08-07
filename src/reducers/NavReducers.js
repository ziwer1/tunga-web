import { combineReducers } from 'redux'
import { LOCATION_CHANGE } from 'react-router-redux'

import * as UserSelectionActions from '../actions/UserSelectionActions'
import * as SkillSelectionActions from '../actions/SkillSelectionActions'

function isChanging(state = false, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return true;
        case UserSelectionActions.INVALIDATE_USER_SUGGESTIONS:
        case SkillSelectionActions.INVALIDATE_SKILL_SUGGESTIONS:
            return state;
        default:
            return false;
    }
}
const Nav = combineReducers({
    isChanging
});

export default Nav;
