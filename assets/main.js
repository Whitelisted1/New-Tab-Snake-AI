if (typeof browser === "undefined") {
    var browser = chrome;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function storeData(key, value){
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, function(){
            resolve(true);
        });
});
}

function getData(key){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function(items){
            resolve(items); // Maybe try return items and see if that does anything different
        });
     });
}


function updateSearchBar(){
        searchEngineCookie = getCookie("searchengine")
        if(searchEngineCookie == undefined) searchEngineCookie = ["Google", "google.com/search"];
        else searchEngineCookie = searchEngineCookie.split("|");
        searchEngine = searchEngineCookie[0];
        searchEngineURL = searchEngineCookie[1];

        searchBar = document.getElementById("searchbar");
        searchBar.placeholder = "Search on " + searchEngine;

        document.getElementById("searchEngineSelect").value = searchEngine;
        document.getElementById("search").action = "http://" + searchEngineURL;
}

function getSnakeColor(){
    var snakeColor = getCookie("snakecolor");
    if(snakeColor == undefined){
        document.cookie = "snakecolor=0,150,0;path=/"
        snakeColor = [0, 150, 0];
    } else snakeColor = snakeColor.split(",")
    return snakeColor;
}

function changeSearchEngine(){
    object = document.getElementById("searchEngineSelect");
    searchEngine = object.value;
    searchEngineURL = document.getElementById(searchEngine.toLowerCase() + "searchengine").getAttribute("url")
    console.log(searchEngine + " | " + searchEngineURL);
    document.cookie = "searchengine=" + searchEngine + "|" + searchEngineURL + ";path=/"
    updateSearchBar();
}

function updateShortcuts(){
    const shortcutmenu = document.getElementById("shortcutmenu");
    if(screen.width < 775){
        shortcutclass = document.getElementById("shortcutmenu")
        shortcutclass.style.width = screen.width * .7 + "px"
    }
    shortcutmenu.innerHTML = "";
    
    const template = '<div id="shortcut"><div index={index} id="shortcutleftarrow" class="disable-select">&#8592;</div><div index={index} id="shortcutrightarrow" class="disable-select">&#8594;</div><div class="disable-select" index="{index}" id="removeshortcut">X</div><a id="shortcutUrl" href="{url}" style="text-decoration: none; color: white;"><img id="shortcutimage" src="http://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={url}&size=64" alt="Icon not found."><div id="shortcutTitle">{text}</div></a></div>';

    var shortcuts = getCookie("shortcuts")

    if(shortcuts == undefined){
        document.cookie = "shortcuts=;path=/"
    } else {
        shortcuts = shortcuts.split("<<>>")
        if(shortcuts[0] == "") shortcuts = shortcuts.splice(1)        

        for(i = 0; i < shortcuts.length; i++){
            if(shortcuts[i] == ""){
                shortcuts.splice(i, 1);
                document.cookie = "shortcuts=" + shortcuts.join("<<>>") + ";path=/";

                shortcuts = getCookie('shortcuts').split("<<>>");
                if(shortcuts[0] == "") shortcuts = shortcuts.splice(1)  

                i = -1;
                continue;
            }
            
            if(shortcuts[0] == "") shortcuts = shortcuts.splice(1)      
            usingTemplate = template

            if(i == 0) usingTemplate = usingTemplate.replaceAll('id="shortcutleftarrow"', 'id="shortcutleftarrow" style="display: none;"')
            if(i == shortcuts.length-1) usingTemplate = usingTemplate.replaceAll('id="shortcutrightarrow"', 'id="shortcutrightarrow" style="display: none;"')
            shortcutssplit = shortcuts[i].split(">><<")
            shortcutmenu.innerHTML += usingTemplate.replaceAll("{text}", shortcutssplit[0]).replaceAll("{url}", shortcutssplit[1]).replaceAll("{index}", i);
        }
        removeshortcuts = document.querySelectorAll(`[id="removeshortcut"]`);

        jQuery(function($){
            $('[id="removeshortcut"]').on('click',function() {
                index = parseInt(this.getAttribute("index"));
                currentShortcuts = getCookie("shortcuts").split("<<>>");

                if(currentShortcuts[0] == ""){
                    currentShortcuts.splice(0, 1);

                    document.cookie = "shortcuts=" + currentShortcuts.join("<<>>") + ";path=/"
                    
                    index = parseInt(this.getAttribute("index"));
                    currentShortcuts = getCookie("shortcuts").split("<<>>");
                }

                currentShortcuts.splice(index, 1);

                document.cookie = "shortcuts=" + currentShortcuts.join("<<>>") + ";path=/"

                updateShortcuts();
            });

            $('[id="shortcutleftarrow"]').on('click',function() {
                index = parseInt(this.getAttribute("index"));
                currentShortcuts = getCookie("shortcuts").split("<<>>");

                if(index != 0){
                    movingTo = currentShortcuts[index-1];
                    currentShortcut = currentShortcuts[index];

                    currentShortcuts[index-1] = currentShortcut;
                    currentShortcuts[index] = movingTo;

                    document.cookie = "shortcuts=" + currentShortcuts.join("<<>>") + ";path=/";

                    updateShortcuts();
                } else console.log("Unable to move shortcut; it can't move any farther!");
            });

            $('[id="shortcutrightarrow"]').on('click',function() {
                index = parseInt(this.getAttribute("index"));
                currentShortcuts = getCookie("shortcuts").split("<<>>");

                if(index != currentShortcuts.length-1){
                    movingTo = currentShortcuts[index+1];
                    currentShortcut = currentShortcuts[index];

                    currentShortcuts[index+1] = currentShortcut;
                    currentShortcuts[index] = movingTo;

                    document.cookie = "shortcuts=" + currentShortcuts.join("<<>>") + ";path=/";

                    updateShortcuts();
                } else console.log("Unable to move shortcut; it can't move any farther!");
            });
        });
    }
        shortcutmenu.innerHTML += '<div id="addshortcut" class="disable-select"><img class="addshortcutimage" src="images/plus.png"> </div>';
        document.getElementById("addshortcut").addEventListener('click', showAddShortcut);
    }


