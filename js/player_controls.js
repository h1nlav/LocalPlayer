
// keyboard
window.onkeydown = e => {
    if (e.code == 'F11') {
        e.preventDefault();
    } else if (e.code == 'Space') {
        e.preventDefault();
        playPauseSong();
    } else if (e.code == 'ArrowRight' && $.currentSong) {
        $.player.currentTime += 5;
        $.progressBar.value = $.player.currentTime;
        moveProgressBar($.player.currentTime / $.player.duration * 100);
    } else if (e.code == 'ArrowLeft' && $.currentSong) {
        $.player.currentTime -= 5;
        $.progressBar.value = $.player.currentTime;
        moveProgressBar($.player.currentTime / $.player.duration * 100);
    } else if (e.code == 'ArrowUp') {
        e.preventDefault()
        $.volumeBar.value = (parseInt($.volumeBar.value) + 5).toString()
        moveVolumeBar(null, $.volumeBar.value);
    } else if (e.code == 'ArrowDown') {
        e.preventDefault()
        $.volumeBar.value = (parseInt($.volumeBar.value) - 5).toString()
        moveVolumeBar(null, $.volumeBar.value);
    } else if (e.code == 'KeyM') {
        volumeSvgHandler();
    } else if (e.code == 'KeyF') {
        showFullScreen();
    } else if (e.code == 'KeyL') {
        showPlaylist();
    } else if (e.code == 'KeyP') {
        changePlaybackOption();
    } 
    else if (e.code == 'KeyI') {
        $.input.click();
    }
}

$.volumeBar.addEventListener('keydown', e => e.preventDefault());



// main btns
$.playPauseBtn.onmousedown = function() {
    $.playPauseBtn.classList.add('active');
    window.addEventListener('mouseup', function mouseUp(e) {
        if (e.target.closest('.play-pause-btn-bg')) playPauseSong();
        $.playPauseBtn.classList.remove('active');
        window.removeEventListener('mouseup', mouseUp);
    });
}

$.nextBtn.onmouseenter = () => $.nextBtn.classList.add('active');
$.nextBtn.onmouseleave = () => $.nextBtn.classList.remove('active');
$.nextBtn.onclick = () => nextSong();

$.prevBtn.onmouseenter = () => $.prevBtn.classList.add('active');
$.prevBtn.onmouseleave = () => $.prevBtn.classList.remove('active');
$.prevBtn.onclick = () => prevSong();

function playPauseSong() {
    if($.currentSong) {
        $.player.paused ? (
            $.player.play(), 
            $.playPauseBtn.querySelector('use').attributes[0].value = '#pause-btn' 
        ):(
            $.player.pause(),
            $.playPauseBtn.querySelector('use').attributes[0].value = '#play-btn' 
        );  
    } else $.playFirstSong();
}

function nextSong() {
    if($.currentSong && !$.currentSong.nextElementSibling.classList.contains('add-item-btn')) {
        $.playSong($.currentSong.nextElementSibling); 
    } else $.playFirstSong();
}

function prevSong() {
    if($.currentSong && $.player.currentTime <= 5 && $.currentSong.previousElementSibling) {
        $.playSong($.currentSong.previousElementSibling);
    } else if ($.currentSong && $.player.currentTime > 5) {
        $.player.currentTime = 0;
    } else $.playFirstSong();
}


// progress bar
let tmpProgressBarValue;
let isProgressBarMoving = false;

$.progressBar.onmouseenter = () => $.progressBar.classList.add('active');
$.progressBar.onmouseleave = () => $.progressBar.classList.remove('active');

$.progressBar.addEventListener('mousedown', e => {
    isProgressBarMoving = true;
    
    const progressBarCoords = $.progressBar.getBoundingClientRect();
    const progressPercent = ((e.clientX - progressBarCoords.x) / progressBarCoords.width * 100);
    $.progressBar.value = $.player.duration / 100 * progressPercent;

    tmpProgressBarValue = $.progressBar.value;
    moveProgressBar(progressPercent)

    $.progressBar.addEventListener('mousemove', changeprogress = () => {
        tmpProgressBarValue = $.progressBar.value
        moveProgressBar($.progressBar.value / $.player.duration * 100);
    });
})

$.progressBar.addEventListener('mouseup', () => {
    $.progressBar.value = tmpProgressBarValue;
    $.player.currentTime = $.progressBar.value;
    isProgressBarMoving = false;

    $.progressBar.removeEventListener('mousemove', changeprogress);
})

$.player.addEventListener('timeupdate', () => {
    if(!isProgressBarMoving) {  
        $.progressBar.value = $.player.currentTime;
        moveProgressBar($.player.currentTime / $.player.duration * 100);
    }       
})

function moveProgressBar(progressPercent) {
    if ($.currentSong) {
        $.progressBar.style.background = `linear-gradient(90deg, #9e9e9e ${progressPercent}%, #525252 ${progressPercent}%)`;
        document.querySelector('.current-time > span').innerHTML = $.formatTime($.progressBar.value);         
    }
}


// playback btn
let playbackOption = 'none';

$.playbackControlsContainer.onmouseenter = () => {if (playbackOption == 'none') $.playbackControlsSvg.classList.add('hover')};
$.playbackControlsContainer.onmouseleave = () => $.playbackControlsSvg.classList.remove('hover');

$.playbackControlsContainer.onclick = () => changePlaybackOption();

