
$.playlistMove.addEventListener('mouseover', () => $.playlistMove.classList.add('active'));
$.playlistMove.addEventListener('mouseout', () => $.playlistMove.classList.remove('active'));

$.playlistMove.addEventListener('mousedown', () => {
    $.isPlaylistMoving = true;
    window.addEventListener('mousemove', _movePlaylist);
    window.addEventListener('mouseup', _cancelMovePlaylist);
});


function _movePlaylist () {
    $.playlistMove.classList.add('active');

    let percentWidth = window.event.clientX / window.innerWidth * 100;
    percentWidth <= 40 && (percentWidth = 40);
    percentWidth >= 70 && (percentWidth = 70);
    $.visualisationContainer.style.width = `${percentWidth}%`;
    $.playlistСontainer.style.width = `${100-percentWidth}%`;
}

function _cancelMovePlaylist () {
    $.isPlaylistMoving = false;
    $.playlistMove.classList.remove('active');
    window.removeEventListener('mousemove', _movePlaylist);
    window.removeEventListener('mouseup', _cancelMovePlaylist);
}
