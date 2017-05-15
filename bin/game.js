var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/boot", ["require", "exports"], function (require, exports) {
    "use strict";
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'bin/assets/loader.png');
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
            }
            else {
            }
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    }(Phaser.State));
    exports.Boot = Boot;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/preloader", ["require", "exports"], function (require, exports) {
    "use strict";
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            this.preloaderBar = this.add.sprite(200, 550, 'preloadBar');
            this.load.setPreloadSprite(this.preloaderBar);
            this.game.load.image('logo', 'bin/assets/logo.png');
            this.game.load.image('heart', 'bin/assets/heart.png');
            this.game.load.image('virus', 'bin/assets/virus.png');
            this.game.load.image('superVirus', 'bin/assets/superVirus.png');
            this.game.load.image('megaVirus', 'bin/assets/megaVirus.png');
            this.game.load.image('player', 'bin/assets/player.png');
            this.game.load.image('gun', 'bin/assets/gun2.png');
            this.game.load.image('playerTop', 'bin/assets/playerTop.png');
            this.game.load.image('playerLeg', 'bin/assets/playerLeg.png');
            this.game.load.audio('explosion', ['bin/assets/explosion.mp3', 'bin/assets/explosion.ogg']);
            this.game.load.audio('jump', ['bin/assets/jump.mp3', 'bin/assets/jump.ogg']);
            this.game.load.audio('steps', ['bin/assets/steps.mp3', 'bin/assets/steps.ogg']);
            this.game.load.audio('gunshot', ['bin/assets/gunshot.mp3', 'bin/assets/gunshot.ogg']);
            this.game.load.audio('hit', ['bin/assets/hit2.mp3', 'bin/assets/hit2.ogg']);
            this.game.load.audio('heartbeat', ['bin/assets/heartbeat.mp3', 'bin/assets/heartbeat.ogg']);
            this.game.load.audio('heartbleed', ['bin/assets/heartbleed.mp3', 'bin/assets/heartbleed.ogg']);
            this.game.load.image('bullet', 'bin/assets/bullet.png');
            this.game.load.image('explosionParticle', 'bin/assets/explosionParticle.png');
            this.game.load.image('blood', 'bin/assets/blood.png');
            this.game.load.image('platform', 'bin/assets/platform.png');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloaderBar).to({
                alpha: 0
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startSplash, this);
            this.game.input.gamepad.start();
        };
        Preloader.prototype.startSplash = function () {
            this.game.state.start('Gameplay', true, false);
        };
        return Preloader;
    }(Phaser.State));
    exports.Preloader = Preloader;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/splash", ["require", "exports"], function (require, exports) {
    "use strict";
    var Splash = (function (_super) {
        __extends(Splash, _super);
        function Splash() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Splash.prototype.preload = function () {
            this.game.stage.backgroundColor = 0xB20059;
        };
        Splash.prototype.create = function () {
            var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);
            this.game.input.onTap.add(this.onTap, this);
        };
        Splash.prototype.onTap = function () {
            this.game.state.start('Gameplay', true, false);
        };
        return Splash;
    }(Phaser.State));
    exports.Splash = Splash;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/heart", ["require", "exports"], function (require, exports) {
    "use strict";
    var Heart = (function (_super) {
        __extends(Heart, _super);
        function Heart(game) {
            var _this = _super.call(this, game, game.world.centerX, game.world.centerY, 'heart', 1) || this;
            _this.game = game;
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.setCircle(_this.width / 2, 0, _this.height / 6);
            _this.anchor.setTo(0.5, 0.5);
            _this.health = 100;
            _this.maxHealth = 100;
            _this.scale.x = 1.1;
            _this.scale.y = 1.1;
            _this.heartbeatTween = _this.game.add.tween(_this.scale).to({
                x: 1,
                y: 1
            }, 150, 'Linear', true, 0, -1);
            _this.beatDelay = 1000;
            _this.heartbeatTween.yoyo(true, _this.beatDelay);
            _this.heartbeatSound = _this.game.add.audio('heartbeat');
            _this.heartbeatSound.allowMultiple = false;
            var index = 0;
            _this.heartbeatTween.onLoop.add(function () {
                index++;
                if (index % 2 === 0) {
                    _this.heartbeatSound.play();
                }
            });
            _this.heartbleedSound = _this.game.add.audio('heartbleed');
            _this.heartbleedSound.allowMultiple = false;
            _this.heartbleedSound.volume = 0.65;
            return _this;
        }
        Heart.prototype.increaseHeartbeat = function () {
            this.beatDelay -= 60;
            this.heartbeatTween.yoyo(true, this.beatDelay);
            this.heartbleedSound.play();
        };
        Heart.prototype.stop = function () {
            this.heartbeatTween.stop();
        };
        Heart.prototype.update = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        };
        return Heart;
    }(Phaser.Sprite));
    exports.Heart = Heart;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("helpers/randomGenerator", ["require", "exports"], function (require, exports) {
    "use strict";
    var RandomGenerator = (function () {
        function RandomGenerator() {
        }
        RandomGenerator.prototype.getRandomInteger = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        return RandomGenerator;
    }());
    exports.RandomGenerator = RandomGenerator;
});
define("entities/virusBase", ["require", "exports"], function (require, exports) {
    "use strict";
    var VirusBase = (function (_super) {
        __extends(VirusBase, _super);
        function VirusBase(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.attackCallback = function () { };
            _this.deathCallback = function () { };
            return _this;
        }
        VirusBase.prototype.attachDeathCallback = function (deathCallback) {
            this.deathCallback = deathCallback;
        };
        VirusBase.prototype.attachAttackCallback = function (attackCallback) {
            this.attackCallback = attackCallback;
        };
        VirusBase.prototype.heartIsDead = function () {
        };
        return VirusBase;
    }(Phaser.Sprite));
    exports.VirusBase = VirusBase;
});
define("entities/virus", ["require", "exports", "helpers/randomGenerator", "entities/virusBase"], function (require, exports, randomGenerator_1, virusbase_1) {
    "use strict";
    var VirusState;
    (function (VirusState) {
        VirusState[VirusState["FollowHeart"] = 0] = "FollowHeart";
        VirusState[VirusState["PrepareToAttack"] = 1] = "PrepareToAttack";
        VirusState[VirusState["Attack"] = 2] = "Attack";
        VirusState[VirusState["HeartIsDead"] = 3] = "HeartIsDead";
    })(VirusState = exports.VirusState || (exports.VirusState = {}));
    ;
    var Virus = (function (_super) {
        __extends(Virus, _super);
        function Virus(game, heart) {
            var _this = _super.call(this, game, -2000, -200, 'virus', 1) || this;
            _this.game = game;
            _this.heart = heart;
            _this.virusState = VirusState.FollowHeart;
            _this.randomGenerator = new randomGenerator_1.RandomGenerator();
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.anchor.setTo(0.5, 0.5);
            _this.body.setCircle(_this.width / 2);
            //this.body.setSize(80, 80, 0, 0);
            _this.body.immovable = true;
            _this.health = 100;
            _this.maxHealth = 100;
            _this.scale.x = 1;
            _this.scale.y = 1;
            if (_this.randomGenerator.getRandomInteger(0, 1)) {
                _this.position.x = -100;
            }
            else {
                _this.position.x = _this.game.world.width + 100;
            }
            _this.position.y = _this.randomGenerator.getRandomInteger(-100, _this.game.world.height + 100);
            _this.virusbeatTween = _this.game.add.tween(_this.scale).to({
                x: 0.85,
                y: 0.85
            }, 100, Phaser.Easing.Cubic.In, true, 0, -1);
            _this.virusbeatTween.yoyo(true, 100);
            _this.attackTimer = _this.game.time.create(false);
            _this.attackTimer.loop(3000, _this.attackTick.bind(_this), _this);
            _this.events.onKilled.addOnce(function () {
                _this.onKilled();
            });
            _this.explosionEmitter = _this.game.add.emitter(_this.game.world.centerX, _this.game.world.centerY, 30);
            _this.explosionEmitter.makeParticles('explosionParticle');
            _this.explosionEmitter.gravity = 0;
            _this.explosionEmitter.lifespan = 400;
            _this.explosionEmitter.minParticleScale = 0.75;
            _this.explosionEmitter.minParticleSpeed.set(-500, -500);
            _this.explosionEmitter.maxParticleSpeed.set(500, 500);
            _this.explosionEmitter.maxParticleScale = 2;
            _this.heartbleedEmitter = _this.game.add.emitter(_this.game.world.centerX, _this.game.world.centerY, 5);
            _this.heartbleedEmitter.makeParticles('blood');
            _this.heartbleedEmitter.gravity = 1000;
            _this.heartbleedEmitter.lifespan = 400;
            _this.heartbleedEmitter.minParticleScale = 0.75;
            _this.heartbleedEmitter.minParticleSpeed.set(-100, -100);
            _this.heartbleedEmitter.maxParticleSpeed.set(100, 250);
            _this.heartbleedEmitter.maxParticleScale = 2;
            _this.explosionSound = _this.game.add.audio('explosion');
            _this.explosionSound.allowMultiple = false;
            _this.hitSound = _this.game.add.audio('hit');
            _this.hitSound.allowMultiple = true;
            _this.hitSound.volume = 0.4;
            return _this;
        }
        Virus.prototype.update = function () {
            this.game.physics.arcade.overlap(this, this.heart, this.overlapHandler.bind(this), null, this);
            if (!this.alive) {
                this.destroy();
                this.attackTimer.destroy();
            }
            if (this.alive && this.virusState === VirusState.FollowHeart) {
                this.game.physics.arcade.moveToObject(this, this.heart, 100);
            }
            this.explosionEmitter.x = this.x;
            this.explosionEmitter.y = this.y;
            this.heartbleedEmitter.x = this.x;
            this.heartbleedEmitter.y = this.y;
        };
        Virus.prototype.onKilled = function () {
            var _this = this;
            this.explosionEmitter.start(true, 400, null, 20, false);
            this.explosionEmitter.forEachAlive(function (particle) {
                particle.alpha = 1;
                _this.game.add.tween(particle).to({
                    alpha: 0
                }, 350, Phaser.Easing.Cubic.In, true, 0, null, false);
            }, this);
            this.explosionSound.play();
            this.game.time.events.add(1000, function () {
                _this.explosionEmitter.destroy();
            }, this);
            this.game.time.events.add(2000, function () {
                _this.explosionSound.destroy();
            }, this);
        };
        Virus.prototype.playDamageSound = function () {
            this.hitSound.play();
        };
        Virus.prototype.animateDamage = function () {
            var _this = this;
            this.tint = 0xcccc00;
            this.game.time.events.add(200, function () {
                if (_this && _this.alive) {
                    _this.tint = 0xffffff;
                    _this.alpha = 1;
                }
            });
        };
        Virus.prototype.attackTick = function () {
            var _this = this;
            if (this.heart.health <= 0 && this.heart.alive) {
                this.heart.alive = false;
                this.heart.stop();
                this.deathCallback(this, this.heart);
                return;
            }
            if (!this.heart.alive) {
                return;
            }
            this.attackCallback(this, this.heart);
            this.heart.health -= 5;
            this.heart.increaseHeartbeat();
            this.heart.tint = 0xffff00;
            this.heart.alpha = 0.5;
            this.heartbleedEmitter.start(true, 300, null, 5);
            this.game.time.events.add(200, function () {
                _this.heart.tint = 0xffffff;
                _this.heart.alpha = 1;
            });
        };
        Virus.prototype.heartIsDead = function () {
            this.virusState = VirusState.HeartIsDead;
            if (this.body) {
                this.body.velocity.x = this.randomGenerator.getRandomInteger(0, 1000) - 500;
                this.body.velocity.y = this.randomGenerator.getRandomInteger(0, 1000) - 500;
            }
        };
        Virus.prototype.overlapHandler = function () {
            var _this = this;
            if (this.virusState === VirusState.HeartIsDead) {
                return;
            }
            this.virusState = VirusState.PrepareToAttack;
            this.game.time.events.add(this.randomGenerator.getRandomInteger(1000, 5000), function () {
                if (_this.alive && _this.virusState !== VirusState.HeartIsDead) {
                    _this.body.velocity.x = 0;
                    _this.body.velocity.y = 0;
                }
            });
            this.attackTimer.start();
        };
        return Virus;
    }(virusbase_1.VirusBase));
    exports.Virus = Virus;
});
define("entities/superVirus", ["require", "exports", "helpers/randomGenerator", "entities/virusBase"], function (require, exports, randomGenerator_2, virusbase_2) {
    "use strict";
    var VirusState;
    (function (VirusState) {
        VirusState[VirusState["Free"] = 0] = "Free";
        VirusState[VirusState["Rest"] = 1] = "Rest";
        VirusState[VirusState["FollowHeart"] = 2] = "FollowHeart";
        VirusState[VirusState["PrepareToAttack"] = 3] = "PrepareToAttack";
        VirusState[VirusState["Attack"] = 4] = "Attack";
        VirusState[VirusState["HeartIsDead"] = 5] = "HeartIsDead";
    })(VirusState = exports.VirusState || (exports.VirusState = {}));
    ;
    var SuperVirus = (function (_super) {
        __extends(SuperVirus, _super);
        function SuperVirus(game, heart) {
            var _this = _super.call(this, game, -2000, -200, 'superVirus', 1) || this;
            _this.game = game;
            _this.heart = heart;
            _this.virusState = VirusState.Free;
            _this.randomGenerator = new randomGenerator_2.RandomGenerator();
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.anchor.setTo(0.5, 0.5);
            _this.body.setCircle(_this.width / 2);
            //this.body.setSize(80, 80, 0, 0);
            _this.body.immovable = true;
            _this.health = 150;
            _this.maxHealth = 150;
            _this.scale.x = 1;
            _this.scale.y = 1;
            if (_this.randomGenerator.getRandomInteger(0, 1)) {
                _this.position.x = -100;
            }
            else {
                _this.position.x = _this.game.world.width + 100;
            }
            _this.position.y = _this.randomGenerator.getRandomInteger(-100, _this.game.world.height + 100);
            _this.virusbeatTween = _this.game.add.tween(_this.scale).to({
                x: 0.85,
                y: 0.85
            }, 100, Phaser.Easing.Cubic.In, true, 0, -1);
            _this.virusbeatTween.yoyo(true, 100);
            // this.virusShakeTween = this.game.add.tween(this).to({
            //     x: '+10'
            // }, 100, Phaser.Easing.Cubic.In, true, 0, -1);
            // this.virusShakeTween.yoyo(true, 100);
            _this.attackTimer = _this.game.time.create(false);
            _this.attackTimer.loop(2500, _this.attackTick.bind(_this), _this);
            _this.events.onKilled.addOnce(function () {
                _this.onKilled();
            });
            _this.explosionEmitter = _this.game.add.emitter(_this.game.world.centerX, _this.game.world.centerY, 30);
            _this.explosionEmitter.makeParticles('explosionParticle');
            _this.explosionEmitter.gravity = 0;
            _this.explosionEmitter.lifespan = 400;
            _this.explosionEmitter.minParticleScale = 0.75;
            _this.explosionEmitter.minParticleSpeed.set(-500, -500);
            _this.explosionEmitter.maxParticleSpeed.set(500, 500);
            _this.explosionEmitter.maxParticleScale = 2;
            _this.heartbleedEmitter = _this.game.add.emitter(_this.game.world.centerX, _this.game.world.centerY, 5);
            _this.heartbleedEmitter.makeParticles('blood');
            _this.heartbleedEmitter.gravity = 1000;
            _this.heartbleedEmitter.lifespan = 400;
            _this.heartbleedEmitter.minParticleScale = 0.75;
            _this.heartbleedEmitter.minParticleSpeed.set(-100, -100);
            _this.heartbleedEmitter.maxParticleSpeed.set(100, 250);
            _this.heartbleedEmitter.maxParticleScale = 2;
            _this.explosionSound = _this.game.add.audio('explosion');
            _this.explosionSound.allowMultiple = false;
            _this.hitSound = _this.game.add.audio('hit');
            _this.hitSound.allowMultiple = true;
            _this.hitSound.volume = 0.4;
            _this.body.velocity.x = _this.randomGenerator.getRandomInteger(0, 700) - 350;
            _this.body.velocity.y = _this.randomGenerator.getRandomInteger(0, 700) - 350;
            _this.game.time.events.add(7000, function () {
                _this.virusState = VirusState.Rest;
            });
            _this.game.time.events.add(9000, function () {
                _this.virusState = VirusState.FollowHeart;
            });
            return _this;
        }
        SuperVirus.prototype.update = function () {
            this.game.physics.arcade.overlap(this, this.heart, this.overlapHandler.bind(this), null, this);
            if (!this.alive) {
                this.destroy();
                this.attackTimer.destroy();
            }
            if (this.alive && this.virusState === VirusState.Free) {
                this.game.physics.arcade.moveToXY(this, this.heart.x + this.randomGenerator.getRandomInteger(0, 200) - 100, this.heart.y + this.randomGenerator.getRandomInteger(0, 200) - 100, 30);
            }
            if (this.alive && this.virusState === VirusState.Rest) {
                this.body.velocity.set(0, 0);
            }
            if (this.alive && this.virusState === VirusState.FollowHeart) {
                this.game.physics.arcade.moveToObject(this, this.heart, 600);
            }
            this.explosionEmitter.x = this.x;
            this.explosionEmitter.y = this.y;
            this.heartbleedEmitter.x = this.x;
            this.heartbleedEmitter.y = this.y;
        };
        SuperVirus.prototype.onKilled = function () {
            var _this = this;
            this.explosionEmitter.start(true, 400, null, 20, false);
            this.explosionEmitter.forEachAlive(function (particle) {
                particle.alpha = 1;
                _this.game.add.tween(particle).to({
                    alpha: 0
                }, 350, Phaser.Easing.Cubic.In, true, 0, null, false);
            }, this);
            this.explosionSound.play();
            this.game.time.events.add(1000, function () {
                _this.explosionEmitter.destroy();
            }, this);
            this.game.time.events.add(2000, function () {
                _this.explosionSound.destroy();
            }, this);
        };
        SuperVirus.prototype.playDamageSound = function () {
            this.hitSound.play();
        };
        SuperVirus.prototype.animateDamage = function () {
            var _this = this;
            this.tint = 0xcccc00;
            this.game.time.events.add(200, function () {
                if (_this && _this.alive) {
                    _this.tint = 0xffffff;
                    _this.alpha = 1;
                }
            });
        };
        SuperVirus.prototype.attackTick = function () {
            var _this = this;
            if (this.heart.health <= 0 && this.heart.alive) {
                this.heart.alive = false;
                this.heart.stop();
                this.deathCallback(this, this.heart);
                return;
            }
            if (!this.heart.alive) {
                return;
            }
            this.attackCallback(this, this.heart);
            this.heart.health -= 5;
            this.heart.increaseHeartbeat();
            this.heart.tint = 0xffff00;
            this.heart.alpha = 0.5;
            this.heartbleedEmitter.start(true, 300, null, 5);
            this.game.time.events.add(200, function () {
                _this.heart.tint = 0xffffff;
                _this.heart.alpha = 1;
            });
        };
        SuperVirus.prototype.heartIsDead = function () {
            this.virusState = VirusState.HeartIsDead;
            if (this.body) {
                this.body.velocity.x = this.randomGenerator.getRandomInteger(0, 1000) - 500;
                this.body.velocity.y = this.randomGenerator.getRandomInteger(0, 1000) - 500;
            }
        };
        SuperVirus.prototype.overlapHandler = function () {
            var _this = this;
            if (this.virusState === VirusState.HeartIsDead) {
                return;
            }
            this.virusState = VirusState.PrepareToAttack;
            this.game.time.events.add(this.randomGenerator.getRandomInteger(200, 1000), function () {
                if (_this.alive && _this.virusState !== VirusState.HeartIsDead) {
                    _this.body.velocity.x = 0;
                    _this.body.velocity.y = 0;
                }
            });
            this.attackTimer.start();
        };
        return SuperVirus;
    }(virusbase_2.VirusBase));
    exports.SuperVirus = SuperVirus;
});
define("entities/megaVirus", ["require", "exports", "helpers/randomGenerator", "entities/virusBase"], function (require, exports, randomGenerator_3, virusbase_3) {
    "use strict";
    var VirusState;
    (function (VirusState) {
        VirusState[VirusState["Rest"] = 1] = "Rest";
        VirusState[VirusState["FollowHeart"] = 2] = "FollowHeart";
        VirusState[VirusState["PrepareToAttack"] = 3] = "PrepareToAttack";
        VirusState[VirusState["Attack"] = 4] = "Attack";
        VirusState[VirusState["HeartIsDead"] = 5] = "HeartIsDead";
    })(VirusState || (VirusState = {}));
    ;
    var MegaVirus = (function (_super) {
        __extends(MegaVirus, _super);
        function MegaVirus(game, heart) {
            var _this = _super.call(this, game, -2000, -200, 'megaVirus', 1) || this;
            _this.game = game;
            _this.heart = heart;
            _this.virusState = VirusState.FollowHeart;
            _this.randomGenerator = new randomGenerator_3.RandomGenerator();
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.anchor.setTo(0.5, 0.5);
            _this.body.setCircle(_this.width / 2);
            //this.body.setSize(80, 80, 0, 0);
            _this.body.immovable = true;
            _this.health = 450;
            _this.maxHealth = 450;
            _this.scale.x = 1;
            _this.scale.y = 1;
            if (_this.randomGenerator.getRandomInteger(0, 1)) {
                _this.position.x = -100;
            }
            else {
                _this.position.x = _this.game.world.width + 100;
            }
            _this.position.y = _this.randomGenerator.getRandomInteger(-100, _this.game.world.height + 100);
            _this.virusbeatTween = _this.game.add.tween(_this.scale).to({
                x: 0.95,
                y: 0.95
            }, 100, Phaser.Easing.Cubic.In, true, 0, -1);
            _this.virusbeatTween.yoyo(true, 100);
            // this.virusShakeTween = this.game.add.tween(this).to({
            //     x: '+10'
            // }, 100, Phaser.Easing.Cubic.In, true, 0, -1);
            // this.virusShakeTween.yoyo(true, 100);
            _this.attackTimer = _this.game.time.create(false);
            _this.attackTimer.loop(6000, _this.attackTick.bind(_this), _this);
            _this.events.onKilled.addOnce(function () {
                _this.onKilled();
            });
            _this.explosionEmitter = _this.game.add.emitter(_this.game.world.centerX, _this.game.world.centerY, 30);
            _this.explosionEmitter.makeParticles('explosionParticle');
            _this.explosionEmitter.gravity = 0;
            _this.explosionEmitter.lifespan = 400;
            _this.explosionEmitter.minParticleScale = 0.75;
            _this.explosionEmitter.minParticleSpeed.set(-500, -500);
            _this.explosionEmitter.maxParticleSpeed.set(500, 500);
            _this.explosionEmitter.maxParticleScale = 2;
            _this.heartbleedEmitter = _this.game.add.emitter(_this.game.world.centerX, _this.game.world.centerY, 5);
            _this.heartbleedEmitter.makeParticles('blood');
            _this.heartbleedEmitter.gravity = 1000;
            _this.heartbleedEmitter.lifespan = 400;
            _this.heartbleedEmitter.minParticleScale = 0.75;
            _this.heartbleedEmitter.minParticleSpeed.set(-100, -100);
            _this.heartbleedEmitter.maxParticleSpeed.set(100, 250);
            _this.heartbleedEmitter.maxParticleScale = 2;
            _this.explosionSound = _this.game.add.audio('explosion');
            _this.explosionSound.allowMultiple = false;
            _this.hitSound = _this.game.add.audio('hit');
            _this.hitSound.allowMultiple = true;
            _this.hitSound.volume = 0.4;
            _this.body.velocity.x = _this.randomGenerator.getRandomInteger(0, 700) - 350;
            _this.body.velocity.y = _this.randomGenerator.getRandomInteger(0, 700) - 350;
            _this.restTimer = _this.game.time.create(false);
            _this.restTimer.loop(4000, function () {
                if (_this.virusState === VirusState.FollowHeart) {
                    _this.virusState = VirusState.Rest;
                }
                else if (_this.virusState === VirusState.Rest) {
                    _this.virusState = VirusState.FollowHeart;
                }
            });
            _this.restTimer.start();
            return _this;
        }
        MegaVirus.prototype.update = function () {
            this.game.physics.arcade.overlap(this, this.heart, this.overlapHandler.bind(this), null, this);
            if (!this.alive) {
                this.destroy();
                this.attackTimer.destroy();
            }
            if (this.alive && this.virusState === VirusState.Rest) {
                this.body.velocity.set(0, 0);
            }
            if (this.alive && this.virusState === VirusState.FollowHeart) {
                this.game.physics.arcade.moveToObject(this, this.heart, 40);
            }
            this.explosionEmitter.x = this.x;
            this.explosionEmitter.y = this.y;
            this.heartbleedEmitter.x = this.x;
            this.heartbleedEmitter.y = this.y;
        };
        MegaVirus.prototype.onKilled = function () {
            var _this = this;
            this.explosionEmitter.start(true, 400, null, 20, false);
            this.explosionEmitter.forEachAlive(function (particle) {
                particle.alpha = 1;
                _this.game.add.tween(particle).to({
                    alpha: 0
                }, 350, Phaser.Easing.Cubic.In, true, 0, null, false);
            }, this);
            this.explosionSound.play();
            this.game.time.events.add(1000, function () {
                _this.explosionEmitter.destroy();
            }, this);
            this.game.time.events.add(2000, function () {
                _this.explosionSound.destroy();
            }, this);
        };
        MegaVirus.prototype.playDamageSound = function () {
            this.hitSound.play();
        };
        MegaVirus.prototype.animateDamage = function () {
            var _this = this;
            this.tint = 0xcccc00;
            this.game.time.events.add(200, function () {
                if (_this && _this.alive) {
                    _this.tint = 0xffffff;
                    _this.alpha = 1;
                }
            });
        };
        MegaVirus.prototype.attackTick = function () {
            var _this = this;
            if (this.heart.health <= 0 && this.heart.alive) {
                this.heart.alive = false;
                this.heart.stop();
                this.deathCallback(this, this.heart);
                return;
            }
            if (!this.heart.alive) {
                return;
            }
            this.attackCallback(this, this.heart);
            this.heart.health -= 10;
            this.heart.increaseHeartbeat();
            this.heart.tint = 0xffff00;
            this.heart.alpha = 0.5;
            this.heartbleedEmitter.start(true, 300, null, 5);
            this.game.time.events.add(200, function () {
                _this.heart.tint = 0xffffff;
                _this.heart.alpha = 1;
            });
        };
        MegaVirus.prototype.heartIsDead = function () {
            this.virusState = VirusState.HeartIsDead;
            if (this.body) {
                this.body.velocity.x = this.randomGenerator.getRandomInteger(0, 1000) - 500;
                this.body.velocity.y = this.randomGenerator.getRandomInteger(0, 1000) - 500;
            }
        };
        MegaVirus.prototype.overlapHandler = function () {
            var _this = this;
            if (this.virusState === VirusState.HeartIsDead) {
                return;
            }
            this.virusState = VirusState.PrepareToAttack;
            this.game.time.events.add(this.randomGenerator.getRandomInteger(4000, 6000), function () {
                if (_this.alive && _this.virusState !== VirusState.HeartIsDead) {
                    _this.body.velocity.x = 0;
                    _this.body.velocity.y = 0;
                }
            });
            this.attackTimer.start();
        };
        return MegaVirus;
    }(virusbase_3.VirusBase));
    exports.MegaVirus = MegaVirus;
});
define("entities/player", ["require", "exports"], function (require, exports) {
    "use strict";
    var Direction;
    (function (Direction) {
        Direction[Direction["None"] = 0] = "None";
        Direction[Direction["Left"] = 1] = "Left";
        Direction[Direction["Right"] = 2] = "Right";
    })(Direction || (Direction = {}));
    ;
    var GunDirection;
    (function (GunDirection) {
        GunDirection[GunDirection["None"] = 0] = "None";
        GunDirection[GunDirection["Right"] = 1] = "Right";
        GunDirection[GunDirection["RightSlightlyTop"] = 2] = "RightSlightlyTop";
        GunDirection[GunDirection["RightTop"] = 3] = "RightTop";
        GunDirection[GunDirection["Left"] = 4] = "Left";
        GunDirection[GunDirection["LeftSlightlyTop"] = 5] = "LeftSlightlyTop";
        GunDirection[GunDirection["LeftTop"] = 6] = "LeftTop";
    })(GunDirection || (GunDirection = {}));
    ;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game) {
            var _this = _super.call(this, game, game.world.centerX, game.world.centerY, 'player', 1) || this;
            _this.jumpTimer = 0;
            _this.direction = Direction.None;
            _this.game = game;
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.pad = _this.game.input.gamepad.pad1;
            _this.body.collideWorldBounds = true;
            _this.body.gravity.y = 5000;
            _this.body.maxVelocity.y = 10000;
            _this.body.setSize(64, 64, 0, 0);
            _this.body.checkCollision.up = false;
            _this.cursors = _this.game.input.keyboard.createCursorKeys();
            _this.jumpButton = _this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            _this.jumpButton2 = _this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            _this.fireButton = _this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            _this.fireButton2 = _this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            _this.pauseButton = _this.game.input.keyboard.addKey(Phaser.Keyboard.P);
            _this.jumpSound = _this.game.add.audio('jump');
            _this.jumpSound.allowMultiple = false;
            _this.stepsSound = _this.game.add.audio('steps');
            _this.stepsSound.allowMultiple = false;
            _this.stepsSound.loop = true;
            _this.establishLook();
            _this.setupWeapon();
            return _this;
        }
        Player.prototype.establishLook = function () {
            this.leftLeg = this.addChild(this.game.make.sprite(0, 0, 'playerLeg'));
            this.leftLeg.anchor.set(0.5, 0.1);
            this.leftLeg.x = this.width / 2 - 10;
            this.leftLeg.y = this.height - 25;
            this.leftLeg.angle -= 45;
            this.leftLegTween = this.game.add.tween(this.leftLeg).to({
                angle: '+100'
            }, 100, Phaser.Easing.Linear.None, true, 0, -1, true);
            this.rightLeg = this.addChild(this.game.make.sprite(0, 0, 'playerLeg'));
            this.rightLeg.anchor.set(0.5, 0.1);
            this.rightLeg.x = this.width / 2 + 10;
            this.rightLeg.y = this.height - 25;
            this.rightLeg.angle += 55;
            this.rightLegTween = this.game.add.tween(this.rightLeg).to({
                angle: '-100'
            }, 100, Phaser.Easing.Linear.None, true, 0, -1, true);
            this.topPlayer = this.addChild(this.game.make.sprite(0, 0, 'playerTop'));
            this.topPlayer.anchor.set(0.5, 0.5);
            this.topPlayer.x = this.width / 2;
            this.topPlayer.y = this.height / 2;
            this.gun = this.addChild(this.game.make.sprite(0, 0, 'gun'));
            this.gun.anchor.set(0.2, 0.5);
            this.gun.x = this.width / 2;
            this.gun.y = this.height / 2 + 5;
        };
        Player.prototype.setupWeapon = function () {
            var _this = this;
            this.weapon = this.game.add.weapon(50, 'bullet');
            this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            this.weapon.bulletAngleOffset = 20;
            this.weapon.bulletSpeed = 1500;
            this.weapon.fireRate = 200;
            this.weapon.bulletAngleVariance = 2;
            this.weapon.trackSprite(this, 32, 32);
            var WeaponBullet = (function (_super) {
                __extends(WeaponBullet, _super);
                function WeaponBullet(game, x, y, direction, speed) {
                    var _this = _super.call(this, game, x, y, direction, speed) || this;
                    _this.z = -1;
                    return _this;
                }
                return WeaponBullet;
            }(Phaser.Bullet));
            this.weapon.bulletClass = WeaponBullet;
            this.weapon.onFire.add(function () {
                _this.gunshotSound.play();
            });
            this.gunshotSound = this.game.add.audio('gunshot');
            this.gunshotSound.allowMultiple = true;
            this.gunshotSound.volume = 0.2;
        };
        Player.prototype.update = function () {
            var _this = this;
            this.body.velocity.x = 0;
            if (this.checkLeft()) {
                this.direction = Direction.Left;
                this.body.velocity.x = -450;
                if (this.checkUp()) {
                    this.weapon.fireAngle = 180 + 40;
                }
                else if (this.checkDown()) {
                    this.weapon.fireAngle = 180 - 40;
                }
                else {
                    this.weapon.fireAngle = 180;
                }
                this.tryPlaySteps();
            }
            else if (this.checkRight()) {
                this.direction = Direction.Right;
                this.body.velocity.x = 450;
                this.weapon.fireAngle = 360;
                if (this.checkUp()) {
                    this.weapon.fireAngle = 360 - 40;
                }
                else if (this.checkDown()) {
                    this.weapon.fireAngle = 360 + 40;
                }
                else {
                    this.weapon.fireAngle = 360;
                }
                this.tryPlaySteps();
            }
            else if (this.checkUp()) {
                this.weapon.fireAngle = 270;
            }
            else if (this.checkDown()) {
                this.weapon.fireAngle = 90;
            }
            if (this.direction === Direction.Left) {
                this.gun.scale.y = -1;
                this.topPlayer.scale.x = -1;
                this.leftLeg.scale.x = -1;
                this.rightLeg.scale.x = -1;
            }
            else {
                this.gun.scale.y = 1;
                this.topPlayer.scale.x = 1;
                this.leftLeg.scale.x = 1;
                this.rightLeg.scale.x = 1;
            }
            if (!this.checkLeft() && !this.checkRight()) {
                this.stopPlayingSteps();
                this.leftLegTween.pause();
                this.leftLeg.angle = 10;
                this.rightLegTween.pause();
                this.rightLeg.angle = -10;
            }
            else {
                if (this.leftLegTween.isPaused) {
                    this.leftLegTween.resume();
                }
                if (this.rightLegTween.isPaused) {
                    this.rightLegTween.resume();
                }
            }
            if (this.checkJumpButton() && (this.body.onFloor() || this.body.touching.down) && this.game.time.now > this.jumpTimer) {
                this.body.velocity.y = -1700;
                this.jumpTimer = this.game.time.now + 750;
                this.jumpSound.play();
            }
            if (this.checkFireButton()) {
                this.weapon.fire();
            }
            this.gun.angle = this.weapon.fireAngle;
            if (this.checkPause()) {
                console.log('pause');
                this.game.paused = true;
                this.pauseText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Pause', {
                    font: '64px Impact',
                    fill: '#ddd',
                    align: 'left'
                });
                this.pauseText.anchor.set(0.5, 0.5);
                setInterval(function () {
                    if (_this.checkPause()) {
                        _this.game.paused = false;
                        _this.pauseText.destroy();
                    }
                }, 100);
            }
        };
        Player.prototype.tryPlaySteps = function () {
            if (!this.stepsSound.isPlaying) {
                this.stepsSound.play();
            }
        };
        Player.prototype.stopPlayingSteps = function () {
            var _this = this;
            this.game.time.events.add(500, function () {
                if (_this.stepsSound.isPlaying) {
                    _this.stepsSound.stop();
                }
            });
        };
        Player.prototype.checkLeft = function () {
            return this.cursors.left.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1;
        };
        Player.prototype.checkRight = function () {
            return this.cursors.right.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1;
        };
        Player.prototype.checkUp = function () {
            return this.cursors.up.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1;
        };
        Player.prototype.checkDown = function () {
            return this.cursors.down.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1;
        };
        Player.prototype.checkJumpButton = function () {
            return this.jumpButton.isDown || this.jumpButton2.isDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_B);
        };
        Player.prototype.checkFireButton = function () {
            return this.fireButton.isDown || this.fireButton2.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_X);
        };
        Player.prototype.checkPause = function () {
            return this.pauseButton.justDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_START);
        };
        Player.prototype.getWeapon = function () {
            return this.weapon;
        };
        return Player;
    }(Phaser.Sprite));
    exports.Player = Player;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/bloodRain", ["require", "exports"], function (require, exports) {
    "use strict";
    var BloodRain = (function (_super) {
        __extends(BloodRain, _super);
        function BloodRain(game) {
            var _this = _super.call(this, game, game.world.centerX, -game.world.height) || this;
            _this.game = game;
            _this.width = game.world.width;
            _this.angle = 25; // uncomment to set an angle for the rain.
            _this.makeParticles('blood');
            _this.minParticleScale = 0.25;
            _this.maxParticleScale = 0.75;
            _this.alpha = 0.3;
            _this.setYSpeed(300, 500);
            _this.setXSpeed(-5, 5);
            _this.minRotation = 0;
            _this.maxRotation = 0;
            _this.start(false, 2500, 50, 0);
            return _this;
        }
        return BloodRain;
    }(Phaser.Particles.Arcade.Emitter));
    exports.BloodRain = BloodRain;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/gameplay", ["require", "exports", "entities/heart", "entities/virus", "entities/superVirus", "entities/megaVirus", "helpers/randomGenerator", "entities/player", "entities/bloodRain"], function (require, exports, heart_1, virus_1, superVirus_1, megaVirus_1, randomGenerator_4, player_1, bloodRain_1) {
    "use strict";
    var Gameplay = (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.viruses = [];
            _this.platforms = [];
            _this.score = 0;
            _this.killedViruses = 0;
            _this.emittedViruses = 0;
            _this.wave = 1;
            _this.spawnTime = 3000;
            return _this;
        }
        Gameplay.prototype.preload = function () {
            this.game.stage.backgroundColor = 0x890029;
        };
        Gameplay.prototype.create = function () {
            var _this = this;
            this.spawnTime = 3000;
            this.wave = 1;
            this.killedViruses = 0;
            this.emittedViruses = 0;
            this.score = 0;
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.bloodRain = new bloodRain_1.BloodRain(this.game);
            this.heart = new heart_1.Heart(this.game);
            this.player = new player_1.Player(this.game);
            this.setAi();
            this.buildLevel();
            var textStyle = {
                font: '36px Impact',
                fill: '#fff',
                align: 'left'
            };
            this.scoreText = this.game.add.text(20, 10, this.getScoreText(), textStyle);
            this.healthText = this.game.add.text(this.game.world.width - 20, 10, this.getHealthText(), textStyle);
            this.healthText.anchor.set(1, 0);
            this.randomGenerator = new randomGenerator_4.RandomGenerator();
            this.waveIncrementator = this.game.time.create(false);
            this.waveIncrementator.loop(20000, function () {
                _this.wave++;
                _this.spawnTime -= 100;
                _this.newVirusTimer.loop(_this.spawnTime, _this.virusTimerCallback.bind(_this), _this);
                _this.newVirusTimer.start(3000);
            });
            this.flashTitle();
        };
        Gameplay.prototype.setAi = function () {
            this.killedViruses = 0;
            this.wave = 1;
            this.newVirusTimer = this.game.time.create(false);
            this.newVirusTimer.loop(4500, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start();
            this.flashWaveNumber(this.wave);
        };
        Gameplay.prototype.updateAi = function () {
            var aiBreakpoint = 3;
            if (this.emittedViruses === aiBreakpoint && this.wave === 1) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 1) {
                this.newVirusTimer.loop(4500, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(3000);
                this.flashWaveNumber(++this.wave);
            }
            // 2nd
            aiBreakpoint += 5;
            if (this.emittedViruses === aiBreakpoint && this.wave === 2) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 2) {
                this.newVirusTimer.loop(4000, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(3000);
                this.flashWaveNumber(++this.wave);
            }
            // 3th
            aiBreakpoint += 5;
            if (this.emittedViruses === aiBreakpoint && this.wave === 3) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 3) {
                this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(3000);
                this.flashWaveNumber(++this.wave);
            }
            // 4th
            aiBreakpoint += 3;
            if (this.emittedViruses === aiBreakpoint && this.wave === 4) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 4) {
                this.newVirusTimer.loop(500, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(3000);
                this.flashWaveNumber(++this.wave);
            }
            // 5th
            aiBreakpoint += 3;
            if (this.emittedViruses === aiBreakpoint && this.wave === 5) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 5) {
                this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(3000);
                this.flashWaveNumber(++this.wave);
            }
            // 6th
            aiBreakpoint += 5;
            if (this.emittedViruses === aiBreakpoint && this.wave === 6) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 6) {
                this.newVirusTimer.loop(2500, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(2500);
                this.flashWaveNumber(this.wave++);
            }
            // 7th
            aiBreakpoint += 3;
            if (this.emittedViruses === aiBreakpoint && this.wave === 7) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 7) {
                this.newVirusTimer.loop(2500, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(2500);
                this.flashWaveNumber(this.wave++);
            }
            // 8th
            aiBreakpoint += 5;
            if (this.emittedViruses === aiBreakpoint && this.wave === 8) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 8) {
                this.newVirusTimer.loop(2500, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(2500);
                this.flashWaveNumber(this.wave++);
            }
            // 9th
            aiBreakpoint += 10;
            if (this.emittedViruses === aiBreakpoint && this.wave === 9) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 9) {
                this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(3000);
                this.flashWaveNumber(this.wave++);
            }
            // 10th
            aiBreakpoint += 2;
            if (this.emittedViruses === aiBreakpoint && this.wave === 10) {
                this.newVirusTimer.stop();
            }
            if (this.killedViruses === aiBreakpoint && this.wave === 10) {
                this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
                this.newVirusTimer.start(3000);
                this.flashRampage();
                this.wave++;
            }
            aiBreakpoint += 5;
            if (this.killedViruses === aiBreakpoint && this.wave === 11) {
                this.waveIncrementator.start();
                this.killedViruses++;
                this.wave++;
            }
        };
        Gameplay.prototype.flashWaveNumber = function (wave) {
            var _this = this;
            this.game.time.events.add(3000, function () {
                var waveText = _this.game.add.text(_this.game.world.centerX, _this.game.world.centerY, 'Wave ' + wave, {
                    font: '64px Impact',
                    fill: '#fff'
                });
                waveText.anchor.set(0.5, 0.5);
                waveText.alpha = 1;
                var waveTextTween = _this.game.add.tween(waveText).to({
                    y: '-75',
                    alpha: 0
                }, 3000, 'Linear', true, 0, 0);
                _this.game.time.events.add(3000, function () {
                    waveText.destroy();
                });
            });
        };
        Gameplay.prototype.flashRampage = function () {
            var _this = this;
            this.game.time.events.add(2000, function () {
                var waveText = _this.game.add.text(_this.game.world.centerX, _this.game.world.centerY, 'RAMPAGE!', {
                    font: '90px Impact',
                    fill: '#fff'
                });
                waveText.anchor.set(0.5, 0.5);
                waveText.alpha = 1;
                var waveTextTween = _this.game.add.tween(waveText).to({
                    y: '-75',
                    alpha: 0
                }, 3000, 'Linear', true, 0, 0);
                _this.game.time.events.add(3000, function () {
                    waveText.destroy();
                });
            });
        };
        Gameplay.prototype.flashTitle = function () {
            var _this = this;
            this.game.time.events.add(1000, function () {
                var waveText = _this.game.add.text(_this.game.world.centerX, _this.game.world.centerY, 'Heart guard', {
                    font: '90px Impact',
                    fill: '#fff'
                });
                waveText.anchor.set(0.5, 0.5);
                waveText.alpha = 1;
                var waveTextTween = _this.game.add.tween(waveText).to({
                    y: '-75',
                    alpha: 0
                }, 5000, 'Linear', true, 0, 0);
                _this.game.time.events.add(5000, function () {
                    waveText.destroy();
                });
            });
            this.game.time.events.add(1000, function () {
                var waveText = _this.game.add.text(_this.game.world.centerX, _this.game.world.centerY + 60, 'Protect the heart no matter what!', {
                    font: '40px Impact',
                    fill: '#fff'
                });
                waveText.anchor.set(0.5, 0.5);
                waveText.alpha = 1;
                var waveTextTween = _this.game.add.tween(waveText).to({
                    y: '-75',
                    alpha: 0
                }, 5000, 'Linear', true, 0, 0);
                _this.game.time.events.add(5000, function () {
                    waveText.destroy();
                });
            });
        };
        Gameplay.prototype.getScoreText = function () {
            return 'Score: ' + this.score.toString();
        };
        Gameplay.prototype.getHealthText = function () {
            return 'Health: ' + this.heart.health.toString();
        };
        Gameplay.prototype.buildLevel = function () {
            var _this = this;
            var platforms = [{
                    x: this.game.world.width - 150,
                    y: this.game.world.centerY + 150,
                    w: 150,
                    h: 20
                }, {
                    x: 0,
                    y: this.game.world.centerY + 150,
                    w: 150,
                    h: 20
                }, {
                    x: this.game.world.width - 150,
                    y: this.game.world.centerY - 150,
                    w: 150,
                    h: 20
                }, {
                    x: 0,
                    y: this.game.world.centerY - 150,
                    w: 150,
                    h: 20
                }, {
                    x: this.game.world.centerX + 160,
                    y: this.game.world.centerY,
                    w: 100,
                    h: 20
                }, {
                    x: this.game.world.centerX - 160 - 100,
                    y: this.game.world.centerY,
                    w: 100,
                    h: 20
                }, {
                    x: 0,
                    y: this.game.world.height - 20,
                    w: this.game.world.width,
                    h: 20
                }];
            platforms.forEach(function (platformsItem) {
                var platform = _this.game.add.tileSprite(0, 0, 40, 40, 'platform');
                platform.anchor.set(0, 0);
                platform.width = platformsItem.w;
                platform.height = platformsItem.h;
                platform.position.set(platformsItem.x, platformsItem.y);
                _this.game.physics.enable(platform);
                platform.body.collideWorldBounds = true;
                platform.body.immovable = true;
                platform.body.allowGravity = false;
                platform.body.checkCollision.left = false;
                platform.body.checkCollision.right = false;
                _this.platforms.push(platform);
            });
        };
        Gameplay.prototype.virusTimerCallback = function () {
            var _this = this;
            var virus, hpLost;
            if (this.wave <= 3) {
                virus = new virus_1.Virus(this.game, this.heart);
                hpLost = 5;
            }
            else if (this.wave === 4) {
                virus = new superVirus_1.SuperVirus(this.game, this.heart);
                hpLost = 5;
            }
            else if (this.wave > 4 && this.wave < 10) {
                if (this.randomGenerator.getRandomInteger(0, 15 - this.wave) > 1) {
                    virus = new virus_1.Virus(this.game, this.heart);
                    hpLost = 5;
                }
                else {
                    virus = new superVirus_1.SuperVirus(this.game, this.heart);
                    hpLost = 10;
                }
            }
            else if (this.wave === 10) {
                virus = new megaVirus_1.MegaVirus(this.game, this.heart);
                hpLost = 10;
            }
            else {
                var random = this.randomGenerator.getRandomInteger(0, 25 - this.wave);
                if (random > 10) {
                    virus = new virus_1.Virus(this.game, this.heart);
                    hpLost = 5;
                }
                else if (random > 5) {
                    virus = new superVirus_1.SuperVirus(this.game, this.heart);
                    hpLost = 10;
                }
                else {
                    virus = new megaVirus_1.MegaVirus(this.game, this.heart);
                    hpLost = 10;
                }
            }
            this.viruses.push(virus);
            var virusEvents = virus.events;
            this.emittedViruses++;
            this.updateAi();
            virus.attachAttackCallback(function () {
                var loosingHealthText = _this.game.add.text(virus.position.x - 50, virus.position.y - 50, '-' + hpLost.toString() + ' HP', {
                    font: '48px Impact',
                    fill: '#fff'
                });
                loosingHealthText.alpha = 1;
                var loosingHealthTextTween = _this.game.add.tween(loosingHealthText).to({
                    y: '-75',
                    alpha: 0
                }, 1000, 'Linear', true, 0, 0);
                _this.game.time.events.add(1000, function () {
                    loosingHealthText.destroy();
                });
                _this.updateAi();
            });
            virus.attachDeathCallback(function () {
                var deathText = _this.game.add.text(_this.game.world.centerX, _this.game.world.centerY, 'Your heart is not beating anymore', {
                    font: '46px Impact',
                    fill: '#fff'
                });
                deathText.anchor.set(0.5, 0.5);
                deathText.alpha = 1;
                var deathTextTween = _this.game.add.tween(deathText).to({
                    y: '-100',
                    alpha: 0
                }, 8000, 'Linear', true, 0, 0);
                for (var i = 0; i < _this.viruses.length; i++) {
                    _this.viruses[i].heartIsDead();
                }
                _this.game.time.events.add(8000, function () {
                    _this.game.state.restart();
                });
                _this.updateAi();
            });
            virusEvents.onKilled.addOnce(function () {
                _this.score += 10;
                var scoreText = _this.game.add.text(virus.position.x - 50, virus.position.y - 50, '+10 Points', {
                    font: '48px Impact',
                    fill: '#fff'
                });
                scoreText.alpha = 1;
                var scoreTextTween = _this.game.add.tween(scoreText).to({
                    y: '-75',
                    alpha: 0
                }, 1000, 'Linear', true, 0, 0);
                _this.game.time.events.add(1000, function () {
                    scoreText.destroy();
                });
                _this.killedViruses++;
                _this.updateAi();
            });
        };
        Gameplay.prototype.update = function () {
            var _this = this;
            this.viruses.forEach(function (virus) {
                _this.game.physics.arcade.overlap(_this.player.getWeapon().bullets, virus, _this.virusBulletCollision.bind(_this));
                _this.game.physics.arcade.collide(_this.player, virus, _this.virusPlayerCollision.bind(_this));
            });
            this.platforms.forEach(function (platform) {
                _this.game.physics.arcade.collide(_this.player, platform);
            });
        };
        Gameplay.prototype.virusBulletCollision = function (virus, bullet) {
            bullet.kill();
            virus.damage(15);
            virus.playDamageSound();
            virus.animateDamage();
        };
        Gameplay.prototype.virusPlayerCollision = function (player, virus) {
        };
        Gameplay.prototype.render = function () {
            this.scoreText.text = this.getScoreText();
            this.healthText.text = this.getHealthText();
        };
        return Gameplay;
    }(Phaser.State));
    exports.Gameplay = Gameplay;
});
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
define("game", ["require", "exports", "states/boot", "states/preloader", "states/splash", "states/gameplay"], function (require, exports, boot_1, preloader_1, splash_1, gameplay_1) {
    "use strict";
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            // create our phaser game
            // 800 - width
            // 600 - height
            // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
            // 'content' - the name of the container to add our game to
            // { preload:this.preload, create:this.create} - functions to call for our states
            var _this = _super.call(this, 1000, 700, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', boot_1.Boot, false);
            _this.state.add('Preloader', preloader_1.Preloader, false);
            _this.state.add('Splash', splash_1.Splash, false);
            _this.state.add('Gameplay', gameplay_1.Gameplay, false);
            _this.state.start('Boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    function bootGame() {
        // when the page has finished loading, create our game
        var game = new Game();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = bootGame;
});
