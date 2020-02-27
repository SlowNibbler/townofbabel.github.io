function HealthDrop(game, x, y, heal) {
    this.healOne = new Animation(ASSET_MANAGER.getAsset('./img/entities/health_drop.png'), 0, 0, 40, 40, 0.2, 4, true, false);
    this.healTwo = new Animation(ASSET_MANAGER.getAsset('./img/entities/health_drop.png'), 0, 40, 40, 40, 0.2, 4, true, false);
    this.healThree = new Animation(ASSET_MANAGER.getAsset('./img/entities/health_drop.png'), 0, 80, 40, 40, 0.2, 4, true, false);
    this.heal = heal;
    this.radius = 0;
    Entity.call(this, game, x, y);
}

HealthDrop.prototype = new Entity();
HealthDrop.prototype.constructor = HealthDrop;

HealthDrop.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.player) {
            if (this.collide(ent)) {
                ent.health.current += this.heal;
                if (ent.health.current > ent.health.max)
                    ent.health.current = ent.health.max;
                this.removeFromWorld = true;
            }
        }
    }
}

HealthDrop.prototype.draw = function (ctx) {
    if (this.heal == 1)
        this.healOne.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else if (this.heal == 2)
        this.healTwo.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else if (this.heal == 3)
        this.healThree.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
}

