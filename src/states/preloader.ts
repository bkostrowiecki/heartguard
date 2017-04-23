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

        this.game.load.image('bullet', 'bin/assets/bullet.png');
        this.game.load.image('explosionParticle', 'bin/assets/explosionParticle.png');
        this.game.load.image('blood', 'bin/assets/blood.png');

    }

    create() {
        var tween = this.add.tween(this.preloaderBar).to({
            alpha: 0
        }, 1000, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(this.startSplash, this);
    }

    startSplash() {
        this.game.state.start('Gameplay', true, false);
    }
}