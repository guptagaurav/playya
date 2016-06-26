/**
 * Created by gauravgupta on 26/06/16.
 */

chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    playingDivs = $("video");
    if (playingDivs.constructor == Array){
        console.log("array");
        playingDivsLen = playingDivs.length;
        for (var i=0; i<playingDivsLen; i++){
            if (!playingDivs[i].pause){
                tagData = {index: i, id : playingDivs[i][0].id, class: playingDivs[i][0].className};
                playPause.push(tagData);
                playingDivs[i][0].pause();
            }
        }
        sendResponse({result: playPause});
    } else {
        console.log("single");
        tagData = {index: 0, id : playingDivs[0].id, class: playingDivs[0].className};
        setTimeout(function () {
            playingDivs[0].pause();
        },150);
        sendResponse({result: tagData});
    }
});