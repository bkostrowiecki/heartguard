/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Heart } from '../entities/heart';
import { Virus, VirusState } from '../entities/virus';
import { RandomGenerator } from '../helpers/randomGenerator';
import { Player } from '../entities/player';
import { BloodRain } from '../entities/bloodRain';

export class Gameplay extends Phaser.State {
    heart: Heart;
    player: Player;

    viruses: Virus[] = [];

    newVirusTimer: Phaser.Timer;

    platforms: Phaser.TileSprite[] = [];

    score: number = 0;

    bloodRain: BloodRain;

    scoreText: Phaser.Text;
    healthText: Phaser.Text;

    preload() {
        this.game.stage.backgroundColor = 0x890029;
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.bloodRain = new BloodRain(this.game);

        this.heart = new Heart(this.game);

        this.player = new Player(this.game);

        this.newVirusTimer = this.game.time.create(false);
        this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
        this.newVirusTimer.start();

        this.buildLevel();

        let textStyle = {
            font: '36px Impact',
            fill: '#fff',
            align: 'left'
        };

        this.scoreText = this.game.add.text(20, 10, this.getScoreText(), textStyle);
        this.healthText = this.game.add.text(this.game.world.width - 20, 10, this.getHealthText(), textStyle);
        this.healthText.anchor.set(1, 0);
    }

    getScoreText(): string {
        return 'Score: ' + this.score.toString();
    }

    getHealthText(): string {
        return 'Health: ' + this.heart.health.toString();
    }

    buildLevel() {
        let platforms = [{
            x: this.game.world.width - 150,
            y: this.game.world.centerY + 150,
            w: 150,
            h: 20
            // Low level right
        }, {
            x: 0,
            y: this.game.world.centerY + 150,
            w: 150,
            h: 20
            // Low level left
        }, {
            x: this.game.world.width - 150,
            y: this.game.world.centerY - 150,
            w: 150,
            h: 20
            // High level right
        }, {
            x: 0,
            y: this.game.world.centerY - 150,
            w: 150,
            h: 20
            // High level left
        }, {
            x: this.game.world.centerX + 160,
            y: this.game.world.centerY,
            w: 100,
            h: 20
            // Mid level right
        }, {
            x: this.game.world.centerX - 160 - 100,
            y: this.game.world.centerY,
            w: 100,
            h: 20
            // Mid level left
        }, {
            x: 0,
            y: this.game.world.height - 20,
            w: this.game.world.width,
            h: 20
        }];

        platforms.forEach((platformsItem: any) => {
            let platform = this.game.add.tileSprite(0, 0, 40, 40, 'platform');

            platform.anchor.set(0, 0);
            platform.width = platformsItem.w;
            platform.height = platformsItem.h;
            platform.position.set(platformsItem.x, platformsItem.y);

            this.game.physics.enable(platform);

            platform.body.collideWorldBounds = true;
            platform.body.immovable = true;
            platform.body.allowGravity = false;

            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;

            this.platforms.push(platform);
        });
    }

    virusTimerCallback() {
        let virus = new Virus(this.game, this.heart);
        this.viruses.push(virus);

        let virusEvents = virus.events;

        virus.attachAttackCallback(() => {
            let loosingHealthText = this.game.add.text(virus.position.x - 50, virus.position.y - 50, '-5 HP', {
                font: '48px Impact',
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
                font: '46px Impact',
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
                font: '48px Impact',
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

            this.game.physics.arcade.collide(this.player, virus, this.virusPlayerCollision.bind(this));
        });

        this.platforms.forEach((platform) => {
            this.game.physics.arcade.collide(this.player, platform);
        });
    }

    virusBulletCollision(virus: Virus, bullet: Phaser.Bullet) {
        bullet.kill();

        virus.damage(15);
        virus.playDamageSound();
        virus.animateDamage();
    }

    virusPlayerCollision(player: Player, virus: Virus) {
    }

    render() {
        this.scoreText.text = this.getScoreText();
        this.healthText.text = this.getHealthText();
    }
}