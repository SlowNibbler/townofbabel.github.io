function Thug(game) {
    // Animations
    this.anim = {};
    this.anim.knifeIdle = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 0, 200, 200, 0.12, 1, true, false);
    this.anim.knifeMove = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 0, 200, 200, 0.12, 8, true, false);
    this.anim.knifeAtk = new Animation(ASSET_MANAGER.getAsset('./img/LilFrump.png'), 400, 600, 200, 200, 0.1, 4, false, false);
    this.anim.knifeHit = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 700, 200, 200, 0.1, 1, false, false);
    this.anim.swordIdle = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 200, 200, 200, 0.12, 1, true, false);
    this.anim.swordMove = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 200, 200, 200, 0.12, 8, true, false);
    this.anim.swordAtk = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 0, 400, 200, 300, 0.15, 5, false, false);
    this.anim.swordHit = new Animation(ASSET_MANAGER.getAsset('./img/Enemy.png'), 200, 700, 200, 200, 0.1, 1, false, false);
    // this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/thug.png'), 0, 0, 200, 300, 0.1, 5, false, false);

    // Properties
    this.enemy = true;
    this.radius = 24;
    this.faces = 28;
    this.sides = 38;
    this.rotation = Math.random()*(Math.PI*2) - Math.PI;
    this.acceleration = 100;
    this.velocity = { x: 0, y: 0};
    this.maxSpeed = 125;
    chooseWeapon(this, 'thug');
    this.health = 5;
    this.atkCD = 0;
    this.canBeHit = 0;
    console.log('added thug');
    Entity.call(this, game, Math.random()*420+410, Math.random()*620+50);
}

Thug.prototype = new Entity();
Thug.prototype.constructor = Thug;

Thug.prototype.update = function () {
    if (this.atkCD > 0) this.atkCD--;
    if (this.canBeHit > 0) this.canBeHit--;
    if (this.canBeHit <= 0) this.hurt = false;

    // Update animations
    if (this.hurt) {
        if (this.weapon == 'knife' && this.anim.knifeHit.isDone()) {
            this.anim.knifeHit.elapsedTime = 0;
            this.hurt = false;
        }
        else if (this.weapon == 'sword' && this.anim.swordHit.isDone()) {
            this.anim.swordHit.elapsedTime = 0;
            this.hurt = false;
        }
    }
    if (this.attacking) {
        if (this.weapon == 'knife' && this.anim.knifeAtk.isDone()) {
            this.anim.knifeAtk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = 60;
        }
        else if (this.weapon == 'sword' && this.anim.swordAtk.isDone()) {
            this.anim.swordAtk.elapsedTime = 0;
            this.attacking = false;
            this.atkCD = 90;
        }
    }

    // Boundary collisions
    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * (1/friction);
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 1280 - this.radius;
    }
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * (1/friction);
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 720 - this.radius;
    }

    // Wall and Player collisions
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.wall) {
            if (this.collide(ent)) {
                if (this.side == 'left' || this.side == 'right') {
                    this.velocity.x = -this.velocity.x * (1/friction);
                    if (this.side == 'left') this.x = ent.x - this.radius;
                    else this.x = ent.x+ent.w + this.radius;
                }
                else if (this.side == 'top' || this.side == 'bottom') {
                    this.velocity.y = -this.velocity.y * (1/friction);
                    if (this.side == 'top') this.y = ent.y - this.radius;
                    else this.y = ent.y+ent.h + this.radius;
                }
            }
        }
        else if (ent.player && ent.alive) {
            if (distance(this, ent) < 250) {
                this.rotation = Math.atan2(ent.y - this.y, ent.x - this.x);
                var difX = Math.cos(this.rotation);
                var difY = Math.sin(this.rotation);
                var delta = this.radius + ent.radius - distance(this, ent);
                if (this.collide(ent)) {
                    this.velocity.x = -this.velocity.x * (1/friction);
                    this.velocity.y = -this.velocity.y * (1/friction);
                    this.x -= difX * delta/2;
                    this.y -= difY * delta/2;
                    ent.x += difX * delta/2;
                    ent.y += difY * delta/2;
                }
                else {
                    this.velocity.x += difX * this.acceleration;
                    this.velocity.y += difY * this.acceleration;
                }
                if (distance(this, ent) < this.range && this.atkCD <= 0) {
                    if (this.weapon == 'knife') {
                        this.attacking = true;
                        this.atkCD = 112;
                    }
                    else if(this.weapon == 'sword') {
                        this.attacking = true;
                        this.atkCD = 116;
                    }
                }
                if (this.attacking && ent.canBeHit <= 0 && this.hit(ent) && this.atkCD > 88 && this.atkCD <= 100) {
                    ent.hurt = true;
                    ent.health.current--;
                    ent.canBeHit = 12;
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

    Entity.prototype.update.call(this);
}

Thug.prototype.draw = function (ctx) {
    if (this.hurt) {
        if (this.weapon == 'knife') this.anim.knifeHit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else this.anim.swordHit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    }
    else if (this.attacking) {
        if (this.weapon == 'knife') this.anim.knifeAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        else this.anim.swordAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
    }
    else {
        if (this.velocity.x > -5 && this.velocity.x < 5 && this.velocity.y > -5 && this.velocity.y < 5) {
            if (this.weapon == 'knife') this.anim.knifeIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else this.anim.swordIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
        else {
            if (this.weapon == 'knife') this.anim.knifeMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
            else this.anim.swordMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation+Math.PI/2);
        }
    }
    Entity.prototype.draw.call(this);
}

Thug.prototype.hit = function (other) {
    var rotdif = 0;
    if (other.rotation < this.rotation) rotdif = this.rotation - other.rotation;
    else rotdif = other.rotation - this.rotation;
    
    if ((rotdif > Math.PI*3/4 && rotdif < Math.PI*5/4) || (rotdif > Math.PI*7/4) || (rotdif < Math.PI/4))
        return distance(this, other) < this.range + other.faces;
    else return distance(this, other) < this.range + other.sides;
}

function chooseWeapon(that, type) {
    var weapons = [];
    if (type == 'thug') weapons = ['knife', 'sword'];
    else if (type == 'swat') weapons = ['baton', 'gun'];
    that.weapon = weapons[Math.floor(Math.random()*weapons.length)];
    if (that.weapon == 'knife') that.range = 70;
    else that.range = 110;
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
    Entity.prototype.update.call(this);
}

Mailbox.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y);
    Entity.prototype.draw.call(this);
}