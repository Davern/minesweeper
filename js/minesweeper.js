
var time = 0;
var columns = 9;
var rows = 9;
var num_of_mines = 10;
var firstClick = 0;
var numbers = ["tile_1", "tile_2", "tile_3", "tile_4", "tile_5", "tile_6", "tile_7", "tile_8"];
var timeVar;
var tilesClicked = 0;
var alive;
var tileGoal;
var finishedTime;

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    document.getElementById("flagCount").innerHTML = num_of_mines;
    tileGoal = (rows*columns)-num_of_mines;
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

function createTile(col,row) {
    var tile = document.createElement("div");
    tile.id = col.toString().concat(" ",row.toString());

    tile.classList.add("tile");
    tile.classList.add("hidden");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks
    tile.addEventListener("click", handleTileClick );

    return tile;
}

function startGame() {
    buildGrid();
    buildBombs();
    document.getElementById("lost").style.display="none";
    document.getElementById("won").style.display="none";
    if (firstClick == 1) {
        stopTimer();
    }
    var smiley = document.getElementById("smiley");
    if (smiley.classList.contains("face_lose")) {
        smileyLoseGone();
    } else if (smiley.classList.contains("face_win")) {
        smileyWinGone();
    }
    tilesClicked = 0;
    alive = true;
}

function smileyDown() { 
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function smileyLimbo() {
    if (firstClick == 1) {
        var smiley = document.getElementById("smiley");
        smiley.classList.add("face_limbo");
    }
}

function smileyLimboGone() {
    if (firstClick == 1) {
        var smiley = document.getElementById("smiley");
        smiley.classList.remove("face_limbo");
    }
}

function smileyLose() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_limbo");
    smiley.classList.add("face_lose");
}

function smileyLoseGone() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_lose");
}

function smileyWin() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_limbo");
    smiley.classList.add("face_win");
}

function smileyWinGone() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_win");
}

function handleTileClick(event) {
    if (alive) {
        var tile = event.target; 
        // Left Click
        if (event.which === 1) {
            if (!tile.classList.contains("flag")) {
                if (tile.classList.contains("mine") && firstClick == 1) {
                    tile.classList.remove("hidden");
                    tile.classList.add("mine_hit");
                    gameOver();
                } else if (tile.classList.contains("hidden")){
                    var nbombs = adjacentBombs(tile);
                    if (nbombs > 0 && firstClick == 1) {
                        var str = numbers[nbombs-1];
                        tile.classList.remove("hidden");
                        tile.classList.add("clicked");
                        tile.classList.add(str);
                        tilesClicked++;
                    } else if (firstClick == 0 && nbombs==0) {
                        startTimer();
                        firstClick = 1;
                        tile.classList.remove("hidden");
                        tile.classList.add("clicked");
                        tile.classList.add("clear");
                        tilesClicked++;
                        clickAdjacent(tile);
                    } else if (firstClick == 1){
                        tile.classList.remove("hidden");
                        tile.classList.add("clicked");
                        tile.classList.add("clear");
                        tilesClicked++;
                        clickAdjacent(tile);
                    }
                }
                if (tilesClicked == tileGoal) {
                    gameWon();
                }
            }
        }
        // Middle Click
        else if (event.which === 2) {
            //TODO try to reveal adjacent tiles
            if (!tile.classList.contains("flag") && tile.classList.contains("clicked")) {
                var flagCount = adjacentFlags(tile);
                var bombCount = adjacentBombs(tile);
                if (flagCount === bombCount) {
                    clickAdjacent(tile);
                }
            }
        }
        // Right Click
        else if (event.which === 3) {
            var tile = event.target; 
            if (tile.classList.contains("hidden") && !tile.classList.contains("clicked")) {
                decFlagCount();
                tile.classList.remove("hidden");
                tile.classList.add("flag");
            } else if (!tile.classList.contains("clicked")){
                incFlagCount();
                tile.classList.add("hidden");
                tile.classList.remove("flag");
            }
        }
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
    for (var i = 0; i < num_of_mines; i++) {
        createBomb();
    }
    return;
}

function createBomb() {
    var ncol, nrow,

    nrow = Math.floor(Math.random() * rows);
    ncol = Math.floor(Math.random() * columns);

    var tile = document.getElementById(ncol.toString().concat(" ",nrow.toString()));

    if (!tile.classList.contains("mine")) {
        tile.classList.add("mine");
        return;
    } else {
        createBomb();
    }
}

function startTimer() {
    timeValue = 0;
    timeVar = window.setInterval(onTimerTick, 1000);
}
function stopTimer() {
    timeValue = null;
    firstClick = 0;
    window.clearInterval(timeVar);
    updateTimer();
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}

function decFlagCount() {
    document.getElementById("flagCount").innerHTML--;
}

function incFlagCount() {
    document.getElementById("flagCount").innerHTML++;
}

function adjacentBombs(tile) {
    var num_of_adj_bombs = 0;
    var row, col;
    var arr;
    var id = tile.id;
    arr = id.split(" ");
    col = parseInt(arr[0]);
    row = parseInt(arr[1]); 

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            var adjRow = row + i;
            var adjCol = col + j;
            var s = adjCol.toString().concat(" ", adjRow.toString());
            if (adjRow > -1 && adjCol > -1 && adjCol < columns && adjRow < rows) {
                var adj = document.getElementById(s);
                if (adj != null && adj.classList.contains("mine")) {
                    num_of_adj_bombs++;
                }
            }
        }
    }
    return num_of_adj_bombs;
}

function clickAdjacent(tile) {
    var row, col;
    var arr;
    var id = tile.id;
    arr = id.split(" ");
    col = parseInt(arr[0]);
    row = parseInt(arr[1]); 
    var j, i;
    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            var adjRow = row + i;
            var adjCol = col + j;
            var s = adjCol.toString().concat(" ", adjRow.toString());
            if (adjRow > -1 && adjCol > -1  && adjCol < columns && adjRow < rows) {
                var adj = document.getElementById(s);
                if (!adj.classList.contains("clicked")) {
                    adj.click();
                }
            }
        }
    }
}

function adjacentFlags(tile) {
    var num_of_adj_flags = 0;
    var row, col;
    var arr;
    var id = tile.id;
    arr = id.split(" ");
    col = parseInt(arr[0]);
    row = parseInt(arr[1]); 
    var j, i;
    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            var adjRow = row + i;
            var adjCol = col + j;
            var s = adjCol.toString().concat(" ", adjRow.toString());
            if (adjRow > -1 && adjCol > -1  && adjCol < columns && adjRow < rows) {
                var adj = document.getElementById(s);
                if (adj.classList.contains("flag")) {
                    num_of_adj_flags++;
                }
            }
        }
    }
    return num_of_adj_flags;
}

function gameOver() {
    smileyLose();
    alive = false;
    stopTimer();
    document.getElementById("lost").style.display="block";
}

function gameWon() {
    smileyWin();
    alive = false;
    document.getElementById("finishedTime").innerHTML = timeValue;
    document.getElementById("won").style.display="block";
}

window.addEventListener('load', function() {
    document.getElementById("lost").style.display="none";
    document.getElementById("won").style.display="none";
});