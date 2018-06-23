export function filterInputProps(props) {
    let inputProps = {};
    ['value', 'defaultValue', 'required'].forEach(item => {
        if(props[item] || props[item] === '') {
            inputProps[item] = props[item];
        }
    });
    return inputProps;
}
