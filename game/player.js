function InfoUI(game) {
    this.image = ASSET_MANAGER.getAsset('./img/entities/UI.png');
    Entity.call(this, game, 0, 0);
}

InfoUI.prototype = new Entity();
InfoUI.prototype.constructor = InfoUI;

InfoUI.prototype.update = function () {
}

InfoUI.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0);
}

function Health(game, hp) {
    this.health = [];
    this.rotation = 0;
    for (var i = 0; i <= hp; i++) {
        this.health[i] = new Animation(ASSET_MANAGER.getAsset('./img/entities/health.png'), 0, 480 - i * 24, 240, 24, 1, 1, true, false);
    }
    this.max = hp;
    this.current = hp;
    Entity.call(this, game, 125, 17);
}

Health.prototype = new Entity();
Health.prototype.constructor = Health;

Health.prototype.update = function () {
}

Health.prototype.draw = function (ctx) {
    if (this.current < 0) this.health[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else this.health[this.current].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
}

function calcDmg(weapon) {
    switch (weapon.rarity) {
        case 0:
            weapon.damage = 20;
            break;
        case 1:
            weapon.damage = 25;
            break;
        case 2:
            weapon.damage = 40;
            break;
        case 3:
            weapon.damage = 60;
            break;
        default:
            weapon.damage = 10;
    }
}

function Popup(game, weapon) {
    this.image = ASSET_MANAGER.getAsset('./img/weapons/popup.png');
    this.weapon = weapon;
    this.startX = 0;
    this.startY = 0;
    if (weapon.type == 'gun') this.startY += 300;
    if (weapon.rarity == 1) this.startX += 150;
    else if (weapon.rarity == 2) this.startX += 300;
    else if (weapon.rarity == 3) this.startX += 450;
    if (weapon.abilityNum == 0) this.startY += 200;
    else if (weapon.abilityNum == 1) this.startY += 150;
    else if (weapon.abilityNum == 2) this.startY += 100;
    else if (weapon.abilityNum == 3) {
        this.startY += 50;
        if (weapon.type == 'knife') this.startY += 200;
    }
    Entity.call(this, game, weapon.x - 75, weapon.y - 75);
}

Popup.prototype = new Entity();
Popup.prototype.constructor = Popup;

Popup.prototype.update = function () {
    if (!this.weapon.floating) this.removeFromWorld = true;
    if (!this.weapon.hover) this.removeFromWorld = true;
}

Popup.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, this.startX, this.startY, 150, 50, this.x, this.y, 150, 50);
}

function Weapon(game, player, type, rarity, ability) {
    this.hidden = true;
    this.floating = true;
    this.hover = false;
    if (type == 0) {
        this.type = 'knife';
        this.static = ASSET_MANAGER.getAsset('./img/weapons/knife' + rarity + '0.png');
        this.animated = new Animation(ASSET_MANAGER.getAsset('./img/weapons/knife' + rarity + '0.png'), 100, 0, 100, 100, .4, 4, true, false);
        if (ability == 3) this.ability = new Lunge(game, player);
        this.scale = 1;
    } else if (type == 1) {
        this.type = 'bat';
        this.static = ASSET_MANAGER.getAsset('./img/weapons/bat' + rarity + '0.png');
        this.animated = new Animation(ASSET_MANAGER.getAsset('./img/weapons/bat' + rarity + '0.png'), 100, 0, 100, 100, .4, 4, true, false);
        if (ability == 3) this.ability = new FruitShot(game, player);
        this.scale = 0.7;
    } else if (type == 2) {
        this.type = 'gun';
        this.static = ASSET_MANAGER.getAsset('./img/weapons/gun' + rarity + '0.png');
        this.animated = new Animation(ASSET_MANAGER.getAsset('./img/weapons/gun' + rarity + '0.png'), 100, 0, 100, 100, .4, 4, true, false);
        if (ability == 3) this.ability = new Laser(game, player);
        this.scale = 0.85;
    } else this.type = 'unarmed';
    this.rarity = rarity;
    if (ability == 0) this.ability = new SuperDash(game, player);
    else if (ability == 1) this.ability = new BlingStun(game, player);
    else if (ability == 2) this.ability = new BoomSpeaker(game, player);
    else if (ability == 3) { }
    else this.ability = false;
    this.abilityNum = ability;
    this.radius = 10;
    calcDmg(this);
    if (type == 2) this.damage /= 2;

    Entity.call(this, game, 640, 360);
}

