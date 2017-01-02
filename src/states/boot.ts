/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Boot extends Phaser.State {
    preload() {
        this.load.image('preloadBar', 'bin/assets/loader.png');
    }

    create() {
        this.input.maxPointers = 1;

        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            // desktop game settings
        } else {
            // mobile game settings
        }

        this.game.state.start('Preloader', true, false);
    }
}