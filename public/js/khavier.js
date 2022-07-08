const music = new Audio('../sound/music/Pierre.mp3');
var speed = 2;
var score = 0;
var loopTileSliding;
var loopTileCreation;

function prepareBoard() {
    score = 0;
    $("#score").removeClass("hidden").text(score);
    $(".popup-container").addClass("hidden");
    $(".board").removeClass("hidden");
    var tileheight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--tile-height"), 10) / 100;
    tileheight *= $(document).height();
    loopTileSliding = setInterval(moveTilesDown, 10)
    loopTileCreation = setInterval(generateTile, tileheight * 10 / speed)
    music.play();
}

function generateTile(){
    createTile((Math.floor(Math.random() * $(".line").length) + 1));
}

function createTile(index){
    var tile = $("<div class='tile'/>");
    tile.on("click", tilePressed)
    $(".line:nth-child("+ index +")").append(tile);
}

function tilePressed(){
    score++;
    $("#score").text(score);
    $(this).remove();
}

function moveTilesDown(){
    var board_height = $(".board").height();
    $(".tile").css('top', function (index, curValue) {
        curValue = (parseInt(curValue, 10) + speed);
        if(curValue >= 0 && curValue < speed){
        }
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