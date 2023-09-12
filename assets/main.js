let shortcuts, latestChangedSettingsTabID;
const browser = chrome;
const thisTabID = getRandomInt(0, Number.MAX_SAFE_INTEGER);

const searchEngineNameToURL = {
    "google": "google.com/search",
    "bing": "bing.com/search",
    "yahoo!": "search.yahoo.com/search",
    "duckduckgo": "duckduckgo.com"
};

let searchBoxInput = document.getElementById("searchBoxInput");

let snakeColorInput = document.getElementById("snakeColorInput");
let searchEngineSelect = document.getElementById("searchEngineSelect");

let shortcutEditMenu = document.getElementById("shortcutEdit");
let shortcutCreateMenu = document.getElementById("shortcutCreate");



chrome.storage.onChanged.addListener((changes, namespace) => {
    if ("lastChangedBy" in changes) {
        latestChangedSettingsTabID = changes["lastChangedBy"]["newValue"];
    }

    // When "lastChangedBy" was changed by a different tab
    if (latestChangedSettingsTabID != thisTabID) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {

            if (key == "lastChangedBy") continue;
            if (newValue == undefined) continue;
            
            // shortcuts were modified on a different page
            if (key == "shortcuts") {
                shortcuts = newValue;
                drawShortcuts();
            }

            else if (key == "snakeColor") {
                window.snakeColor = newValue['color'];
                snakeColorInput.value = rgbToHex(...newValue);
            }

            else if (key == "searchEngine") {
                searchBoxInput.placeholder = "Search " + newValue['engineName'] + " or type a URL";
                searchBoxInput.parentElement.setAttribute("action", "http://" + searchEngineNameToURL[newValue['engineName'].toLowerCase()]);
            }

            console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                `Old value was "${oldValue}", new value is "${newValue}".`
            );
        }
    }
});

defaultSettings = {
    shortcuts: [
        {
            "title": "Discord",
            "url": "https://discord.com",
            "icon": "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=256&url=https://discord.com"
        },
        {
            "title": "Google",
            "url": "https://google.com",
            "icon": "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=256&url=https://google.com"
        },
        {
            "title": "Stack Overflow",
            "url": "https://stackoverflow.com",
            "icon": "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=256&url=https://stackoverflow.com"
        }
    ],
    snakeColor: { "color": [0, 150, 0] },
    searchEngine: { "engineName": "Google" }
};

console.log(3);
async function loadSettings(retry=true) {
    console.log(4);
    try {
        // await chrome.storage.local.clear();
        defaultSettingsKeys = Object.values(Object.keys(defaultSettings));
        currentSettings = await getMultipleDataValues(defaultSettingsKeys);
        dataToChange = { };
        
        console.log(currentSettings);
        for (var i = 0; i < defaultSettingsKeys.length; i++) {
            thisSetting = defaultSettingsKeys[i];
            if (currentSettings[thisSetting] == undefined) {
                dataToChange[thisSetting] = defaultSettings[thisSetting];
            }
        }
        
        if (Object.values(Object.keys(dataToChange)).length != 0) {
            await storeMultipleDataValues(dataToChange);
        }

        shortcuts = (currentSettings['shortcuts'] != undefined) ? currentSettings['shortcuts'] : defaultSettings['shortcuts'];

        window.snakeColor = (currentSettings['snakeColor'] != undefined) ? currentSettings['snakeColor']['color'] : defaultSettings['snakeColor']['color'];
        snakeColorInput.value = rgbToHex(...window.snakeColor);

        searchEngine = (currentSettings['searchEngine'] != undefined) ? currentSettings['searchEngine']['engineName'] : defaultSettings['searchEngine']['engineName'];
        searchEngineSelect.value = searchEngine;
        searchBoxInput.placeholder = "Search " + searchEngine + " or type a URL";
        searchBoxInput.parentElement.setAttribute("action", "http://" + searchEngineNameToURL[searchEngine.toLowerCase()]);
        

        console.log(window.snakeColor);
        console.log(shortcuts);
        drawShortcuts();
        hudReady();
    
    } catch (e) {
        console.error(e);
        if (retry) {
            await chrome.storage.local.clear().then();
            console.log(2);
            await loadSettings(retry=false);
        }
    }
} 

