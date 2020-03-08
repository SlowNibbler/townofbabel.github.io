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

function getTrans(weapon) {
    return (71.4 - (weapon.scale * 71.4)) / 2;
}

function SceneManager(game) {
    this.manager = true;
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
                this.changeBackground(this.menus.story1);
                this.menus.fade.active = false;
                this.menus.fade.tofrom = 'toBlack';
            }
        }
        else if (this.activeBG === this.menus.story1 && this.game.click)
            this.changeBackground(this.menus.story2);
        else if (this.activeBG === this.menus.story2 && this.game.click) {
            this.buildLevelOne(this.game);
            this.bossDead = false;
            this.player.weapon = new Weapon(this.game, this.player, 0, 0);
            this.player.x = 515;
            this.player.y = 470;
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
                this.level.clear = true;
                if (this.game.enter) {
                    this.level.clear = false;
                    this.player.x = 515;
                    this.player.y = 470;
                    this.changeBackground(this.menus.title);
                }
            }
        }
        if (!this.activeBG.menu) {
            if (this.activeBG.enemies.length == 0) {
                this.updateLevel = true;
                if (this.game.player.interact) this.swapHeld++;
                else this.swapHeld = 0;
                if (this.swapHeld > 15 && distance(this.player, this.activeBG.drop) < 100) {
                    var old = this.player.weapon;
                    if (old.ability) old.ability.removeFromWorld = true;
                    this.player.weapon = this.activeBG.drop;
                    if (this.player.weapon.ability) {
                        this.player.weapon.ability.removeFromWorld = false;
                        this.game.addEntity(this.player.weapon.ability);
                    }
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
                        this.player.faces = 34;
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
    if (this.player.weapon.ability)
        this.player.weapon.ability.removeFromWorld = false;
    this.player.health.removeFromWorld = false;
    if (this.level.clear)
        this.menus.cont.removeFromWorld = false;
    this.menus.fade.removeFromWorld = false;

    // add entities back into game engine
    if (!this.activeBG.menu) {
        for (var i = 0; i < this.activeBG.enemies.length; i++)
            this.game.addEntity(this.activeBG.enemies[i]);
        this.game.addEntity(this.activeBG.door);
        this.game.addEntity(this.arrow);
        this.game.addEntity(this.player);
        for (var i = 0; i < this.activeBG.walls.length; i++)
            this.game.addEntity(this.activeBG.walls[i]);
        this.game.addEntity(this.player.UI);
        this.game.addEntity(this.activeBG.drop);
        this.game.addEntity(this.player.weapon);
        this.game.addEntity(this.player.dashInd);
        if (this.player.weapon.ability)
            this.game.addEntity(this.player.weapon.ability);
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
                        this.player.y = 720 - this.player.radius - 10;
                    }
                }
                else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                    this.changeBackground(this.activeBG.neighbors[2]);
                    this.player.y = this.player.radius + 10;
                }
            }
            else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius + 10;
            }
        }
        else if (this.activeBG.neighbors[3]) {
            if (this.activeBG.neighbors[3].enemies.length == 0) {
                if (this.player.collideTop() && this.activeBG.neighbors[0]) {
                    if (this.activeBG.neighbors[0].type == 'street') {
                        this.changeBackground(this.activeBG.neighbors[0]);
                        this.player.y = 720 - this.player.radius - 10;
                    }
                }
                else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                    this.changeBackground(this.activeBG.neighbors[2]);
                    this.player.y = this.player.radius + 10;
                }
            }
            else if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius + 10;
            }
        }
        else if (this.activeBG === this.levels[this.level.current].streets[4]) {
            if (this.player.collideBottom() && this.activeBG.neighbors[2]) {
                this.changeBackground(this.activeBG.neighbors[2]);
                this.player.y = this.player.radius + 10;
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
    if (this.player.weapon.ability)
        this.player.weapon.ability.removeFromWorld = true;
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
