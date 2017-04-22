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
            this.game.load.image('heart', 'bin/assets/heart.png');
            this.game.load.image('virus', 'bin/assets/virus.png');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloaderBar).to({
                alpha: 0
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startSplash, this);
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
            var heartbeatTween = _this.game.add.tween(_this.scale).to({
                x: 1,
                y: 1
            }, 150, 'Linear', true, 0, -1);
            heartbeatTween.yoyo(true, 850);
            return _this;
        }
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
define("entities/virus", ["require", "exports", "helpers/randomGenerator"], function (require, exports, randomGenerator_1) {
    "use strict";
    var VirusState;
    (function (VirusState) {
        VirusState[VirusState["FollowHeart"] = 0] = "FollowHeart";
        VirusState[VirusState["PrepareToAttack"] = 1] = "PrepareToAttack";
        VirusState[VirusState["Attack"] = 2] = "Attack";
    })(VirusState || (VirusState = {}));
    ;
    var Virus = (function (_super) {
        __extends(Virus, _super);
        function Virus(game, heart) {
            var _this = _super.call(this, game, game.world.centerX - 300, game.world.centerY, 'virus', 1) || this;
            _this.attackCallback = function () { };
            _this.game = game;
            _this.heart = heart;
            _this.virusState = VirusState.FollowHeart;
            _this.randomGenerator = new randomGenerator_1.RandomGenerator();
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.anchor.setTo(0.5, 0.5);
            _this.body.setCircle(_this.width / 2);
            _this.health = 100;
            _this.maxHealth = 100;
            _this.scale.x = 1;
            _this.scale.y = 1;
            _this.virusbeatTween = _this.game.add.tween(_this.scale).to({
                x: 0.85,
                y: 0.85
            }, 100, 'Linear', true, 0, -1);
            _this.virusbeatTween.yoyo(true, 100);
            _this.attackTimer = _this.game.time.create(false);
            _this.attackTimer.loop(3000, _this.attackTick.bind(_this), _this);
            return _this;
        }
        Virus.prototype.update = function () {
            this.game.physics.arcade.overlap(this, this.heart, this.overlapHandler.bind(this), null, this);
            if (this.virusState === VirusState.FollowHeart) {
                this.game.physics.arcade.moveToObject(this, this.heart, 100);
            }
        };
        Virus.prototype.attackTick = function () {
            this.attackCallback(this, this.heart);
            this.heart.health -= 10;
        };
        Virus.prototype.attachAttackCallback = function (attackCallback) {
            this.attackCallback = attackCallback;
        };
        Virus.prototype.overlapHandler = function () {
            var _this = this;
            this.virusState = VirusState.PrepareToAttack;
            this.game.time.events.add(this.randomGenerator.getRandomInteger(1000, 5000), function () {
                _this.body.velocity.x = 0;
                _this.body.velocity.y = 0;
            });
            this.attackTimer.start();
        };
        return Virus;
    }(Phaser.Sprite));
    exports.Virus = Virus;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/gameplay", ["require", "exports", "entities/heart", "entities/virus"], function (require, exports, heart_1, virus_1) {
    "use strict";
    var Gameplay = (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Gameplay.prototype.preload = function () {
            this.game.stage.backgroundColor = 0x890029;
        };
        Gameplay.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.heart = new heart_1.Heart(this.game);
            this.virusTest = new virus_1.Virus(this.game, this.heart);
        };
        Gameplay.prototype.update = function () {
        };
        Gameplay.prototype.render = function () {
            this.game.debug.body(this.heart);
            this.game.debug.body(this.virusTest);
            this.game.debug.text(this.heart.health.toString(), 10, 10, '#fff');
            // for (let i = 0; i < this.things.length; i++) {
            //     this.game.debug.body(this.things[i]);
            // }
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
            var _this = _super.call(this, 1024, 786, Phaser.AUTO, 'content', null) || this;
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