function hudReady() {
    document.getElementsByClassName("hud")[0].style.opacity = "1";
}

function drawShortcuts() {
    if (shortcuts == undefined) return;

    shortcutMenu = document.getElementById("shortcuts");
    shortcutMenu.innerHTML = "";

    for (var i = 0; i < shortcuts.length; i++) {
        let shortcut, shortcutElement, iconElement, titleElement, arrowElementL, arrowElementR;
        shortcut = shortcuts[i];
    
        shortcutElement = document.createElement("a");
        shortcutElement.href = shortcut.url;
        shortcutElement.classList.add("shortcut");
        shortcutElement.setAttribute("draggable", false);
        shortcutElement.setAttribute("shortcutIndex", i);
        
        titleElement = document.createElement("span");
        titleElement.innerText = shortcut.title;
        titleElement.classList.add("title");
        shortcutElement.appendChild(titleElement);

        shortcutOptionButton = document.createElement("img");
        shortcutOptionButton.src = "images/Settings-icon-symbol-vector.png";
        shortcutOptionButton.classList.add("shortcutOptionButton");

        shortcutOptionButton.addEventListener("click", (e) => {
            e.preventDefault();
            shortcutIndex = parseInt(e.target.parentElement.getAttribute("shortcutindex"))

            shortcutEditMenu.classList.add("active");
            shortcutEditMenu.setAttribute("activeindex", shortcutIndex);
            setSnakePaused(true);
            

            shortcutInfo = shortcuts[shortcutIndex];

            document.getElementById("editShortcutName").value = shortcutInfo['title'];
            document.getElementById("editShortcutURL").value = shortcutInfo['url'];
        });

        shortcutElement.appendChild(shortcutOptionButton);


        iconElement = document.createElement("img");
        iconElement.src = shortcut.icon;
        iconElement.classList.add("shortcutIcon")
        iconElement.setAttribute("draggable", false);
        shortcutElement.appendChild(iconElement);
    
        if (i != 0) {
            arrowElementL = document.createElement("span");
            arrowElementL.innerHTML = "&ShortLeftArrow;"
            arrowElementL.classList.add("leftArrow");

            arrowElementL.addEventListener("click", async (e) => {
                e.preventDefault();
                shortcutIndex = e.target.parentElement.getAttribute("shortcutIndex");
                arrayMove(shortcuts, shortcutIndex, shortcutIndex-1);
                await storeData("shortcuts", shortcuts);
                drawShortcuts();
            });

            shortcutElement.appendChild(arrowElementL);
        }

        if (i != shortcuts.length-1) {
            arrowElementR = document.createElement("span");
            arrowElementR.innerHTML = "&ShortRightArrow;"
            arrowElementR.classList.add("rightArrow");

            arrowElementR.addEventListener("click", async (e) => {
                e.preventDefault();
                shortcutIndex = parseInt(e.target.parentElement.getAttribute("shortcutIndex"));
                arrayMove(shortcuts, shortcutIndex, shortcutIndex+1);
                await storeData("shortcuts", shortcuts);
                drawShortcuts();
            });
            
            
            shortcutElement.appendChild(arrowElementR);
        }

        shortcutMenu.appendChild(shortcutElement);
    }

    addShortcutElement = document.createElement("span");
    addShortcutElement.classList.add("shortcut");

    iconElement = document.createElement("img");
    iconElement.classList.add("addShortcutPlus");
    iconElement.src = "images/Plus_symbol.svg";

    addShortcutElement.addEventListener("click", async () => {
        shortcutCreateMenu.classList.add("active");
        setSnakePaused(true);
    });

    addShortcutElement.appendChild(iconElement);
    shortcutMenu.appendChild(addShortcutElement)
}