function Enemy(game) {
    //Properties
    this.alive = true;
    this.enemy = true;
    this.rotation = Math.random() * (Math.PI * 2) - Math.PI;
    this.velocity = { x: 0, y: 0 };

    this.atkCD = 0;
    this.slamCD = 0;
    this.hitCD = 0;
    this.ctr = 0;

    Entity.call(this, game, Math.random() * 100 + 590, Math.random() * 100 + 310);
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    if (Number.isNaN(this.health)) {
        this.health = this.initHP;
    }

    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        if (Math.floor(Math.random() * 4) == 0)
            this.game.addEntity(new HealthDrop(this.game, this.x, this.y, this.hpDrop));
        this.die = false;
    }
    if (this.alive) {
        this.ctr++;
        if (this.atkCD > 0) this.atkCD--;
        if (this.slamCD > 0) this.slamCD--;
        if (this.hitCD > 0) this.hitCD--;
        if (this.hitCD <= 0) this.hurt = false;
        if (this.hurt) this.engage = true;

        // Update animations
        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.hurt = false;
        }
        if (this.slamming) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            if (this.anim.slam.isDone()) {
                this.anim.slam.elapsedTime = 0;
                this.slamming = false;
                this.slamCD = 180;
            }
        }
        if (this.attacking && this.anim.atk.isDone()) {
            this.anim.atk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = this.endLag;
            if (this.weapon.type == 'bite') {
                this.acceleration = 200;
                this.maxSpeed = 200;
            }
        }

        // Boundary collisions
        if (this.caged) {
            if (this.collideLeft() || this.collideRight()) {
                this.velocity.x = -this.velocity.x * (1 / friction);
                if (this.collideLeft()) this.x = this.radius + 1150;
                if (this.collideRight()) this.x = 1280 - this.radius;
            }
            if (this.collideTop() || this.collideBottom()) {
                this.velocity.y = -this.velocity.y * (1 / friction);
                if (this.collideTop()) this.y = this.radius;
                if (this.collideBottom()) this.y = 150 - this.radius;
            }
        }
        else {
            if (this.collideLeft() || this.collideRight()) {
                this.velocity.x = -this.velocity.x * (1 / friction);
                if (this.collideLeft()) this.x = this.radius;
                if (this.collideRight()) this.x = 1280 - this.radius;
            }
            if (this.collideTop() || this.collideBottom()) {
                this.velocity.y = -this.velocity.y * (1 / friction);
                if (this.collideTop()) this.y = this.radius;
                if (this.collideBottom()) this.y = 720 - this.radius;
            }
        }

        // Wall and Player/Enemy collisions
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.wall) {
                if (this.collide(ent)) {
                    if (this.side == 'left' || this.side == 'right') {
                        this.velocity.x = -this.velocity.x * (1 / friction);
                        if (this.side == 'left') this.x = ent.x - this.radius;
                        else this.x = ent.x + ent.w + this.radius;
                    }
                    else if (this.side == 'top' || this.side == 'bottom') {
                        this.velocity.y = -this.velocity.y * (1 / friction);
                        if (this.side == 'top') this.y = ent.y - this.radius;
                        else this.y = ent.y + ent.h + this.radius;
                    }
                }
            }
            else if (ent.enemy && !ent.boss) {
                var difX = Math.cos(this.rotation);
                var difY = Math.sin(this.rotation);
                var delta = this.radius + ent.radius - distance(this, ent);
                if (this.collide(ent)) {
                    this.velocity.x = -this.velocity.x * (1 / friction);
                    this.velocity.y = -this.velocity.y * (1 / friction);
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
            }
            else if (ent.player && ent.alive) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                var rotationDif = Math.abs(this.rotation - atan);
                if (rotationDif > Math.PI) rotationDif = (Math.PI * 2) - rotationDif;

                if ((distance(this, ent) < this.sight && rotationDif <= this.fov)
                    || distance(this, ent) < (this.range + ent.radius + 50) || this.engage) {
                    this.engage = true;
                    // Determine rotation
                    if (this.rotation > atan) {
                        var rotdif = this.rotation - atan;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation += rotdif / this.rotationLag;
                        }
                        else this.rotation -= rotdif / this.rotationLag;
                    }
                    else {
                        var rotdif = atan - this.rotation;
                        if (rotdif > Math.PI) {
                            rotdif = Math.PI * 2 - rotdif;
                            this.rotation -= rotdif / this.rotationLag;
                        }
                        else this.rotation += rotdif / this.rotationLag;
                    }

                    var difX = Math.cos(this.rotation);
                    var difY = Math.sin(this.rotation);
                    var delta = this.radius + ent.radius - distance(this, ent);
                    if (this.collide(ent) && !ent.dash) {
                        this.velocity.x = -this.velocity.x * (1 / friction);
                        this.velocity.y = -this.velocity.y * (1 / friction);
                        this.x -= difX * delta / 2;
                        this.y -= difY * delta / 2;
                        ent.x += difX * delta / 2;
                        ent.y += difY * delta / 2;
                    }
                    else {
                        this.velocity.x += difX * this.acceleration;
                        this.velocity.y += difY * this.acceleration;
                    }
                    // Attack calculations
                    if (this.weapon.type == 'swing' && distance(this, ent) < 140 && this.slamCD <= 0) {
                        this.slamming = true;
                        this.slamCD = 150;
                    }
                    else if (distance(this, ent) < (this.range + ent.radius / 2) && this.atkCD <= 0) {
                        this.attacking = true;
                        this.atkCD = this.begLag;
                    }
                    else if (this.weapon.type == 'bite' && this.atkCD <= 0
                        && distance(this, ent) < (this.range * 1.75 + ent.range)) {
                        this.attacking = true;
                        this.atkCD = this.begLag;
                        this.acceleration = 400;
                        this.maxSpeed = 400;
                    }
                    if (this.slamming && ent.hitCD <= 0 && this.hit(ent, 150)
                        && this.slamCD > 91 && this.slamCD <= 100) {
                        ent.hurt = true;
                        ent.health.current--;
                        ent.hitCD = 9;
                        ent.stunCD = 45;
                    }
                    if (this.attacking && ent.hitCD <= 0 && this.hit(ent)) {
                        ent.hurt = true;
                        ent.health.current -= this.dmg;
                        ent.hitCD = this.hitDur;
                    }
                }
            }
        }

        // Speed control
        var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            var ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        this.velocity.x -= friction * this.game.clockTick * this.velocity.x;
        this.velocity.y -= friction * this.game.clockTick * this.velocity.y;
    }
}

Enemy.prototype.draw = function (ctx) {
    if (this.die)
        this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt)
        this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.slamming)
        this.anim.slam.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.attacking)
        this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else
            this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
}

