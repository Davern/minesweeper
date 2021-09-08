
var time = 0;
var columns = 9;
var rows = 9;
var num_of_mines = 10;
var mines = [];

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    document.getElementById("flagCount").innerHTML = num_of_mines;

    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
        }
    }
    
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks

    return tile;
}

function startGame() {
    buildGrid();
    mines = buildBombs();
    startTimer();
}

function smileyDown() { 
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function handleTileClick(event) {
    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
    }
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
    }
    // Right Click
    else if (event.which === 3) {
        this.tile.classList.remove("hidden");
        this.tile.classList.add("flag");
        updateFlagCount();
    }
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;

    if (difficulty === 0) {
        columns = 9;
        rows = 9;
        num_of_mines = 10;
    } else if (difficulty === 1) {
        columns = 16;
        rows = 16;
        num_of_mines = 40;
    } else if (difficulty === 2) {
        columns = 30;
        rows = 16;
        num_of_mines = 99;
    }
}

function buildBombs() {
    var rows = [];

    for (var i = 0; i < num_of_mines; i++) {
        createBomb(rows);
    }

    return rows;
}

function createBomb(bombs) {
    var col, row, ncol, nrow;

    nrow = Math.floor(Math.random() * rows);
    ncol = Math.floor(Math.random() * columns);

    row = bombs[nrow];

    if (!row) {
        row = [];
        bombs[nrow] = row;
    }
    col = row[ncol];

    if (!col) {
        row[ncol] = true;
        return;
    } else {
        createBomb(bombs);
    }
}

function startTimer() {
    timeValue = 0;
    window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}

function updateFlagCount() {
    document.getElementById("flagCount").innerHTML--;
}