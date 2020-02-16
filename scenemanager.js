function Menu(game, image) {
    this.menu = true;
    this.image = ASSET_MANAGER.getAsset(image);
    this.animation = new Animation(ASSET_MANAGER.getAsset(image), 0, 0, 640, 360, 0.25, 8, true, false);
    this.rotation = 0;
    Entity.call(this, game, 320, 180);
}

Menu.prototype = new Entity();
Menu.prototype.constructor = Menu;

Menu.prototype.update = function () {
}

Menu.prototype.draw = function (ctx) {
    // ctx.drawImage(this.image, 0, 0);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation, 2);
}

function Background(game, image, weapon, lvl) {
    this.image = ASSET_MANAGER.getAsset(image);
    this.drop = weapon;
    this.level = lvl;
    this.walls = [];
    this.enemies = [];
    this.neighbors = [];
    Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0);
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

function Arrow(game, manager) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/backgrounds/arrow.png'), 0, 0, 100, 100, 0.25, 4, true, false);
    this.manager = manager;
    this.rotation = 0;
    Entity.call(this, game, 640, 360);
}

Arrow.prototype = new Entity();
Arrow.prototype.constructor = Arrow;

Arrow.prototype.update = function () {
    if (this.manager.level.clear) {
        if (this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[4]) {
            this.x = 640;
            this.y = 640;
            this.rotation = Math.PI / 2;
        }
        else if (this.manager.activeBG === this.manager.levels[this.manager.level.current].streets[4]
            || this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[1]
            || this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[3]
            || this.manager.activeBG === this.manager.levels[this.manager.level.current]
                .houses[this.manager.levels[this.manager.level.current].houses.length - 1]) {
            this.x = 1200;
            this.y = 360;
            this.rotation = 0;
        }
        else if (this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[0]
            || this.manager.activeBG === this.manager.levels[this.manager.level.current].houses[2]) {
            this.x = 80;
            this.y = 360;
            this.rotation = Math.PI;
        }
        else {
            this.x = 640;
            this.y = 80;
            this.rotation = -Math.PI / 2;
        }
    }
    Entity.prototype.update.call(this);
}

Arrow.prototype.draw = function (ctx) {
    if (this.manager.level.clear)
        this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    Entity.prototype.draw.call(this);
}

function buildStartRoom(level) {
    level.streets[0].neighbors[2] = level.streets[5];
    level.streets[5].neighbors[0] = level.streets[0];
    level.houses[5].neighbors[1] = level.streets[5];
    level.streets[5].neighbors[3] = level.houses[5];
}

function findDif(weapon) {
    return (71.4 - (weapon.scale * 71.4)) / 2;
}