function changePlaybackOption() {
    if (playbackOption == 'none') {
        playbackOption = 'play-in-circle';
        $.playbackControlsSvg.querySelector('use').attributes[0].value = '#play-in-circle';
        $.playbackControlsSvg.classList.add('active');
    } else if (playbackOption == 'play-in-circle'){
        playbackOption = 'play-one-song';
        $.playbackControlsSvg.querySelector('use').attributes[0].value = '#play-one-song';
    } else if (playbackOption == 'play-one-song'){
        playbackOption = 'play-random-song';
        $.playbackControlsSvg.querySelector('use').attributes[0].value = '#play-random-song';
    } else {
        playbackOption = 'none';
        $.playbackControlsSvg.querySelector('use').attributes[0].value = '#play-in-circle';
        $.playbackControlsSvg.classList.remove('hover');
        $.playbackControlsSvg.classList.remove('active');
    }
}

$.player.addEventListener("ended", () => {
    if (playbackOption == 'play-one-song') {
        $.playSong($.currentSong);
    } else if (playbackOption == 'play-random-song') {
        let playlistSongs = Object.values(document.querySelectorAll('.playlist-item:not(.playing)')); 
        let j, temp;
	    for(let i = playlistSongs.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            temp = playlistSongs[j];
            playlistSongs[j] = playlistSongs[i];
            playlistSongs[i] = temp;
	    }
        $.playSong(playlistSongs[0]);
    } else if ($.currentSong.nextElementSibling.classList.contains('add-item-btn')) { 
        if (playbackOption == 'none') {
            $.resetPlayer();
        } else if (playbackOption == 'play-in-circle') {
            $.playFirstSong();
        } 
    } else {
        nextSong();
    }
    
    if (isProgressBarMoving) {
        $.progressBar.value = 0;
        moveProgressBar($.progressBar.value / $.player.duration * 100);
    }
});


// playlist show btn
$.playlistShowBtnContainer.onmouseenter = () => $.playlistShowBtnSvg.classList.add('hover');
$.playlistShowBtnContainer.onmouseleave = () => $.playlistShowBtnSvg.classList.remove('hover');
$.playlistShowBtnContainer.onclick = () => showPlaylist();

function showPlaylist() {
    if(window.getComputedStyle($.playlistСontainer).display == 'none') {
        $.playlistСontainer.classList.remove('hidden');
        $.visualisationContainer.style.width = `0%`;

        let percentWidth = parseInt(window.getComputedStyle($.playlistСontainer).width) / 
        parseInt(window.getComputedStyle($.playerContent).width) * 100;
        $.visualisationContainer.style.width = `${100 - percentWidth}%`;

        $.playlistShowBtnSvg.classList.remove('inactive');
    } else {
        $.playlistСontainer.classList.add('hidden');
        $.visualisationContainer.style.width = '100%';
        $.playlistShowBtnSvg.classList.add('inactive');
    }
}


// volume btn & bar
let tmpVolumeBarValue = 0;

$.volumeControls.onmouseenter = () => {
    $.volumeSvg.classList.add('active');
    $.volumeBar.classList.add('active');
}
$.volumeControls.onmouseleave = () => {
    $.volumeBar.classList.remove('active');
    $.volumeSvg.classList.remove('active');
}

$.volumeSvg.onclick= () => volumeSvgHandler();
$.volumeBar.addEventListener('mousedown', e => {
    if ($.volumeBar.value != 0) tmpVolumeBarValue = $.volumeBar.value;
    const volumeBarCoords = $.volumeBar.getBoundingClientRect();
    const volumePercent = ((e.clientX - volumeBarCoords.x) / volumeBarCoords.width * 100).toFixed();
    moveVolumeBar(null, volumePercent);

    $.volumeBar.addEventListener('mousemove', changeVolumeBar = () => moveVolumeBar(null, $.volumeBar.value));
});

$.volumeBar.addEventListener('mouseup', () => $.volumeBar.removeEventListener('mousemove', changeVolumeBar));

function volumeSvgHandler() {
    if ($.volumeBar.value != 0) {
        tmpVolumeBarValue = $.volumeBar.value;
        $.volumeBar.value = 0;
        moveVolumeBar(null, 0);
    } else if ($.volumeBar.value == 0) {
        $.volumeBar.value = tmpVolumeBarValue;
        moveVolumeBar(null, tmpVolumeBarValue);
    }
}

function moveVolumeBar(event, volumePercent) {
    $.player.volume = volumePercent / 100;
    $.volumeBar.style.background = `linear-gradient(90deg, #9e9e9e ${volumePercent}%, #525252 ${volumePercent}%)`;

    if (volumePercent >= 70) {
        $.volumeSvg.querySelector('use').attributes[0].value = '#volume-more-70%' 
    } else if (volumePercent >= 30) {
        $.volumeSvg.querySelector('use').attributes[0].value = '#volume-more-30%' 
    } else if (volumePercent > 0) {
        $.volumeSvg.querySelector('use').attributes[0].value = '#volume-more-0%' 
    } else {
        $.volumeSvg.querySelector('use').attributes[0].value = '#volume-0%' 
    }   
}


// fullscreen btn
$.fullscreenСontainer.onmouseenter = () => {
    $.fullscreenSvg.classList.add('active');
    $.cancelFullscreenSvg.classList.add('active');
}
$.fullscreenСontainer.onmouseleave = () => {
    $.fullscreenSvg.classList.remove('active');
    $.cancelFullscreenSvg.classList.remove('active');
}
$.fullscreenСontainer.onclick = () => showFullScreen();

function showFullScreen() {
    if (document.fullscreenElement) {
        let cancelFullScreen = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen;
        cancelFullScreen.call(document);
    } else {
        let docEl = document.documentElement;
        let showFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen;
        showFullScreen.call(docEl);
    }
}