Weapon.prototype = new Entity();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.update = function () {
    if (distance(this, this.game.mouse) < 40 && !this.hover && !this.hidden) {
        this.hover = true;
        this.game.addEntity(new Popup(this.game, this));
    }
    else if (distance(this, this.game.mouse) > 40 && this.hover)
        this.hover = false;
}

Weapon.prototype.draw = function (ctx) {
    if (this.hidden) { }
    else if (this.floating)
        this.animated.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation);
    else
        ctx.drawImage(this.static, 0, 0, 100, 100, this.x, this.y, 71.4 * this.scale, 71.4 * this.scale);
}

function Bullet(game, x, y, rot, dmg) {
    this.image = ASSET_MANAGER.getAsset('./img/weapons/bullet.png');
    this.velocity = {};
    var newRot = rot + Math.random() * 0.1 - 0.05;
    this.velocity.x = Math.cos(newRot) * 99999;
    this.velocity.y = Math.sin(newRot) * 99999;
    this.maxSpeed = 1000;
    this.damage = dmg;
    this.radius = 4;

    Entity.call(this, game, x, y);
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
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
            else if (ent.player) {
                ent.hurt = true;
                ent.health.current--;
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

Bullet.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, this.x, this.y);
}

function Frump(game) {
    // Animations
    this.anim = {};
    this.anim.idle = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 200, 200, 200, 0.4, 2, true, false);
    this.anim.move = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 0, 200, 200, 0.1, 8, true, false);
    this.anim.atk = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 400, 200, 200, 200, 0.15, 4, false, false);
    this.anim.hit = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 1300, 200, 200, 0.15, 1, false, false);
    this.anim.dash = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 1600, 200, 200, 0.05, 5, false, false);
    this.anim.die = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 200, 1300, 200, 300, 0.2, 5, false, false);
    this.anim.knifeIdle = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 600, 200, 200, 0.4, 2, true, false);
    this.anim.knifeMove = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 400, 200, 200, 0.1, 8, true, false);
    this.anim.knifeAtk = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 400, 600, 200, 200, 0.05, 4, false, false);
    this.anim.batIdle = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 1000, 200, 200, 0.4, 2, true, false);
    this.anim.batMove = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 0, 800, 200, 200, 0.1, 8, true, false);
    this.anim.batAtk = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump.png'), 400, 1000, 200, 300, 0.1, 4, false, false);
    this.anim.gunIdle = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 0, 0, 300, 300, 0.4, 2, true, false);
    this.anim.gunMove = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 0, 300, 300, 300, 0.1, 8, true, false);
    this.anim.gunAtk = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 600, 0, 300, 300, 0.25, 1, false, false);
    this.anim.reload = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 1800, 0, 300, 300, 0.6, 2, false, false);
    this.anim.supDash = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 0, 1200, 300, 300, 0.04, 7, false, false);
    this.anim.bling = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 0, 900, 300, 300, 0.15, 4, false, false);
    this.anim.boom = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 300, 1900, 300, 300, 0.15, 4, false, false);
    this.anim.lunge = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 0, 1500, 300, 400, 0.075, 4, false, false);
    this.anim.fruit = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 0, 600, 300, 300, 0.12, 7, false, false);
    this.anim.laser = new Animation(ASSET_MANAGER.getAsset('./img/entities/frump2.png'), 900, 0, 300, 300, 0.1, 3, false, false);

    // Properties
    this.player = true;
    this.alive = true;
    this.UI = new InfoUI(game);
    this.dashInd = new Dash(game, this);
    this.storedRot = 0;
    this.radius = 24;
    this.faces = 33;
    this.sides = 38;
    this.acceleration = 100;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 235;
    this.weapon = new Weapon(game, this, 0, 0);
    this.bullets = 6;
    this.range = 70;
    this.damage = 20;
    this.health = new Health(game, 20);
    this.dashing = false;
    this.atkCD = 0;
    this.hitCD = 0;
    this.stunCD = 0;

    Entity.call(this, game, 515, 470);
}