function SceneManager(game) {
    this.game = game;
    this.levels = [];
    this.level = { current: 0, clear: false };
    this.menus = {};
    this.player = new Frump(game);
    this.arrow = new Arrow(game, this);

    this.menus.start = new Menu(game, './img/menus/title_orig.png');
    this.menus.win = new Menu(game, './img/menus/win.png');
    this.menus.lose = new Menu(game, './img/menus/lose.png');

    for (var i = 0; i < 4; i++) this.buildLevel(i);
    this.levels[0].streets.push(new Background(game, './img/backgrounds/street00.png', new Bat(game, 0), 0));
    this.levels[0].houses.push(new Background(game, './img/backgrounds/house00.png', new Knife(game, 0), 0));
    buildStartRoom(this.levels[0]);

    // this.levels[0].streets[0].walls.push(new Wall(game, 0, 0, 240, 180));
    // this.levels[0].streets[0].walls.push(new Wall(game, 226, 180, 14, 310));
    // this.levels[0].streets[0].walls.push(new Wall(game, 226, 607, 14, 113));
    // this.levels[0].streets[0].walls.push(new Wall(game, 145, 607, 81, 10));
    // this.levels[0].streets[0].walls.push(new Mailbox(game, 200));
    // for (var i = 0; i < this.levels.length; i++) {
    //     for (var j = 0; j < this.levels[i].streets.length; j++) {
    //         // this.levels[i].streets[j].enemies.push(new Dog(game));
    //         // this.levels[i].streets[j].enemies.push(new Bodyguard(game));
    //         for (var k = 0; k < Math.floor(Math.random()*2)+1; k++)
    //             this.levels[i].streets[j].enemies.push(new Thug(this.game, Math.floor(Math.random()*2)));
    //     }
    // }

    this.activeBG = this.menus.start;
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
        if (this.game.click) this.changeBackground(this.levels[0].houses[5]);
    }
    else {
        for (var i = this.activeBG.enemies.length - 1; i >= 0; --i) {
            if (this.activeBG.enemies[i].health <= 0) {
                this.activeBG.enemies[i].removeFromWorld = true;
                this.activeBG.enemies.splice(i, 1);
            }
        }
        if (this.levels[this.level.current].houses[4].enemies.length == 0)
            this.level.clear = true;
        if (this.activeBG.enemies.length == 0) {
            this.updateLevel = true;
            if (this.game.player.interact) this.swapHeld++;
            else this.swapHeld = 0;
            if (this.swapHeld > 60 && distance(this.player, this.activeBG.drop) < 100) {
                var old = this.player.weapon;
                this.player.weapon = this.activeBG.drop;
                this.player.weapon.floating = false;
                var dif = findDif(this.player.weapon);
                this.player.weapon.x = dif - 5;
                this.player.weapon.y = 15 + dif;

                old.x = this.player.x;
                old.y = this.player.y;
                old.floating = true;
                this.activeBG.drop = old;
                this.swapHeld = 0;
            }
        }
        if (this.updateLevel) {
            this.activeBG.drop.hidden = false;
            this.updateLevel = false;
        }
    }
    // if (this.activeBG.level == -1 && this.game.click)
    //     this.changeBackground(this.levels[0].houses[5]);
    // for (var i = this.activeBG.enemies.length - 1; i >= 0; --i) {
    //     if (this.activeBG.enemies[i].health <= 0) {
    //         this.activeBG.enemies[i].removeFromWorld = true;
    //         this.activeBG.enemies.splice(i, 1);
    //     }
    // }
    // if (this.levels[this.level.current].houses[4].enemies.length == 0)
    //     this.level.clear = true;
    // if (this.activeBG.level != -1 && this.activeBG.enemies.length == 0) {
    //     console.log('ooops');
    //     this.updateLevel = true;
    //     if (this.game.player.interact) this.swapHeld++;
    //     else this.swapHeld = 0;
    //     if (this.swapHeld > 90 && distance(this.player, this.activeBG.drop) < 100) {
    //         this.player.weapon.hidden = true;
    //         this.player.weapon = this.activeBG.drop;
    //         this.player.weapon.floating = false;
    //         this.player.weapon.x = 5;
    //         this.player.weapon.y = 30;
    //         this.swapHeld = 0;
    //     }
    // }
    // if (this.updateLevel) {
    //     this.activeBG.drop.hidden = false;
    //     this.updateLevel = false;
    // }
    this.checkBounds();
    // if (this.player.health.current <= 0) {
    //     for (var i = 0; i < this.activeBG.enemies.length; i++)
    //         this.activeBG.enemies[i].removeFromWorld = true;
    //     this.activeBG.enemies = [];
    //     for (var i = 0; i < Math.floor(Math.random()*2); i++)
    //         this.activeBG.enemies.push(new Thug(this.game));
    //     this.player.x = 65;
    //     this.player.y = 430;
    //     this.player.health.current = this.player.health.max;
    //     this.changeBackground(this.menus.lose);
    // }
    // else if (this.activeBG.enemies.length == 0 && this.activeBG.level != -1) {
    //     for (var i = 0; i < Math.floor(Math.random()*2); i++)
    //         this.activeBG.enemies.push(new Thug(this.game));
    //     this.player.x = 65;
    //     this.player.y = 430;
    //     this.changeBackground(this.menus.win);
    // }
    Entity.prototype.update.call(this);
}

SceneManager.prototype.draw = function (ctx) {
}

SceneManager.prototype.updateBackground = function () {
    // reset entities to NOT remove from world
    this.prevBG.removeFromWorld = false;
    if (!this.prevBG.menu) {
        for (var i = 0; i < this.prevBG.walls.length; i++)
            this.prevBG.walls[i].removeFromWorld = false;
        for (var i = 0; i < this.prevBG.enemies.length; i++)
            this.prevBG.enemies[i].removeFromWorld = false;
        this.prevBG.drop.removeFromWorld = false;
    }
    this.arrow.removeFromWorld = false;
    this.player.removeFromWorld = false;
    this.player.weapon.removeFromWorld = false;
    this.player.health.removeFromWorld = false;

    // add entities back into game engine
    this.game.addEntity(this.player.weapon);
    this.game.addEntity(this.player);
    this.game.addEntity(this.arrow);
    this.game.addEntity(this.player.health);
    this.changedBG = false;
    this.level.clear = false;
}

SceneManager.prototype.startGame = function () {
    this.game.addEntity(this.activeBG);
    this.start = false;
}

