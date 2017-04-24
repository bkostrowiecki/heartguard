/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
import { RandomGenerator } from '../helpers/randomGenerator';

enum Direction {
    None = 0,
    Left = 1,
    Right = 2
};

enum GunDirection {
    None = 0,
    Right = 1,
    RightSlightlyTop = 2,
    RightTop = 3,
    Left = 4,
    LeftSlightlyTop = 5,
    LeftTop = 6
};

export class Player extends Phaser.Sprite {
    game: Phaser.Game;
    cursors: Phaser.CursorKeys;
    jumpButton: Phaser.Key;
    fireButton: Phaser.Key;
    pauseButton: Phaser.Key;

    jumpTimer: Number = 0;

    weapon: Phaser.Weapon;

    direction: Direction = Direction.None;
    pad: Phaser.SinglePad;

    jumpSound: Phaser.Sound;
    stepsSound: Phaser.Sound;
    gunshotSound: Phaser.Sound;

    pauseText: Phaser.Text;

    gun: Phaser.Sprite;
    topPlayer: Phaser.Sprite;
    
    leftLeg: Phaser.Sprite;
    leftLegTween: Phaser.Tween;

    rightLeg: Phaser.Sprite;
    rightLegTween: Phaser.Tween;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'player', 1);

        this.game = game;

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.pad = this.game.input.gamepad.pad1;

        this.body.collideWorldBounds = true;
        this.body.gravity.y = 5000;
        this.body.maxVelocity.y = 10000;
        this.body.setSize(64, 64, 0, 0);

        this.body.checkCollision.up = false;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

        this.jumpSound = this.game.add.audio('jump');
        this.jumpSound.allowMultiple = false;

        this.stepsSound = this.game.add.audio('steps');
        this.stepsSound.allowMultiple = false;
        this.stepsSound.loop = true;

        this.establishLook();
        this.setupWeapon();
    }

    establishLook() {
        this.leftLeg = <Phaser.Sprite>this.addChild(this.game.make.sprite(0, 0, 'playerLeg'));
        this.leftLeg.anchor.set(0.5, 0.1);
        this.leftLeg.x = this.width/2 - 10;
        this.leftLeg.y = this.height - 25;

        this.leftLeg.angle -= 45;

        this.leftLegTween = this.game.add.tween(this.leftLeg).to({
            angle: '+100'
        }, 100, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.rightLeg = <Phaser.Sprite>this.addChild(this.game.make.sprite(0, 0, 'playerLeg'));
        this.rightLeg.anchor.set(0.5, 0.1);
        this.rightLeg.x = this.width/2 + 10;
        this.rightLeg.y = this.height - 25;

        this.rightLeg.angle += 55;

        this.rightLegTween = this.game.add.tween(this.rightLeg).to({
            angle: '-100'
        }, 100, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.topPlayer = <Phaser.Sprite>this.addChild(this.game.make.sprite(0, 0, 'playerTop'));
        this.topPlayer.anchor.set(0.5, 0.5);
        this.topPlayer.x = this.width / 2;
        this.topPlayer.y = this.height / 2;

        this.gun = <Phaser.Sprite>this.addChild(this.game.make.sprite(0, 0, 'gun'));
        this.gun.anchor.set(0.2, 0.5);
        this.gun.x = this.width/2;
        this.gun.y = this.height/2 + 5;
    }

    setupWeapon() {
        this.weapon = this.game.add.weapon(50, 'bullet');

        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        this.weapon.bulletAngleOffset = 20;
        this.weapon.bulletSpeed = 1500;
        this.weapon.fireRate = 200;

        this.weapon.bulletAngleVariance = 2;
    
        this.weapon.trackSprite(<any>this, 32, 32);

        class WeaponBullet extends Phaser.Bullet {
            constructor(game, x, y, direction, speed) {
                super(game, x, y, direction, speed);
                this.z = -1;
            }
        }
        this.weapon.bulletClass = WeaponBullet;

        this.weapon.onFire.add(() => {
            this.gunshotSound.play();
        });

        this.gunshotSound = this.game.add.audio('gunshot');
        this.gunshotSound.allowMultiple = true;
        this.gunshotSound.volume = 0.2;
    }

    update() {
        this.body.velocity.x = 0;

        if (this.checkLeft()) {
            this.direction = Direction.Left;
            
            this.body.velocity.x = -450;

            if (this.checkUp()) {
                this.weapon.fireAngle = 180 + 40;
            } else if (this.checkDown()) {
                this.weapon.fireAngle = 180 - 40;
            } else {
                this.weapon.fireAngle = 180;
            }

            this.tryPlaySteps();
        } else if (this.checkRight()) {
            this.direction = Direction.Right;

            this.body.velocity.x = 450;
            this.weapon.fireAngle = 360;

            if (this.checkUp()) {
                this.weapon.fireAngle = 360 - 40;
            } else if (this.checkDown()) {
                this.weapon.fireAngle = 360 + 40;
            } else {
                this.weapon.fireAngle = 360;
            }
            this.tryPlaySteps();
        } else if (this.checkUp()) {
            this.weapon.fireAngle = 270;
        } else if (this.checkDown()) {
            this.weapon.fireAngle = 90;
        }

        if (this.direction === Direction.Left) {
            this.gun.scale.y = -1;
            this.topPlayer.scale.x = -1;
            this.leftLeg.scale.x = -1;
            this.rightLeg.scale.x = -1;
        } else {
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
        } else {
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
            setInterval(() => {
                if (this.checkPause()) {
                    this.game.paused = false;
                    this.pauseText.destroy();
                }
            }, 100);
        }
    }

    tryPlaySteps() {
        if (!this.stepsSound.isPlaying) {
            this.stepsSound.play();
        }
    }

    stopPlayingSteps() {
        this.game.time.events.add(500, () => {
            if (this.stepsSound.isPlaying) {
                this.stepsSound.stop();
            }
        });
    }

    checkLeft() {
        return this.cursors.left.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1;
    }

    checkRight() {
        return this.cursors.right.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)  || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1;
    }

    checkUp() {
        return this.cursors.up.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)  || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1;
    }

    checkDown() {
        return this.cursors.down.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)  || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1;
    }

    checkJumpButton() {
        return this.jumpButton.isDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_B);
    }

    checkFireButton() {
        return this.fireButton.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_X);
    }

    checkPause() {
        return this.pauseButton.justDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_START);
    }

    getWeapon() {
        return this.weapon;
    }
}