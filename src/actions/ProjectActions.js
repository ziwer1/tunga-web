import axios from 'axios';
import {ENDPOINT_PROJECTS} from './utils/api';

export const CREATE_PROJECT_START = 'CREATE_PROJECT_START';
export const CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS';
export const CREATE_PROJECT_FAILED = 'CREATE_PROJECT_FAILED';
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

export function createProject(project, documents, target) {
    return dispatch => {
        dispatch(createProjectStart(project, documents, target));

        let headers = {},
            data = project;

        if (documents && documents.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(project).map(key => {
                if (
                    (Array.isArray(project[key]) && project[key].length) ||
                    (!Array.isArray(project[key]) && project[key] != null)
                ) {
                    data.append(key, project[key]);
                }
            });

            let docsArray = [],
                uploadMetadata = [];

            documents.forEach((document, idx) => {
                if(document.file) {
                    let docKey = `document${idx}`;
                    data.append(docKey, document.file);
                    let docMeta = {...document};
                    delete docMeta['file'];
                    docMeta.key = docKey;
                    uploadMetadata.push(docMeta);
                } else {
                    docsArray.push(document);
                }
            });

            if(docsArray.length) {
                docsArray.forEach(doc => {
                    data.append('documents[]', doc);
                });
            }

            if(uploadMetadata.length) {
                uploadMetadata.forEach(upload => {
                    data.append('uploadMeta[]', upload);
                });
            }
        }

        axios
            .post(ENDPOINT_PROJECTS, data, {headers})
            .then(function(response) {
                dispatch(createProjectSuccess(response.data, documents, target));
            })
            .catch(function(error) {
                dispatch(
                    createProjectFailed(
                        (error.response ? error.response.data : null), project, documents, target
                    ),
                );
            });
    };
}

export function createProjectStart(project, documents, target) {
    return {
        type: CREATE_PROJECT_START,
        project,
        documents,
        target
    };
}

export function createProjectSuccess(project, documents, target) {
    return {
        type: CREATE_PROJECT_SUCCESS,
        project,
        documents,
        target
    };
}

export function createProjectFailed(error, project, documents, target) {
    return {
        type: CREATE_PROJECT_FAILED,
        error,
        project,
        documents,
        target
    };
}

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

export function updateProject(id, project_data, documents) {
    return dispatch => {
        dispatch(updateProjectStart(id, project_data, documents, id));

        let headers = {},
            data = project_data;
        if (documents && documents.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            if (project_data) {
                Object.keys(project_data).map(key => {
                    if (
                        (Array.isArray(project_data[key]) &&
                            project_data[key].length) ||
                        (!Array.isArray(project_data[key]) &&
                            project_data[key] != null)
                    ) {
                        data.append(key, project_data[key]);
                    }
                });
            }

            let docsArray = [],
                uploadMetadata = [];

            documents.forEach((document, idx) => {
                if(document.file) {
                    let docKey = `document${idx}`;
                    data.append(docKey, document.file);
                    let docMeta = {...document};
                    delete docMeta['file'];
                    docMeta.key = docKey;
                    uploadMetadata.push(docMeta);
                } else {
                    docsArray.push(document);
                }
            });

            if(docsArray.length) {
                docsArray.forEach(doc => {
                    data.append('documents[]', doc);
                });
            }

            if(uploadMetadata.length) {
                uploadMetadata.forEach(upload => {
                    data.append('uploadMeta[]', upload);
                });
            }
        }

        axios
            .patch(ENDPOINT_PROJECTS + id + '/', data, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateProjectSuccess(response.data, documents, id));
            })
            .catch(function(error) {
                dispatch(
                    updateProjectFailed(
                        (error.response ? error.response.data : null), project_data, documents, id
                    ),
                );
            });
    };
}

export function updateProjectStart(id, project, documents, target) {
    return {
        type: UPDATE_PROJECT_START,
        id,
        project,
        documents,
        target
    };
}

export function updateProjectSuccess(project, documents, target) {
    return {
        type: UPDATE_PROJECT_SUCCESS,
        project,
        documents,
        target
    };
}

export function updateProjectFailed(error, project, documents, target) {
    return {
        type: UPDATE_PROJECT_FAILED,
        error,
        project,
        documents,
        target
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
