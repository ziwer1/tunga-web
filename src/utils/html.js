export function nl_to_br(str) {
    if(str) {
        return str.replace(/\n/g, "<br />");
    }
    return str;
}

export function render_excerpt(excerpt) {
    return nl_to_br(excerpt);
}