Frump.prototype = new Entity();
Frump.prototype.constructor = Frump;

Frump.prototype.update = function () {
    if (this.stunCD > 0) this.stunCD--;
    if (this.health.current <= 0) {
        this.die = true;
        this.alive = false;
    }
    if (this.die && this.anim.die.isDone()) {
        this.anim.die.elapsedTime = 0;
        this.die = false;
    }
    if (this.alive) {
        if (this.stunCD <= 0) {
            // Player faces mouse pointer
            this.rotation = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);
            if (this.atkCD > 0) this.atkCD--;
            if (this.hitCD > 0) this.hitCD--;

            // Movement control
            if (this.dashing || this.supDash || this.lunge || this.fruit) {
                this.velocity.x += Math.cos(this.storedRot) * this.acceleration;
                this.velocity.y += Math.sin(this.storedRot) * this.acceleration;
                if (this.lunge) this.rotation = this.storedRot;
                else if (this.fruit) {
                    this.rotation = this.storedRot;
                    this.velocity.x = 0;
                    this.velocity.y = 0;
                }
            }
            else if (!this.bling && !this.boom) {
                if (this.game.player.up) this.velocity.y -= this.acceleration;
                if (this.game.player.down) this.velocity.y += this.acceleration;
                if (this.game.player.left) this.velocity.x -= this.acceleration;
                if (this.game.player.right) this.velocity.x += this.acceleration;
            }

            if (this.game.player.reload && !this.reload && this.bullets < 6) this.reload = true;

            // Check for attack + update range
            if (!this.dashing && !this.supDash && this.game.click && this.atkCD <= 0 && this.stunCD <= 0) {
                if (this.weapon.type == 'knife') {
                    this.attacking = true;
                    this.atkCD = 105;
                    this.hitDur = 7;
                    this.range = 85;
                }
                else if (this.weapon.type == 'bat') {
                    this.attacking = true;
                    this.atkCD = 110;
                    this.hitDur = 14;
                    this.range = 110;
                }
                else if (this.weapon.type == 'gun' && !this.reload) {
                    this.attacking = true;
                    this.atkCD = 30;
                    this.bullets--;
                    if (this.bullets == 0) this.reload = true;
                    var gunRot = this.rotation + Math.atan(7 / 85);
                    var difX = Math.cos(gunRot) * 85;
                    var difY = Math.sin(gunRot) * 85;
                    this.game.addEntity(new Bullet(this.game, this.x + difX, this.y + difY, this.rotation, this.weapon.damage));
                }
                else {
                    this.atkCD = 109;
                    this.hitDur = 18;
                    this.range = 60;
                }
            }
        }

        // Update animations
        if (this.attacking && this.stunCD > 0) {
            this.attacking = false;
            if (this.weapon.type == 'knife')
                this.anim.knifeAtk.elapsedTime = 0;
            else if (this.weapon.type == 'bat')
                this.anim.batAtk.elapsedTime = 0;
            else if (this.weapon.type == 'gun')
                this.anim.gunAtk.elapsedTime = 0;
            else
                this.anim.atk.elapsedTime = 0;
        }
        if (this.hurt && this.anim.hit.isDone()) {
            this.anim.hit.elapsedTime = 0;
            this.hurt = false;
        }
        if (this.reload && this.anim.reload.isDone()) {
            this.anim.reload.elapsedTime = 0;
            this.reload = false;
            this.bullets = 6;
            this.atkCD = 10;
        }
        if (this.attacking) {
            if (this.weapon.type == 'gun') {
                this.velocity.x /= 2;
                this.velocity.y /= 2;
            }
            if (this.weapon.type == 'knife' && this.anim.knifeAtk.isDone()) {
                this.anim.knifeAtk.elapsedTime = 0;
                this.attacking = false;
                this.atkCD = 9;
            }
            else if (this.weapon.type == 'bat' && this.anim.batAtk.isDone()) {
                this.anim.batAtk.elapsedTime = 0;
                this.attacking = false;
                this.atkCD = 18;
            }
            else if (this.weapon.type == 'gun' && this.anim.gunAtk.isDone()) {
                this.anim.gunAtk.elapsedTime = 0;
                this.attacking = false;
            }
            else if (this.weapon.type == 'unarmed' && this.anim.atk.isDone()) {
                this.anim.atk.elapsedTime = 0;
                this.attacking = false;
                this.atkCD = 24;
            }
        }

        // Enemy hurtbox collisions
        // - collisions with enemy controlled by enemy
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.enemy && this.stunCD <= 0) {
                if (this.attacking && this.weapon.type != 'gun') {
                    if (ent.hitCD <= 0 && this.hit(ent)) {
                        ent.hurt = true;
                        ent.health -= this.weapon.damage;
                        ent.hitCD = this.hitDur;
                    }
                }
            }
        }

        // Boundary collisions
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x * (1 / friction);
            if (this.collideLeft()) this.x = this.radius;
            else this.x = 1280 - this.radius;
        }
        else if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y * (1 / friction);
            if (this.collideTop()) this.y = this.radius;
            else this.y = 720 - this.radius;
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

