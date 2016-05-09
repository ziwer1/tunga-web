var player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player('learn-video', {});
}

var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

