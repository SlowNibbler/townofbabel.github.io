function Menu(game, image) {
    this.menu = true;
    this.image = ASSET_MANAGER.getAsset(image);

    Entity.call(this, game, 320, 180);
}

Menu.prototype = new Entity();
Menu.prototype.constructor = Menu;

Menu.prototype.update = function () {
}

Menu.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0);
}

function TitleScreen(game) {
    this.menu = true;
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/menus/title.png'), 0, 0, 1280, 720, 0.25, 8, true, false);
    this.rotation = 0;

    Entity.call(this, game, 640, 360);
}

TitleScreen.prototype = new Entity();
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.update = function () {
}

TitleScreen.prototype.draw = function (ctx) {
    this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
}

function Fade(game, tofrom) {
    this.menu = true;
    this.tofrom = tofrom;
    this.toBlack = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 0, 0, 1280, 720, 0.2, 5, false, false);
    this.fromBlack = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 0, 0, 1280, 720, 0.2, 5, false, true);
    this.black = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 5120, 0, 1280, 720, 1, 1, true, true);
    this.clear = new Animation(ASSET_MANAGER.getAsset('./img/menus/fadeblack.png'), 0, 0, 1, 1, 1, 1, true, true);
    this.rotation = 0;
    this.active = false;
    Entity.call(this, game, 640, 360);
}

Fade.prototype = new Entity();
Fade.prototype.constructor = Fade;

Fade.prototype.update = function () {
    if (this.toBlack.isDone()) {
        this.toBlack.elapsedTime = 0;
        this.tofrom = 'black';
        this.active = false;
    }
    if (this.fromBlack.isDone()) {
        this.fromBlack.elapsedTime = 0;
        this.tofrom = 'clear';
        this.active = false;
    }
}

Fade.prototype.draw = function (ctx) {
    if (this.tofrom == 'toBlack')
        this.toBlack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else if (this.tofrom == 'fromBlack')
        this.fromBlack.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else if (this.tofrom == 'black')
        this.black.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else
        this.clear.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
}

function SelectDif(game) {
    this.menu = true;
    this.none = ASSET_MANAGER.getAsset('./img/menus/none_dif.png');
    this.casual = ASSET_MANAGER.getAsset('./img/menus/casual_dif.png');
    this.classic = ASSET_MANAGER.getAsset('./img/menus/classic_dif.png');
    this.hover = 'none';

    Entity.call(this, game, 0, 0);
}

SelectDif.prototype = new Entity();
SelectDif.prototype.constructor = SelectDif;

SelectDif.prototype.update = function () {
    if (this.game.mouse.x > 525 && this.game.mouse.x < 755) {
        if (this.game.mouse.y > 300 && this.game.mouse.y < 390)
            this.hover = 'casual';
        else if (this.game.mouse.y > 390 && this.game.mouse.y < 480)
            this.hover = 'classic';
        else
            this.hover = 'none';
    }
    else
        this.hover = 'none';
}

SelectDif.prototype.draw = function (ctx) {
    if (this.hover == 'casual')
        ctx.drawImage(this.casual, 0, 0);
    else if (this.hover == 'classic')
        ctx.drawImage(this.classic, 0, 0);
    else
        ctx.drawImage(this.none, 0, 0);
}

function Background(game, image, weapon, door, type) {
    this.image = ASSET_MANAGER.getAsset(image);
    this.drop = weapon;
    this.walls = [];
    this.enemies = [];
    this.neighbors = [];
    this.door = door;
    this.spawn = {};
    this.type = type;
    Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0);
}

function Roof(game, x, y, roofImage) {
    this.image = roofImage;
    Entity.call(this, game, x, y);
}

Roof.prototype = new Entity();
Roof.prototype.constructor = Roof;

Roof.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Roof.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Wall(game, x, y, w, h) {
    this.wall = true;
    this.w = w;
    this.h = h;
    Entity.call(this, game, x, y);
}

Wall.prototype = new Entity();
Wall.prototype.constructor = Wall;

Wall.prototype.update = function () {
}

Wall.prototype.draw = function (ctx) {
}

function Door(game, x, y, w, h) {
    this.door = true;
    this.w = w;
    this.h = h;
    Entity.call(this, game, x, y);
}

Door.prototype = new Entity();
Door.prototype.constructor = Door;

Door.prototype.update = function () {
}

Door.prototype.update = function (ctx) {
}

