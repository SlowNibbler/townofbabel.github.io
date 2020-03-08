function Ability(game, player, x, y) {
    this.ability = true;
    this.player = player;
    this.cooldown = 0;
    this.iconCD = 0;
    Entity.call(this, game, x, y);
}

Ability.prototype = new Entity();
Ability.prototype.constructor = Ability;

Ability.prototype.update = function () {
}

Ability.prototype.draw = function (ctx) {
    if (this.iconCD <= 0)
        ctx.drawImage(this.icon, 240, 0, 60, 60, this.x, this.y, 40, 40);
    else if (this.iconCD <= this.maxCD / 4)
        ctx.drawImage(this.icon, 180, 0, 60, 60, this.x, this.y, 40, 40);
    else if (this.iconCD <= this.maxCD / 2)
        ctx.drawImage(this.icon, 120, 0, 60, 60, this.x, this.y, 40, 40);
    else if (this.iconCD <= (this.maxCD * 3 / 4))
        ctx.drawImage(this.icon, 60, 0, 60, 60, this.x, this.y, 40, 40);
    else
        ctx.drawImage(this.icon, 0, 0, 60, 60, this.x, this.y, 40, 40);
}

function Dash(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/dash.png');
    this.maxCD = 90;
    Ability.call(this, game, player, 75, 35);
}

Dash.prototype = new Ability();
Dash.prototype.constructor = Dash;

Dash.prototype.update = function () {
    if (this.iconCD > 0) this.iconCD--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.player.space && this.cooldown <= 0 && this.player.stunCD <= 0
        && !this.player.lunge && !this.player.fruit && !this.player.laser) {
        if (this.player.attacking) {
            this.player.attacking = false;
            if (this.player.weapon.type == 'knife') {
                this.player.anim.knifeAtk.elapsedTime = 0;
                this.player.atkCD = 9;
            }
            else if (this.player.weapon.type == 'bat') {
                this.player.anim.batAtk.elapsedTime = 0;
                this.player.atkCD = 18;
            }
            else if (this.player.weapon.type == 'gun') {
                this.player.anim.gunAtk.elapsedTime = 0;
                this.player.atkCD = 30;
            }
        }
        this.player.dashing = true;
        this.player.hitCD = 20;
        var pointy = this.player.y + this.player.velocity.y;
        var pointx = this.player.x + this.player.velocity.x;
        this.player.storedRot = Math.atan2(pointy - this.player.y, pointx - this.player.x);
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD * 2;
        this.player.acceleration = 300;
        this.player.maxSpeed = 750;
    }
    if (this.player.dashing && this.player.anim.dash.isDone()) {
        this.player.anim.dash.elapsedTime = 0;
        this.player.dashing = false;
        this.player.acceleration = 100;
        this.player.maxSpeed = 250;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD;
    }
}

function SuperDash(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/super_dash.png');
    this.maxCD = 120;
    Ability.call(this, game, player, 150, 35);
}

SuperDash.prototype = new Ability();
SuperDash.prototype.constructor = SuperDash;

SuperDash.prototype.update = function () {
    if (this.iconCD > 0) this.iconCD--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.player.dash && this.player.supDash) {
        this.player.supDash = false;
        this.player.anim.supDash.elapsedTime = 0;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD;
    }
    if (this.game.shift && this.cooldown <= 0 && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            if (this.player.weapon.type == 'knife') {
                this.player.anim.knifeAtk.elapsedTime = 0;
                this.player.atkCD = 9;
            }
            else if (this.player.weapon.type == 'bat') {
                this.player.anim.batAtk.elapsedTime = 0;
                this.player.atkCD = 18;
            }
            else if (this.player.weapon.type == 'gun') {
                this.player.anim.gunAtk.elapsedTime = 0;
                this.player.atkCD = 30;
            }
        }
        this.player.supDash = true;
        this.player.radius = 10;
        this.player.hitCD = 30;
        var pointy = this.player.y + this.player.velocity.y;
        var pointx = this.player.x + this.player.velocity.x;
        this.player.storedRot = Math.atan2(pointy - this.player.y, pointx - this.player.x);
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD * 2;
        this.player.acceleration = 500;
        this.player.maxSpeed = 1200;
    }
    if (this.player.supDash && this.player.anim.supDash.isDone()) {
        this.player.anim.supDash.elapsedTime = 0;
        this.player.supDash = false;
        this.player.acceleration = 100;
        this.player.maxSpeed = 250;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD;
    }
}

