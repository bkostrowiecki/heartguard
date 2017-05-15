/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
import { RandomGenerator } from '../helpers/randomGenerator';

export class VirusBase extends Phaser.Sprite {
    attackCallback: Function = () => {};
    deathCallback: Function = () => {};

    constructor(game: Phaser.Game, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number) {
        super(game, x, y, key, frame);
    }

    attachDeathCallback(deathCallback: Function) {
        this.deathCallback = deathCallback;
    }

    attachAttackCallback(attackCallback: Function) {
        this.attackCallback = attackCallback;
    }

    heartIsDead() {
    }
}