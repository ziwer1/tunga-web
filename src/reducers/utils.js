export function getIds(items) {
    return Array.from(
        new Set(
            items.map(item => {
                return item.id;
            }),
        ),
    );
}
