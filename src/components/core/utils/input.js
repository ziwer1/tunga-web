export function filterInputProps(props) {
    let inputProps = {};
    ['value', 'defaultValue'].forEach(item => {
        if(props[item]) {
            inputProps[item] = props[item];
        }
    });
    return inputProps;
}