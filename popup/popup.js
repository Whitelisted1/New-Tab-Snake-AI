function convertFromHex(hexCode) {
    return [parseInt(hexCode.substr(1,2), 16), parseInt(hexCode.substr(3,2), 16), parseInt(hexCode.substr(5,2), 16)]
}

(async() => {
    const browserType = "firefox";
    

    if (browserType == "chrome") {
        async function storeData(key, value){
            await chrome.storage.local.set({[key]: value});
            return true;
        }

        async function getData(key){
            return Object.values(await chrome.storage.local.get(key))[0];
        }
        window.storeData = storeData;
        window.getData = getData;
    }
    else if (browserType == "firefox") {
        async function storeData(key, value){
            await browser.storage.local.set({[key]: value})
        }

        async function getData(key){
            return Object.values(await browser.storage.local.get(key))[0];
        }
        window.storeData = storeData;
        window.getData = getData;
    }
})();

window.onload = function() {
    snakeColorInput = document.getElementById('SnakeColorInput');
    searchEngineInput = document.getElementById('searchEngineSelect');
    
    
    document.getElementById('submitChangeSnakeColor').addEventListener('click', function(){
        (async() => { 
            await storeData('snakecolor', convertFromHex(snakeColorInput.value));
        })();
    });

    searchEngineInput.addEventListener('change', function() {
        (async() => { 
            searchEngine = searchEngineInput.value;
            searchEngineURL = document.getElementById(searchEngine.toLowerCase() + "searchengine").getAttribute("url")
            await window.storeData("searchengine",  [searchEngine,searchEngineURL]);
        })();
    })

}