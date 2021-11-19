
$.addItemBtn.addEventListener('mouseenter', addItemBtnActive);
$.addItemBtn.addEventListener('mousemove', addItemBtnActive);
$.addItemBtn.addEventListener('mouseleave', addItemBtnReset);
$.addItemBtn.addEventListener('click', () => {
    
    $.input.click()
});


window.document.addEventListener('dragenter', () => 
$.isPlaylistItemDragging || $.dropZone.classList.add('active'));
window.document.addEventListener('dragleave', () => 
window.event.clientX == 0 && $.dropZone.classList.remove('active'));
window.document.addEventListener('dragover', e => e.preventDefault());


window.addEventListener('drop', e => {
    e.preventDefault();
    $.dropZone.classList.remove('active')
    for (let file of e.dataTransfer.files) addPlaylistItem(file);
});

$.input.addEventListener("input", function() {
    for (let file of this.files) addPlaylistItem(file);
    $.input.value = null;
})


function addPlaylistItem (file) {
    if (file.type != 'audio/mpeg') return;
    $.createPlayerVisualiser();

    let item = document.createElement('li');
    
    const tmpPlayer = document.createElement('audio');
    tmpPlayer.src = URL.createObjectURL(file);
    tmpPlayer.onloadedmetadata = () => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            createHtmlTemplate(file, item, tmpPlayer.duration);
            createListeners(item);
            document.body.querySelector('.playlist').insertBefore(item, $.addItemBtn);
            $.playlistSongs.set(item, e.target.result); 
            $.playlist.classList.add('not-empty');
        }
    }
}


function createHtmlTemplate (file, item, duration) {
    item.classList.add('playlist-item');
    item.draggable = true
    item.insertAdjacentHTML('beforeend', `
    <span class="item-number">${document.querySelectorAll('.playlist-item').length + 1}</span>
    <span class="item-name">${file.name.substring(0, file.name.indexOf('.mp3'))}</span>
    <span class="item-duration">${$.formatTime(duration)}</span>
    <div class="item-delete">
        <svg><use class="item-delete-img" xlink:href="#add-delete-btn"></use></svg>
    </div>
    `);
}


function createListeners(item) {
    item.onmouseenter = () => itemActive(item);
    item.onmousemove = () => itemActive(item);
    item.onmouseleave = () => itemReset(item);


    item.querySelector('.item-delete-img').onclick = e => {
        e.target.closest('svg').classList.add('active');

        e.target.addEventListener('click', deleteItem);
        function deleteItem () {
            if (item == $.currentSong ) $.resetPlayer();
            $.playlistSongs.delete(item);
            item.remove();
            document.querySelector('.playlist-item') ? $.newItemsNumbers() : $.playlist.classList.remove('not-empty');
        }

        e.target.addEventListener('mouseleave', function tmpLeave() {
            e.target.closest('svg').classList.remove('active');
            e.target.removeEventListener('click', deleteItem);
            e.target.removeEventListener('mouseleave', tmpLeave);
        });
    }

    item.ondblclick = e => {
        if (!e.target.classList.contains('item-delete-img')) $.playSong(item);
    }
}


function addItemBtnActive() {
    if (!$.isPlaylistMoving) {
        $.addItemBtn.classList.add('active');
        $.addItemBtn.querySelector('svg').classList.add('active');
    } 
}

function addItemBtnReset() {
    $.addItemBtn.classList.remove('active');
    $.addItemBtn.querySelector('svg').classList.remove('active');
}

function itemActive(item) {
    if (!$.isPlaylistMoving) {
        item.classList.add('active');
        item.querySelector('.item-number').classList.add('active');
        item.querySelector('.item-duration').classList.add('active');
        item.querySelector('.item-delete').classList.add('active');
    }    
}

function itemReset (item) {
    item.classList.remove('active');
    item.querySelector('.item-delete').classList.remove('active');
    item.querySelector('.item-number').classList.remove('active');
    item.querySelector('.item-duration').classList.remove('active');
}