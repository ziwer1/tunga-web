import store from '../store';

export function getAuth() {
    return store.getState().Auth;
}

export function getUser() {
    return getAuth().user;
}

export function isAuthenticated() {
    return getAuth().isAuthenticated;
}

export function getUserType() {
    return getUser().type || null;
}

export function isDeveloper() {
    return getUser().is_developer;
}

export function isProjectOwner() {
    return getUser().is_project_owner;
}

export function isProjectManager() {
    return getUser().is_project_manager;
}

export function isAdmin() {
    let user = getUser();
    return user.is_staff || user.is_superuser;
}