function Arrow(game, manager) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/backgrounds/arrow.png'), 0, 0, 50, 50, 0.25, 4, true, false);
    this.manager = manager;
    this.rotation = 0;
    Entity.call(this, game, 640, 360);
}

Arrow.prototype = new Entity();
Arrow.prototype.constructor = Arrow;

Arrow.prototype.update = function () {
    var displayBG = this.manager.activeBG;
    if (displayBG.type == 'street') {
        if (displayBG.neighbors[1]) {
            if (displayBG.neighbors[1].enemies.length > 0) {
                this.x = displayBG.spawn.x - 50;
                this.y = displayBG.spawn.y;
                this.rotation = 0;
            }
            else {
                this.x = 640;
                this.y = 60;
                this.rotation = -Math.PI / 2;
            }
        }
        else if (displayBG.neighbors[3]) {
            if (displayBG.neighbors[3].enemies.length > 0) {
                this.x = displayBG.spawn.x + 50;
                this.y = displayBG.spawn.y;
                this.rotation = Math.PI;
            }
            else {
                this.x = 640;
                this.y = 60;
                this.rotation = -Math.PI / 2;
            }
        }
    }
    else if (displayBG === this.manager.levels[this.manager.level.current].streets[4]) {
        if (displayBG.neighbors[0].enemies.length > 0) {
            this.x = displayBG.spawn.x;
            this.y = displayBG.spawn.y + 50;
            this.rotation = -Math.PI / 2;
        }
        else {
            this.x = 1220;
            this.y = 360;
            this.rotation = 0;
        }
    }
    else if (displayBG === this.manager.levels[this.manager.level.current].houses[1]
        || displayBG === this.manager.levels[this.manager.level.current].houses[3]
        || displayBG === this.manager.levels[this.manager.level.current].houses[5]) {
        this.x = displayBG.spawn.x - 50;
        this.y = displayBG.spawn.y;
        this.rotation = 0;
    }
    else if (displayBG === this.manager.levels[this.manager.level.current].houses[0]
        || displayBG === this.manager.levels[this.manager.level.current].houses[2]) {
        this.x = displayBG.spawn.x + 50;
        this.y = displayBG.spawn.y;
        this.rotation = Math.PI;
    }
    else {
        this.x = displayBG.spawn.x;
        this.y = displayBG.spawn.y - 50;
        this.rotation = Math.PI / 2;
    }
}

Arrow.prototype.draw = function (ctx) {
    if (this.manager.activeBG.enemies.length == 0)
        this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
}

function getTrans(weapon) {
    return (71.4 - (weapon.scale * 71.4)) / 2;
}

