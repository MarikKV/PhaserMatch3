let game;
let gameOptions = {
    fieldSize: 7,
    gemColors: 6,
    gemSize: 100,
    gemShadowSize: 72,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    score: 0,
    timer: 45,
    sound: true
}
const HORIZONTAL = 1;
const VERTICAL = 2;
window.onload = function() {
    let gameConfig = {
        width: 1000,
        height: 700,
        scene: [
            loadGame,
            menuGame,
            tutorial,
            playGame
            ]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
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
        //images and sounds
        this.load.image("background", "images/backgrounds/background.jpg");
        this.load.image("btn-play", "images/btn-play.png");
        this.load.image("logo", "images/donuts_logo.png");
        this.load.image("sound", "images/btn-sfx.png");
        this.load.image("time-up", "images/text-timeup.png");
        this.load.image("score", "images/bg-score.png");
        this.load.image("donut", "images/donut.png");
        this.load.image("tutorial", "images/tutorial.png");
        this.load.image("hand", "images/game/hand.png");


        this.load.audio("fon-music", "audio/background.mp3");
        this.load.audio("s-kill", "audio/kill.mp3");
        this.load.audio("bell-ring", "audio/bell-ring.wav");
        this.load.audio("time-ending", "audio/time-ending.wav");
        this.load.audio("time-up-ring", "audio/time-up-ring.wav");

        //sounds for gems
        for(let i=1;i <= 8;i++){
            this.load.audio("s-select-" + i, "audio/select-" + i +".mp3");
        }
        //anim
        this.load.spritesheet('boom', 'images/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });

        //gem sprites
        for(let i = 0; i <= 5; i++){
            let j = i + 1;
            this.load.image("gem" + i, "images/game/gem-0"+ j +".png", {
                frameWidth: gameOptions.gemSize,
                frameHeight: gameOptions.gemSize
            });
        }
        //shadows
        for(let i = 0; i <= 4; i++){
            let j = i + 1;
            this.load.spritesheet("gem_shadow-" + i, "images/particles/particle-"+ j +".png", {
                frameWidth: gameOptions.gemShadowSize,
                frameHeight: gameOptions.gemShadowSize
            });
        }
        this.load.spritesheet("gem_shadow-5", "images/particles/particle_ex1.png", {
            frameWidth: 62,
            frameHeight: 62
        });


            //loading line
        this.add.text(420, 480, 'LOADING...', { fontFamily: '"Roboto Condensed"', fontSize: '40px' });
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

}}
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
        //fon and logo
        this.add.tileSprite(640, 480, 1280, 960, "background");
        this.add.tileSprite(500, 150, 605, 225, "logo");


        //buttons
        let soundButton = this.add.tileSprite(100, 580, 143, 140, "sound");
        let playButton = this.add.tileSprite(500, 400, 286, 180, "btn-play");
        let tutorialButton = this.add.tileSprite(500, 570, 960, 257, "tutorial").setScale(0.3);
        //loading line color
        let line = this.add.graphics({
            fillStyle: {
                color: 0xffffff,//white
                alpha: 100
            }
        });


        //fon music
        let fonMusic = this.sound.add("fon-music");
        //fon music start
        fonMusic.play();

        //on , off fon music
        soundButton.setInteractive();
        soundButton.on("pointerover", ()=> {
            soundButton.setScale(1.04);
        })
        soundButton.on("pointerout", ()=> {
            soundButton.setScale(1);
        })
        soundButton.on("pointerup", ()=> {
            if(gameOptions.sound) {
                fonMusic.stop();
                line.fillRect(280, 440, 190, 20);
                line.angle =  30;
                gameOptions.sound = false;
            }else{
                fonMusic.play();
                line.clear();
                gameOptions.sound = true;
            }
        })
        this.sound.pauseOnBlur = false;

        //buttons play effect on hover
        playButton.setInteractive();
        playButton.on("pointerover", ()=> {
            playButton.setScale(1.02);
        })
        playButton.on("pointerout", ()=> {
            playButton.setScale(1);
        })
        playButton.on("pointerup", ()=> {
            fonMusic.stop();
            console.log('game started')
            this.scene.start("playGame", "can play")
        })

        //tutorial button events
        tutorialButton.setInteractive();
        tutorialButton.on("pointerover", ()=> {
            tutorialButton.setScale(0.35);
        })
        tutorialButton.on("pointerout", ()=> {
            tutorialButton.setScale(0.3);
        })
        tutorialButton.on("pointerup", ()=> {
            console.log('tutorial started');
            fonMusic.stop();
            this.scene.start("tutorial", "tutorial start")
        })


    }
}
class tutorial extends Phaser.Scene {
    constructor() {
        super("tutorial")
    }
    init(){

    }
    preload(){

    }
    create(){
        this.add.tileSprite(640, 480, 1280, 960, "background");
        this.add.text(this.game.renderer.width - 770, 0, 'How to play', { fontFamily: '"Fredoka One", cursive', fontSize: '80px', color: 'black'});
        this.add.text(0, 130, '1) Press big donut', { fontFamily: '"Fredoka One", cursive', fontSize: '45px', color: 'black'});
        this.add.text(580, 130, ' to start a timer.', { fontFamily: '"Fredoka One", cursive', fontSize: '45px', color: 'black'});
        this.add.text(0, 280, '2) Choose two donuts on the field to swap them', { fontFamily: '"Fredoka One", cursive', fontSize: '42px', color: 'black'});

        this.add.text(0, 450, '3) Match 3 ore more \n    same color donuts \n    to colect the points', { fontFamily: '"Fredoka One", cursive', fontSize: '45px', color: 'black'});
        this.add.tileSprite(480, 170, 582, 581, "donut").setScale(0.2);

        /*exemple moving gems
        this.vector_one = true;
        this.gem_one = this.add.tileSprite(875, 295, 100, 100, "gem2").setScale(0.7);
        this.gem_two = this.add.tileSprite(675, 250, 100, 100, "gem1").setScale(0.7);
        */

        let btn_play_game = this.add.tileSprite(915, 620, 286, 180, "btn-play").setScale(0.45);


        //this.hand_up_down = this.add.tileSprite(700, 300, 110, 157, "hand").setScale(0.7);
        //this.hand_left_right = this.add.tileSprite(900, 350, 110, 157, "hand").setScale(0.7);
        this.anim_l_r = this.time.addEvent({ delay: 40, callback: this.move, callbackScope: this, repeat: -1, startAt: 0 });


        this.anim_exemple = this.time.addEvent({ delay: 40, callback: this.exemp, callbackScope: this, repeat: -1, startAt: 0 });
        let field_exemple = [[1,4,3,4],[2,1,2,2], [3,4,1,2]];
        this.field=[];
        for(let i=0; i < 3; i++){
            this.field[i] = [];
            for(let j=0; j < 4; j++){
                this.field[i][j] = this.add.tileSprite(600+ gameOptions.gemSize*j/1.5, 475+gameOptions.gemSize*i/1.5, 100, 100, "gem"+field_exemple[i][j]).setScale(0.7).setDepth(1);
            }
        }
        this.hand_example = this.add.tileSprite(630, 590, 110, 157, "hand").setScale(0.6).setDepth(3);
        this.new_field = this.field;


        btn_play_game.setInteractive();
        btn_play_game.on("pointerover", ()=> {
            btn_play_game.setScale(0.6);
        })
        btn_play_game.on("pointerout", ()=> {
            btn_play_game.setScale(0.5);
        })
        btn_play_game.on("pointerup", ()=> {
            console.log('game started')
            this.scene.start("playGame", "can play")
        })
    }
    update(){

    }
    exemp(){
        if(this.hand_example.x < 695) {
            this.field[1][0].setDepth(2);
            this.field[1][0].setScale(0.78);
            this.hand_example.x += 2;
        }
        if(this.hand_example.x >= 695 && this.field[1][0].x < 665) {
            this.field[1][1].setScale(0.78);
            this.field[1][0].x += 2;
            this.field[1][1].x -= 2;
        }
        if(this.field[1][0].x >= 664){
            this.field[1][0].visible = false;
            this.field[1][2].visible = false;
            this.field[1][3].visible = false;
            this.field[1][1].setScale(0.7);
            this.field[1][0].setScale(0.7);
            this.field[0][1].y+=2;
            this.field[0][2].y+=2;
            this.field[0][3].y+=2;
        }
        if(this.field[0][3].y >= 540){
            this.field = this.new_field;
            this.hand_example.x = 630;
            this.field[0][1].y=475;
            this.field[0][2].y=475;
            this.field[0][3].y=475;
            this.field[1][1].x=600 + gameOptions.gemSize/1.5;
            this.field[1][0].x=600;
            this.field[1][0].visible = true;
            this.field[1][2].visible = true;
            this.field[1][3].visible = true;
        }
    }
/*//exemple moving gems and hands
    move(){
        if(this.vector_one) {
            if(this.gem_one.x < 990) {
                //this.hand_left_right.x+= 2;
                this.gem_one.x+=2;
                //this.hand_up_down.y+=2;
                this.gem_two.y+=2;
            }
            if(this.gem_one.x >= 990){
                this.vector_one = false
            }
        }
        if(!this.vector_one){
            if(this.gem_one.x > 900) {
                //this.hand_left_right.x -= 2;
                this.gem_one.x-=2;
                //this.hand_up_down.y -= 2;
                this.gem_two.y-=2;

            }
            if(this.gem_one.x <= 900){
                this.vector_one = true
            }
        }
    }*/
}
class playGame extends Phaser.Scene{
    constructor(){
        super("playGame");
    }
    init(data) {
        console.log(data);
    }
    preload(){

    }
    create(){
        this.gameStarted = false;
        this.donutSize = 0.25;
        //margin left from gems
        let left_muve = (gameOptions.fieldSize - 1)*gameOptions.gemSize + gameOptions.fieldSize*gameOptions.gemSize / 2.5;
        this.gameOver = false;
        this.gameEndSound = false;
        this.timeUpdate = true;
        this.add.tileSprite(640, 480, 1280, 960, "background");
        //score image
        this.add.tileSprite(left_muve, 100, 605, 225, "score").setScale(0.8);
        this.canPick = false;
        this.dragging = false;
        this.drawField();
        this.selectedGem = null;

        //check this to fix bag
        this.input.on("pointerdown", this.gemSelect, this);//нажав машку
        this.input.on("pointermove", this.startSwipe, this);//рух мишки
        this.input.on("pointerup", this.stopSwipe, this);//відпустив мишку

        //game score
        this.Score = this.add.text(left_muve - 20, 60, '0', { fontFamily: '"Fredoka One", cursive', fontSize: '45px'});
        //timer
        this.Timertext = this.add.text(left_muve - 180, 150, 'Time left', { fontFamily: '"Fredoka One", cursive', fontSize: '65px', color: 'black'});


        this.Timer = this.add.text(left_muve - 125, 240, '0' + Math.floor(gameOptions.timer / 60) + ':' + (gameOptions.timer % 60), {
            fontFamily: '"Fredoka One", cursive',
            fontSize: '70px',
            color: 'black'
        });

        //start timer button (game start)
        this.startPlayButton = this.add.tileSprite(left_muve - 30, 430, 582, 581, "donut").setScale(0.25);
        //text click to start
        let clicToStartText = this.add.text(left_muve - 175, 520, 'Click on donut\n     to start', {
            fontFamily: '"Fredoka One", cursive',
            fontSize: '42px',
            color: 'black'
        });

        let soundInGame = this.add.tileSprite(930, 650, 143, 140, "sound").setScale(0.55);
        let line_sound = this.add.graphics({
            fillStyle: {
                color: 0xffffff,//white
                alpha: 100
            }
        });
        //if sound off then drow line on sound pic
        if(!gameOptions.sound){
            line_sound.fillRect(1080, 90, 100, 10);
            line_sound.angle =  30;
        }
        //changes for sound in play mode
        soundInGame.setInteractive();
        soundInGame.on("pointerover", ()=> {
            soundInGame.setScale(0.60)
        })
        soundInGame.on("pointerout", ()=> {
            soundInGame.setScale(0.55)
        })
        soundInGame.on("pointerup", ()=> {
            if(gameOptions.sound){
                line_sound.fillRect(1080, 90, 100, 10);
                line_sound.angle =  30;
                gameOptions.sound = false;
                this.gameTimeEnding.pause();
                this.gameTimeUpRing.pause()
            }else{
                line_sound.clear();
                gameOptions.sound = true;
                if(gameOptions.timer < 6){this.gameTimeEnding.play()}
                if(gameOptions.timer < 1 && !this.gameOver){this.gameTimeUpRing.play()}
            }
        })

        //changes for start button
        this.startPlayButton.setInteractive();
        this.startPlayButton.on("pointerover", ()=> {
            this.startPlayButton.setScale(0.26)
        })
        this.startPlayButton.on("pointerout", ()=> {
            this.startPlayButton.setScale(0.25)
        })
        this.startPlayButton.on("pointerup", ()=> {
            //minus 1 sec from timer(in game options)
            if(!this.gameStarted){
                this.timer_run = this.time.addEvent({ delay: 1000, callback: this.time_run, callbackScope: this, repeat: gameOptions.timer - 1, startAt: 0 });
                this.gameStarted = true;
                if(gameOptions.sound){
                    this.gameStartRing.play();
                }
                this.canPick = true;
            }
        })

        //sound game start and game is ending
        this.gameStartRing = this.sound.add("bell-ring");
        this.gameTimeEnding = this.sound.add("time-ending");
        this.gameTimeUpRing = this.sound.add("time-up-ring");
    }