Enemy.prototype.hit = function (other, range) {
    if (range === undefined) {
        var acc = 1;
        var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
        var orien = Math.abs(this.rotation - other.rotation);
        if (orien > Math.PI) orien = (Math.PI * 2) - orien;

        if (this.weapon.type == 'knife') {
            if (this.anim.atk.currentFrame() == 0) {
                var knifeAngle = this.rotation + Math.atan(21 / 56);
                acc = Math.abs(knifeAngle - atan2);
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 60;
            }
            else if (this.anim.atk.currentFrame() == 1 || this.anim.atk.currentFrame == 3) {
                var knifeAngle = this.rotation + Math.atan(13 / 68);
                acc = Math.abs(knifeAngle - atan2);
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 70;
            }
            else if (this.anim.atk.currentFrame() == 2) {
                var knifeAngle = this.rotation + Math.atan(3 / 88);
                acc = Math.abs(knifeAngle - atan2);
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 90;
            }
        }
        else if (this.weapon.type == 'bat') {
            var moveAmnt = (Math.PI / 2 + Math.atan(76 / 33)) / this.anim.atk.totalTime;
            var batAngle = (this.rotation + Math.PI / 2) - (this.anim.atk.elapsedTime * moveAmnt);
            acc = Math.abs(batAngle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 105;
        }
        else if (this.weapon.type == 'bite') {
            var startTime = this.anim.atk.frameDuration * 2.75;
            var endTime = this.anim.atk.frameDuration * 4.25;
            if (this.anim.atk.elapsedTime > startTime && this.anim.atk.elapsedTime < endTime) {
                acc = Math.abs(this.rotation - atan2);
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 75;
            }
        }
        else if (this.weapon.type == 'swing') {
            var moveAmnt = (Math.atan(33 / 40) + Math.atan(20 / 48)) / this.anim.atk.totalTime;
            var swingAngle = (this.rotation + Math.atan(33 / 40)) - (this.anim.atk.elapsedTime * moveAmnt);
            acc = Math.abs(swingAngle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 60;
        }

        if (acc < 0.1) {
            if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
                return distance(this, other) < this.range + other.faces;
            else
                return distance(this, other) < this.range + other.sides;
        }
        else
            return false;
    }
    else
        return distance(this, other) < range + other.radius;
}

function SlowDogg(game, dogs) {
    // animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 200, 0, 200, 200, 0.2, 3, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 600, 400, 300, 0.15, 4, false, false);
    this.anim.sht = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 200, 200, 200, 0.1, 8, false, false);
    this.anim.wsl = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 0, 400, 200, 200, 0.1, 3, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 1400, 0, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/slow_dogg.png'), 800, 0, 200, 200, 0.25, 2, false, false);

    // properties
    this.alive = true;
    this.boss = true;
    this.enemy = true;
    this.dogs = dogs;
    this.radius = 38;
    this.faces = 42;
    this.sides = 42;
    this.rotation = Math.PI / 2;
    this.acceleration = 50;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 65;
    this.range = 130;
    this.health = 250;

    this.atkCD = 0;
    this.shtCD = 0;
    this.wslCD = 0;
    this.hitCD = 0;

    Entity.call(this, game, 100, 100);
}

SlowDogg.prototype = new Entity();
SlowDogg.prototype.constructor = SlowDogg;

SlowDogg.prototype.update = function () {
    if (Number.isNaN(this.health)) {
        this.health = 250;
    }

    if (this.health <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        this.die = false;
    }
    if (this.alive) {
        if (this.atkCD > 0) this.atkCD--;
        if (this.shtCD > 0) this.shtCD--;
        if (this.wslCD > 0) this.wslCD--;
        if (this.hitCD > 0) this.hitCD--;
        else this.hurt = false;

        // animation control
        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.hurt = false;
        }
        if (this.whistle || this.shoot) {
            this.velocity.x *= (3 / 7);
            this.velocity.y *= (3 / 7);
            if (this.anim.wsl.isDone()) {
                this.anim.wsl.elapsedTime = 0;
                this.whistle = false;
                this.wslCD = 720;
            }
            if (this.anim.sht.isDone()) {
                this.anim.sht.elapsedTime = 0;
                this.shoot = false;
                this.shtCD = 90;
            }
        }
        if (this.attack && this.anim.atk.isDone()) {
            this.anim.atk.elapsedTime = 0;
            this.attack = false;
            this.atkCD = 60;
        }

        // boundary collisions
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x * (1 / friction);
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 1280 - this.radius;
        }
        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y * (1 / friction);
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 720 - this.radius;
        }

        // entity collisions
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.wall) {
                if (this.collide(ent)) {
                    if (this.side == 'left' || this.side == 'right') {
                        this.velocity.x = -this.velocity.x * (1 / friction);
                        if (this.side == 'left') this.x = ent.x - this.radius;
                        else this.x = ent.x + ent.w + this.radius;
                    }
                    else if (this.side == 'top' || this.side == 'bottom') {
                        this.velocity.y = -this.velocity.y * (1 / friction);
                        if (this.side == 'top') this.y = ent.y - this.radius;
                        else this.y = ent.y + ent.h + this.radius;
                    }
                }
            }
            else if (ent.player && ent.alive) {
                var atan = Math.atan2(ent.y - this.y, ent.x - this.x);
                if (this.rotation > atan) {
                    var rotdif = this.rotation - atan;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation += rotdif / 25;
                    }
                    else this.rotation -= rotdif / 25;
                }
                else {
                    var rotdif = atan - this.rotation;
                    if (rotdif > Math.PI) {
                        rotdif = Math.PI * 2 - rotdif;
                        this.rotation -= rotdif / 25;
                    }
                    else this.rotation += rotdif / 25;
                }
                var difX = Math.cos(this.rotation);
                var difY = Math.sin(this.rotation);
                var delta = this.radius + ent.radius - distance(this, ent);
                if (this.collide(ent) && !ent.dash) {
                    this.velocity.x = -this.velocity.x * (1 / friction);
                    this.velocity.y = -this.velocity.y * (1 / friction);
                    this.x -= difX * delta / 2;
                    this.y -= difY * delta / 2;
                    ent.x += difX * delta / 2;
                    ent.y += difY * delta / 2;
                }
                else {
                    this.velocity.x += difX * this.acceleration;
                    this.velocity.y += difY * this.acceleration;
                }
                var dist = distance(this, ent);
                if (this.wslCD <= 0 && this.dogs.length > 0) {
                    this.whistle = true;
                    var dog = this.dogs.pop();
                    dog.caged = false;
                    this.wslCD = 720;
                }
                else if (dist < 140 && this.atkCD <= 0) {
                    this.attack = true;
                    this.atkCD = 112;
                }
                else if (this.shtCD <= 0) {
                    this.shoot = true;
                    this.shtCD = 118;
                }
                if (this.attack && ent.hitCD <= 0 && this.hit(ent)) {
                    ent.hurt = true;
                    ent.health.current -= 2;
                    ent.hitCD = 20;
                }
                else if (this.shoot && this.shtCD == 100) {
                    var difX = Math.cos(this.rotation) * 75;
                    var difY = Math.sin(this.rotation) * 75;
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 7, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 21, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation - Math.PI / 21, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation - Math.PI / 7, 1));
                }
            }
        }

        // speed control
        var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            var ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        this.velocity.x -= friction * this.game.clockTick * this.velocity.x;
        this.velocity.y -= friction * this.game.clockTick * this.velocity.y;
    }
}

