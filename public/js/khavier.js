const music = new Audio('../sound/music/Pierre.mp3');
const bpm = 100;
var dx;
var speed = 10;
var score = 0;
var loopTileSliding;
var loopTileCreation;
var board_height;
function prepareBoard() {
    board_height = $(".board").height();
    score = 0;
    $("#score").removeClass("hidden").text(score);
    $(".popup-container").addClass("hidden");
    $(".board").removeClass("hidden");
    var tileheight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--tile-height"), 10) / 100;
    tileheight *= $(document).height();
    console.log(tileheight);
    var dxDivisor = 100;
    dx = tileheight/dxDivisor;
    var speed = 60000/bpm;
    loopTileSliding = setInterval(moveTilesDown, speed/dxDivisor)
    loopTileCreation = setInterval(generateTile, speed);
    music.play();
}

function generateTile(){
    createTile((Math.floor(Math.random() * $(".line").length) + 1));
}

function createTile(index){
    $(".line:nth-child("+ index +")").append($("<div class='tile'/>").on("click", tilePressed));
}

function tilePressed(){
    score++;
    $("#score").text(score);
    $(this).remove();
}

function moveTilesDown(){

    $(".tile").css('top', function (index, curValue) {
        curValue = (parseFloat(curValue) + dx);
        if(curValue > board_height){
            gameOver();
        }else{
            return curValue + 'px';
        }
    });
}

function gameOver(){
    clearInterval(loopTileSliding);
    clearInterval(loopTileCreation);
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