let game;
let gameOptions = {
    fieldSize: 7,
    gemColors: 6,
    gemSize: 100,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    score: 0
}

const HORIZONTAL = 1;
const VERTICAL = 2;
window.onload = function() {
    let gameConfig = {
        width: 1100,
        height: 700,
        scene: [
            loadGame,
            menuGame,
            playGame
            ]
    }
    game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

class loadGame extends Phaser.Scene {
    constructor() {
        super("loadGame")
    }
    init(){

    }
    preload(){
        //картинки і звуки
        this.load.image("background", "images/backgrounds/background.jpg");
        this.load.image("btn-play", "images/btn-play.png");
        this.load.image("logo", "images/donuts_logo.png");
        this.load.image("sound", "images/btn-sfx.png");
        this.load.image("time-up", "images/text-timeup.png");
        this.load.image("score", "images/bg-score.png");
        this.load.image("hand", "images/game/hand.png");


        this.load.audio("fon-music", "audio/background.mp3");
        this.load.audio("s-kill", "audio/kill.mp3");

        //звуки гемів
        for(let i=1;i <= 8;i++){
            this.load.audio("s-select-" + i, "audio/select-" + i +".mp3");
        }

        //каритинки гемів
        for(let i = 0; i <= 6; i++){
            let j = i + 1;
            this.load.spritesheet("gem" + i, "images/game/gem-0"+ j +".png", {
                frameWidth: gameOptions.gemSize,
                frameHeight: gameOptions.gemSize
            });
        }

        //лінія завантаження
        this.add.text(450, 480, 'LOADING...', { fontFamily: '"Roboto Condensed"', fontSize: '40px' });
        //лінія завантаження
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff//white
            }
        })
        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height * 0.8, this.game.renderer.width * percent, 20)
        })
        this.load.on("complete", ()=>{

        })
    }
    create(){
        this.scene.start("menuGame", "load complete")
    }
}
class menuGame extends Phaser.Scene {
    constructor() {
        super("menuGame")
    }
    init(data){
        console.log(data);
    }
    preload(){

    }
    create(){
        //фон і лого
        this.add.tileSprite(640, 480, 1280, 960, "background");
        this.add.tileSprite(540, 150, 605, 225, "logo");
        //кнопки
        let soundButton = this.add.tileSprite(100, 580, 143, 140, "sound");
        let playButton = this.add.tileSprite(550, 400, 286, 180, "btn-play");

        //колір лініїзавантаження
        let a = this.add.graphics({
            fillStyle: {
                color: 0xffffff,//white
                alpha: 100
            }
        });


        //фонова музика
        let fonMusic = this.sound.add("fon-music");

        //запускаєм фон при старті
        fonMusic.play();
        let play = true;
        //включити вимкунути фнову музику
        soundButton.setInteractive();
        soundButton.on("pointerover", ()=> {
            soundButton.setScale(1.04);
        })
        soundButton.on("pointerout", ()=> {
            soundButton.setScale(1);
        })
        soundButton.on("pointerup", ()=> {
            if(play) {
                fonMusic.stop();
                a.fillRect(280, 440, 190, 20);
                a.angle =  30;
                play = false;
            }else{
                fonMusic.play();
                a.clear();
                play = true;
            }
        })
        this.sound.pauseOnBlur = false;

        //кнопка play ефекти при наведені та запуск гри при нажатті
        playButton.setInteractive();
        playButton.on("pointerover", ()=> {
            playButton.setScale(1.02);
        })
        playButton.on("pointerout", ()=> {
            playButton.setScale(1);
        })
        playButton.on("pointerup", ()=> {
            console.log('game staarted')
            this.scene.start("playGame", "can play")
        })


    }
}

