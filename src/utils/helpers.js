export function isInt(n) {
    return parseInt(n) === n;
}

export function parseNumber(number, precision=2) {
    if(isInt(number)) {
        return parseInt(number);
    }
    return parseFloat(number).toFixed(precision);
}