function SceneManager(game) {
    this.game = game;
    this.difficulty = 0;
    this.levels = [];
    this.level = { current: 0, clear: false };
    this.player = new Frump(game);
    this.arrow = new Arrow(game, this);

    this.menus = {};
    this.menus.title = new TitleScreen(game);
    this.menus.dif = new SelectDif(game);
    this.menus.win = new Menu(game, './img/menus/roomclear.png');
    this.menus.lose = new Menu(game, './img/menus/game over.png');
    this.menus.story1 = new Menu(game, './img/menus/story1.png');
    this.menus.story2 = new Menu(game, './img/menus/story2.png');
    this.menus.cont = new Menu(game, './img/menus/continued.png');
    this.menus.fade = new Fade(game, 'toBlack');

    this.activeBG = this.menus.title;
    this.start = true;
    this.swapHeld = 0;
    Entity.call(this, game, 0, 0);
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.update = function () {
    if (this.changedBG) this.updateBackground();
    if (this.start) this.startGame();
    if (this.activeBG.menu) {
        if (this.activeBG === this.menus.title) {
            var hover = false;
            if (this.game.mouse.x > 630 && this.game.mouse.x < 1000
                && this.game.mouse.y > 480 && this.game.mouse.y < 660)
                hover = true;
            if (this.game.click && !this.menus.fade.active && hover) {
                this.menus.fade.tofrom = 'toBlack';
                this.game.addEntity(this.menus.fade);
                this.menus.fade.active = true;
            }
            if (this.menus.fade.tofrom == 'black') {
                this.menus.fade.active = false;
                this.menus.fade.tofrom = 'toBlack';
                this.changeBackground(this.menus.story1);
            }
        }
        else if (this.activeBG === this.menus.story1 && this.game.click)
            this.changeBackground(this.menus.story2);
        else if (this.activeBG === this.menus.story2 && this.game.click) {
            this.buildLevelOne(this.game);
            this.bossDead = false;
            this.player.health.current = this.player.health.max;
            this.player.alive = true;
            this.changeBackground(this.levels[0].houses[5]);
        }
        else if (this.activeBG === this.menus.lose && this.game.click)
            this.changeBackground(this.menus.title);
        // for difficulty selection - not fully implemented
        // if (this.activeBG === this.menus.title && this.game.click) {
        //     this.game.addEntity(this.menus.dif);
        //     this.activeBG = this.menus.dif;
        // }
        // else if (this.activeBG === this.menus.dif && this.game.click && this.menus.dif.hover != 'none') {
        //     if (this.menus.dif.hover == 'classic')
        //         this.difficulty = 1;
        //     this.changeBackground(this.levels[0].houses[5]);
        // }
    }
    else {
        if (!this.player.alive && !this.player.die)
            this.changeBackground(this.menus.lose);
        if (!this.activeBG.menu) {
            for (var i = this.activeBG.enemies.length - 1; i >= 0; --i) {
                var ent = this.activeBG.enemies[i];
                if (!ent.alive && !ent.die) {
                    if (ent.boss) {
                        this.bossDead = true;
                        this.game.addEntity(this.menus.win);
                    }
                    ent.removeFromWorld = true;
                    this.activeBG.enemies.splice(i, 1);
                }
                else if (this.bossDead) {
                    ent.removeFromWorld = true;
                    this.activeBG.enemies.splice(i, 1);
                }
            }
            if (this.bossDead) {
                this.level.clear = true;;
                if (this.game.click) {
                    this.level.clear = false;
                    this.player.x = 515;
                    this.player.y = 470;
                    this.changeBackground(this.menus.title);
                }
            }
            if (this.activeBG.enemies.length == 0) {
                this.updateLevel = true;
                if (this.game.player.interact) this.swapHeld++;
                else this.swapHeld = 0;
                if (this.swapHeld > 30 && distance(this.player, this.activeBG.drop) < 100) {
                    var old = this.player.weapon;
                    this.player.weapon = this.activeBG.drop;
                    this.player.weapon.floating = false;
                    var dif = getTrans(this.player.weapon);
                    this.player.weapon.x = dif - 5;
                    this.player.weapon.y = 15 + dif;

                    old.x = this.player.x;
                    old.y = this.player.y;
                    old.floating = true;
                    this.activeBG.drop = old;
                    this.swapHeld = 0;
                    if (this.player.weapon.type == 'knife')
                        this.player.faces = 33;
                    else if (this.player.weapon.type == 'bat')
                        this.player.faces = 28;
                }
            }
            if (this.updateLevel) {
                this.activeBG.drop.hidden = false;
                this.updateLevel = false;
            }
            this.checkBounds();
        }
    }
}

SceneManager.prototype.draw = function (ctx) {
}

function genEnemies(game, room, maxEnemies) {
    if (maxEnemies == 2) {
        var total = Math.floor(Math.random() * 2 + 1);
        if (total == 1)
            room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
        else {
            var numDogs = Math.floor(Math.random() * 2);
            if (numDogs == 1) {
                room.enemies.push(new Dog(game));
                room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
            }
            else {
                room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
            }
        }
    }
    else if (maxEnemies == 4) {
        var total = Math.floor(Math.random() * 3 + 2);
        if (total == 2) {
            room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
            room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
        }
        else {
            var numDogs = Math.floor(Math.random() * 2);
            if (numDogs == 1) {
                room.enemies.push(new Dog(game));
                for (var i = 0; i < total - 1; i++)
                    room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
            }
            else {
                for (var i = 0; i < total; i++)
                    room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
            }
        }
        
    }
    else {
        var total = Math.floor(Math.random() * 3 + 3);
        var numDogs = Math.floor(Math.random() * 2);
        if (total == 5) {
            var numBGs = Math.floor(Math.random() * 3);
            if (numBGs == 2) {
                if (numDogs == 1) {
                    room.enemies.push(new Dog(game));
                    room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Bodyguard(game));
                    room.enemies.push(new Bodyguard(game));
                }
                else {
                    for (var i = 0; i < 3; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Bodyguard(game));
                    room.enemies.push(new Bodyguard(game));
                }
            }
            else if (numBGs == 1) {
                if (numDogs == 1) {
                    room.enemies.push(new Dog(game));
                    for (var i = 0; i < 3; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Bodyguard(game));
                }
                else {
                    for (var i = 0; i < 4; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Bodyguard(game));
                }
            }
            else {
                if (numDogs == 1) {
                    room.enemies.push(new Dog(game));
                    for (var i = 0; i < 4; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                }
                else {
                    for (var i = 0; i < 5; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                }
            }
        }
        else if (total == 4) {
            var numBGs = Math.floor(Math.random() * 2);
            if (numBGs == 1) {
                if (numDogs == 1) {
                    room.enemies.push(new Dog(game));
                    room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Bodyguard(game));
                }
                else {
                    for (var i = 0; i < 3; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                    room.enemies.push(new Bodyguard(game));
                }
            }
            else {
                if (numDogs == 1) {
                    room.enemies.push(new Dog(game));
                    for (var i = 0; i < 3; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                }
                else {
                    for (var i = 0; i < 4; i++)
                        room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                }
            }
        }
        else {
            if (numDogs == 1) {
                room.enemies.push(new Dog(game));
                room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
                room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
            }
            else {
                for (var i = 0; i < 3; i++)
                    room.enemies.push(new Thug(game, Math.floor(Math.random() * 2)));
            }
        }
    }
}

SceneManager.prototype.buildLevelOne = function (game) {
    this.levels[0] = { streets: [], houses: [] };

    this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street01.png'),
        new Knife(game, 0), new Door(game, 1270, 439, 10, 112), 'street');
    this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street02.png'),
        new Knife(game, 0), new Door(game, 0, 156, 10, 114), 'street');
    this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street03.png'),
        new Knife(game, 0), new Door(game, 1270, 386, 10, 110), 'street');
    this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street04.png'),
        new Knife(game, 0), new Door(game, 0, 478, 10, 111), 'street');
    this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street05.png'),
        new Knife(game, 0), new Door(game, 600, 0, 111, 10), 'street');
    this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street00.png'),
        new Knife(game, 0), new Door(game, 0, 376, 10, 112), 'street');

    this.levels[0].houses[0] = new Background(game, ('./img/backgrounds/house01.png'),
        new Bat(game, 0), new Door(game, 0, 362, 10, 108), 'house');
    this.levels[0].houses[1] = new Background(game, ('./img/backgrounds/house02.png'),
        new Bat(game, 0), new Door(game, 1270, 312, 10, 109), 'house');
    this.levels[0].houses[2] = new Background(game, ('./img/backgrounds/house03.png'),
        new Bat(game, 0), new Door(game, 0, 297, 10, 109), 'house');
    this.levels[0].houses[3] = new Background(game, ('./img/backgrounds/house04.png'),
        new Bat(game, 0), new Door(game, 1270, 189, 10, 113), 'house');
    this.levels[0].houses[4] = new Background(game, ('./img/backgrounds/house05.png'),
        new Gun(game, Math.floor(Math.random() * 2)), new Door(game, 577, 710, 116, 10), 'house');
    this.levels[0].houses[5] = new Background(game, ('./img/backgrounds/house00.png'),
        new Bat(game, 0), new Door(game, 1270, 176, 10, 96), 'house');

    // house00 - Lil' Frump's House
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 0, 210, 720));
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 0, 548, 314));
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 0, 693, 175));
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 0, 1280, 127));
    this.levels[0].houses[5].walls.push(new Wall(game, 627, 281, 68, 439));
    this.levels[0].houses[5].walls.push(new Wall(game, 582, 437, 90, 282));
    this.levels[0].houses[5].walls.push(new Wall(game, 200, 430, 86, 60));
    this.levels[0].houses[5].walls.push(new Wall(game, 200, 483, 225, 256));
    this.levels[0].houses[5].walls.push(new Wall(game, 0, 693, 1280, 20));
    this.levels[0].houses[5].walls.push(new Wall(game, 880, 203, 142, 142));
    this.levels[0].houses[5].walls.push(new Wall(game, 809, 274, 53, 61));
    this.levels[0].houses[5].walls.push(new Wall(game, 1022, 227, 53, 61));
    this.levels[0].houses[5].walls.push(new Wall(game, 1250, 0, 30, 176));
    this.levels[0].houses[5].walls.push(new Wall(game, 1250, 272, 30, 450));
    this.levels[0].houses[5].walls.push(new Wall(game, 1181, 447, 52, 200));
    this.levels[0].houses[5].walls.push(new Wall(game, 989, 457, 94, 192));
    this.levels[0].houses[5].walls.push(new Wall(game, 788, 427, 92, 248));
    this.levels[0].houses[5].spawn = { x: 1240, y: 224 };

    // street00
    this.levels[0].streets[5].walls.push(new Wall(game, 226, 180, 14, 310));
    this.levels[0].streets[5].walls.push(new Wall(game, 226, 607, 14, 113));
    this.levels[0].streets[5].walls.push(new Wall(game, 145, 607, 81, 10));
    this.levels[0].streets[5].walls.push(new Wall(game, 0, 0, 54, 79));
    this.levels[0].streets[5].walls.push(new Wall(game, 0, 176, 244, 22));
    this.levels[0].streets[5].walls.push(new Wall(game, 720, 45, 205, 390));
    this.levels[0].streets[5].walls.push(new Wall(game, 1035, 0, 21, 164));
    this.levels[0].streets[5].walls.push(new Wall(game, 1035, 145, 245, 16));
    this.levels[0].streets[5].walls.push(new Wall(game, 1217, 0, 63, 720));
    this.levels[0].streets[5].walls.push(new Wall(game, 0, 235, 27, 141));
    this.levels[0].streets[5].walls.push(new Wall(game, 0, 488, 27, 232));
    this.levels[0].streets[5].walls.push(new Roof(game, 0, 182, './img/backgrounds/roof00.png'));
    this.levels[0].streets[5].spawn = { x: 40, y: 432 };

    // street01
    this.levels[0].streets[0].walls.push(new Wall(game, 0, 0, 55, 720));
    this.levels[0].streets[0].walls.push(new Wall(game, 1253, 0, 27, 120));
    this.levels[0].streets[0].walls.push(new Wall(game, 1033, 160, 247, 33));
    this.levels[0].streets[0].walls.push(new Wall(game, 1033, 160, 33, 269));
    this.levels[0].streets[0].walls.push(new Wall(game, 1033, 535, 33, 184));
    this.levels[0].streets[0].walls.push(new Wall(game, 1225, 191, 63, 248));
    this.levels[0].streets[0].walls.push(new Wall(game, 1225, 551, 63, 248));
    this.levels[0].streets[0].walls.push(new Roof(game, 1138, 110, './img/backgrounds/roof01.png'));
    this.levels[0].streets[0].spawn = { x: 1240, y: 495 };

    // street02
    this.levels[0].streets[1].walls.push(new Wall(game, 224, 0, 34, 150));
    this.levels[0].streets[1].walls.push(new Wall(game, 217, 372, 33, 348));
    this.levels[0].streets[1].walls.push(new Wall(game, 0, 650, 250, 70));
    this.levels[0].streets[1].walls.push(new Wall(game, 1032, 0, 22, 181));
    this.levels[0].streets[1].walls.push(new Wall(game, 1032, 161, 248, 20));
    this.levels[0].streets[1].walls.push(new Wall(game, 1250, 0, 31, 720));
    this.levels[0].streets[1].walls.push(new Wall(game, 0, 0, 56, 156));
    this.levels[0].streets[1].walls.push(new Wall(game, 0, 270, 56, 450));
    this.levels[0].streets[1].walls.push(new Roof(game, 0, 0, './img/backgrounds/roof02.png'));
    this.levels[0].streets[1].spawn = { x: 40, y: 214 };

    // street03
    this.levels[0].streets[2].walls.push(new Wall(game, 0, 0, 45, 334));
    this.levels[0].streets[2].walls.push(new Wall(game, 229, 0, 22, 720));
    this.levels[0].streets[2].walls.push(new Wall(game, 0, 496, 248, 36));
    this.levels[0].streets[2].walls.push(new Wall(game, 0, 558, 56, 162));
    this.levels[0].streets[2].walls.push(new Wall(game, 1037, 0, 37, 324));
    this.levels[0].streets[2].walls.push(new Wall(game, 1037, 0, 243, 40));
    this.levels[0].streets[2].walls.push(new Wall(game, 1037, 543, 29, 177));
    this.levels[0].streets[2].walls.push(new Wall(game, 1227, 0, 53, 386));
    this.levels[0].streets[2].walls.push(new Wall(game, 1227, 496, 53, 224));
    this.levels[0].streets[2].walls.push(new Roof(game, 1164, 9, './img/backgrounds/roof03.png'));
    this.levels[0].streets[2].spawn = { x: 1240, y: 441 };

    // street04
    this.levels[0].streets[3].walls.push(new Wall(game, 0, 203, 254, 37));
    this.levels[0].streets[3].walls.push(new Wall(game, 225, 203, 33, 203));
    this.levels[0].streets[3].walls.push(new Wall(game, 225, 629, 33, 91));
    this.levels[0].streets[3].walls.push(new Wall(game, 715, 237, 205, 389));
    this.levels[0].streets[3].walls.push(new Wall(game, 1147, 291, 133, 429));
    this.levels[0].streets[3].walls.push(new Wall(game, 0, 305, 42, 173));
    this.levels[0].streets[3].walls.push(new Wall(game, 0, 589, 42, 131));
    this.levels[0].streets[3].walls.push(new Roof(game, 0, 256, './img/backgrounds/roof04.png'));
    this.levels[0].streets[3].spawn = { x: 40, y: 533 };

    // street05
    this.levels[0].streets[4].walls.push(new Wall(game, 33, 250, 444, 236));
    this.levels[0].streets[4].walls.push(new Wall(game, 329, 0, 271, 29));
    this.levels[0].streets[4].walls.push(new Wall(game, 711, 0, 271, 29));
    this.levels[0].streets[4].walls.push(new Roof(game, 275, 0, './img/backgrounds/roof05.png'));
    this.levels[0].streets[4].spawn = { x: 655, y: 40 };

    // house01
    this.levels[0].houses[0].walls.push(new Wall(game, 0, 0, 1280, 34));
    this.levels[0].houses[0].walls.push(new Wall(game, 0, 685, 1280, 34));
    this.levels[0].houses[0].walls.push(new Wall(game, 0, 0, 34, 362));
    this.levels[0].houses[0].walls.push(new Wall(game, 0, 470, 34, 250));
    this.levels[0].houses[0].walls.push(new Wall(game, 0, 297, 379, 37));
    this.levels[0].houses[0].walls.push(new Wall(game, 341, 0, 37, 185));
    this.levels[0].houses[0].walls.push(new Wall(game, 654, 396, 37, 324));
    this.levels[0].houses[0].walls.push(new Wall(game, 690, 437, 95, 273));
    this.levels[0].houses[0].walls.push(new Wall(game, 880, 157, 214, 214));
    this.levels[0].houses[0].walls.push(new Wall(game, 1247, 0, 34, 720));
    this.levels[0].houses[0].spawn = { x: 40, y: 416 };

    // house02
    this.levels[0].houses[1].walls.push(new Wall(game, 0, 0, 1280, 34));
    this.levels[0].houses[1].walls.push(new Wall(game, 0, 685, 1280, 34));
    this.levels[0].houses[1].walls.push(new Wall(game, 0, 0, 37, 720));
    this.levels[0].houses[1].walls.push(new Wall(game, 324, 159, 43, 353));
    this.levels[0].houses[1].walls.push(new Wall(game, 795, 217, 43, 353));
    this.levels[0].houses[1].walls.push(new Wall(game, 1093, 0, 187, 100));
    this.levels[0].houses[1].walls.push(new Wall(game, 1244, 0, 36, 312));
    this.levels[0].houses[1].walls.push(new Wall(game, 1244, 421, 36, 300));
    this.levels[0].houses[1].spawn = { x: 1240, y: 367 };

    // house03
    this.levels[0].houses[2].walls.push(new Wall(game, 0, 0, 1280, 34));
    this.levels[0].houses[2].walls.push(new Wall(game, 0, 685, 1280, 34));
    this.levels[0].houses[2].walls.push(new Wall(game, 0, 0, 34, 297));
    this.levels[0].houses[2].walls.push(new Wall(game, 0, 406, 34, 314));
    this.levels[0].houses[2].walls.push(new Wall(game, 1247, 0, 34, 720));
    this.levels[0].houses[2].walls.push(new Wall(game, 339, 0, 37, 285));
    this.levels[0].houses[2].walls.push(new Wall(game, 743, 369, 37, 351));
    this.levels[0].houses[2].walls.push(new Wall(game, 900, 581, 259, 109));
    this.levels[0].houses[2].spawn = { x: 40, y: 352 };

    // house04
    this.levels[0].houses[3].walls.push(new Wall(game, 0, 0, 1280, 34));
    this.levels[0].houses[3].walls.push(new Wall(game, 0, 685, 1280, 34));
    this.levels[0].houses[3].walls.push(new Wall(game, 0, 0, 37, 720));
    this.levels[0].houses[3].walls.push(new Wall(game, 90, 0, 203, 90));
    this.levels[0].houses[3].walls.push(new Wall(game, 496, 0, 41, 283));
    this.levels[0].houses[3].walls.push(new Wall(game, 762, 134, 152, 152));
    this.levels[0].houses[3].walls.push(new Wall(game, 324, 482, 607, 41));
    this.levels[0].houses[3].walls.push(new Wall(game, 1247, 0, 34, 189));
    this.levels[0].houses[3].walls.push(new Wall(game, 1247, 302, 34, 418));
    this.levels[0].houses[3].spawn = { x: 1240, y: 245 };

    // house05
    this.levels[0].houses[4].walls.push(new Wall(game, 0, 0, 1280, 34));
    this.levels[0].houses[4].walls.push(new Wall(game, 0, 0, 37, 720));
    this.levels[0].houses[4].walls.push(new Wall(game, 1247, 0, 34, 720));
    this.levels[0].houses[4].walls.push(new Wall(game, 531, 0, 217, 286));
    this.levels[0].houses[4].walls.push(new Wall(game, 210, 481, 263, 37));
    this.levels[0].houses[4].walls.push(new Wall(game, 808, 481, 263, 37));
    this.levels[0].houses[4].walls.push(new Wall(game, 0, 688, 577, 32));
    this.levels[0].houses[4].walls.push(new Wall(game, 693, 688, 587, 32));
    this.levels[0].houses[4].walls.push(new Wall(game, 1065, 0, 23, 215));
    this.levels[0].houses[4].spawn = { x: 635, y: 680 };

    // scene connections
    this.buildLevel(0);
    this.levels[0].streets[0].neighbors[2] = this.levels[0].streets[5];
    this.levels[0].streets[5].neighbors[0] = this.levels[0].streets[0];
    this.levels[0].houses[5].neighbors[1] = this.levels[0].streets[5];
    this.levels[0].streets[5].neighbors[3] = this.levels[0].houses[5];

    genEnemies(game, this.levels[0].streets[5], 2);
    for (var i = 0; i < 5; i++)
        genEnemies(game, this.levels[0].streets[i], 2);
    genEnemies(game, this.levels[0].houses[0], 4);
    genEnemies(game, this.levels[0].houses[1], 4);
    genEnemies(game, this.levels[0].houses[2], 5);
    genEnemies(game, this.levels[0].houses[3], 5);
    var dogs = [new Dog(game), new Dog(game), new Dog(game), new Dog(game), new Dog(game), new Dog(game)];
    for (var i = 0; i < dogs.length; i++) {
        dogs[i].caged = true;
        dogs[i].engage = true;
        this.levels[0].houses[4].enemies.push(dogs[i]);
    }
    this.levels[0].houses[4].enemies.push(new MiniBoss(game, dogs));
}

