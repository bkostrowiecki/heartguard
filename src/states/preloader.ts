/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Preloader extends Phaser.State {
    preloaderBar: Phaser.Sprite;

    preload() {
        this.preloaderBar = this.add.sprite(200, 250, 'preloadBar');
        this.load.setPreloadSprite(this.preloaderBar);

        // this.load.image('titlepage', 'assets/titlepage.jpg');
        // this.load.image('logo', 'assets/logo.png');
        // this.load.audio('music', 'assets/title.mp3', true);
        // this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);;
        // this.load.image('level1', 'assets/level1.png');

        this.game.load.image('logo', 'bin/assets/logo.png');
        
        this.game.load.image('heart', 'bin/assets/heart.png');
        this.game.load.image('virus', 'bin/assets/virus.png');
        this.game.load.image('player', 'bin/assets/player.png');
        this.game.load.image('gun', 'bin/assets/gun2.png');
        this.game.load.image('playerTop', 'bin/assets/playerTop.png');
        this.game.load.image('playerLeg', 'bin/assets/playerLeg.png');

        this.game.load.audio('explosion', 'bin/assets/explosion.mp3');
        this.game.load.audio('jump', 'bin/assets/jump.mp3');
        this.game.load.audio('steps', 'bin/assets/steps.mp3');
        this.game.load.audio('gunshot', 'bin/assets/gunshot.mp3');
        this.game.load.audio('hit', 'bin/assets/hit2.mp3');

        this.game.load.audio('heartbeat', 'bin/assets/heartbeat.mp3');
        this.game.load.audio('heartbleed', 'bin/assets/heartbleed.mp3');

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