function BlingStun(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/bling.png');
    this.maxCD = 240;
    Ability.call(this, game, player, 150, 35);
}

BlingStun.prototype = new Ability();
BlingStun.prototype.constructor = BlingStun;

BlingStun.prototype.update = function () {
    if (this.iconCD > 0) this.iconCD--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.player.dash && this.player.bling) {
        this.player.bling = false;
        this.player.anim.bling.elapsedTime = 0;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD;
    }
    if (this.game.shift && this.cooldown <= 0 && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            if (this.player.weapon.type == 'knife') {
                this.player.anim.knifeAtk.elapsedTime = 0;
                this.player.atkCD = 9;
            }
            else if (this.player.weapon.type == 'bat') {
                this.player.anim.batAtk.elapsedTime = 0;
                this.player.atkCD = 18;
            }
            else if (this.player.weapon.type == 'gun') {
                this.player.anim.gunAtk.elapsedTime = 0;
                this.player.atkCD = 30;
            }
        }
        this.player.bling = true;
        this.cooldown = 109;
        this.iconCD = this.maxCD * 2;
    }
    if (this.player.bling && this.player.anim.bling.isDone()) {
        this.player.anim.bling.elapsedTime = 0;
        this.player.bling = false;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.enemy) {
            if (this.player.bling && this.player.hit(ent, 150) && ent.hitCD <= 0
                && this.cooldown <= 100 && this.cooldown > 82) {
                ent.hurt = true;
                ent.health -= 10;
                ent.hitCD = 18;
                ent.stunCD = 60;
            }
        }
    }
}

function BoomSpeaker(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/boombox.png');
    this.maxCD = 275;
    Ability.call(this, game, player, 150, 35);
}

BoomSpeaker.prototype = new Ability();
BoomSpeaker.prototype.constructor = BoomSpeaker;

BoomSpeaker.prototype.update = function () {
    if (this.iconCD > 0) this.iconCD--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.player.dash && this.player.boom) {
        this.player.boom = false;
        this.player.anim.boom.elapsedTime = 0;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD;
    }
    if (this.game.shift && this.cooldown <= 0 && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            if (this.player.weapon.type == 'knife') {
                this.player.anim.knifeAtk.elapsedTime = 0;
                this.player.atkCD = 9;
            }
            else if (this.player.weapon.type == 'bat') {
                this.player.anim.batAtk.elapsedTime = 0;
                this.player.atkCD = 18;
            }
            else if (this.player.weapon.type == 'gun') {
                this.player.anim.gunAtk.elapsedTime = 0;
                this.player.atkCD = 30;
            }
        }
        this.player.boom = true;
        this.cooldown = 109;
        this.iconCD = this.maxCD * 2;
    }
    if (this.player.boom && this.player.anim.boom.isDone()) {
        this.player.anim.boom.elapsedTime = 0;
        this.player.boom = false;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.enemy) {
            if (this.player.boom && this.cooldown > 100) {
                if (this.player.hit(ent, 90) && ent.hitCD <= 0) {
                    ent.hurt = true;
                    ent.health -= 15;
                    ent.hitCD = 27;
                    ent.knockBack = 15;
                }
            }
            else if (this.player.boom && this.cooldown > 82) {
                if (this.player.hit(ent, 130) && ent.hitCD <= 0) {
                    ent.hurt = true;
                    ent.health -= 15;
                    ent.hitCD = 27;
                    ent.knockBack = 13;
                }
            }
            else if (this.player.boom && this.cooldown > 73) {
                if (this.player.hit(ent, 90) && ent.hitCD <= 0) {
                    ent.hurt = true;
                    ent.health -= 15;
                    ent.hitCD = 9;
                    ent.knockBack = 9;
                }
            }
        }
    }
}

function Lunge(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/lunge.png');
    this.maxCD = 210;
    Ability.call(this, game, player, 150, 35);
}

Lunge.prototype = new Ability();
Lunge.prototype.constructor = Lunge;

