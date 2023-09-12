let shortcuts, latestChangedSettingsTabID;
const browser = chrome;
const thisTabID = getRandomInt(0, Number.MAX_SAFE_INTEGER);

chrome.storage.onChanged.addListener((changes, namespace) => {
    if ("lastChangedBy" in changes) {
        latestChangedSettingsTabID = changes["lastChangedBy"]["newValue"];
    }

    // When "lastChangedBy" was changed by a different tab
    if (latestChangedSettingsTabID != thisTabID) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {

            if (key == "lastChangedBy") continue;
            
            // shortcuts were modified on a different page
            if (key == "shortcuts") {
                shortcuts = newValue;
                drawShortcuts();
            }

            console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                `Old value was "${oldValue}", new value is "${newValue}".`
            );
        }
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

async function storeData(key, value){
    if (browser.extension != undefined) {
        await browser.storage.local.set({[key]: value, "lastChangedBy": thisTabID});
    } else {
        // store with cookies
    }
}

async function storeMultipleDataValues(dict){
    dict["lastChangedBy"] = thisTabID;
    if (browser.extension != undefined) {
        await browser.storage.local.set(dict);
    } else {
        // store with cookies
    }
}

async function getData(key){
    if (browser.extension != undefined) {
        return Object.values(await browser.storage.local.get(key))[0];
    } else {
        // get from cookies
    }
}

async function getMultipleDataValues(key){
    if (browser.extension != undefined) {
        return await browser.storage.local.get(key);
    } else {
        // get from cookies
        return {};
    }
}

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
    ]
};

async function loadSettings() {
    // await chrome.storage.local.clear();
    defaultSettingsKeys = Object.values(Object.keys(defaultSettings));
    currentSettings = await getMultipleDataValues(defaultSettingsKeys);
    dataToChange = { };
    
    for (var i = 0; i < defaultSettingsKeys.length; i++) {
        thisSetting = defaultSettingsKeys[i];
        console.log(currentSettings);
        if (currentSettings[thisSetting] == undefined) {
            dataToChange[thisSetting] = defaultSettings[thisSetting];
        }
    }
    
    if (Object.values(Object.keys(dataToChange)).length != 0) {
        await storeMultipleDataValues(dataToChange);
    }

    // const result = (condition) ? 'value if true' : 'value if false';
    shortcuts = (currentSettings['shortcuts'] != undefined) ? currentSettings['shortcuts'] : dataToChange['shortcuts'];

    console.log(shortcuts);
    drawShortcuts();
    hudReady();
} 

function setSnakePaused(snakePaused=false) {
    let canvas = document.getElementById("defaultCanvas0");

    pause = snakePaused; // pause var is used by SnakeGame
    if (snakePaused) {
        canvas.style.opacity = ".6";
        canvas.style.filter = "blur(6px)";
    }
    else {
        canvas.style.opacity = "1";
        canvas.style.filter = "none";
    }
}

// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
function arrayMove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
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

        iconElement = document.createElement("img");
        iconElement.src = shortcut.icon;
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
        shortcutCreateMenu = document.getElementById("shortcutCreate");

        shortcutCreateMenu.classList.add("active");
        setSnakePaused(true);
        
        // shortcutName = window.prompt("Shortcut Name", "");
        // shortcutURL = window.prompt("Shortcut URL", "https://");

        // shortcuts.push({
        //     "title": shortcutName,
        //     "url": shortcutURL,
        //     "icon": "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=256&url=" + shortcutURL
        // });

        // await storeData("shortcuts", shortcuts);
        // drawShortcuts();
    });

    addShortcutElement.appendChild(iconElement);
    shortcutMenu.appendChild(addShortcutElement)
}

loadSettings();

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
    browser.storage.local.clear();
    await loadSettings();
});

document.getElementById("createShortcut").addEventListener("click", async () => {
    let shortcutURLInput, shortcutNameInput, shortcutURL, shortcutName;

    setSnakePaused(false);

    shortcutURLInput = document.getElementById("addShortcutURL");
    shortcutURL = shortcutURLInput.value;
    shortcutURLInput.value = "http://";

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
    document.getElementById("addShortcutURL").value = "http://";
    document.getElementById("addShortcutName").value = "";
    document.getElementById("shortcutCreate").classList.remove("active");
});