SceneManager.prototype.checkBounds = function () {
    if (this.player.collideLeft() || this.player.collideRight()) {
        if (this.activeBG.enemies.length == 0) {
            if (this.player.collideRight() && this.level.clear
                && this.activeBG === this.levels[this.level.current].streets[4]) {
                this.changeBackground(this.levels[this.level.current + 1].streets[0]);
                this.level.current++;
                this.player.x = this.player.y * (16 / 9);
                this.player.y = 720 - this.player.radius * 3;
                var vel = this.player.velocity.x;
                this.player.velocity.x = this.player.velocity.y;
                this.player.velocity.y = -vel;
            }
            else if (this.player.collideLeft() && this.activeBG.neighbors[3]) {
                this.changeBackground(this.activeBG.neighbors[3]);
                this.player.x = 1280 - this.player.radius;
            }
            else if (this.player.collideRight() && this.activeBG.neighbors[1]) {
                this.changeBackground(this.activeBG.neighbors[1]);
                this.player.x = this.player.radius;
            }
        }
    }
    else if (this.player.collideTop() || this.player.collideBottom()) {
        if (this.activeBG.enemies.length == 0) {
            if (this.player.collideTop() && this.activeBG.neighbors[0]) {
                this.changeBackground(this.activeBG.neighbors[0]);
                this.player.y = 720 - this.player.radius;
            }
            else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius;
            }
        }
    }
}

SceneManager.prototype.changeBackground = function (nextBG) {
    // remove entities from game engine
    if (!this.activeBG.menu) {
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.activeBG.walls[i].removeFromWorld = true;
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.activeBG.enemies[i].removeFromWorld = true;
        this.activeBG.drop.removeFromWorld = true;
    }
    this.activeBG.removeFromWorld = true;
    this.arrow.removeFromWorld = true;
    this.player.removeFromWorld = true;
    this.player.weapon.removeFromWorld = true;
    this.player.health.removeFromWorld = true;
    this.prevBG = this.activeBG;
    this.activeBG = nextBG;

    // add new entities to game engine
    this.game.addEntity(this.activeBG);
    if (!this.activeBG.menu) {
        if (this.activeBG.level != -1) {
            for (var i = 0; i < this.activeBG.walls.length; i++)
                this.game.addEntity(this.activeBG.walls[i]);
            for (var i = 0; i < this.activeBG.enemies.length; i++)
                this.game.addEntity(this.activeBG.enemies[i]);
        }
        this.game.addEntity(this.activeBG.drop);
    }
    this.changedBG = true;
}

SceneManager.prototype.buildLevel = function (lvl) {
    this.levels[lvl] = { streets: [], houses: [] };

    // for (var i = 0; i < 5; i++) {
    //     this.levels[lvl].streets[i] = new Background(this.game, ('./img/backgrounds/street' + lvl
    //         + (Math.floor(Math.random() * 3) + 1) + '.png'), (new Knife(this.game, lvl)), lvl);
    //     this.levels[lvl].houses[i] = new Background(this.game, ('./img/backgrounds/house' + lvl
    //         + (Math.floor(Math.random() * 3) + 1) + '.png'), (new Bat(this.game, lvl)), lvl);
    // }

    this.levels[lvl].streets[0] = new Background(this.game, ('./img/backgrounds/street' + lvl + '1.png'), new Knife(this.game, lvl), lvl);
    this.levels[lvl].streets[1] = new Background(this.game, ('./img/backgrounds/street' + lvl + '2.png'), new Knife(this.game, lvl), lvl);
    this.levels[lvl].streets[2] = new Background(this.game, ('./img/backgrounds/street' + lvl + '3.png'), new Knife(this.game, lvl), lvl);
    this.levels[lvl].streets[3] = new Background(this.game, ('./img/backgrounds/street' + lvl + '4.png'), new Knife(this.game, lvl), lvl);
    this.levels[lvl].streets[4] = new Background(this.game, ('./img/backgrounds/street' + lvl + '5.png'), new Knife(this.game, lvl), lvl);

    this.levels[lvl].houses[0] = new Background(this.game, ('./img/backgrounds/house' + lvl + '1.png'), new Bat(this.game, lvl), lvl);
    this.levels[lvl].houses[1] = new Background(this.game, ('./img/backgrounds/house' + lvl + '2.png'), new Bat(this.game, lvl), lvl);
    this.levels[lvl].houses[2] = new Background(this.game, ('./img/backgrounds/house' + lvl + '3.png'), new Bat(this.game, lvl), lvl);
    this.levels[lvl].houses[3] = new Background(this.game, ('./img/backgrounds/house' + lvl + '4.png'), new Bat(this.game, lvl), lvl);
    this.levels[lvl].houses[4] = new Background(this.game, ('./img/backgrounds/house' + lvl + '5.png'), new Bat(this.game, lvl), lvl);

    // enemies
    // this.levels[lvl].houses[4].enemies.push(new Dog(this.game));
    // this.levels[lvl].houses[4].enemies.push(new Thug(this.game, 0));
    // this.levels[lvl].houses[4].enemies.push(new Thug(this.game, 1));
    // this.levels[lvl].houses[4].enemies.push(new Bodyguard(this.game));

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