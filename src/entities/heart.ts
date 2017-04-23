/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Heart extends Phaser.Sprite {
    game: Phaser.Game;

    beatDelay: number;
    heartbeatTween: Phaser.Tween;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'heart', 1);

        this.game = game;

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(this.width / 2, 0, this.height / 6);

        this.anchor.setTo(0.5, 0.5);

        this.health = 100;
        this.maxHealth = 100;

        this.scale.x = 1.1;
        this.scale.y = 1.1;

        this.heartbeatTween = this.game.add.tween(this.scale).to({
            x: 1,
            y: 1
        }, 150, 'Linear', true, 0, -1);

        this.beatDelay = 1000;

        this.heartbeatTween.yoyo(true, this.beatDelay);
    }

    increaseHeartbeat() {
        this.beatDelay -= 70;
        this.heartbeatTween.yoyo(true, this.beatDelay);
    }

    stop() {
        this.heartbeatTween.stop();
    }

    update() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
}