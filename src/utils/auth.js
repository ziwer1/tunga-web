import store from '../store';

export function getUser() {
    return store.getState().Auth.user;
}

export function getUserType() {
    let user = getUser();
    return user.type || null;
}
