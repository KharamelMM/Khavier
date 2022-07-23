let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let dx;
let score = 0;
let ticker;
let board_height;
let tile_height;
let lastTick;

let moveTilesDownTicker = 0;
let generateTileTicker = 0;
let speed;
let tileSpeed;
let row_offset = 0;


const MAX_ROWS = 8;
let rowid = 0;

function getTileHeight() {
    var tile = $("<div class='tile' id='temp'/>");
    $(".line").append(tile);
    let height = tile.height();
    tile.remove();
    return height;
}

function setBPM(bpm) {
    speed = 60000 / bpm; // ms between each tile creation
    tileSpeed = speed * dx / tile_height; // ms between each 1 percent tile move
}

function prepareBoard() {
    score = 0

    $("#score").removeClass("hidden").text(score);
    $(".popup-container").addClass("hidden");

    board_height = $(".board").removeClass("hidden").height();
    tile_height = board_height * 2 / MAX_ROWS;
    dx = board_height / 100; // 1 percent of the board each time
    row_offset = 0;
    rowid = 0;
    setBPM(100);

    lastTick = Date.now();
    ticker = setInterval(tick, 10)
}

function tick() {
    var now = Date.now();
    var deltaTime = now - lastTick; // in ms
    lastTick = now;
    moveTilesDownTicker += deltaTime;
    generateTileTicker += deltaTime;

    if (moveTilesDownTicker >= tileSpeed) {
        moveTilesDown(Math.floor(moveTilesDownTicker / tileSpeed));
        moveTilesDownTicker %= tileSpeed;
    }
    if (generateTileTicker >= speed) {
        generateTileTicker -= speed;
        generateTile();
    }
}


function generateTile() {
    let n = $(".line").length
    let counter = 0;
    let tabIndex = [];
    for (let i = 1; i <= n; i++) {
        if (Math.random() < (i - counter) / n) {
            tabIndex.push(i);
            counter++;
            if (Math.random() < 0.8) break;
        }
    }
    createTiles(tabIndex);
}


function createTiles(tabIndex) {

    for (let i = 0; i < tabIndex.length; i++) {
        let index = tabIndex[i];

        let note = 'c3'
        switch (index) {
            case 1:
                note = 'e3';
                break;
            case 2:
                note = 'g3';
                break;
            case 3:
                note = 'c4';
                break;
        }
        var tile = $("<div class='tile' data-note='" + note + "' data-rowid='" + rowid + "'/>")
            .css("height", tile_height + 'px');
        if (mobile) {
            tile.on("touchmove", tilePressed)
        } else {
            tile.on("click", tilePressed);
        }
        $(".line:nth-child(" + index + ")").append(tile);
    }
    rowid++;
    rowid %= MAX_ROWS;
}

function tilePressed(e) {
    new Audio('../sound/notes/' + $(e.target).data('note') + '.mp3').play()
    score++;
    $("#score").text(score);
    /*new Audio('../sound/notes/c3.mp3').play()
    new Audio('../sound/notes/e3.mp3').play()
    new Audio('../sound/notes/g3.mp3').play()
    new Audio('../sound/notes/c4.mp3').play()
    */

    /*if(startTick === undefined){
        startTick = Date.now();
    }
    $("#score").text("BPM : " + ((score-1)/((Date.now()-startTick)/60000)));*/
    $(this).remove();
    //clearInterval(ticker);

}


function moveTilesDown(amount) {
    let board_length = 2 * board_height;
    row_offset += (dx * amount);
    row_offset %= board_length;
    $(".tile").css('top', function (index, curValue) {
        let lastValue = parseFloat(curValue);
        let rowid = parseInt($(this).data('rowid'));
        curValue = (((row_offset - rowid * tile_height) + board_length) % board_length) - board_height;
        if (curValue < lastValue) {
            gameOver();
        } else {
            return curValue + 'px';
        }

    });
}

function gameOver() {
    clearInterval(ticker);
    $(".tile").remove();
    $("#score").addClass("hidden");
    $(".popup-container").removeClass("hidden");
    $(".board").addClass("hidden");
}

$("#start").on("click", () => {

    prepareBoard();
});