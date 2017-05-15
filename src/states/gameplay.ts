/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Heart } from '../entities/heart';
import { VirusBase } from '../entities/virusBase';
import { Virus } from '../entities/virus';
import { SuperVirus } from '../entities/superVirus';
import { MegaVirus } from '../entities/megaVirus';
import { RandomGenerator } from '../helpers/randomGenerator';
import { Player } from '../entities/player';
import { BloodRain } from '../entities/bloodRain';

export class Gameplay extends Phaser.State {
    heart: Heart;
    player: Player;

    viruses: VirusBase[] = [];

    newVirusTimer: Phaser.Timer;

    platforms: Phaser.TileSprite[] = [];

    score: number = 0;

    bloodRain: BloodRain;

    scoreText: Phaser.Text;
    healthText: Phaser.Text;

    killedViruses: number = 0;
    emittedViruses: number = 0;

    wave: number = 1;
    waveIncrementator: Phaser.Timer;

    randomGenerator: RandomGenerator;

    spawnTime: number = 3000;

    preload() {
        this.game.stage.backgroundColor = 0x890029;
    }

    create() {
        this.spawnTime = 3000;
        this.wave = 1;
        this.killedViruses = 0;
        this.emittedViruses = 0
        this.score = 0

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.bloodRain = new BloodRain(this.game);

        this.heart = new Heart(this.game);

        this.player = new Player(this.game);

        this.setAi();

        this.buildLevel();

        let textStyle = {
            font: '36px Impact',
            fill: '#fff',
            align: 'left'
        };

        this.scoreText = this.game.add.text(20, 10, this.getScoreText(), textStyle);
        this.healthText = this.game.add.text(this.game.world.width - 20, 10, this.getHealthText(), textStyle);
        this.healthText.anchor.set(1, 0);

        this.randomGenerator = new RandomGenerator();

        this.waveIncrementator = this.game.time.create(false);
        this.waveIncrementator.loop(20000, () => {
            this.wave++;
            this.spawnTime -= 100;

            this.newVirusTimer.loop(this.spawnTime, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);
        });

        this.flashTitle();
    }

    setAi() {
        this.killedViruses = 0;
        this.wave = 1;
        
        this.newVirusTimer = this.game.time.create(false);
        this.newVirusTimer.loop(4500, this.virusTimerCallback.bind(this), this);
        this.newVirusTimer.start();

        this.flashWaveNumber(this.wave);
    }

    updateAi() {
        let aiBreakpoint = 3;

        if (this.emittedViruses === aiBreakpoint  && this.wave === 1) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint   && this.wave === 1)  {
            this.newVirusTimer.loop(4500, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);

            this.flashWaveNumber(++this.wave);
        }

        // 2nd
        aiBreakpoint += 5;