    time_run(){
        if(gameOptions.timer >=0) {
            gameOptions.timer--;
            this.sec = gameOptions.timer % 60;
            this.min = Math.floor(gameOptions.timer / 60);
        }
    }
    time_ending(){
        if(gameOptions.timer == 6 && gameOptions.sound){
            this.gameTimeEnding.play()
        }
    }
    time_up(){
        if(gameOptions.timer == 0 && !this.gameEndSound && !this.gameOver){
            this.canPick = false;
            this.time.delayedCall(
                2000,
                this.drawEndScore,
                [],
                this);
            this.time.delayedCall(
                2500,
                this.stopRing,
                [],
                this);
            if(!this.gameEndSound && gameOptions.sound){
                this.gameTimeUpRing.play();
                this.gameEndSound = true;
            }
            this.gameOver = true;
        }
    }
    //end score in 2 sec after game end(2 sec wait to show the right score)
    drawEndScore(){
        this.canPick = false;
        let scoreBard = this.add.graphics({
            fillStyle: {
                color: 0x525861//white
            }
        })
        scoreBard.fillRect(this.game.renderer.width/5, this.game.renderer.height/2, this.game.renderer.width/1.7, 150).setDepth(10);
        this.add.tileSprite(540, 240, 464, 112, "time-up").setScale(1.5).setDepth(10);
        this.add.text(this.game.renderer.width/3, this.game.renderer.height/2 + 20,'Your core: ' + gameOptions.score, { fontFamily: '"Fredoka One", cursive', fontSize: '50px'}).setDepth(15)

    }
    stopRing(){
        this.gameTimeUpRing.stop();
    }
    drawField(){
        this.gameArray = [];
        this.gameShadowsArray = [];
        this.poolArray = [];
        this.gemGroup = this.add.group();
        this.gemShadowsGroup = this.add.group();

        this.gemsArray = ["gem0", "gem1", "gem2", "gem3", "gem4", "gem5"];
        this.gems_shadowArray = ["gem_shadow-0", "gem_shadow-1", "gem_shadow-2", "gem_shadow-3", "gem_shadow-4", "gem_shadow-5"];

        for(let i = 0; i < gameOptions.fieldSize; i ++){
            this.gameArray[i] = [];
            this.gameShadowsArray[i] = [];
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                do{
					let randomColor = Phaser.Math.Between(0, gameOptions.gemColors - 1);

					let gem = this.add.sprite(gameOptions.gemSize * j + gameOptions.gemSize / 2, gameOptions.gemSize * i + gameOptions.gemSize / 2, this.gemsArray[randomColor]).setDepth(1);
					gem.visible = false;//випарвка багу

					let gem_shadow = this.add.sprite(gameOptions.gemSize * j + gameOptions.gemSize / 2 - 10, gameOptions.gemSize * i + gameOptions.gemSize / 2, this.gems_shadowArray[randomColor]).setDepth(0);
					gem_shadow.setScale(1.5);
                    gem_shadow.visible = false;

					this.gemGroup.add(gem);
                    this.gemShadowsGroup.add(gem_shadow);

                    gem.setFrame(randomColor);
                    gem_shadow.setFrame(randomColor);
                    this.gameArray[i][j] = {
                        gemColor: randomColor,
                        gemSprite: gem,
                        isEmpty: false
                    };
                   this.gameShadowsArray[i][j] = {
                        gemColor: randomColor,
                        gemSprite: gem_shadow,
                        isEmpty: false
                    }
                } while(this.isMatch(i, j));
                this.gameArray[i][j].gemSprite.visible = true;
                this.gameShadowsArray[i][j].gemSprite.visible = true;
            }
        }
        console.log(this.gameArray);
        console.log(this.gameShadowsArray);
        this.handleMatches();
    }
    update(){
        //show time in min, sec
        if(this.min > 0 && this.sec >=10) {
            this.Timer.setText('0'+ this.min + ':' + (this.sec - this.timer_run.getProgress().toString().substr(0, 2)))
        }
        if(this.min > 0 && this.sec < 10) {
            this.Timer.setText('0'+ this.min + ':0' + (this.sec - this.timer_run.getProgress().toString().substr(0, 2)))
        }
        if(this.min <= 0 && this.sec >= 10) {
            this.Timer.setText('00:'+ (this.sec - this.timer_run.getProgress().toString().substr(0, 2)))
        }
        if(this.min <= 0 && this.sec < 10 && this.timeUpdate) {
            this.Timer.setText('00:0'+ (this.sec - this.timer_run.getProgress().toString().substr(0, 2)))
        }
        if(this.min == 0 && this.sec == 0 && this.timeUpdate) {
            this.Timer.setText('00:00')
            this.timeUpdate = false;
        }
        this.time_ending();
        this.time_up();
        if(this.gameStarted) {
            for (let i = 0; i < gameOptions.fieldSize; i++) {
                for (let j = 0; j < gameOptions.fieldSize; j++) {
                    this.gameShadowsArray[i][j].gemColor = this.gameArray[i][j].gemColor;
                    this.gameShadowsArray[i][j].gemSprite.setFrame(this.gameArray[i][j].gemColor);
                    this.gameShadowsArray[i][j].gemSprite.setTexture("gem_shadow-" + this.gameArray[i][j].gemColor);//правильна картинка
                    this.gameShadowsArray[i][j].gemSprite.visible = true;
                    this.gameShadowsArray[i][j].gemSprite.x = this.gameArray[i][j].gemSprite.x - 10;
                    this.gameShadowsArray[i][j].gemSprite.y = this.gameArray[i][j].gemSprite.y;
                    this.gameShadowsArray[i][j].gemSprite.alpha = 1;
                    this.gameShadowsArray[i][j].isEmpty = false;
                }
            }
        }
        if(this.gameStarted){
            if(gameOptions.timer > 0) {
                this.startPlayButton.setScale(this.donutSize)
            }
        }
    }
    //match functions
    isMatch(row, col){
         return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }
    isHorizontalMatch(row, col){
         return this.gemAt(row, col).gemColor == this.gemAt(row, col - 1).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row, col - 2).gemColor;
    }
    isVerticalMatch(row, col){
         return this.gemAt(row, col).gemColor == this.gemAt(row - 1, col).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row - 2, col).gemColor;
    }
    //get row and col of gem
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
            let pickedGem = this.gemAt(row, col)//gem row and col
            if(pickedGem != -1){
                if(this.selectedGem == null){
                    pickedGem.gemSprite.setScale(1.1);
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
                            pickedGem.gemSprite.setScale(1.1);
                            this.selectedGem = pickedGem;
                        }
                    }
                }
            }
        }
    }
    startSwipe(pointer){
        //Change to fix bag
        this.dragging = false; // new (can be deleted)

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
            //if move then..
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
    //check matches
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

    //draw score
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
                            if(gameOptions.sound){scoreMusic.play();}
                            this.drawScore();
                        }
                        else{
                            console.log("VERTICAL :: Length = " + colorStreak + " :: Start = (" + startStreak + "," + i + ") :: Color = " + currentColor);
                            gameOptions.score+=colorStreak;
                            if(gameOptions.sound){scoreMusic.play();}
                            this.drawScore();
                        }
                        for(let k = 0; k < colorStreak; k ++){
                            if(direction == HORIZONTAL){
                                this.removeMap[i][startStreak + k] ++;
                            }
                            else{
                                this.removeMap[startStreak + k][i] ++;
                            }
                        }
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
                            //new
                            this.animation_effect(j*gameOptions.gemSize + gameOptions.gemSize/2, i*gameOptions.gemSize + gameOptions.gemSize/2);
                            this.gameArray[i][j].gemSprite.visible = false;
                            this.poolArray.push(this.gameArray[i][j].gemSprite);
                            if(destroyed == 0){
                                setTimeout(() =>  this.makeGemsFall(), 500);
                                setTimeout(() =>  this.replenishField(), 500);

                                //setTimeout(this.makeGemsFall(), 2000);
                               // setTimeout(this.replenishField(), 2000);
                            }
                        }
                    });
                    this.gameArray[i][j].isEmpty = true;
                }
            }
        }
    }
    animation_effect(x, y){
        let config = {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 24}),
            frameRate: 60,
            repeat: 0
        };
        this.anims.create(config);
        this.add.sprite(x, y, 'boom').play('explode').setDepth(3);
    }
    makeGemsFall(){
        for(let i = gameOptions.fieldSize - 2; i >= 0; i --){
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(!this.gameArray[i][j].isEmpty){
                    let fallTiles = this.holesBelow(i, j);//empty holes
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
                    this.gameArray[i][j].gemSprite = this.poolArray.pop();
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
}
function resize() {
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
