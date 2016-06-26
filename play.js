/**
 * Created by gauravgupta on 26/06/16.
 */


chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    console.log(request.result);
    playingDivs = $("video");
    if (playingDivs.constructor == Array){
        idx = request.result.index;
        setTimeout(function () {
            playingDivs[idx][0].play();
        },150);
    } else {
        setTimeout(function () {
            playingDivs[0].play();
        },150);
    }
    sendResponse({result: "Played"});
});