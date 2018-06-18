import axios from 'axios';
import {ENDPOINT_PROJECTS} from './utils/api';

export const LIST_PROJECTS_START = 'LIST_PROJECTS_START';
export const LIST_PROJECTS_SUCCESS = 'LIST_PROJECTS_SUCCESS';
export const LIST_PROJECTS_FAILED = 'LIST_PROJECTS_FAILED';
export const RETRIEVE_PROJECT_START = 'RETRIEVE_PROJECT_START';
export const RETRIEVE_PROJECT_SUCCESS = 'RETRIEVE_PROJECT_SUCCESS';
export const RETRIEVE_PROJECT_FAILED = 'RETRIEVE_PROJECT_FAILED';
export const UPDATE_PROJECT_START = 'UPDATE_PROJECT_START';
export const UPDATE_PROJECT_SUCCESS = 'UPDATE_PROJECT_SUCCESS';
export const UPDATE_PROJECT_FAILED = 'UPDATE_PROJECT_FAILED';
export const LIST_MORE_PROJECTS_START = 'LIST_MORE_PROJECTS_START';
export const LIST_MORE_PROJECTS_SUCCESS = 'LIST_MORE_PROJECTS_SUCCESS';
export const LIST_MORE_PROJECTS_FAILED = 'LIST_MORE_PROJECTS_FAILED';

export function listProjects(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listProjectsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_PROJECTS, {params: filter})
            .then(function(response) {
                dispatch(listProjectsSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listProjectsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listProjectsStart(filter, selection, prev_selection) {
    return {
        type: LIST_PROJECTS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listProjectsSuccess(response, filter, selection) {
    return {
        type: LIST_PROJECTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listProjectsFailed(error, selection) {
    return {
        type: LIST_PROJECTS_FAILED,
        error,
        selection,
    };
}

export function retrieveProject(id) {
    return dispatch => {
        dispatch(retrieveProjectStart(id));
        axios
            .get(ENDPOINT_PROJECTS + id + '/')
            .then(function(response) {
                dispatch(retrieveProjectSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveProjectFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveProjectStart(id) {
    return {
        type: RETRIEVE_PROJECT_START,
        id,
    };
}

export function retrieveProjectSuccess(project) {
    return {
        type: RETRIEVE_PROJECT_SUCCESS,
        project,
    };
}

export function retrieveProjectFailed(error) {
    return {
        type: RETRIEVE_PROJECT_FAILED,
        error,
    };
}

export function updateProject(id, data) {
    return dispatch => {
        dispatch(updateProjectStart(id));
        axios
            .patch(ENDPOINT_PROJECTS + id + '/', data)
            .then(function(response) {
                dispatch(updateProjectSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateProjectFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateProjectStart(id) {
    return {
        type: UPDATE_PROJECT_START,
        id,
    };
}

export function updateProjectSuccess(project) {
    return {
        type: UPDATE_PROJECT_SUCCESS,
        project,
    };
}

export function updateProjectFailed(error) {
    return {
        type: UPDATE_PROJECT_FAILED,
        error,
    };
}

export function listMoreProjects(url, selection) {
    return dispatch => {
        dispatch(listMoreProjectsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreProjectsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreProjectsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreProjectsStart(url, selection) {
    return {
        type: LIST_MORE_PROJECTS_START,
        url,
        selection,
    };
}

export function listMoreProjectsSuccess(response, selection) {
    return {
        type: LIST_MORE_PROJECTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreProjectsFailed(error) {
    return {
        type: LIST_MORE_PROJECTS_FAILED,
        error,
    };
}
