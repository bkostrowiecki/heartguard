/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Heart } from '../entities/heart';
import { Virus, VirusState } from '../entities/virus';
import { RandomGenerator } from '../helpers/randomGenerator';
import { Player } from '../entities/player';

export class Gameplay extends Phaser.State {
    heart: Heart;
    player: Player;

    viruses: Virus[] = [];

    newVirusTimer: Phaser.Timer;

    platforms: Phaser.Group;

    score: number = 0;

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

        this.buildLevel();
    }

    buildLevel() {
        let wall = this.game.add.sprite(0, this.game.world.centerY, 'platform');
    }

    virusTimerCallback() {
        let virus = new Virus(this.game, this.heart);
        this.viruses.push(virus);

        let virusEvents = virus.events;

        virus.attachAttackCallback(() => {
            let loosingHealthText = this.game.add.text(virus.position.x - 50, virus.position.y - 50, '-5 HP', {
                font: '48px Arial',
                fill: '#fff'
            });

            loosingHealthText.alpha = 1;

            let loosingHealthTextTween = this.game.add.tween(loosingHealthText).to({
                y: '-75',
                alpha: 0
            }, 1000, 'Linear', true, 0, 0);

            this.game.time.events.add(1000, () => {
                loosingHealthText.destroy();
            });
        });

        virus.attachDeathCallback(() => {
            let deathText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Your heart is not beating anymore', {
                font: '46px Arial',
                fill: '#fff'
            });

            deathText.anchor.set(0.5, 0.5);

            deathText.alpha = 1;

            let deathTextTween = this.game.add.tween(deathText).to({
                y: '-100',
                alpha: 0
            }, 8000, 'Linear', true, 0, 0);

            for (let i = 0; i < this.viruses.length; i++) {
                this.viruses[i].heartIsDead();
            }

            this.game.time.events.add(8000, () => {
                this.game.state.restart();
            });
        });

        virusEvents.onKilled.addOnce(() => {
            this.score += 10;

            let scoreText = this.game.add.text(virus.position.x - 50, virus.position.y - 50, '+10 Points', {
                font: '48px Arial',
                fill: '#fff'
            });

            scoreText.alpha = 1;

            let scoreTextTween = this.game.add.tween(scoreText).to({
                y: '-75',
                alpha: 0
            }, 1000, 'Linear', true, 0, 0);

            this.game.time.events.add(1000, () => {
                scoreText.destroy();
            });
        });
    }

    update() {
        this.viruses.forEach((virus) => {
            this.game.physics.arcade.overlap(this.player.getWeapon().bullets, virus, this.virusBulletCollision.bind(this));
        })
    }

    virusBulletCollision(virus: Virus, bullet) {
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
        this.game.debug.text(this.heart.health.toString(), 10, 10, '#fff');
        this.game.debug.text(this.score.toString(), this.world.game.width - 100, 10, '#fff');
        //this.game.debug.body(this.heart);

        // for (let i = 0; i < this.things.length; i++) {
        //     this.game.debug.body(this.things[i]);
        // }
    }
}