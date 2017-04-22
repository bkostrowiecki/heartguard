/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Heart } from '../entities/heart';
import { Virus } from '../entities/virus';
import { RandomGenerator } from '../helpers/randomGenerator';
import { Player } from '../entities/player';

export class Gameplay extends Phaser.State {
    heart: Heart;
    player: Player;

    viruses: Virus[] = [];

    newVirusTimer: Phaser.Timer;

    preload() {
        this.game.stage.backgroundColor = 0x890029;
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.heart = new Heart(this.game);

        this.player = new Player(this.game);

        this.newVirusTimer = this.game.time.create(false);
        this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
        this.newVirusTimer.start();

    }

    virusTimerCallback() {
        let virus = new Virus(this.game, this.heart);
        this.viruses.push(virus);
    }

    update() {
        this.viruses.forEach((virus) => {
            this.game.physics.arcade.overlap(this.player.getWeapon().bullets, virus, this.virusBulletCollision.bind(this));
        })
    }

    virusBulletCollision(virus, bullet) {
        bullet.kill();
        virus.damage(15);

        virus.tint = 0xcccc00;

        this.game.time.events.add(200, () => {
            if (virus && virus.alive) {
                virus.tint = 0xffffff;
                virus.alpha = 1;
            }
        });
    }

    render() {
        this.game.debug.body(this.heart);

        this.game.debug.text(this.heart.health.toString(), 10, 10, '#fff');
        // for (let i = 0; i < this.things.length; i++) {
        //     this.game.debug.body(this.things[i]);
        // }
    }
}