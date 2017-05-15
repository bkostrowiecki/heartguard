/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Preloader extends Phaser.State {
    preloaderBar: Phaser.Sprite;

    preload() {
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
    }

    create() {
        var tween = this.add.tween(this.preloaderBar).to({
            alpha: 0
        }, 1000, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(this.startSplash, this);

        this.game.input.gamepad.start();
    }

    startSplash() {
        this.game.state.start('Gameplay', true, false);
    }
}