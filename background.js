/**
 * Created by gauravgupta on 25/06/16.
 */

playPause = [];

/* Signal the tab playing audio to pause it. */
function sendMessageToPause(tab, callback) {
    console.log("SMPauseTabId "+ tab.id);
    chrome.tabs.sendMessage(tab.id, {result: "Pausing"}, function (response) {
        if (response.result.constructor == Object)
            playPause.push({tabId: tab.id, index: response.result.index, id: response.result.id, class: response.result.class});
        else if (response.result.constructor == Array){
            console.log("arrayHere");
            divInfoList = response.result;
            divInfoListLen = divInfoList.length;
            for (var i=0; i<divInfoListLen; i++){
                playPause.push({tabId: tab.id, index: response.result.index, id: divInfoList[i].id, class: divInfoList[i].class});
            }
        }
        localStorage.setItem("data", JSON.stringify(playPause));
        callback();
    })
}

/* Signal the tab to Play audio muted by extension earlier. */
function sendMessageToPlay(tabInfo, callback) {
    console.log("SMPlayTabId "+ tabInfo.tabId);
    chrome.tabs.sendMessage(tabInfo.tabId, {result: tabInfo}, function (response){
        console.log("played tab ID " + tabInfo.tabId);
        callback();
    });
}

function pauseVid(i, len, tabs) {
    if (i == len)
        return;

    tab = tabs[i];
    chrome.tabs.executeScript(tab.id, {file: "jquery.min.js"}, function () {
        chrome.tabs.executeScript(tab.id, {file: "pause.js"}, function () {
            sendMessageToPause(tab, function(){
                pauseVid(i+1, len, tabs);
            });
        });
    });
}

function playVid(i, start) {
    if (i < start)
        return;

    tabInfo = playPause[i];
    console.log(tabInfo);
    chrome.tabs.executeScript(tabInfo.tabId, {file: "jquery.min.js"}, function () {
        chrome.tabs.executeScript(tabInfo.tabId, {file: "play.js"}, function () {
            sendMessageToPlay(tabInfo, function () {
                playVid(i-1, start);
            });
        });
    });

}

/* Play or pause the video by pressing Shortcut Key. Currently Supported only for HTML5 video player. */
chrome.commands.onCommand.addListener(function(command) {
    if (command == "play-pause") {
        chrome.tabs.query({audible: true}, function (tabs) {
            len = tabs.length;
            if (len) {                               // pause the videos
                playPause = [];
                localStorage.clear();
                console.log(len);
                pauseVid(0, len, tabs);
                chrome.browserAction.setBadgeText({text: "ON"});
            } else {                                 // play the videos
                playPause = JSON.parse(localStorage.getItem("data"));
                pauseLen = playPause.length;
                if (pauseLen) {
                    console.log(playPause);
                    playVid(pauseLen - 1, 0);
                }
            }
        });
    } else {
        console.log("History Deleted");
        localStorage.clear();
        playPause = [];
        chrome.browserAction.setBadgeText({text: ""});
    }
    console.log(command);
});

chrome.browserAction.setPopup({popup: "popup.html"});

// TODO: display a tooltip upon installing the extension
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") { //reason ( enum of "install", "update", or "chrome_update" )
        console.log("Installed");
        chrome.browserAction.setPopup({popup: "Play/Pause Videos using Hot Keys. Press Ctrl(Command)+Shift+0 to toggle Play, Pause videos. Press Ctrl(Command)+Shift+1 to delete history. Play your video after a 3-4 seconds if you have paused it using this extension."});
    }
});