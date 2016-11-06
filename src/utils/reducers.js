export function getIds(items) {
    return items.map((item) => {
        return item.id;
    });
}

export function getTaskKey(id) {
    return 'task' + id;
}

export function getChannelKey(id) {
    return 'channel' + id;
}
