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

function Roof(game, x, y, image) {
    this.image = ASSET_MANAGER.getAsset(image);
    Entity.call(this, game, x, y);
}

Roof.prototype = new Entity();
Roof.prototype.constructor = Roof;

Roof.prototype.update = function () {
}

Roof.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, this.x, this.y);
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
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if ((ent.player || ent.enemy) && !ent.manager && !ent.ability) {
            if (this.collide(ent)) {
                if (this.side == 'left' || this.side == 'right') {
                    ent.velocity.x = 0;
                    if (this.side == 'left') ent.x = this.x - ent.radius;
                    else ent.x = this.x + this.w + ent.radius;
                }
                else if (this.side == 'top' || this.side == 'bottom') {
                    ent.velocity.y = 0;
                    if (this.side == 'top') ent.y = this.y - ent.radius;
                    else ent.y = this.y + this.h + ent.radius;
                }
                else if (this.side == 'topleft' || this.side == 'topright'
                    || this.side == 'bottomleft' || this.side == 'bottomright') {
                    ent.velocity.x = -ent.velocity.x / friction;
                    ent.velocity.y = -ent.velocity.y / friction;
                    if (this.side == 'topleft') {
                        var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                        ent.x = this.x + ent.radius * Math.cos(atan);
                        ent.y = this.y + ent.radius * Math.sin(atan);
                    }
                    else if (this.side == 'topright') {
                        var atan = Math.atan2(ent.y - this.y, ent.x - (this.x + this.w));
                        ent.x = this.x + this.w + ent.radius * Math.cos(atan);
                        ent.y = this.y + ent.radius * Math.sin(atan);
                    }
                    else if (this.side == 'bottomleft') {
                        var atan = Math.atan2(ent.y - (this.y + this.h), ent.x - this.x);
                        ent.x = this.x + ent.radius * Math.cos(atan);
                        ent.y = this.y + this.h + ent.radius * Math.sin(atan);
                    }
                    else {
                        var atan = Math.atan2(ent.y - (this.y + this.h), ent.x - (this.x + this.w));
                        ent.x = this.x + this.w + ent.radius * Math.cos(atan);
                        ent.y = this.y + this.h + ent.radius * Math.sin(atan);
                    } 
                }
                else {
                    if (this.w < this.h) {
                        ent.velocity.x = 0;
                        if (ent.x < 640)
                            ent.x = this.x + this.w + ent.radius;
                        else
                            ent.x = this.x - ent.radius;
                    }
                    else {
                        ent.velocity.y = 0;
                        if (ent.y < 360)
                            ent.y = this.y - ent.radius;
                        else
                            ent.y = this.y + this.h + ent.radius;
                    }
                }
            }
        }
    }
}

Wall.prototype.draw = function (ctx) {
}

Wall.prototype.collide = function (other) {
    if (other.player || other.enemy) {
        if (this.x > other.x) {
            if (this.y > other.y) {
                this.side = 'topleft';
                return distance(this, other) < other.radius;
            }
            else if (other.y > this.y + this.h) {
                this.side = 'bottomleft';
                return distance(other, this.x, this.y + this.h) < other.radius;
            }
            else {
                this.side = 'left';
                return distance(other, this.x, other.y) <= other.radius;
            }
        }
        else if (other.x > this.x + this.w) {
            if (this.y > other.y) {
                this.side = 'topright';
                return distance(other, this.x + this.w, this.y) < other.radius;
            }
            else if (other.y > this.y + this.h) {
                this.side = 'bottomright';
                return distance(other, this.x + this.w, this.y + this.h) < other.radius;
            }
            else {
                this.side = 'right';
                return distance(other, this.x + this.w, other.y) <= other.radius;
            }
        }
        else {
            if (this.y > other.y) {
                this.side = 'top';
                return distance(other, other.x, this.y) <= other.radius;
            }
            else if (other.y > this.y + this.h) {
                this.side = 'bottom';
                return distance(other, other.x, this.y + this.h) <= other.radius;
            }
            else
                return true;
        }
    }
}

function Column(game, x, y, radius, image) {
    this.column = true;
    if (image === undefined) this.image = false;
    else this.image = ASSET_MANAGER.getAsset(image);
    this.radius = radius;
    Entity.call(this, game, x, y);
}

Column.prototype = new Entity();
Column.prototype.constructor = Column;

Column.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if ((ent.player || ent.enemy) && !ent.manager && !ent.ability) {
            if (this.collide(ent)) {
                var atan = Math.atan2(this.y - ent.y, this.x - ent.x);
                var difX = Math.cos(atan);
                var difY = Math.sin(atan);
                var delta = this.radius + ent.radius - distance(this, ent);
                ent.velocity.x = -ent.velocity.x / friction;
                ent.velocity.y = -ent.velocity.y / friction;
                ent.x -= delta * difX;
                ent.y -= delta * difY;
            }
        }
    }
}

Column.prototype.draw = function (ctx) {
    if (this.image)
        ctx.drawImage(this.image, this.x, this.y);
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

Door.prototype.draw = function (ctx) {
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