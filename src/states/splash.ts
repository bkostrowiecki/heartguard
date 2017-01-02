/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Splash extends Phaser.State {
    preload() {
        this.game.stage.backgroundColor = 0xB20059;
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		logo.anchor.setTo(0.5, 0.5);

        this.game.input.onTap.add(this.onTap, this);
    }

    onTap() {
        this.game.state.start('Gameplay', true, false);
    }
}
