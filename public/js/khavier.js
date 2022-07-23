let mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));


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