Lunge.prototype.update = function () {
    if (this.iconCD > 0) this.iconCD--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.shift && this.cooldown <= 0 && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            this.player.anim.knifeAtk.elapsedTime = 0;
            this.player.atkCD = 9;
        }
        this.player.lunge = true;
        this.player.hitCD = this.player.anim.lunge.totalTime * 60;
        this.player.storedRot = this.player.rotation;
        this.player.acceleration = 225;
        this.player.maxSpeed = 800;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD * 2;
    }
    if (this.player.lunge) {
        if (this.player.anim.lunge.elapsedTime > (this.player.anim.lunge.totalTime * 3 / 4)) {
            this.player.maxSpeed = 100;
        }
        if (this.player.anim.lunge.isDone()) {
            this.player.anim.lunge.elapsedTime = 0;
            this.player.lunge = false;
            this.player.acceleration = 100;
            this.cooldown = this.maxCD;
            this.iconCD = this.maxCD;
        }
    }
    if (this.cooldown < (this.maxCD - 15) && this.player.maxSpeed == 100) {
        this.player.maxSpeed = 250;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.enemy) {
            if (this.player.lunge && this.hit(ent) && ent.hitCD <= 0) {
                ent.hurt = true;
                ent.health -= this.player.weapon.damage * 2;
                ent.hitCD = (this.player.anim.lunge.totalTime - this.player.anim.lunge.elapsedTime) * 60;
            }
        }
    }
}

Lunge.prototype.hit = function (other) {
    var atan2 = Math.atan2(other.y - this.player.y, other.x - this.player.x);
    var orien = Math.abs(this.player.rotation - other.rotation);
    if (orien > Math.PI) orien = (Math.PI * 2) - orien;
    var acc = 1;
    if (this.player.anim.lunge.currentFrame() == 0) {
        var angle = this.player.rotation + Math.atan(42 / 64);
        acc = Math.abs(angle - atan2);
        if (acc > Math.PI) acc = (Math.PI * 2) - acc;
        this.range = 76;
    }
    else if (this.player.anim.lunge.currentFrame() == 1 || this.player.anim.lunge.currentFrame() == 2) {
        var angle = this.player.rotation + Math.atan(44 / 144);
        acc = Math.abs(angle - atan2);
        if (acc > Math.PI) acc = (Math.PI * 2) - acc;
        this.range = 150;
    }
    else if (this.player.anim.lunge.currentFrame() == 3) {
        var angle = this.player.rotation + Math.atan(38 / 58);
        acc = Math.abs(angle - atan2);
        if (acc > Math.PI) acc = (Math.PI * 2) - acc;
        this.range = 70;
    }
    if (acc < 0.5) {
        if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
            return distance(this.player, other) < this.range + other.faces;
        else
            return distance(this.player, other) < this.range + other.sides;
    }
    else return false;
}

function Apple(game, x, y, rot, dmg) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/weapons/apple.png'), 0, 0, 22, 24, 1, 1, true, false);
    this.velocity = {};
    var newRot = rot + Math.random() * 0.12 - 0.06;
    this.velocity.x = Math.cos(newRot) * 99999;
    this.velocity.y = Math.sin(newRot) * 99999;
    this.maxSpeed = 600;
    this.damage = dmg;
    this.rotation = rot;
    this.radius = 11;
    Entity.call(this, game, x, y);
}

Apple.prototype = new Entity();
Apple.prototype.constructor = Apple;

Apple.prototype.update = function () {
    if (this.collideTop() || this.collideRight() || this.collideLeft() || this.collideBottom())
        this.removeFromWorld = true;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this.collide(ent)) {
            if (ent.enemy) {
                ent.hurt = true;
                ent.health -= this.damage;
                ent.hitCD = 6;
                this.removeFromWorld = true;
            }
            else if (ent.wall || ent.column)
                this.removeFromWorld = true;
        }
    }

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;
}

Apple.prototype.draw = function (ctx) {
    this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
}

function FruitShot(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/fruit_bat.png');
    this.maxCD = 210;
    this.hit = false;
    this.mouse = {};
    this.spawnDist = Math.sqrt(Math.pow(127, 2) + Math.pow(26, 2));
    Ability.call(this, game, player, 150, 35);
}

FruitShot.prototype = new Ability();
FruitShot.prototype.constructor = FruitShot;

