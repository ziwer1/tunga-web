import { combineReducers } from 'redux'
import * as TaskActions from '../actions/TaskActions'
import * as ApplicationActions from '../actions/ApplicationActions'
import * as SavedTaskActions from '../actions/SavedTaskActions'
import { PATH_CHANGE } from '../actions/NavActions'
import { LOGOUT_SUCCESS, LIST_RUNNING_TASKS_SUCCESS } from '../actions/AuthActions'

import Application from './ApplicationReducers'
import Integration from './IntegrationReducers'

function task(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_SUCCESS:
        case TaskActions.RETRIEVE_TASK_SUCCESS:
            return action.task;
        case TaskActions.UPDATE_TASK_SUCCESS:
            return {...state, ...action.task};
        case TaskActions.DELETE_TASK_SUCCESS:
        case TaskActions.CREATE_TASK_START:
        case TaskActions.CREATE_TASK_FAILED:
        case TaskActions.UPDATE_TASK_START:
        case TaskActions.UPDATE_TASK_FAILED:
        case TaskActions.RETRIEVE_TASK_START:
        case TaskActions.RETRIEVE_TASK_FAILED:
            return {};
        case ApplicationActions.CREATE_APPLICATION_SUCCESS:
            if(state.id == action.application.task) {
                return {...state, can_apply: false};
            }
            return state;
        case SavedTaskActions.CREATE_SAVED_TASK_SUCCESS:
            if(state.id == action.saved_task.task) {
                return {...state, can_save: false};
            }
            return state;
        default:
            return state;
    }
}

function tasks(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            var all_tasks = {};
            action.items.forEach((task) => {
                all_tasks[task.id] = task;
            });
            return {...state, ...all_tasks};
        case TaskActions.LIST_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
            return {};
        case ApplicationActions.CREATE_APPLICATION_SUCCESS:
            var task = state[action.application.task];
            task.can_apply = false;
            var new_ref = {};
            new_ref[task.id] = task;
            return {...state, ...new_ref};
        case SavedTaskActions.CREATE_SAVED_TASK_SUCCESS:
            task = state[action.saved_task.task];
            task.can_save = false;
            new_ref = {};
            new_ref[task.id] = task;
            return {...state, ...new_ref};
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            var new_tasks = action.items.map((task) => {
                return task.id;
            });
            return [...state, ...new_tasks];
        case TaskActions.LIST_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
            return action.count;
        case TaskActions.LIST_MORE_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
            return 0;
        default:
            return state;
    }
}

function filter(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
            return action.filter;
        case TaskActions.LIST_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
            return null;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_START:
        case TaskActions.UPDATE_TASK_START:
            return true;
        case TaskActions.CREATE_TASK_SUCCESS:
        case TaskActions.CREATE_TASK_FAILED:
        case TaskActions.UPDATE_TASK_SUCCESS:
        case TaskActions.UPDATE_TASK_FAILED:
        case TaskActions.RETRIEVE_TASK_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_SUCCESS:
        case TaskActions.UPDATE_TASK_SUCCESS:
            return true;
        case TaskActions.CREATE_TASK_START:
        case TaskActions.CREATE_TASK_FAILED:
        case TaskActions.UPDATE_TASK_START:
        case TaskActions.UPDATE_TASK_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_START:
            return true;
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_TASKS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_MORE_TASKS_START:
            return true;
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case TaskActions.RETRIEVE_TASK_START:
            return true;
        case TaskActions.RETRIEVE_TASK_SUCCESS:
        case TaskActions.RETRIEVE_TASK_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case TaskActions.DELETE_TASK_START:
            return true;
        case TaskActions.DELETE_TASK_SUCCESS:
        case TaskActions.DELETE_TASK_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_FAILED:
            return {...state, create: action.error};
        case TaskActions.CREATE_TASK_START:
        case TaskActions.CREATE_TASK_SUCCESS:
            return {...state, create: null};
        case TaskActions.UPDATE_TASK_FAILED:
            return {...state, update: action.error};
        case TaskActions.UPDATE_TASK_START:
        case TaskActions.UPDATE_TASK_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

export function running(state = [], action) {
    switch (action.type) {
        case LIST_RUNNING_TASKS_SUCCESS:
            return action.items;
        case TaskActions.CREATE_TASK_SUCCESS:
            return [action.task, ...state];
        case LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}

function meta(state = {}, action) {
    switch (action.type) {
        case TaskActions.RETRIEVE_TASK_META_SUCCESS:
            return action.meta;
        case TaskActions.UPDATE_TASK_FAILED:
            return {};
        default:
            return state;
    }
}

const detail = combineReducers({
    task,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    applications: Application,
    integrations: Integration,
    meta,
    error
});

const list = combineReducers({
    tasks,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    filter
});

const Task = combineReducers({
    detail,
    list,
    running
});

export default Task;