settingsButton = document.getElementById("settingsIcon");
settingsMenu = document.getElementById("options");
settingsButton.addEventListener("click", () => {
    if (settingsMenu.classList.contains("active")) {
        settingsMenu.classList.remove("active");
        setSnakePaused(false);
    } else {
        settingsMenu.classList.add("active");
        setSnakePaused(true);
    }
});

// prob just reset settings and not shortcuts
document.getElementById("resetSettings").addEventListener("click", async () => {
    if (!confirm("Are you sure you would like to reset settings to default?")) return;

    await storeMultipleDataValues(defaultSettings);
    // browser.storage.local.clear();
    await loadSettings();
});

document.getElementById("createShortcut").addEventListener("click", async () => {
    let shortcutURLInput, shortcutNameInput, shortcutURL, shortcutName;

    setSnakePaused(false);

    shortcutURLInput = document.getElementById("addShortcutURL");
    shortcutURL = shortcutURLInput.value;
    shortcutURLInput.value = "https://";

    shortcutNameInput = document.getElementById("addShortcutName");
    shortcutName = shortcutNameInput.value;
    shortcutNameInput.value = "";


    document.getElementById("shortcutCreate").classList.remove("active");

    shortcuts.push({
        "title": shortcutName,
        "url": shortcutURL,
        "icon": "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=256&url=" + shortcutURL
    });

    await storeData("shortcuts", shortcuts);
    drawShortcuts();
});

document.getElementById("cancelShortcut").addEventListener("click", () => {
    setSnakePaused(false);
    document.getElementById("addShortcutURL").value = "https://";
    document.getElementById("addShortcutName").value = "";
    document.getElementById("shortcutCreate").classList.remove("active");
});

document.getElementById("changeSettings").addEventListener("click", async (e) => {
    let searchEngine, snakeColor

    snakeColor = snakeColorInput.value;
    snakeColor = [parseInt(snakeColor.substr(1,2), 16), parseInt(snakeColor.substr(3,2), 16), parseInt(snakeColor.substr(5,2), 16)];

    searchEngine = searchEngineSelect.value;
    searchEngineURL = searchEngineNameToURL[searchEngine.toLowerCase()];

    searchBoxInput.placeholder = "Search " + searchEngine + " or type a URL";
    searchBoxInput.parentElement.setAttribute("action", "http://" + searchEngineURL);

    window.snakeColor = [...snakeColor];
    console.log(snakeColor, searchEngine);

    await storeMultipleDataValues({
        "snakeColor": { "color": snakeColor},
        "searchEngine": { "engineName": searchEngine }
    });
});

document.getElementById("saveShortcutEdit").addEventListener("click", async () => {
    setSnakePaused(false);
    shortcutIndex = parseInt(shortcutEditMenu.getAttribute("activeindex"));

    newURL = document.getElementById("editShortcutURL").value;
    newTitle = document.getElementById("editShortcutName").value;
    newIconURL = "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=256&url=" + newURL;

    shortcuts[shortcutIndex] = {
        'title': newTitle,
        'url': newURL,
        'icon': newIconURL
    }

    await storeData("shortcuts", shortcuts);
    drawShortcuts();
    shortcutEditMenu.classList.remove("active");
});

document.getElementById("closeShortcutEdit").addEventListener("click", () => {
    setSnakePaused(false);
    shortcutEditMenu.classList.remove("active");
})

document.getElementById("deleteShortcut").addEventListener("click", async () => {
    if (!confirm("Are you sure you would like to delete this shortcut?")) return;

    setSnakePaused(false);
    shortcutIndex = parseInt(shortcutEditMenu.getAttribute("activeindex"));
    shortcuts.splice(shortcutIndex, 1);

    await storeData("shortcuts", shortcuts);
    drawShortcuts();
    shortcutEditMenu.classList.remove("active");
});

loadSettings();