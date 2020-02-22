function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, angle, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;

    ctx.setTransform(1, 0, 0, 1, locX, locY);
    ctx.rotate(angle);
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2,
        this.frameWidth * scaleBy, this.frameHeight * scaleBy);
    ctx.rotate(angle);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// the 'main' code begins here
var friction = 8;

var ASSET_MANAGER = new AssetManager();

// menus
ASSET_MANAGER.queueDownload('./img/menus/title_orig.png');
ASSET_MANAGER.queueDownload('./img/menus/title.png');
ASSET_MANAGER.queueDownload('./img/menus/none_dif.png');
ASSET_MANAGER.queueDownload('./img/menus/casual_dif.png');
ASSET_MANAGER.queueDownload('./img/menus/classic_dif.png');
ASSET_MANAGER.queueDownload('./img/menus/roomclear.png');
ASSET_MANAGER.queueDownload('./img/menus/game over.png');
ASSET_MANAGER.queueDownload('./img/menus/continued.png');
ASSET_MANAGER.queueDownload('./img/menus/fadeblack.png');
ASSET_MANAGER.queueDownload('./img/menus/story1.png');
ASSET_MANAGER.queueDownload('./img/menus/story2.png');

// backgrounds
ASSET_MANAGER.queueDownload('./img/backgrounds/street00.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street01.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street02.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street03.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street04.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street05.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street11.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street12.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street13.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street14.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street15.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street21.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street22.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street23.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street24.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street25.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street31.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street32.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street33.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street34.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/street35.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house00.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house01.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house02.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house03.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house04.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house05.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house11.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house12.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house13.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house14.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house15.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house21.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house22.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house23.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house24.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house25.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house31.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house32.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house33.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house34.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/house35.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/arrow.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/roof00.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/roof01.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/roof02.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/roof03.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/roof04.png');
ASSET_MANAGER.queueDownload('./img/backgrounds/roof05.png');

// entities (player + enemies)
ASSET_MANAGER.queueDownload('./img/entities/frump.png');
ASSET_MANAGER.queueDownload('./img/entities/UI.png');
ASSET_MANAGER.queueDownload('./img/entities/health.png');
ASSET_MANAGER.queueDownload('./img/entities/health_drop.png');
ASSET_MANAGER.queueDownload('./img/entities/dash.png');
ASSET_MANAGER.queueDownload('./img/entities/dog.png');
ASSET_MANAGER.queueDownload('./img/entities/thug_bat.png');
ASSET_MANAGER.queueDownload('./img/entities/thug_knife.png');
ASSET_MANAGER.queueDownload('./img/entities/bodyguard.png');
ASSET_MANAGER.queueDownload('./img/entities/miniboss.png');

// weapons
ASSET_MANAGER.queueDownload('./img/weapons/bat00.png');
ASSET_MANAGER.queueDownload('./img/weapons/bat10.png');
ASSET_MANAGER.queueDownload('./img/weapons/bat20.png');
ASSET_MANAGER.queueDownload('./img/weapons/bat30.png');
ASSET_MANAGER.queueDownload('./img/weapons/knife00.png');
ASSET_MANAGER.queueDownload('./img/weapons/knife10.png');
ASSET_MANAGER.queueDownload('./img/weapons/knife20.png');
ASSET_MANAGER.queueDownload('./img/weapons/knife30.png');
ASSET_MANAGER.queueDownload('./img/weapons/gun00.png');
ASSET_MANAGER.queueDownload('./img/weapons/gun10.png');
ASSET_MANAGER.queueDownload('./img/weapons/gun20.png');
ASSET_MANAGER.queueDownload('./img/weapons/gun30.png');
ASSET_MANAGER.queueDownload('./img/weapons/bullet.png');
ASSET_MANAGER.queueDownload('./img/weapons/bullet_alt.png');

ASSET_MANAGER.queueDownload('./img/Mailbox.png');

ASSET_MANAGER.downloadAll(function () {
    console.log('loading game...');
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var manager = new SceneManager(gameEngine);
    gameEngine.addEntity(manager);

    gameEngine.init(ctx);
    gameEngine.start();
});
