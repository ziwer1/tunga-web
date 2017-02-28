export const AUTHED_ONLY = 'authedOnly';
export const UNAUTHED_ONLY = 'unauthedOnly';
export const AUTHED_OR_EMAIL_ONLY = 'authedOrEmailOnly';

export function requiresAuth(routes) {
    return getRouteParamValues(AUTHED_ONLY, routes).indexOf(true) > -1;
}

export function requiresNoAuth(routes) {
    return getRouteParamValues(UNAUTHED_ONLY, routes).indexOf(true) > -1;
}

export function requiresAuthOrEmail(routes) {
    return getRouteParamValues([AUTHED_ONLY, AUTHED_OR_EMAIL_ONLY], routes).indexOf(true) > -1;
}

export function getRouteParamValues(keys, routes) {
    var paramValues = [];
    if(routes) {
        var targetKeys = keys;
        if(!Array.isArray(keys)) {
            targetKeys = [keys];
        }

        targetKeys.forEach(function (key) {
            paramValues = paramValues.concat(
                routes.map(function (route) {
                    return route[key];
                })
            );
        });
    }
    return paramValues;
}

export function getRouteCrumb(routes) {
    if(Array.isArray(routes) && routes.length) {
        var x;
        for(x=routes.length-1; x >= 0; x--) {
            let route = routes[x];
            if(route.crumb) {
                return route.crumb;
            }
        }
    }
    return null;
}

export function showWizard(routes) {
    if(Array.isArray(routes) && routes.length) {
        var x;
        for(x=routes.length-1; x >= 0; x--) {
            let route = routes[x];
            if(route.showTaskWizard) {
                return route.showTaskWizard;
            }
        }
    }
    return false;
}