SceneManager.prototype.updateBackground = function () {
    // reset entities to NOT remove from world
    this.prevBG.removeFromWorld = false;
    if (!this.prevBG.menu) {
        for (var i = 0; i < this.prevBG.walls.length; i++)
            this.prevBG.walls[i].removeFromWorld = false;
        this.prevBG.door.removeFromWorld = false;
        for (var i = 0; i < this.prevBG.enemies.length; i++)
            this.prevBG.enemies[i].removeFromWorld = false;
        this.prevBG.drop.removeFromWorld = false;
    }
    this.arrow.removeFromWorld = false;
    this.player.removeFromWorld = false;
    this.player.UI.removeFromWorld = false;
    this.player.dashInd.removeFromWorld = false;
    this.player.weapon.removeFromWorld = false;
    this.player.health.removeFromWorld = false;
    if (this.level.clear)
        this.menus.cont.removeFromWorld = false;
    this.menus.fade.removeFromWorld = false;

    // add entities back into game engine
    if (!this.activeBG.menu) {
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.game.addEntity(this.activeBG.enemies[i]);
        this.game.addEntity(this.player);
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.game.addEntity(this.activeBG.walls[i]);
        this.game.addEntity(this.activeBG.door);
        this.game.addEntity(this.player.UI);
        this.game.addEntity(this.player.dashInd);
        this.game.addEntity(this.player.weapon);
        this.game.addEntity(this.activeBG.drop);
        this.game.addEntity(this.arrow);
        this.game.addEntity(this.player.health);
    }
    if (this.level.clear)
        this.game.addEntity(this.menus.cont);
    if (this.prevBG === this.menus.story2)
        this.game.addEntity(new Fade(this.game, 'fromBlack'));
    this.changedBG = false;
}