SlowDogg.prototype.draw = function (ctx) {
    if (this.die)
        this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt)
        this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.whistle)
        this.anim.wsl.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.attack)
        this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.shoot)
        this.anim.sht.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5)
            this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else
            this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
}

SlowDogg.prototype.hit = function (other) {
    var acc = 1;
    var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
    var orien = Math.abs(this.rotation - other.rotation);
    if (orien > Math.PI) orien = (Math.PI * 2) - orien;

    if (this.anim.atk.currentFrame() != 0) {
        var moveAmnt = (Math.atan(158 / 10) + Math.atan(86 / 46)) / (this.anim.atk.totalTime - this.anim.atk.frameDuration);
        var caneAngle = (this.rotation + Math.atan(158 / 10)) - ((this.anim.atk.elapsedTime - this.anim.atk.frameDuration) * moveAmnt);
        acc = Math.abs(caneAngle - atan2);
        if (acc > Math.PI) acc = (Math.PI * 2) - acc;
    }

    if (acc < 0.1) {
        if (orien < Math.PI / 4 || orien > Math.PI * 3 / 4)
            return distance(this, other) < this.range + other.faces;
        else
            return distance(this, other) < this.range + other.sides;
    }
    else
        return false;
}

function Mailbox(game, timer) {
    this.image = './img/Mailbox.png';
    this.timer = timer;
    this.radius = 15;
    this.acceleration = 100;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 875 / (timer * 60);
    Entity.call(this, game, 940, 430);
}

