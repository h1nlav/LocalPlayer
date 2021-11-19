
const $ = {};
window.$ = $;


let isMobileBrowser = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobileBrowser = true;})(navigator.userAgent||navigator.vendor||window.opera);
$.logoContainer = document.querySelector('.logo-container');

if (isMobileBrowser) {
    $.logoContainer.querySelector('.danger').classList.add('active');
} else {
    $.logoContainer.classList.add('active');
    $.logoContainer.querySelector('.logo-svg').classList.add('active');
    $.logoContainer.addEventListener('animationend', () => $.logoContainer.style.display = 'none');
}


$.player = document.createElement('audio');
$.input = document.createElement('input');
$.input.setAttribute('type', 'file');
$.input.setAttribute('accept', '.mp3');
$.input.setAttribute('multiple', 'true');

$.playlistSongs = new Map();
$.currentSong = null;


$.playerContent = document.querySelector('.player-content');

$.visualisationContainer = document.querySelector('.visualisation-container');
$.visualisationCanvas = document.querySelector('.visualisation-canvas');

$.playlistСontainer = document.querySelector('.playlist-container');
$.playlistMove = document.querySelector('.playlist-move');
$.playlistScroll = document.querySelector('.playlist-scroll')
$.playlist = document.querySelector('.playlist');
$.addItemBtn = document.querySelector('.add-item-btn');
$.dropZone = document.querySelector('.drop-zone');
$.isPlaylistMoving = false;
$.isPlaylistItemDragging = false;


$.controlsPanel = document.querySelector('.controls-panel');

$.currentSongNameContainer = document.querySelector('.current-song-name');
$.csnSpan1 = document.querySelector('.csn-span1');
$.csnSpan2  = document.querySelector('.csn-span2');
$.currentNameAnimationTime = null;

$.playPauseBtn = document.querySelector('.play-pause-btn-bg');
$.prevBtn = document.querySelector('.prev-btn');
$.nextBtn = document.querySelector('.next-btn');
$.progressBar = document.querySelector('.progress-bar');

$.playbackControlsContainer = document.querySelector('.playback-controls-container');
$.playbackControlsSvg = document.querySelector('.playback-controls-svg');

$.playlistShowBtnContainer = document.querySelector('.playlist-show-btn-container');
$.playlistShowBtnSvg = document.querySelector('.playlist-show-btn-svg');

$.volumeControls = document.querySelector('.volume-controls');
$.volumeBar = document.querySelector('.volume-bar');
$.volumeSvg = document.querySelector('.volume-svg');

$.fullscreenСontainer = document.querySelector('.fullscreen-container');
$.fullscreenSvg = document.querySelector('.fullscreen-svg');
$.cancelFullscreenSvg = document.querySelector('.cancel-fullscreen-svg');


$.formatTime = function(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    remainingSeconds < 10 && (remainingSeconds = `0${remainingSeconds}`);
    return `${minutes}:${remainingSeconds}`;
}

$.newItemsNumbers = function () {
    let num = 1
    for (item of $.playlist.querySelectorAll('.playlist-item')) {
        item.querySelector('.item-number').innerHTML = num++;
    }
}

$.changeScroll = function () {
    let itemCoords = $.currentSong.getBoundingClientRect();

    if (itemCoords.y - itemCoords.height  < 0) {
        $.currentSong.scrollIntoView(true);
        $.playlistScroll.scrollBy(0, -itemCoords.height);
        
    } else if(itemCoords.y > $.controlsPanel.getBoundingClientRect().y - itemCoords.height*2) {
        $.currentSong.scrollIntoView(false);
        $.playlistScroll.scrollBy(0, itemCoords.height);
    }
}


$.playFirstSong = function() {
    if (document.querySelector('.playlist-item')) $.playSong(document.querySelector('.playlist-item'));
}

$.playSong = function (item) {
    if ($.currentSong) $.resetPlayer();

    $.currentSong = item;
    $.currentSong.classList.add('playing');           
    $.currentSong.querySelector('.item-number').classList.add('playing');
    $.currentSong.querySelector('.item-name').classList.add('playing');
    $.currentSong.querySelector('.item-duration').classList.add('playing');
    $.currentSong.querySelector('.item-delete').classList.add('playing');

    $.cancelAnimateName();
    $.currentNameAnimationTime = $.currentSong.querySelector('.item-name').textContent.length / 3 * 1000;
    $.csnSpan1.innerHTML = $.currentSong.querySelector('.item-name').textContent;
    $.csnSpan2.innerHTML = $.currentSong.querySelector('.item-name').textContent;
    $.player.src = $.playlistSongs.get($.currentSong);
    $.playPauseBtn.querySelector('use').attributes[0].value = '#pause-btn';
    $.changeScroll();

    $.player.addEventListener('loadeddata', () => {
        $.progressBar.max = $.player.duration;
        document.querySelector('.duration > span').innerHTML = $.formatTime($.player.duration)
        $.player.play(); 
    });
}


$.resetPlayer = function () {
    $.player.pause();

    $.currentSong.classList.remove('playing');          
    $.currentSong.querySelector('.item-number').classList.remove('playing');
    $.currentSong.querySelector('.item-name').classList.remove('playing');
    $.currentSong.querySelector('.item-duration').classList.remove('playing');
    $.currentSong.querySelector('.item-delete').classList.remove('playing');

    $.currentSong  = null;
    $.csnSpan1.innerHTML = '';
    $.csnSpan2.innerHTML = '';

    $.player.currentTime = 0;
    $.player.duration = 0;
    document.querySelector('.duration > span').innerHTML = '0:00';
    document.querySelector('.current-time > span').innerHTML = '0:00';
    $.playPauseBtn.querySelector('use').attributes[0].value = '#play-btn' ;
    $.progressBar.style.background = `linear-gradient(90deg, #9e9e9e 0%, #525252 0%)`; 
}



