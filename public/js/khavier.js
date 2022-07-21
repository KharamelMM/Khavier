const music = new Audio('../sound/music/Pierre.mp3');
const bpm = 100;
var dx;
var speed = 10;
var score = 0;
var ticker;
var board_height;
var tile_height;
var lastTick;

var moveTilesDownTicker = 0;
var generateTileTicker = 0;
var speed = 60000/bpm;
var tileSpeed;

var startTick;

function prepareBoard() {
    score = 0

    $("#score").removeClass("hidden").text(score);
    $(".popup-container").addClass("hidden");

    board_height = $(".board").removeClass("hidden").height();
    tile_height = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tile-height")) / 100;
    tile_height *= board_height;
    speed = 60000/bpm; // ms between each tile creation
    dx = board_height/100; // 1 percent of the board each time
    tileSpeed = speed/((tile_height/dx)); // ms between each 1 percent tile move

    console.log((tile_height/dx));


    lastTick = Date.now();
    ticker = setInterval(tick,1)
    music.play();
    music.playbackRate=1.25
}


function tick(){
    var now = Date.now();
    var deltaTime = now - lastTick; // in ms
    lastTick = now;
    moveTilesDownTicker+=deltaTime;
    generateTileTicker+=deltaTime;

    if(generateTileTicker >= speed){
        generateTile();
        generateTileTicker-=speed;
        //moveTilesDown(25);
    }
    if(moveTilesDownTicker >= tileSpeed){
        moveTilesDown(moveTilesDownTicker / tileSpeed);
        moveTilesDownTicker%=tileSpeed;
    }
}


function generateTile(){
    createTile((Math.floor(Math.random() * $(".line").length) + 1));
    //createTile((Math.floor(Math.random() * 2) + 1));
}

function createTile(index){
    var tile = $("<div class='tile'/>").on("click", tilePressed);
    $(".line:nth-child("+ index +")").append(tile);
}

function tilePressed(){
    score++;
    $("#score").text(score);
    /*if(startTick === undefined){
        startTick = Date.now();
    }
    $("#score").text("BPM : " + ((score-1)/((Date.now()-startTick)/60000)));*/
    $(this).remove();
}

function moveTilesDown(amount){

    $(".tile").css('top', function (index, curValue) {
        curValue = (parseFloat(curValue) + (dx*amount));
        if(curValue > board_height){
            gameOver();
        }else{
            return curValue + 'px';
        }
    });
}

function gameOver(){
    clearInterval(ticker);
    $(".tile").remove();
    $("#score").addClass("hidden");
    $(".popup-container").removeClass("hidden");
    $(".board").addClass("hidden");
    music.pause();
    music.currentTime = 0;
}

$("#start").on("click", ()=>{
    console.log("AA");
    prepareBoard();
});