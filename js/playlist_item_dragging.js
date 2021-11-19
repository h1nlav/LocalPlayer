
let draggingItem = null;
let overItem = null;

$.playlist.addEventListener('dragstart', e => {
    $.isPlaylistItemDragging = true;
    draggingItem = e.target;
})

$.playlist.addEventListener('dragover', e => {
    e.preventDefault();
    overItemClear();
    if ($.isPlaylistItemDragging && e.target.closest('li')) {
        overItem = e.target.closest('li');  
        let overItemCoords = overItem.getBoundingClientRect();
        let overItemCenter = (overItemCoords.y + overItemCoords.height / 2).toFixed();
        e.clientY >= overItemCenter && (overItem = overItem.nextElementSibling);
        overItem?.classList.add('insert-before');
    }
})

$.playlist.addEventListener('dragend', e => {
    if (overItem) {
        $.playlist.insertBefore(draggingItem, overItem);
        $.newItemsNumbers();
    }
    overItemClear();
    draggingItem = null;
    $.isPlaylistItemDragging = false;
})


function overItemClear () {
    overItem?.classList.remove('insert-before');
    overItem = null;
}