function ShowSearchBar(){
    searchbar = document.getElementById('searchbar');
    document.getElementById('defaultCanvas0').style.position = null;
    searchbar.style.display = "block";
}

function hideShortcut(){
    document.getElementById("addShortcutMenu").style.display = "none";
    document.getElementById("dimScreen").style.display = "none";
    pause = false;
}

function showAddShortcut(){
    document.getElementById("addShortcutMenu").style.display = "block";
    document.getElementById("dimScreen").style.display = "block";
    pause = true;
}

function addShortcut(){
    document.getElementById("addShortcutMenu").style.display = "none";
    document.getElementById("dimScreen").style.display = "none";

    var urlInput = document.getElementById("addShortcutURL")
    url = urlInput.value
    urlInput.value = "http://";

    var shortcutNameInput = document.getElementById("addShortcutName")
    shortcutname = shortcutNameInput.value
    addShortcutName.value = "";
    
    // var url = window.prompt("What is the URL?", "http://example.com")
    // var shortcutname = window.prompt("What would you like the shortcut to be called?", "").replace("<", "").replace(">", "").replace(";", ":")

    currentshortcuts = getCookie("shortcuts")
    if(currentshortcuts == undefined) currentshortcuts = ""
    else currentshortcuts += "<<>>"

    document.cookie = "shortcuts=" + currentshortcuts + shortcutname + ">><<" + url + ";path=/"

    pause = false;
    updateShortcuts();
}

function settingsMenu(){
    menuClass = document.getElementById("settingsMenu")
    if(menuClass.style.display == "block"){
        menuClass.style.display = "none";
        document.getElementById("dimScreen").style.display = "none";
        pause = false;
    } else {
        document.getElementById("addShortcutMenu").style.display = "none";
        menuClass.style.display = "block";
        document.getElementById("dimScreen").style.display = "block";
        pause = true;
    }
}

function changeSnakeColor(){
    SnakeColorInput = document.getElementById("SnakeColorInput")
    hexcolor = SnakeColorInput.value
    rgb = parseInt(hexcolor.substr(1,2), 16) + "," + parseInt(hexcolor.substr(3,2), 16) + "," + parseInt(hexcolor.substr(5,2), 16)
    snakeColor = rgb.split(",")

    document.cookie = "snakecolor=" + rgb + ";path=/"
    pauseUpdateColor();
}

function toggleWatermark(){
    button = document.getElementById('showWatermark');
    waterMark = document.getElementById('waterMark')
    if(button.checked){
        waterMark.style.display = "block";
    } else waterMark.style.display = "none";
}

function toggleHUD(){
    button = document.getElementById('showHUD');
    if(button.checked){
        document.getElementById('defaultCanvas0').style.zIndex = -10;
        document.getElementById('defaultCanvas0').style.position = null;
        HUD = false;
        settingsMenu();
    } else {
        document.getElementById('defaultCanvas0').style.zIndex = 10;
        document.getElementById('defaultCanvas0').style.position = "absolute";
    }
}


window.onload = function(){
    var HUD;
    setTimeout(() => { // Make search bar visible
        ShowSearchBar();
    }, 0);

    document.getElementById("configicon").addEventListener('click', settingsMenu);
    document.getElementById("submitChangeSnakeColor").addEventListener('click', changeSnakeColor);
    document.getElementById("searchEngineSelect").addEventListener("change", changeSearchEngine);

    document.getElementById("cancelShortcut").addEventListener("click", hideShortcut); 
    // document.getElementById("createShortcut").addEventListener("click", addShortcut); // Commented because currently shortcuts don't work properly
    
    // document.getElementById('showWatermark').addEventListener('change', toggleWatermark);
    // document.getElementById('showHUD').addEventListener('change', toggleHUD);


    // if(screen.width < 800){
    //     document.getElementsByTagName('html')[0].style.overflow = "scroll";
    // }

    updateSearchBar();
    updateShortcuts();
}

testing = false;
setInterval(() => {
    ShowSearchBar();
    // updateShortcuts();
}, 1000);