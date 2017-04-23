/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class BloodRain extends Phaser.Particles.Arcade.Emitter {
    game: Phaser.Game;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, -game.world.height);

        this.game = game;

        this.width = game.world.width;
	    this.angle = 25; // uncomment to set an angle for the rain.

	    this.makeParticles('blood');

	    this.minParticleScale = 0.25;
	    this.maxParticleScale = 0.75;
        this.alpha = 0.3;

	    this.setYSpeed(300, 500);
	    this.setXSpeed(-5, 5);

	    this.minRotation = 0;
	    this.maxRotation = 0;

	    this.start(false, 2500, 50, 0);
    }
}