Mailbox.prototype = new Entity();
Mailbox.prototype.constructor = Mailbox;

Mailbox.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.player && ent.alive) {
            var rotation = Math.atan2(ent.y - this.y, ent.x - this.x);
            var difX = Math.cos(rotation);
            var difY = Math.sin(rotation);
            // var delta = this.radius + ent.radius - distance(this, ent.x, ent.y);
            // if (this.collide(ent)) {
            //     this.velocity.x = -this.velocity.x * (1/friction);
            //     this.velocity.y = -this.velocity.y * (1/friction);
            //     this.x -= difX * delta/2;
            //     this.y -= difY * delta/2;
            //     ent.x += difX * delta/2;
            //     ent.y += difY * delta/2;

            // }
            // else {
            this.velocity.x += difX * this.acceleration;
            this.velocity.y += difY * this.acceleration;
            // }
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

Mailbox.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y);
}

function Dog(game) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 200, 200, 200, 0.1, 6, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 0, 600, 200, 200, 0.05, 5, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 1000, 0, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 200, 0, 200, 200, 0.25, 2, false, false);

    // Properties
    this.radius = 20;
    this.faces = 74;
    this.sides = 18;
    this.rotationLag = 10;
    this.acceleration = 200;
    this.maxSpeed = 200;
    this.weapon = {};
    this.weapon.type = 'bite';
    this.begLag = 109;
    this.endLag = 120;
    this.hitDur = 6;
    this.range = 75;
    this.sight = 500;
    this.fov = Math.PI;
    this.hpDrop = 1;
    this.health = 60;
    this.initHP = 60;
    this.dmg = 1;

    Enemy.call(this, game);
}

Dog.prototype = new Enemy();
Dog.prototype.constructor = Dog;

function Thug(game, weapon) {
    // Weapons & Animations
    this.anim = {};
    this.weapon = {};
    if (weapon == 0) {
        this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 0, 200, 200, 0.12, 1, true, false);
        this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 0, 200, 200, 0.12, 8, true, false);
        this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 200, 200, 200, 0.1, 4, false, false);
        this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 0, 400, 200, 200, 0.15, 1, false, false);
        this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 800, 200, 200, 400, (0.5 / 3), 3, false, false);
        this.weapon.type = 'knife';
        this.faces = 38;
        this.begLag = 110;
        this.endLag = 45;
        this.hitDur = 14;
        this.range = 90;
    }
    else {
        this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 1, true, false);
        this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 8, true, false);
        this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 200, 200, 300, 0.15, 4, false, false);
        this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 500, 200, 200, 0.15, 1, false, false);
        this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 800, 200, 200, 400, (0.5 / 3), 3, false, false);
        this.weapon.type = 'bat';
        this.faces = 28;
        this.begLag = 116;
        this.endLag = 65;
        this.hitDur = 20;
        this.range = 110;
    }

    // Properties
    this.radius = 24;
    this.sides = 38;
    this.rotationLag = 15;
    this.acceleration = 100;
    this.maxSpeed = 150;
    this.sight = 250;
    this.fov = Math.PI * 2 / 5;
    this.hpDrop = 2;
    this.health = 100;
    this.initHP = 100;
    this.dmg = 1;

    Enemy.call(this, game);
}

Thug.prototype = new Enemy();
Thug.prototype.constructor = Thug;

function Bodyguard(game) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 0, 200, 200, 0.15, 8, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 200, 200, 200, 0.14, 5, false, false);
    this.anim.slam = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 1600, 300, 300, 0.14, 7, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 1400, 400, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 600, 200, 700, 0.125, 4, false, false);

    // Properties
    this.radius = 26;
    this.faces = 36;
    this.sides = 50;
    this.rotationLag = 35;
    this.acceleration = 75;
    this.maxSpeed = 100;
    this.weapon = {};
    this.weapon.type = 'swing';
    this.begLag = 114;
    this.endLag = 85;
    this.hitDur = 12;
    this.range = 60;
    this.sight = 200;
    this.fov = Math.PI * 4 / 9;
    this.hpDrop = 3;
    this.health = 140;
    this.initHP = 140;
    this.dmg = 3;

    Enemy.call(this, game);
}

Bodyguard.prototype = new Enemy();
Bodyguard.prototype.constructor = Bodyguard;