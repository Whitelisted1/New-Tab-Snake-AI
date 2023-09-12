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

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}