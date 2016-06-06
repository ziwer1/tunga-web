export function render_excerpt(excerpt) {
    if(excerpt) {
        return excerpt.replace(/\n/g, "<br />");
    }
    return excerpt;
}
