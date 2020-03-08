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
    console.log('loading level 1...');

    // street 01
    if (Math.floor(Math.random() * 20) == 0) {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street01.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 439, 10, 112), 'street');
        else this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street01.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 1270, 439, 10, 112), 'street');
    } else {
        if (Math.floor(Math.random() * 4) == 0)
            this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street01.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 439, 10, 112), 'street');
        else this.levels[0].streets[0] = new Background(game, ('./img/backgrounds/street01.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 1270, 439, 10, 112), 'street');
    }
    // street 02
    if (Math.floor(Math.random() * 20) == 0) {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street02.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 156, 10, 114), 'street');
        else this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street02.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 156, 10, 114), 'street');
    } else {
        if (Math.floor(Math.random() * 4) == 0)
            this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street02.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 156, 10, 114), 'street');
        else this.levels[0].streets[1] = new Background(game, ('./img/backgrounds/street02.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 0, 156, 10, 114), 'street');
    }
    // street 03
    if (Math.floor(Math.random() * 20) == 0) {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street03.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 386, 10, 110), 'street');
        else this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street03.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 1270, 386, 10, 110), 'street');
    } else {
        if (Math.floor(Math.random() * 4) == 0)
            this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street03.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 386, 10, 110), 'street');
        else this.levels[0].streets[2] = new Background(game, ('./img/backgrounds/street03.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 1270, 386, 10, 110), 'street');
    }
    // street 04
    if (Math.floor(Math.random() * 20) == 0) {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street04.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 478, 10, 111), 'street');
        else this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street04.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 478, 10, 111), 'street');
    } else {
        if (Math.floor(Math.random() * 4) == 0)
            this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street04.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 478, 10, 111), 'street');
        else this.levels[0].streets[3] = new Background(game, ('./img/backgrounds/street04.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 0, 478, 10, 111), 'street');
    }
    // street 05
    if (Math.floor(Math.random() * 20) == 0) {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street05.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 600, 0, 111, 10), 'street');
        else this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street05.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 600, 0, 111, 10), 'street');
    } else {
        if (Math.floor(Math.random() * 4) == 0)
            this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street05.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 600, 0, 111, 10), 'street');
        else this.levels[0].streets[4] = new Background(game, ('./img/backgrounds/street05.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 600, 0, 111, 10), 'street');
    }
    // street 00
    if (Math.floor(Math.random() * 20) == 0) {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street00.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 376, 10, 112), 'street');
        else this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street00.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 1),
            new Door(game, 0, 376, 10, 112), 'street');
    } else {
        if (Math.floor(Math.random() * 4) == 0)
            this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street00.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 3), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 376, 10, 112), 'street');
        else this.levels[0].streets[5] = new Background(game, ('./img/backgrounds/street00.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 3), 0),
            new Door(game, 0, 376, 10, 112), 'street');
    }

    // house 01
    if (Math.floor(Math.random() * 10) == 0) {
        if (Math.floor(Math.random() * 2) == 0)
            this.levels[0].houses[0] = new Background(game, ('./img/backgrounds/house01.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 362, 10, 108), 'house');
        else this.levels[0].houses[0] = new Background(game, ('./img/backgrounds/house01.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 362, 10, 108), 'house');
    } else {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].houses[0] = new Background(game, ('./img/backgrounds/house01.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 362, 10, 108), 'house');
        else this.levels[0].houses[0] = new Background(game, ('./img/backgrounds/house01.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 0, 362, 10, 108), 'house');
    }
    // house 02
    if (Math.floor(Math.random() * 10) == 0) {
        if (Math.floor(Math.random() * 2) == 0)
            this.levels[0].houses[1] = new Background(game, ('./img/backgrounds/house02.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 312, 10, 109), 'house');
        else this.levels[0].houses[1] = new Background(game, ('./img/backgrounds/house02.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 1270, 312, 10, 109), 'house');
    } else {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].houses[1] = new Background(game, ('./img/backgrounds/house02.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 312, 10, 109), 'house');
        else this.levels[0].houses[1] = new Background(game, ('./img/backgrounds/house02.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 1270, 312, 10, 109), 'house');
    }
    // house 03
    if (Math.floor(Math.random() * 7) == 0) {
        if (Math.floor(Math.random() * 2) == 0)
            this.levels[0].houses[2] = new Background(game, ('./img/backgrounds/house03.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 0, 297, 10, 109), 'house');
        else this.levels[0].houses[2] = new Background(game, ('./img/backgrounds/house03.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 0, 297, 10, 109), 'house');
    } else {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].houses[2] = new Background(game, ('./img/backgrounds/house03.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 0, 297, 10, 109), 'house');
        else this.levels[0].houses[2] = new Background(game, ('./img/backgrounds/house03.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 0, 297, 10, 109), 'house');
    }
    // house 04
    if (Math.floor(Math.random() * 7) == 0) {
        if (Math.floor(Math.random() * 2) == 0)
            this.levels[0].houses[3] = new Background(game, ('./img/backgrounds/house04.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 1, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 189, 10, 113), 'house');
        else this.levels[0].houses[3] = new Background(game, ('./img/backgrounds/house04.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 1),
            new Door(game, 1270, 189, 10, 113), 'house');
    } else {
        if (Math.floor(Math.random() * 3) == 0)
            this.levels[0].houses[3] = new Background(game, ('./img/backgrounds/house04.png'),
                new Weapon(game, this.player, Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 4)),
                new Door(game, 1270, 189, 10, 113), 'house');
        else this.levels[0].houses[3] = new Background(game, ('./img/backgrounds/house04.png'),
            new Weapon(game, this.player, Math.floor(Math.random() * 2), 0),
            new Door(game, 1270, 189, 10, 113), 'house');
    }
    // house 05
    this.levels[0].houses[4] = new Background(game, ('./img/backgrounds/house05.png'),
        new Weapon(game, this.player, 2, Math.floor(Math.random() * 2), Math.floor(Math.random() * 4)),
        new Door(game, 577, 710, 116, 10), 'house');
    // house 00
    this.levels[0].houses[5] = new Background(game, ('./img/backgrounds/house00.png'),
        new Weapon(game, this.player, 1, 0), new Door(game, 1270, 176, 10, 96), 'house');

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
    this.levels[0].houses[5].walls.push(new Column(game, 950, 270, 65));
    this.levels[0].houses[5].walls.push(new Wall(game, 809, 274, 53, 61));
    this.levels[0].houses[5].walls.push(new Wall(game, 1022, 227, 53, 61));
    this.levels[0].houses[5].walls.push(new Wall(game, 1250, 0, 30, 176));
    this.levels[0].houses[5].walls.push(new Wall(game, 1250, 272, 30, 450));
    this.levels[0].houses[5].walls.push(new Wall(game, 1181, 447, 52, 200));
    this.levels[0].houses[5].walls.push(new Wall(game, 989, 457, 94, 192));
    this.levels[0].houses[5].walls.push(new Wall(game, 788, 427, 92, 248));
    this.levels[0].houses[5].walls.push(new Roof(game, 0, 0, './img/backgrounds/house00shadow.png'));
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
    this.levels[0].houses[0].walls.push(new Column(game, 987, 264, 107));
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
    this.levels[0].houses[3].walls.push(new Column(game, 838, 210, 76));
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
    this.levels[0].houses[4].enemies.push(new SlowDogg(game, dogs));

    // this.levels[0].streets[5].enemies.push(new BigGuy(game));

    console.log('loading complete!');
}

SceneManager.prototype.buildLevelTwo = function () {
    this.levels[1] = { streets: [], houses: [] };
    console.log('loading level 2...');

    
}