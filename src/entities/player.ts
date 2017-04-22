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

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'player', 1);

        this.game = game;

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);


        this.body.collideWorldBounds = true;
        this.body.gravity.y = 5000;
        this.body.maxVelocity.y = 10000;
        this.body.setSize(80, 80, 0, 0);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);

        this.weapon = this.game.add.weapon(50, 'bullet');

        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        this.weapon.bulletAngleOffset = 20;
        this.weapon.bulletSpeed = 1500;
        this.weapon.fireRate = 250;

        this.weapon.bulletAngleVariance = 2;
    
        this.weapon.trackSprite(this, 40, 40);
    }

    update() {
        this.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.body.velocity.x = -800;

            this.direction = Direction.Left;

            if (this.cursors.up.isDown) {
                this.weapon.fireAngle = 180 + 40;
            } else if (this.cursors.down.isDown) {
                this.weapon.fireAngle = 180 - 40;
            } else {
                this.weapon.fireAngle = 180;
            }
        } else if (this.cursors.right.isDown) {
            this.direction = Direction.Right;

            this.body.velocity.x = 800;
            this.weapon.fireAngle = 360;

            if (this.cursors.up.isDown) {
                this.weapon.fireAngle = 360 - 40;
            } else if (this.cursors.down.isDown) {
                this.weapon.fireAngle = 360 + 40;
            } else {
                this.weapon.fireAngle = 360;
            }

        } else if (this.cursors.up.isDown) {
            this.weapon.fireAngle = 270;
        } else if (this.cursors.down.isDown) {
            this.weapon.fireAngle = 90;
        }

        if (this.jumpButton.isDown && this.body.onFloor() && this.game.time.now > this.jumpTimer) {
            this.body.velocity.y = -1700;
            this.jumpTimer = this.game.time.now + 750;
        }

        if (this.fireButton.isDown) {
            this.weapon.fire();
        }
    }

    getWeapon() {
        return this.weapon;
    }

    render() {
        this.game.debug.bodyInfo(this, 16, 24);
    }
}