class playGame extends Phaser.Scene{
    constructor(){
        super("playGame");
    }
    init(data){
        console.log(data);
    }
    preload(){

    }
    create(){
        this.add.tileSprite(640, 480, 1280, 960, "background");
        this.add.tileSprite(950, 100, 605, 225, "score");
        this.canPick = true;
        this.dragging = false;
        this.drawField();
        this.selectedGem = null;
        this.input.on("pointerdown", this.gemSelect, this);//нажав машку
        this.input.on("pointermove", this.startSwipe, this);//рух мишки
        this.input.on("pointerup", this.stopSwipe, this);//відпустив мишку

        this.min = 90;
        this.Score = this.add.text(930, 60, '0', { fontFamily: '"Fredoka One", cursive', fontSize: '50px'});

        this.Timer = this.add.text(700, 260, '01:00', { fontFamily: '"Fredoka One", cursive', fontSize: '50px'});

        this.timer_run = this.time.addEvent({ delay: 10000, callback: this.drawTimer, callbackScope: this, repeat: 8, startAt: 0 });
    }
    update(){
        if(this.min <= 90 && this.min >= 60) {
            this.Timer.setText('Time left' + '\n01:'+ (this.min - this.timer_run.getProgress().toString().substr(2, 1) - 60))
        }
        if(this.min < 60 && this.min > 10 ) {
            this.Timer.setText('Time left' + '\n00:'+ (this.min - this.timer_run.getProgress().toString().substr(2, 1)))
        }
        if(this.min < 60 && this.min >= 10) {
            this.Timer.setText('Time left' + '\n00:'+ (this.min - this.timer_run.getProgress().toString().substr(2, 1)))
        }
        if(this.min < 10) {
            this.Timer.setText('Time left' + '\n00:0'+ (this.min - this.timer_run.getProgress().toString().substr(2, 1)))
        }
    }
    drawTimer(){
       this.min-=10;
    }
    drawField(){
        this.gameArray = [];
        this.poolArray = [];
        this.gemGroup = this.add.group();
		this.gemsArray = ["gem0", "gem1", "gem2", "gem3", "gem4", "gem5"];
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            this.gameArray[i] = [];
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                do{
					let randomColor = Phaser.Math.Between(0, gameOptions.gemColors - 1);
					let gem = this.add.sprite(gameOptions.gemSize * j + gameOptions.gemSize / 2, gameOptions.gemSize * i + gameOptions.gemSize / 2, this.gemsArray[randomColor]);
					gem.visible = false;//випарвка багу
					this.gemGroup.add(gem);
                    gem.setFrame(randomColor);
                    this.gameArray[i][j] = {
                        gemColor: randomColor,
                        gemSprite: gem,
                        isEmpty: false
                    }
                } while(this.isMatch(i, j));
                this.gameArray[i][j].gemSprite.visible = true;//для виправлення багу 2 геми на 1 місці
            }
        }

        console.log(this.gameArray);
        this.handleMatches();
    }
    //функції перевірки елементів які співпадаютxь
    isMatch(row, col){
         return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }
    isHorizontalMatch(row, col){
         return this.gemAt(row, col).gemColor == this.gemAt(row, col - 1).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row, col - 2).gemColor;
    }
    isVerticalMatch(row, col){
         return this.gemAt(row, col).gemColor == this.gemAt(row - 1, col).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row - 2, col).gemColor;
    }
    //ряд і стовпець гему
    gemAt(row, col){
        if(row < 0 || row >= gameOptions.fieldSize || col < 0 || col >= gameOptions.fieldSize){
            return -1;
        }
        return this.gameArray[row][col];
    }
    gemSelect(pointer){
        if(this.canPick){
            this.dragging = true;
            let row = Math.floor(pointer.y  / gameOptions.gemSize);
            let col = Math.floor(pointer.x / gameOptions.gemSize);
            let pickedGem = this.gemAt(row, col)//координати гему
            if(pickedGem != -1){
                if(this.selectedGem == null){
                    pickedGem.gemSprite.setScale(1.2);
                    pickedGem.gemSprite.setDepth(1);
                    this.selectedGem = pickedGem;
                }
                else{
                    if(this.areTheSame(pickedGem, this.selectedGem)){
                        this.selectedGem.gemSprite.setScale(1);
                        this.selectedGem = null;
                    }
                    else{
                        if(this.areNext(pickedGem, this.selectedGem)){
                            this.selectedGem.gemSprite.setScale(1);
                            this.swapGems(this.selectedGem, pickedGem, true);
                        }
                        else{
                            this.selectedGem.gemSprite.setScale(1);
                            pickedGem.gemSprite.setScale(1.2);
                            this.selectedGem = pickedGem;
                        }
                    }
                }
            }
        }
    }
    startSwipe(pointer){
        //перевірка чи пересунули ми гем на достатню відстань щоб залишити на місці
        if(this.dragging && this.selectedGem != null){
            let deltaX = pointer.downX - pointer.x;
            let deltaY = pointer.downY - pointer.y;
            let deltaRow = 0;
            let deltaCol = 0;
            //перетягнули гем 4 випадки верх низ право ліво
            if(deltaX > gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4){
                deltaCol = -1;
            }
            if(deltaX < -gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4){
                deltaCol = 1;
            }
            if(deltaY > gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4){
                deltaRow = -1;
            }
            if(deltaY < -gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4){
                deltaRow = 1;
            }
            //якщо виконалась бодай 1 умова тоді міняємо розташування гемів
            if(deltaRow + deltaCol != 0){
                let pickedGem = this.gemAt(this.getGemRow(this.selectedGem) + deltaRow, this.getGemCol(this.selectedGem) + deltaCol);
                if(pickedGem != -1){
                    this.selectedGem.gemSprite.setScale(1);
                    this.swapGems(this.selectedGem, pickedGem, true);
                    this.dragging = false;
                }
            }
        }
    }
    stopSwipe(){
        this.dragging = false;
    }
    areTheSame(gem1, gem2){
        return this.getGemRow(gem1) == this.getGemRow(gem2) && this.getGemCol(gem1) == this.getGemCol(gem2);
    }
    getGemRow(gem){
        return Math.floor(gem.gemSprite.y / gameOptions.gemSize);
    }
    getGemCol(gem){
        return Math.floor(gem.gemSprite.x / gameOptions.gemSize);
    }
    areNext(gem1, gem2){
        return Math.abs(this.getGemRow(gem1) - this.getGemRow(gem2)) + Math.abs(this.getGemCol(gem1) - this.getGemCol(gem2)) == 1;
    }
    swapGems(gem1, gem2, swapBack){
        this.swappingGems = 2;
        this.canPick = false;
        let fromColor = gem1.gemColor;
        let fromSprite = gem1.gemSprite;
        let toColor = gem2.gemColor;
        let toSprite = gem2.gemSprite;
        let gem1Row = this.getGemRow(gem1);
        let gem1Col = this.getGemCol(gem1);
        let gem2Row = this.getGemRow(gem2);
        let gem2Col = this.getGemCol(gem2);
        this.gameArray[gem1Row][gem1Col].gemColor = toColor;
        this.gameArray[gem1Row][gem1Col].gemSprite = toSprite;
        this.gameArray[gem2Row][gem2Col].gemColor = fromColor;
        this.gameArray[gem2Row][gem2Col].gemSprite = fromSprite;
        this.tweenGem(gem1, gem2, swapBack);
        this.tweenGem(gem2, gem1, swapBack);
    }
    tweenGem(gem1, gem2, swapBack){
        let row = this.getGemRow(gem1);
        let col = this.getGemCol(gem1);
        this.tweens.add({
            targets: this.gameArray[row][col].gemSprite,
            x: col * gameOptions.gemSize + gameOptions.gemSize / 2,
            y: row * gameOptions.gemSize + gameOptions.gemSize / 2,
            duration: gameOptions.swapSpeed,
            callbackScope: this,
            onComplete: function(){
                this.swappingGems --;
                if(this.swappingGems == 0){
                    if(!this.matchInBoard() && swapBack){
                        this.swapGems(gem1, gem2, false);
                    }
                    else{
                        if(this.matchInBoard()){
                            this.handleMatches();
                        }
                        else{
                            this.canPick = true;
                            this.selectedGem = null;
                        }
                    }
                }
            }
        });
    }
    //чи є повтори гемів на полі
    matchInBoard(){
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(this.isMatch(i, j)){
                    return true;
                }
            }
        }
        return false;
    }
    //перевірка виду збігу кольорів
    handleMatches(){
        this.removeMap = [];//масив з гемами по 3
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            this.removeMap[i] = [];
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                this.removeMap[i].push(0);
            }
        }
        this.markMatches(HORIZONTAL);
        this.markMatches(VERTICAL);
        this.destroyGems();
    }
    //малювання рахунку
    drawScore(){
        this.Score.setText(gameOptions.score);
    }

    markMatches(direction){
        let scoreMusic = this.sound.add("s-kill");
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            let colorStreak = 1;
            let currentColor = -1;
            let startStreak = 0;
            let colorToWatch = 0;
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(direction == HORIZONTAL){
                    colorToWatch = this.gemAt(i, j).gemColor;
                }
                else{
                    colorToWatch = this.gemAt(j, i).gemColor;
                }
                if(colorToWatch == currentColor){
                    colorStreak ++;
                }
                if(colorToWatch != currentColor || j == gameOptions.fieldSize - 1){
                    if(colorStreak >= 3){
                        if(direction == HORIZONTAL){
                            console.log("HORIZONTAL :: Length = " + colorStreak + " :: Start = (" + i + "," + startStreak + ") :: Color = " + currentColor);
                            //рахунок
                            gameOptions.score+=colorStreak;
                            scoreMusic.play();
                            this.drawScore();
                            console.log(gameOptions.score)
                        }
                        else{
                            console.log("VERTICAL :: Length = " + colorStreak + " :: Start = (" + startStreak + "," + i + ") :: Color = " + currentColor);
                            gameOptions.score+=colorStreak;
                            scoreMusic.play();
                            this.drawScore();
                            console.log(gameOptions.score)
                        }
                        for(let k = 0; k < colorStreak; k ++){
                            if(direction == HORIZONTAL){
                                this.removeMap[i][startStreak + k] ++;
                            }
                            else{
                                this.removeMap[startStreak + k][i] ++;
                            }
                        }
                        console.log(this.gameArray)
                    }
                    startStreak = j;
                    colorStreak = 1;
                    currentColor = colorToWatch;
                }
            }
        }
    }
    destroyGems(){
        let destroyed = 0;
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(this.removeMap[i][j] > 0){
                    destroyed ++;
                    this.tweens.add({
                        targets: this.gameArray[i][j].gemSprite,
                        alpha: 0.5,
                        duration: gameOptions.destroySpeed,
                        callbackScope: this,
                        onComplete: function(){
                            destroyed --;
                            this.gameArray[i][j].gemSprite.visible = false;
                            this.poolArray.push(this.gameArray[i][j].gemSprite);
                            if(destroyed == 0){
                                this.makeGemsFall();
                                this.replenishField();
                            }
                        }
                    });
                    this.gameArray[i][j].isEmpty = true;
                }
            }
        }
    }
    makeGemsFall(){
        for(let i = gameOptions.fieldSize - 2; i >= 0; i --){
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(!this.gameArray[i][j].isEmpty){
                    let fallTiles = this.holesBelow(i, j);//пусті ділянки
                    if(fallTiles > 0){
                        this.tweens.add({
                            targets: this.gameArray[i][j].gemSprite,
                            y: this.gameArray[i][j].gemSprite.y + fallTiles * gameOptions.gemSize,
                            duration: gameOptions.fallSpeed * fallTiles
                        });
                        this.gameArray[i + fallTiles][j] = {
                            gemSprite: this.gameArray[i][j].gemSprite,
                            gemColor: this.gameArray[i][j].gemColor,
                            isEmpty: false
                        }
                        this.gameArray[i][j].isEmpty = true;
                    }
                }
            }
        }
    }
    holesBelow(row, col){
        let result = 0;
        for(let i = row + 1; i < gameOptions.fieldSize; i ++){
            if(this.gameArray[i][col].isEmpty){
                result ++;
            }
        }
        return result;
    }
    replenishField(){
        let replenished = 0;
        this.canPick = false;
        for(let j = 0; j < gameOptions.fieldSize; j ++){
            let emptySpots = this.holesInCol(j);
            if(emptySpots > 0){
                for(let i = 0; i < emptySpots; i ++){
                    replenished ++;
                    let randomColor = Phaser.Math.Between(0, gameOptions.gemColors - 1);
                    this.gameArray[i][j].gemColor = randomColor;
                    this.gameArray[i][j].gemSprite = this.poolArray.pop()
                    this.gameArray[i][j].gemSprite.setFrame(randomColor);
                    this.gameArray[i][j].gemSprite.setTexture("gem" + randomColor);//правильна картинка
                    this.gameArray[i][j].gemSprite.visible = true;
                    this.gameArray[i][j].gemSprite.x = gameOptions.gemSize * j + gameOptions.gemSize / 2;
                    this.gameArray[i][j].gemSprite.y = gameOptions.gemSize / 2 - (emptySpots - i) * gameOptions.gemSize;
                    this.gameArray[i][j].gemSprite.alpha = 1;
                    this.gameArray[i][j].isEmpty = false;
                    this.tweens.add({
                        targets: this.gameArray[i][j].gemSprite,
                        y: gameOptions.gemSize * i + gameOptions.gemSize / 2,
                        duration: gameOptions.fallSpeed * emptySpots,
                        callbackScope: this,
                        onComplete: function(){
                            replenished --;
                            if(replenished == 0){
                                if(this.matchInBoard()){
                                    this.time.addEvent({
                                        delay: 250,
                                        callback: this.handleMatches()
                                    });
                                }
                                else{
                                    console.log("msstake here");
                                    this.canPick = true;
                                    this.selectedGem = null;
                                }
                            }
                        }
                    });
                }
            }
        }
    }
    holesInCol(col){
        let result = 0;
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            if(this.gameArray[i][col].isEmpty){
                result ++;
            }
        }
        return result;
    }
}function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
