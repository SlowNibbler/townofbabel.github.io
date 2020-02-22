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
    this.rotations = [];
    this.rotation = Math.random() * (Math.PI * 2) - Math.PI;
    this.velocity = { x: 0, y: 0 };

    this.atkCD = 0;
    this.slamCD = 0;
    this.hitCD = 0;
    this.ctr = 0;

    Entity.call(this, game, 640, 360);
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    if (Number.isNaN(this.health)){
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
                    if (rotationDif < Math.PI / 32 || this.rotations.length > (this.rotationLag * 10)) {
                        for (var j = this.rotations.length - 1; j >= 0; j -= 2) {
                            this.rotations.splice(j, 1);
                        }
                    }
                    this.rotations.push(atan);
                    if (this.ctr % this.rotationLag == 0) this.rotation = this.rotations.shift();

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
                    if (this.weapon.type == 'swing' && distance(this, ent) < 170 && this.slamCD <= 0) {
                        this.slamming = true;
                        this.slamCD = 150;
                    }
                    else if (distance(this, ent) < (this.range) && this.atkCD <= 0) {
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
                    if (this.attacking && ent.hitCD <= 0 && this.hit(ent)
                        && this.atkCD > (100 - this.hitDur) && this.atkCD <= 100) {
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

function MiniBoss(game, dogs) {
    // animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 0, 200, 200, 1, 1, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 200, 0, 200, 200, 0.2, 3, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 600, 400, 300, 0.15, 4, false, false);
    this.anim.sht = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 200, 200, 200, 0.1, 8, false, false);
    this.anim.wsl = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 0, 400, 200, 200, 0.1, 3, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 1400, 0, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/miniboss.png'), 800, 0, 200, 200, 0.5, 2, false, false);

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
    this.weapon = {};
    this.weapon.type = 'bat';
    this.range = 130;
    this.health = 200;

    this.atkCD = 0;
    this.shtCD = 0;
    this.wslCD = 0;
    this.hitCD = 0;

    Entity.call(this, game, 640, 300);
}

MiniBoss.prototype = new Entity();
MiniBoss.prototype.constructor = MiniBoss;

MiniBoss.prototype.update = function () {
    if (Number.isNaN(this.health)) {
        this.health = 200;
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
                this.rotation = Math.atan2(ent.y - this.y, ent.x - this.x);
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
                if (this.attack && ent.hitCD <= 0 && this.hit(ent)
                    && this.atkCD > 80 && this.atkCD <= 100) {
                    ent.hurt = true;
                    ent.health.current -= 2;
                    ent.hitCD = 20;
                }
                else if (this.shoot && this.shtCD == 100) {
                    var difX = Math.cos(this.rotation) * 45;
                    var difY = Math.sin(this.rotation) * 45;
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 7, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation + Math.PI / 15, 1));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation));
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation - Math.PI / 15, 1));
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

MiniBoss.prototype.draw = function (ctx) {
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
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/dog.png'), 200, 0, 200, 200, 0.5, 2, false, false);

    // Properties
    this.radius = 20;
    this.faces = 42;
    this.sides = 18;
    this.rotationLag = 1;
    this.acceleration = 200;
    this.maxSpeed = 200;
    this.weapon = {};
    this.weapon.type = 'bite';
    this.begLag = 109;
    this.endLag = 120;
    this.hitDur = 6;
    this.range = 70;
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
        this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_knife.png'), 800, 200, 200, 400, 0.33, 3, false, false);
        this.weapon.type = 'knife';
        this.faces = 38;
        this.begLag = 110;
        this.endLag = 45;
        this.hitDur = 14;
        this.range = 85;
    }
    else {
        this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 1, true, false);
        this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 0, 200, 200, 0.12, 8, true, false);
        this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 200, 200, 300, 0.15, 4, false, false);
        this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 0, 500, 200, 200, 0.15, 1, false, false);
        this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug_bat.png'), 800, 200, 200, 400, 0.33, 3, false, false);
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
    this.rotationLag = 2;
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
    this.anim.slam = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 1800, 300, 300, 0.14, 7, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 1400, 400, 200, 200, 0.15, 1, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/bodyguard.png'), 0, 600, 200, 700, 0.25, 4, false, false);

    // Properties
    this.radius = 26;
    this.faces = 30;
    this.sides = 48;
    this.rotationLag = 3;
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