SceneManager.prototype.startGame = function () {
    this.game.addEntity(this.activeBG);
    this.start = false;
}

SceneManager.prototype.checkBounds = function () {
    if (this.player.collide(this.activeBG.door) && this.activeBG.enemies.length == 0) {
        if (this.activeBG.door.x == 0)
            this.changeBackground(this.activeBG.neighbors[3])
        else if (this.activeBG.door.x == 1270)
            this.changeBackground(this.activeBG.neighbors[1])
        else if (this.activeBG.door.y == 0)
            this.changeBackground(this.activeBG.neighbors[0])
        else
            this.changeBackground(this.activeBG.neighbors[2])
        this.player.x = this.activeBG.spawn.x;
        this.player.y = this.activeBG.spawn.y;
    }
    else if ((this.player.collideTop() || this.player.collideBottom())
        && this.activeBG.type == 'street' && this.activeBG.enemies.length == 0) {
        if (this.activeBG.neighbors[1]) {
            if (this.activeBG.neighbors[1].enemies.length == 0) {
                if (this.player.collideTop() && this.activeBG.neighbors[0]) {
                    if (this.activeBG.neighbors[0].type == 'street') {
                        this.changeBackground(this.activeBG.neighbors[0]);
                        this.player.y = 720 - this.player.radius;
                    }
                }
                else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                    this.changeBackground(this.activeBG.neighbors[2]);
                    this.player.y = this.player.radius;
                }
            }
        }
        else if (this.activeBG.neighbors[3]) {
            if (this.activeBG.neighbors[3].enemies.length == 0) {
                if (this.player.collideTop() && this.activeBG.neighbors[0]) {
                    if (this.activeBG.neighbors[0].type == 'street') {
                        this.changeBackground(this.activeBG.neighbors[0]);
                        this.player.y = 720 - this.player.radius;
                    }
                }
                else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                    this.changeBackground(this.activeBG.neighbors[2]);
                    this.player.y = this.player.radius;
                }
            }
        }
    }
}

