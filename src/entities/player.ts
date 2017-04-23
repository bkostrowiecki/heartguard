/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
import { RandomGenerator } from '../helpers/randomGenerator';

enum Direction {
    None = 0,
    Left = 1,
    Right = 2
};

export class Player extends Phaser.Sprite {
    game: Phaser.Game;
    cursors: Phaser.CursorKeys;
    jumpButton: Phaser.Key;
    fireButton: Phaser.Key;

    jumpTimer: Number = 0;

    weapon: Phaser.Weapon;

    direction: Direction = Direction.None;
    pad: Phaser.SinglePad;

    jumpSound: Phaser.Sound;
    stepsSound: Phaser.Sound;
    gunshotSound: Phaser.Sound;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'player', 1);

        this.game = game;

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.pad = this.game.input.gamepad.pad1;

        this.body.collideWorldBounds = true;
        this.body.gravity.y = 5000;
        this.body.maxVelocity.y = 10000;
        this.body.setSize(80, 80, 0, 0);

        this.body.checkCollision.up = false;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);

        this.weapon = this.game.add.weapon(50, 'bullet');

        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        this.weapon.bulletAngleOffset = 20;
        this.weapon.bulletSpeed = 1500;
        this.weapon.fireRate = 200;

        this.weapon.bulletAngleVariance = 2;
    
        this.weapon.trackSprite(this, 40, 40);

        this.jumpSound = this.game.add.audio('jump');
        this.jumpSound.allowMultiple = false;

        this.stepsSound = this.game.add.audio('steps');
        this.stepsSound.allowMultiple = false;
        this.stepsSound.loop = true;

        this.gunshotSound = this.game.add.audio('gunshot');
        this.gunshotSound.allowMultiple = true;
        this.gunshotSound.volume = 0.2;

        this.weapon.onFire.add(() => {
            this.gunshotSound.play();
        });
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

        if (!this.checkLeft() && !this.checkRight()) {
            this.stopPlayingSteps();
        }

        if (this.checkJumpButton() && (this.body.onFloor() || this.body.touching.down) && this.game.time.now > this.jumpTimer) {
            this.body.velocity.y = -1700;
            this.jumpTimer = this.game.time.now + 750;

            this.jumpSound.play();
        }

        if (this.checkFireButton()) {
            this.weapon.fire();
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

    getWeapon() {
        return this.weapon;
    }

    render() {
        this.game.debug.bodyInfo(this, 16, 24);
    }
}