        if (this.emittedViruses === aiBreakpoint  && this.wave === 2) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 2) {
            this.newVirusTimer.loop(4000, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);

            this.flashWaveNumber(++this.wave);
        }

        // 3th
        aiBreakpoint += 5;

        if (this.emittedViruses === aiBreakpoint  && this.wave === 3) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint && this.wave === 3) {
            this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);

            this.flashWaveNumber(++this.wave);
        }

        // 4th
        aiBreakpoint += 3;

        if (this.emittedViruses === aiBreakpoint  && this.wave === 4) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 4) {
            this.newVirusTimer.loop(500, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);

            this.flashWaveNumber(++this.wave);
        }

        // 5th
        aiBreakpoint += 3;

        if (this.emittedViruses === aiBreakpoint  && this.wave === 5) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 5) {
            this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);

            this.flashWaveNumber(++this.wave);
        }

        // 6th
        aiBreakpoint += 5;

        if (this.emittedViruses === aiBreakpoint  && this.wave === 6) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 6) {
            this.newVirusTimer.loop(2500, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(2500);

            this.flashWaveNumber(this.wave++);
        }

        // 7th
        aiBreakpoint += 3;
        if (this.emittedViruses === aiBreakpoint  && this.wave === 7) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 7) {
            this.newVirusTimer.loop(2500, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(2500);

            this.flashWaveNumber(this.wave++);
        }

        // 8th
        aiBreakpoint += 5;
        if (this.emittedViruses === aiBreakpoint  && this.wave === 8) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 8) {
            this.newVirusTimer.loop(2500, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(2500);

            this.flashWaveNumber(this.wave++);
        }

        // 9th
        aiBreakpoint += 10;
        if (this.emittedViruses === aiBreakpoint  && this.wave === 9) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 9) {
            this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);

            this.flashWaveNumber(this.wave++);
        }

        // 10th
        aiBreakpoint += 2;
        if (this.emittedViruses === aiBreakpoint  && this.wave === 10) {
            this.newVirusTimer.stop();
        }

        if (this.killedViruses === aiBreakpoint  && this.wave === 10) {
            this.newVirusTimer.loop(3000, this.virusTimerCallback.bind(this), this);
            this.newVirusTimer.start(3000);

            this.flashRampage();
            this.wave++;
        }

        aiBreakpoint += 5;
        if (this.killedViruses === aiBreakpoint  && this.wave === 11) {
            this.waveIncrementator.start();
            this.killedViruses++;
            this.wave++;
        }
    }

    flashWaveNumber(wave) {
        this.game.time.events.add(3000, () => {
            let waveText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Wave ' + wave, {
                font: '64px Impact',
                fill: '#fff'
            });

            waveText.anchor.set(0.5, 0.5);

            waveText.alpha = 1;

            let waveTextTween = this.game.add.tween(waveText).to({
                y: '-75',
                alpha: 0
            }, 3000, 'Linear', true, 0, 0);
            this.game.time.events.add(3000, () => {
                waveText.destroy();
            });
        });
    }

    flashRampage() {
        this.game.time.events.add(2000, () => {
            let waveText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'RAMPAGE!', {
                font: '90px Impact',
                fill: '#fff'
            });

            waveText.anchor.set(0.5, 0.5);

            waveText.alpha = 1;

            let waveTextTween = this.game.add.tween(waveText).to({
                y: '-75',
                alpha: 0
            }, 3000, 'Linear', true, 0, 0);
            this.game.time.events.add(3000, () => {
                waveText.destroy();
            });
        });
    }

    flashTitle() {
        this.game.time.events.add(1000, () => {
            let waveText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Heart guard', {
                font: '90px Impact',
                fill: '#fff'
            });

            waveText.anchor.set(0.5, 0.5);

            waveText.alpha = 1;

            let waveTextTween = this.game.add.tween(waveText).to({
                y: '-75',
                alpha: 0
            }, 5000, 'Linear', true, 0, 0);
            this.game.time.events.add(5000, () => {
                waveText.destroy();
            });
        });

        this.game.time.events.add(1000, () => {
            let waveText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 60, 'Protect the heart no matter what!', {
                font: '40px Impact',
                fill: '#fff'
            });

            waveText.anchor.set(0.5, 0.5);

            waveText.alpha = 1;

            let waveTextTween = this.game.add.tween(waveText).to({
                y: '-75',
                alpha: 0
            }, 5000, 'Linear', true, 0, 0);
            this.game.time.events.add(5000, () => {
                waveText.destroy();
            });
        });
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
        let virus, hpLost;
        

        if (this.wave <= 3) {
            virus = new Virus(this.game, this.heart);
            hpLost = 5;
        } else if (this.wave === 4) {
            virus = new SuperVirus(this.game, this.heart);
            hpLost = 5;
        } else if (this.wave > 4 && this.wave < 10) {
            if (this.randomGenerator.getRandomInteger(0, 15 - this.wave) > 1) {
                virus = new Virus(this.game, this.heart);
                hpLost = 5;
            } else {
                virus = new SuperVirus(this.game, this.heart);
                hpLost = 10;
            }
        } else if (this.wave === 10) {
            virus = new MegaVirus(this. game, this.heart);
            hpLost = 10;
        } else {
            let random = this.randomGenerator.getRandomInteger(0, 25 - this.wave);
            if (random > 10) {
                virus = new Virus(this.game, this.heart);
                hpLost = 5;
            } else if (random > 5) {
                virus = new SuperVirus(this.game, this.heart);
                hpLost = 10;
            } else {
                virus = new MegaVirus(this.game, this.heart);
                hpLost = 10;
            }
        }

        this.viruses.push(virus);

        let virusEvents = virus.events;

        this.emittedViruses++;

        this.updateAi();

        virus.attachAttackCallback(() => {
            let loosingHealthText = this.game.add.text(virus.position.x - 50, virus.position.y - 50, '-' + hpLost.toString() + ' HP', {
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

            this.updateAi();
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

            this.updateAi();
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

            this.killedViruses++;

            this.updateAi();
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