SceneManager.prototype.changeBackground = function (nextBG) {
    // remove entities from game engine
    if (!this.activeBG.menu) {
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.activeBG.walls[i].removeFromWorld = true;
        this.activeBG.door.removeFromWorld = true;
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.activeBG.enemies[i].removeFromWorld = true;
        this.activeBG.drop.removeFromWorld = true;
    }
    this.activeBG.removeFromWorld = true;
    this.arrow.removeFromWorld = true;
    this.player.removeFromWorld = true;
    this.player.UI.removeFromWorld = true;
    this.player.dashInd.removeFromWorld = true;
    this.player.weapon.removeFromWorld = true;
    this.player.health.removeFromWorld = true;
    if (this.level.clear)
        this.menus.cont.removeFromWorld = true;
    this.menus.fade.removeFromWorld = true;
    this.prevBG = this.activeBG;
    this.activeBG = nextBG;

    // add new background
    this.game.addEntity(this.activeBG);
    this.changedBG = true;
}

SceneManager.prototype.buildLevel = function (lvl) {
    // connections
    this.levels[lvl].streets[0].neighbors[0] = this.levels[lvl].streets[1];
    this.levels[lvl].streets[0].neighbors[1] = this.levels[lvl].houses[0];
    this.levels[lvl].houses[0].neighbors[3] = this.levels[lvl].streets[0];
    for (var i = 1; i < 4; i++) {
        this.levels[lvl].streets[i].neighbors[0] = this.levels[lvl].streets[(i + 1)];
        this.levels[lvl].streets[i].neighbors[2] = this.levels[lvl].streets[(i - 1)];
        if (i == 2) {
            this.levels[lvl].streets[i].neighbors[1] = this.levels[lvl].houses[i];
            this.levels[lvl].houses[i].neighbors[3] = this.levels[lvl].streets[i];
        }
        else {
            this.levels[lvl].streets[i].neighbors[3] = this.levels[lvl].houses[i];
            this.levels[lvl].houses[i].neighbors[1] = this.levels[lvl].streets[i];
        }
    }
    this.levels[lvl].streets[4].neighbors[0] = this.levels[lvl].houses[4];
    this.levels[lvl].streets[4].neighbors[2] = this.levels[lvl].streets[3];
    this.levels[lvl].houses[4].neighbors[2] = this.levels[lvl].streets[4];
}