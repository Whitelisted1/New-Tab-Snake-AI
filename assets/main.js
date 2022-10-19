const browserType = "chrome";

if (browserType == "chrome") {
    browser = chrome;
}

// Initializing consistant variables
async function storeData(key, value){
    await browser.storage.local.set({[key]: value})
}

async function getData(key){
    return Object.values(await browser.storage.local.get(key))[0];
}
window.storeData = storeData;
window.getData = getData;

(async() => {

    // if (browserType == "chrome") {
    //     async function storeData(key, value){
    //         await chrome.storage.local.set({[key]: value});
    //         return true;
    //     }

    //     async function getData(key){
    //         return Object.values(await chrome.storage.local.get(key))[0];
    //     }
    //     window.storeData = storeData;
    //     window.getData = getData;
    // }
    // else if (browserType == "firefox") {
    // }

    // await window.storeData('hi', 'hello there');
    // console.log(await window.getData('hi'));
        
        
    async function updateSearchBar(){
        searchEngineData = await window.getData("searchengine")
        if(searchEngineData == undefined) searchEngineData = ["Google", "google.com/search"];
        searchEngine = searchEngineData[0];
        searchEngineURL = searchEngineData[1];
        
        searchBar = document.getElementById("searchbar");
        searchBar.placeholder = "Search on " + searchEngine;
        
        document.getElementById("searchEngineSelect").value = searchEngine;
        document.getElementById("search").action = "http://" + searchEngineURL;
    }

    window.getSnakeColor = async function(){
        var snakeColor = await window.getData("snakecolor");

        if(snakeColor == undefined){
            (async() => {
                await window.storeData("snakecolor", [0,150,0]);
            })();
            snakeColor = [0, 150, 0];
        }

        return snakeColor;
    }

    // await getSnakeColor()

    async function changeSearchEngine(){
        object = document.getElementById("searchEngineSelect");
        searchEngine = object.value;
        searchEngineURL = document.getElementById(searchEngine.toLowerCase() + "searchengine").getAttribute("url")

        console.log("Changed search engine to '"+ searchEngine + "', using the URL '" + searchEngineURL + "'");

        await window.storeData("searchengine",  [searchEngine,searchEngineURL]);
        updateSearchBar();
    }

    async function updateShortcuts(){
        const shortcutmenu = document.getElementById("shortcutmenu");
        if(screen.width < 775){
            shortcutclass = document.getElementById("shortcutmenu")
            shortcutclass.style.width = screen.width * .7 + "px"
        }
        shortcutmenu.innerHTML = "";
        
        const template = '<div id="shortcut"><div index={index} id="shortcutleftarrow" class="disable-select">&#8592;</div><div index={index} id="shortcutrightarrow" class="disable-select">&#8594;</div><div class="disable-select" index="{index}" id="removeshortcut">X</div><a id="shortcutUrl" href="{url}" style="text-decoration: none; color: white;"><img id="shortcutimage" src="http://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={url}&size=64" alt="Icon not found."><div class="shortcutTitle">{text}</div></a></div>';
        
        var shortcuts = await window.getData("shortcuts");
        
        if(shortcuts == undefined){
            await window.storeData("shortcuts", []);
            
        } else {     
            
            for(i = 0; i < shortcuts.length; i++){                    
                usingTemplate = template;
                
                if(i == 0) usingTemplate = usingTemplate.replaceAll('id="shortcutleftarrow"', 'id="shortcutleftarrow" style="display: none;"');
                if(i == shortcuts.length-1) usingTemplate = usingTemplate.replaceAll('id="shortcutrightarrow"', 'id="shortcutrightarrow" style="display: none;"');

                shortcutssplit = shortcuts[i];
                shortcutmenu.innerHTML += usingTemplate.replaceAll("{text}", shortcutssplit[0]).replaceAll("{url}", shortcutssplit[1]).replaceAll("{index}", i);
            }
            removeshortcuts = document.querySelectorAll(`[id="removeshortcut"]`);
            
            jQuery(async function($){
                $('[id="removeshortcut"]').on('click',async function() {
                    index = parseInt(this.getAttribute("index"));
                    currentShortcuts = await window.getData("shortcuts");
                    
                    currentShortcuts.splice(index, 1);
                    
                    await window.storeData("shortcuts", currentShortcuts);
                    
                    updateShortcuts();
                });
                
                $('[id="shortcutleftarrow"]').on('click',async function() {
                    index = parseInt(this.getAttribute("index"));
                    currentShortcuts = await window.getData("shortcuts");
                    
                    if(index != 0){
                        movingTo = currentShortcuts[index-1];
                        currentShortcut = currentShortcuts[index];
                        
                        currentShortcuts[index-1] = currentShortcut;
                        currentShortcuts[index] = movingTo;
                        
                        await window.storeData("shortcuts", currentShortcuts);
                        
                        updateShortcuts();
                    } else console.log("Unable to move shortcut; it can't move any farther!");
                });
                
                $('[id="shortcutrightarrow"]').on('click',async function() {
                    index = parseInt(this.getAttribute("index"));
                    currentShortcuts = await window.getData("shortcuts");
                    
                    if(index != currentShortcuts.length-1){
                        movingTo = currentShortcuts[index+1];
                        currentShortcut = currentShortcuts[index];
                        
                        currentShortcuts[index+1] = currentShortcut;
                        currentShortcuts[index] = movingTo;
                        
                        await window.storeData("shortcuts", currentShortcuts);
                        
                        updateShortcuts();
                    } else console.log("Unable to move shortcut; it can't move any farther!");
                });
            });
        }
        shortcutmenu.innerHTML += '<div id="addshortcut" class="disable-select"><img class="addshortcutimage" src="images/plus.png"> </div>';
        document.getElementById("addshortcut").addEventListener('click', showAddShortcut);
    }


    async function ShowSearchBar(){
        searchbar = document.getElementById('searchbar');
        document.getElementById('defaultCanvas0').style.position = null;
        searchbar.style.display = "block";
    }
    window.ShowSearchBar = ShowSearchBar;

    async function hideShortcut(){
        document.getElementById("addShortcutMenu").style.display = "none";
        document.getElementById("dimScreen").style.display = "none";
        pause = false;
    }

    async function showAddShortcut(){
        document.getElementById("addShortcutMenu").style.display = "block";
        document.getElementById("dimScreen").style.display = "block";
        pause = true;
    }

    async function addShortcut(){
        document.getElementById("addShortcutMenu").style.display = "none";
        document.getElementById("dimScreen").style.display = "none";
        
        var urlInput = document.getElementById("addShortcutURL")
        url = urlInput.value
        urlInput.value = "http://";
        
        var shortcutNameInput = document.getElementById("addShortcutName")
        shortcutname = shortcutNameInput.value
        addShortcutName.value = "";
        
        currentshortcuts = await window.getData("shortcuts")
        if(currentshortcuts == undefined) currentshortcuts = []

        currentshortcuts.push([shortcutname, url])
        
        await window.storeData("shortcuts", currentshortcuts);
        
        pause = false;
        updateShortcuts();
    }

    async function settingsMenu(){
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

    async function changeSnakeColor(){
        SnakeColorInput = document.getElementById("SnakeColorInput")
        hexcolor = SnakeColorInput.value
        snakeColor = [parseInt(hexcolor.substr(1,2), 16), parseInt(hexcolor.substr(3,2), 16), parseInt(hexcolor.substr(5,2), 16)]
        
        await window.storeData("snakecolor", snakeColor);
        pauseUpdateColor();
    }

    async function toggleWatermark(){
        button = document.getElementById('showWatermark');
        waterMark = document.getElementById('waterMark')
        if(button.checked){
            waterMark.style.display = "block";
        } else waterMark.style.display = "none";
    }

    async function toggleHUD(){
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


    window.onload = async function(){
        onWinResize();

        setTimeout(ShowSearchBar, 0); // Show the search bar
        
        document.getElementById("configicon").addEventListener('click', settingsMenu);
        document.getElementById("submitChangeSnakeColor").addEventListener('click', changeSnakeColor);
        document.getElementById("searchEngineSelect").addEventListener("change", changeSearchEngine);
        
        document.getElementById("cancelShortcut").addEventListener("click", hideShortcut); 
        document.getElementById("createShortcut").addEventListener("click", addShortcut);
        
        // document.getElementById('showWatermark').addEventListener('change', toggleWatermark);
        // document.getElementById('showHUD').addEventListener('change', toggleHUD);
            
        updateSearchBar();
        updateShortcuts();

    }

    const onWinResize = () => {
        shortcuts = document.getElementById('shortcutmenu');
        aspectRatioDecimal = document.body.clientWidth/document.body.clientHeight;
        
        thinMode = aspectRatioDecimal < .9;
    
        if(thinMode) {
            shortcutmenu.classList.add('thin');
        } else {
            shortcutmenu.classList.remove('thin');
        }
    }
        
    window.onresize = onWinResize;

})();