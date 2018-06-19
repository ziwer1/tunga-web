import {combineReducers} from 'redux';
import {getIds} from './utils';
import * as ProjectActions from "../actions/ProjectActions";

function created(state = {}, action) {
    let targetKey = action.target || 'new';
    let newState = {};
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_SUCCESS:
            newState[targetKey] = action.project.id;
            return {...state, ...newState};
        default:
            return state;
    }
}

function ids(state = {}, action) {
    let selection_key = action.selection || 'default';
    let new_state = {};
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case ProjectActions.LIST_PROJECTS_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case ProjectActions.LIST_PROJECTS_FAILED:
            return state;
        default:
            return state;
    }
}

function projects(state = {}, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            let all_projects = {};
            action.items.forEach(project => {
                all_projects[project.id] = project;
            });
            return {...state, ...all_projects};
        case ProjectActions.RETRIEVE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            let new_project = {};
            new_project[action.project.id] = action.project;
            return {...state, ...new_project};
        default:
            return state;
    }
}

function isSaving(state = {}, action) {
    let targetKey = action.target || 'new';
    let newState = {};
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProjectActions.CREATE_PROJECT_SUCCESS:
        case ProjectActions.CREATE_PROJECT_FAILED:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isSaved(state = {}, action) {
    let targetKey = action.target || 'new';
    let newState = {};
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.CREATE_PROJECT_FAILED:
        case ProjectActions.UPDATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isRetrieving(state = {}, action) {
    let targetKey = action.target || 'new';
    let newState = {};
    switch (action.type) {
        case ProjectActions.RETRIEVE_PROJECT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProjectActions.RETRIEVE_PROJECT_SUCCESS:
        case ProjectActions.RETRIEVE_PROJECT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_START:
            return true;
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_PROJECTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case ProjectActions.LIST_MORE_PROJECTS_START:
            return true;
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_FAILED:
            return false;
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
            return action.count;
        case ProjectActions.LIST_PROJECTS_START:
        case ProjectActions.LIST_PROJECTS_FAILED:
            return 0;
        default:
            return state;
    }
}

function errors(state = {}, action) {
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_FAILED:
            return {...state, create: action.error};
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.CREATE_PROJECT_SUCCESS:
            return {...state, create: null};
        case ProjectActions.UPDATE_PROJECT_FAILED:
            return {...state, update: action.error};
        case ProjectActions.UPDATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const Project = combineReducers({
    created,
    ids,
    projects,
    isSaving,
    isSaved,
    isRetrieving,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    errors,
});

export default Project;