Frump.prototype.draw = function (ctx) {
    if (this.die) this.anim.die.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.hurt) this.anim.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.dashing) this.anim.dash.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.supDash) this.anim.supDash.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.bling) this.anim.bling.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.boom) this.anim.boom.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.lunge) this.anim.lunge.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.fruit) this.anim.fruit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.laser) this.anim.laser.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else if (this.attacking) {
        if (this.weapon.type == 'knife') this.anim.knifeAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else if (this.weapon.type == 'bat') this.anim.batAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else if (this.weapon.type == 'gun') this.anim.gunAtk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        else this.anim.atk.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    }
    else if (this.reload) this.anim.reload.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
    else {
        if (this.velocity.x > -10 && this.velocity.x < 10 && this.velocity.y > -10 && this.velocity.y < 10) {
            if (this.weapon.type == 'knife') this.anim.knifeIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
            else if (this.weapon.type == 'bat') this.anim.batIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
            else if (this.weapon.type == 'gun') this.anim.gunIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
            else this.anim.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        }
        else {
            if (this.weapon.type == 'knife') this.anim.knifeMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
            else if (this.weapon.type == 'bat') this.anim.batMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
            else if (this.weapon.type == 'gun') this.anim.gunMove.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
            else this.anim.move.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotation + Math.PI / 2);
        }
    }
}

Frump.prototype.hit = function (other, range) {
    if (range === undefined) {
        var acc = 1;
        var atan2 = Math.atan2(other.y - this.y, other.x - this.x);
        var orien = Math.abs(this.rotation - other.rotation);
        if (orien > Math.PI) orien = (Math.PI * 2) - orien;

        if (this.weapon.type == 'knife') {
            if (this.anim.knifeAtk.currentFrame() == 0) {
                var knifeAngle = this.rotation + Math.atan(21 / 56);
                acc = Math.abs(knifeAngle - atan2);
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 60;
            }
            else if (this.anim.knifeAtk.currentFrame() == 1 || this.anim.knifeAtk.currentFrame == 3) {
                var knifeAngle = this.rotation + Math.atan(13 / 68);
                acc = Math.abs(knifeAngle - atan2);
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 70;
            }
            else if (this.anim.knifeAtk.currentFrame() == 2) {
                var knifeAngle = this.rotation + Math.atan(3 / 88);
                acc = Math.abs(knifeAngle - atan2);
                if (acc > Math.PI) acc = (Math.PI * 2) - acc;
                this.range = 90;
            }
        }
        else if (this.weapon.type == 'bat') {
            var moveAmnt = (Math.PI / 2 + Math.atan(76 / 33)) / this.anim.batAtk.totalTime;
            var batAngle = (this.rotation + Math.PI / 2) - (this.anim.batAtk.elapsedTime * moveAmnt);
            if (batAngle > Math.PI) batAngle = batAngle - (Math.PI * 2);
            else if (batAngle < -Math.PI) batAngle = batAngle + (Math.PI * 2);
            acc = Math.abs(batAngle - atan2);
            if (acc > Math.PI) acc = (Math.PI * 2) - acc;
            this.range = 110;
        }

        if ((this.weapon.type == 'knife' && acc < 0.2)
            || (this.weapon.type == 'bat' && acc < 0.25)
            || (this.lunge && acc < 0.3)) {
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