FruitShot.prototype.update = function () {
    if (this.iconCD > 0) this.iconCD--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.shift && this.cooldown <= 0 && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            this.player.anim.batAtk.elapsedTime = 0;
            this.player.atkCD = 18;
        }
        this.player.fruit = true;
        this.mouse.x = this.game.mouse.x;
        this.mouse.y = this.game.mouse.y;
        this.player.storedRot = this.player.rotation;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD * 2;
    }
    if (this.player.fruit) {
        if (this.player.anim.fruit.elapsedTime > (this.player.anim.fruit.totalTime * 4 / 7) && !this.hit) {
            this.hit = true;
            var appleRot = this.player.rotation + Math.atan(127 / 26);
            var difX = Math.cos(appleRot) * 125;
            var difY = Math.sin(appleRot) * 125;
            var spawnX = this.player.x + difX;
            var spawnY = this.player.y + difY;
            var spawnRot = Math.atan2(this.mouse.y - spawnY, this.mouse.x - spawnX);
            this.game.addEntity(new Apple(this.game, spawnX, spawnY, spawnRot, this.player.weapon.damage * 3));
        }
        if (this.player.anim.fruit.isDone()) {
            this.player.anim.fruit.elapsedTime = 0;
            this.player.fruit = false;
            this.hit = false;
            this.cooldown = this.maxCD;
            this.iconCD = this.maxCD;
        }
    }
}

function LaserProj(game, x, y, rot, dmg) {
    this.image = new Animation(ASSET_MANAGER.getAsset('./img/weapons/laser.png'), 0, 0, 12, 38, 0.1, 4, true, false);
    this.velocity = {};
    this.velocity.x = Math.cos(rot) * 99999;
    this.velocity.y = Math.sin(rot) * 99999;
    this.maxSpeed = 800;
    this.damage = dmg;
    this.rotation = rot;
    this.radius = 8;
    this.hitMax = 3;
    Entity.call(this, game, x, y);
}

LaserProj.prototype = new Entity();
LaserProj.prototype.constructor = LaserProj;

LaserProj.prototype.update = function () {
    if (this.collideTop() || this.collideRight() || this.collideLeft() || this.collideBottom())
        this.removeFromWorld = true;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this.collide(ent)) {
            if (ent.enemy && ent.hitCD <= 0) {
                ent.hurt = true;
                ent.health -= this.damage;
                ent.hitCD = 12;
                this.hitMax--;
                if (this.hitMax < 1) this.removeFromWorld = true;
            }
            else if (ent.wall || ent.column)
                this.removeFromWorld = true;
        }
    }

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;
}

LaserProj.prototype.draw = function (ctx) {
    this.image.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
}

function Laser(game, player) {
    this.icon = ASSET_MANAGER.getAsset('./img/entities/laser_icon.png');
    this.maxCD = 240;
    Ability.call(this, game, player, 150, 35);
}

Laser.prototype = new Ability();
Laser.prototype.constructor = Laser;

Laser.prototype.update = function () {
    if (this.iconCD > 0) this.iconCD--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.game.shift && this.cooldown <= 0 && this.player.stunCD <= 0 && !this.player.dash) {
        if (this.player.attacking) {
            this.player.attacking = false;
            this.player.anim.gunAtk.elapsedTime = 0;
        }
        this.player.laser = true;
        this.cooldown = this.maxCD;
        this.iconCD = this.maxCD * 2;
    }
    if (this.player.laser) {
        if (this.player.anim.laser.elapsedTime > (this.player.anim.laser.totalTime * 2 / 3) && !this.hit) {
            this.hit = true;
            var laserRot = this.player.rotation + Math.atan(13 / 127);
            var difX = Math.cos(laserRot) * 127.7;
            var difY = Math.sin(laserRot) * 127.7;
            var spawnX = this.player.x + difX;
            var spawnY = this.player.y + difY;
            this.game.addEntity(new LaserProj(this.game, spawnX, spawnY, this.player.rotation, this.player.weapon.damage * 2));
        }
        if (this.player.anim.laser.isDone()) {
            this.player.anim.laser.elapsedTime = 0;
            this.player.laser = false;
            this.hit = false;
            this.cooldown = this.maxCD;
            this.iconCD = this.maxCD;
        }
    }
}