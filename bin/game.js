var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/headState", ["require", "exports"], function (require, exports) {
    "use strict";
    var HeadMoodState;
    (function (HeadMoodState) {
        HeadMoodState[HeadMoodState["CALM"] = 0] = "CALM";
        HeadMoodState[HeadMoodState["CONSUMING"] = 1] = "CONSUMING";
        HeadMoodState[HeadMoodState["SAD"] = 2] = "SAD";
        HeadMoodState[HeadMoodState["HAPPY"] = 3] = "HAPPY";
    })(HeadMoodState = exports.HeadMoodState || (exports.HeadMoodState = {}));
});
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
define("reaction", ["require", "exports"], function (require, exports) {
    "use strict";
    var Reaction;
    (function (Reaction) {
        Reaction[Reaction["NONE"] = 0] = "NONE";
        Reaction[Reaction["GOOD"] = 1] = "GOOD";
        Reaction[Reaction["BAD"] = 2] = "BAD";
    })(Reaction = exports.Reaction || (exports.Reaction = {}));
    ;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/head", ["require", "exports", "entities/headState", "reaction"], function (require, exports, headState_1, reaction_1) {
    "use strict";
    var Head = (function (_super) {
        __extends(Head, _super);
        function Head(game, x, y) {
            var _this = _super.call(this, game, x, y, 'head', 1) || this;
            _this.anchor.setTo(0.5, 0.5);
            _this.animations.frame = 0;
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.setCircle(_this.width / 3, _this.width / 6, _this.height / 6);
            _this.body.immovable = true;
            _this.moodState = headState_1.HeadMoodState.CALM;
            _this.moodTimer = new Phaser.TimerEvent(new Phaser.Timer(_this.game, false), 0, 0, 0, false, function () { }, _this);
            return _this;
        }
        Head.prototype.update = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        };
        Head.prototype.prepareForSnack = function () {
            if (!this.isMoodDominating()) {
                this.animations.frame = 1;
                this.moodState = headState_1.HeadMoodState.CONSUMING;
                this.triggerMoodChangeCallback();
            }
        };
        Head.prototype.giveUpOnSnack = function () {
            if (!this.isMoodDominating()) {
                this.animations.frame = 0;
                this.moodState = headState_1.HeadMoodState.CALM;
                this.triggerMoodChangeCallback();
            }
        };
        Head.prototype.isMoodDominating = function () {
            return this.moodState == headState_1.HeadMoodState.HAPPY || this.moodState == headState_1.HeadMoodState.SAD;
        };
        Head.prototype.react = function (reaction) {
            switch (reaction) {
                case reaction_1.Reaction.GOOD:
                    this.reactOnGoodie();
                    break;
                case reaction_1.Reaction.BAD:
                    this.reactOnBaddie();
                    break;
                default:
                    break;
            }
        };
        Head.prototype.reactOnGoodie = function () {
            var _this = this;
            this.animations.frame = 2;
            this.moodState = headState_1.HeadMoodState.HAPPY;
            this.game.time.events.remove(this.moodTimer);
            this.moodTimer = this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                _this.animations.frame = 0;
                _this.moodState = headState_1.HeadMoodState.CALM;
                _this.triggerMoodChangeCallback();
            });
        };
        Head.prototype.reactOnBaddie = function () {
            var _this = this;
            this.moodState = headState_1.HeadMoodState.SAD;
            this.animations.frame = 0;
            this.game.time.events.remove(this.moodTimer);
            this.moodTimer = this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                _this.animations.frame = 0;
                _this.moodState = headState_1.HeadMoodState.CALM;
                _this.triggerMoodChangeCallback();
            });
        };
        Head.prototype.registerMoodChangeCallback = function (callback, context) {
            this.moodChangeCallback = callback;
            this.moodChangeCallbackContext = context;
        };
        Head.prototype.getMood = function () {
            return this.moodState;
        };
        Head.prototype.triggerMoodChangeCallback = function () {
            this.moodChangeCallback.call(this.moodChangeCallbackContext, this.moodState);
        };
        return Head;
    }(Phaser.Sprite));
    exports.Head = Head;
});
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
define("randomGenerator", ["require", "exports"], function (require, exports) {
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
/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/things/thing", ["require", "exports", "randomGenerator", "reaction"], function (require, exports, randomGenerator_1, reaction_2) {
    "use strict";
    var Thing = (function (_super) {
        __extends(Thing, _super);
        function Thing(game, assetId, head) {
            var _this = _super.call(this, game, 0, 0, assetId, 0) || this;
            _this.game = game;
            _this.randomGenerator = new randomGenerator_1.RandomGenerator();
            _this.placeInRandomPositionNotCollidingWithHead(head);
            _this.establishPhysics();
            _this.applyRandomDirection();
            _this.establishUserControls();
            _this.playAppearingAnimation();
            return _this;
        }
        Thing.prototype.placeInRandomPositionNotCollidingWithHead = function (head) {
            var point = new Phaser.Point(head.x, head.y);
            while (!this.isRectangleIsInHead(point, head)) {
                point = new Phaser.Point(this.randomGenerator.getRandomInteger(0, this.game.canvas.clientWidth), this.randomGenerator.getRandomInteger(0, this.game.canvas.clientHeight));
            }
            this.x = point.x;
            this.y = point.y;
        };
        Thing.prototype.isRectangleIsInHead = function (point, head) {
            return !((point.x - this.width / 2 > head.x - head.width / 2) && (point.x + this.width / 2 < head.x + head.width / 2) &&
                (point.y - this.height / 2 > head.y - head.height / 2) && (point.y + this.height / 2 < head.y + head.height / 2));
        };
        Thing.prototype.establishPhysics = function () {
            this.anchor.setTo(0.5, 0.5);
            this.game.add.existing(this);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
        };
        Thing.prototype.applyRandomDirection = function () {
            this.velocity = new Phaser.Point(this.randomGenerator.getRandomInteger(0, 100) - 50, this.randomGenerator.getRandomInteger(0, 100) - 50);
            this.body.velocity.x = this.velocity.x;
            this.body.velocity.y = this.velocity.y;
        };
        Thing.prototype.establishUserControls = function () {
            this.inputEnabled = true;
            this.input.enableDrag(true);
            this.events.onDragStart.add(this.onDragStart, this);
            this.events.onDragStop.add(this.onDragStop, this);
        };
        Thing.prototype.playAppearingAnimation = function () {
            this.scale.x = 0;
            this.scale.y = 0;
            var startTweens = [];
            startTweens.push(this.game.add.tween(this.scale).to({
                x: 1.25,
                y: 1.25
            }, 200, Phaser.Easing.Exponential.Out, false, 0));
            startTweens.push(this.game.add.tween(this.scale).to({
                x: 1,
                y: 1
            }, 50, Phaser.Easing.Linear.None, false, 0));
            startTweens[0].chain(startTweens[1]);
            startTweens[0].start();
        };
        Thing.prototype.onDragStart = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        };
        Thing.prototype.onDragStop = function () {
            this.body.velocity.x = this.velocity.x;
            this.body.velocity.y = this.velocity.y;
        };
        Thing.prototype.getScoreValue = function () {
            return 0;
        };
        Thing.prototype.getLiveModifier = function () {
            return 0;
        };
        Thing.prototype.beConsumed = function () {
            return reaction_2.Reaction.NONE;
        };
        Thing.prototype.move = function () { };
        return Thing;
    }(Phaser.Sprite));
    exports.Thing = Thing;
});
/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/things/beer", ["require", "exports", "entities/things/thing", "reaction"], function (require, exports, thing_1, reaction_3) {
    "use strict";
    var Beer = (function (_super) {
        __extends(Beer, _super);
        function Beer(game, head) {
            var _this = _super.call(this, game, 'beer', head) || this;
            _this.game = game;
            return _this;
        }
        Beer.prototype.getScoreValue = function () {
            return 50;
        };
        Beer.prototype.getLiveModifier = function () {
            return 0;
        };
        Beer.prototype.beConsumed = function () {
            this.destroy();
            return reaction_3.Reaction.GOOD;
        };
        Beer.prototype.move = function () {
        };
        return Beer;
    }(thing_1.Thing));
    exports.Beer = Beer;
});
/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/things/broccoli", ["require", "exports", "entities/things/thing", "reaction"], function (require, exports, thing_2, reaction_4) {
    "use strict";
    var Broccoli = (function (_super) {
        __extends(Broccoli, _super);
        function Broccoli(game, head) {
            var _this = _super.call(this, game, 'broccoli', head) || this;
            _this.game = game;
            return _this;
        }
        Broccoli.prototype.getScoreValue = function () {
            return 0;
        };
        Broccoli.prototype.getLiveModifier = function () {
            return 1;
        };
        Broccoli.prototype.beConsumed = function () {
            this.destroy();
            return reaction_4.Reaction.NONE;
        };
        Broccoli.prototype.move = function () {
        };
        return Broccoli;
    }(thing_2.Thing));
    exports.Broccoli = Broccoli;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/boot", ["require", "exports"], function (require, exports) {
    "use strict";
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super.apply(this, arguments) || this;
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
            return _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            this.preloaderBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloaderBar);
            // this.load.image('titlepage', 'assets/titlepage.jpg');
            // this.load.image('logo', 'assets/logo.png');
            // this.load.audio('music', 'assets/title.mp3', true);
            // this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);;
            // this.load.image('level1', 'assets/level1.png');
            this.game.load.image('logo', 'bin/assets/logo.png');
            this.game.load.image('background', 'bin/assets/background.png');
            this.game.load.spritesheet('head', 'bin/assets/head.png', 128, 128, 3);
            this.game.load.image('beer', 'bin/assets/beer.png');
            this.game.load.image('broccoli', 'bin/assets/broccoli.png');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloaderBar).to({
                alpha: 0
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startSplash, this);
        };
        Preloader.prototype.startSplash = function () {
            this.game.state.start('Splash', true, false);
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
            return _super.apply(this, arguments) || this;
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
define("states/gameplay", ["require", "exports", "entities/head", "entities/headState", "entities/things/beer", "randomGenerator"], function (require, exports, head_1, headState_2, beer_1, randomGenerator_2) {
    "use strict";
    var Gameplay = (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            return _super.apply(this, arguments) || this;
        }
        Gameplay.prototype.preload = function () {
            this.randomGenerator = new randomGenerator_2.RandomGenerator();
            this.score = 0;
            this.lives = 3;
            this.comboCounter = 0;
            this.comboPoints = 0;
            this.things = [];
            this.canCreateThing = true;
            this.game.stage.backgroundColor = 0x000000;
        };
        Gameplay.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.add.sprite(0, 0, 'background');
            this.head = new head_1.Head(this.game, this.world.centerX, this.world.centerY);
            this.input.mouse.capture = true;
            this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.activePointer = this.input.activePointer;
            this.head.body.onCollide = new Phaser.Signal();
            this.head.body.onCollide.add(this.headWithThingCollide, this);
            this.head.registerMoodChangeCallback(this.headMoodChangeCallback, this);
        };
        Gameplay.prototype.headMoodChangeCallback = function (headMoodState) {
            if (headMoodState == headState_2.HeadMoodState.CALM && this.comboCounter > 0) {
                this.finishCombo();
            }
        };
        Gameplay.prototype.update = function () {
            var _this = this;
            if (this.spacebar.isDown && this.canCreateThing) {
                this.canCreateThing = false;
                this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
                    _this.canCreateThing = true;
                });
                this.createRandomThing();
            }
            if (this.activePointer.leftButton.isDown) {
                this.head.prepareForSnack();
            }
            else {
                this.head.giveUpOnSnack();
            }
            for (var i = 0; i < this.things.length; i++) {
                this.game.physics.arcade.collide(this.head, this.things[i]);
            }
        };
        Gameplay.prototype.render = function () {
            this.game.debug.text(['Score:', this.score, '   Lives:', this.lives].join(' '), 10, 10, 'white');
            this.game.debug.body(this.head);
            for (var i = 0; i < this.things.length; i++) {
                this.game.debug.body(this.things[i]);
            }
        };
        Gameplay.prototype.createRandomThing = function () {
            var randomConstructors = [beer_1.Beer];
            var randomConstructorIndex = this.randomGenerator.getRandomInteger(0, randomConstructors.length - 1);
            var newThing = new randomConstructors[randomConstructorIndex](this.game, this.head);
            this.things.push(newThing);
        };
        Gameplay.prototype.headWithThingCollide = function (head, collider) {
            var thing = collider;
            this.score += collider.getScoreValue();
            if (head.getMood() == headState_2.HeadMoodState.HAPPY) {
                this.comboCounter++;
                this.comboPoints += collider.getScoreValue();
            }
            if (this.activePointer.leftButton.isDown) {
                this.lives -= collider.getLiveModifier();
            }
            head.react(collider.beConsumed());
        };
        Gameplay.prototype.finishCombo = function () {
            this.score += this.comboPoints * (this.comboCounter);
            console.log('COMBO!', this.comboPoints, this.comboCounter);
            this.comboCounter = 0;
            this.comboPoints = 0;
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
            var _this = _super.call(this, 800, 600, Phaser.AUTO, 'content', null) || this;
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
