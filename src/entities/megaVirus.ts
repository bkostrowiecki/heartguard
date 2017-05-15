/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
import { RandomGenerator } from '../helpers/randomGenerator';
import { Heart } from './heart';
import { VirusBase } from './virusbase';

enum VirusState {
    Rest = 1,
    FollowHeart = 2,
    PrepareToAttack = 3,
    Attack = 4,
    HeartIsDead = 5
};

export class MegaVirus extends VirusBase {
    game: Phaser.Game;
    heart: Heart;

    public virusState: VirusState;

    virusbeatTween: Phaser.Tween;
    virusShakeTween: Phaser.Tween;

    attackTimer: Phaser.Timer;
    restTimer: Phaser.Timer;

    randomGenerator: RandomGenerator;

    explosionEmitter: Phaser.Particles.Arcade.Emitter;
    heartbleedEmitter: Phaser.Particles.Arcade.Emitter;

    explosionSound: Phaser.Sound;
    hitSound: Phaser.Sound;

    constructor(game: Phaser.Game, heart: Heart) {
        super(game, -2000, -200, 'megaVirus', 1);

        this.game = game;
        this.heart = heart;

        this.virusState = VirusState.FollowHeart;

        this.randomGenerator = new RandomGenerator();

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);

        this.body.setCircle(this.width / 2);
        //this.body.setSize(80, 80, 0, 0);

        this.body.immovable = true;

        this.health = 450;
        this.maxHealth = 450;

        this.scale.x = 1;
        this.scale.y = 1;

        if (this.randomGenerator.getRandomInteger(0, 1)) {
            this.position.x = -100;
        } else {
            this.position.x = this.game.world.width + 100;
        }
        
        this.position.y = this.randomGenerator.getRandomInteger(-100, this.game.world.height + 100);

        this.virusbeatTween = this.game.add.tween(this.scale).to({
            x: 0.95,
            y: 0.95
        }, 100, Phaser.Easing.Cubic.In, true, 0, -1);

        this.virusbeatTween.yoyo(true, 100);

        // this.virusShakeTween = this.game.add.tween(this).to({
        //     x: '+10'
        // }, 100, Phaser.Easing.Cubic.In, true, 0, -1);

        // this.virusShakeTween.yoyo(true, 100);

        this.attackTimer = this.game.time.create(false);
        this.attackTimer.loop(6000, this.attackTick.bind(this), this);

        this.events.onKilled.addOnce(() => {
            this.onKilled();
        });

        this.explosionEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 30);

        this.explosionEmitter.makeParticles('explosionParticle');
        this.explosionEmitter.gravity = 0;
        this.explosionEmitter.lifespan = 400;
        this.explosionEmitter.minParticleScale = 0.75;
        this.explosionEmitter.minParticleSpeed.set(-500, -500);
        this.explosionEmitter.maxParticleSpeed.set(500, 500);
        this.explosionEmitter.maxParticleScale = 2;

        this.heartbleedEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 5);
        this.heartbleedEmitter.makeParticles('blood');
        this.heartbleedEmitter.gravity = 1000;
        this.heartbleedEmitter.lifespan = 400;
        this.heartbleedEmitter.minParticleScale = 0.75;
        this.heartbleedEmitter.minParticleSpeed.set(-100, -100);
        this.heartbleedEmitter.maxParticleSpeed.set(100, 250);
        this.heartbleedEmitter.maxParticleScale = 2;

        this.explosionSound = this.game.add.audio('explosion');
        this.explosionSound.allowMultiple = false;

        this.hitSound = this.game.add.audio('hit');
        this.hitSound.allowMultiple = true;
        this.hitSound.volume = 0.4;

        this.body.velocity.x = this.randomGenerator.getRandomInteger(0, 700) - 350; 
        this.body.velocity.y = this.randomGenerator.getRandomInteger(0, 700) - 350;

        this.restTimer = this.game.time.create(false);
        this.restTimer.loop(4000, () => {
            if (this.virusState === VirusState.FollowHeart) {
                this.virusState = VirusState.Rest;
            } else if (this.virusState === VirusState.Rest) {
                this.virusState = VirusState.FollowHeart;
            }
        });

        this.restTimer.start();
    }

    update() {
        this.game.physics.arcade.overlap(this, this.heart, this.overlapHandler.bind(this), null, this);

        if (!this.alive) {
            this.destroy();
            this.attackTimer.destroy();
        }

        if (this.alive && this.virusState === VirusState.Rest) {
            this.body.velocity.set(0, 0);
        }

        if (this.alive && this.virusState === VirusState.FollowHeart) {
            this.game.physics.arcade.moveToObject(this, this.heart, 40);
        }
        
        this.explosionEmitter.x = this.x;
        this.explosionEmitter.y = this.y;

        this.heartbleedEmitter.x = this.x;
        this.heartbleedEmitter.y = this.y;
    }

    onKilled() {
        this.explosionEmitter.start(true, 400, null, 20, false);
        
        this.explosionEmitter.forEachAlive((particle: Phaser.Particle) => {
            particle.alpha = 1;
            this.game.add.tween(particle).to({
                alpha: 0
            }, 350, Phaser.Easing.Cubic.In, true, 0, null, false);
        }, this);

        this.explosionSound.play();

        this.game.time.events.add(1000, () => {
            this.explosionEmitter.destroy();
        }, this);

        this.game.time.events.add(2000, () => {
            this.explosionSound.destroy();
        }, this);
    }

    playDamageSound() {
        this.hitSound.play();
    }

    animateDamage() {
        this.tint = 0xcccc00;

        this.game.time.events.add(200, () => {
            if (this && this.alive) {
                this.tint = 0xffffff;
                this.alpha = 1;
            }
        });
    }

    attackTick() {
        if (this.heart.health <= 0 && this.heart.alive) {
            this.heart.alive = false;

            this.heart.stop();
            this.deathCallback(this, this.heart);

            return;
        }

        if (!this.heart.alive) {
            return;
        }
        
        this.attackCallback(this, this.heart);
        this.heart.health -= 10;

        this.heart.increaseHeartbeat();

        this.heart.tint = 0xffff00;
        this.heart.alpha = 0.5;

        this.heartbleedEmitter.start(true, 300, null, 5);

        this.game.time.events.add(200, () => {
             this.heart.tint = 0xffffff;
             this.heart.alpha = 1;
        });
    }

    heartIsDead() {
        this.virusState = VirusState.HeartIsDead;

        if (this.body) {
            this.body.velocity.x = this.randomGenerator.getRandomInteger(0, 1000) - 500;
            this.body.velocity.y = this.randomGenerator.getRandomInteger(0, 1000) - 500;
        }
    }

    overlapHandler() {
        if (this.virusState === VirusState.HeartIsDead) {
            return;
        }

        this.virusState = VirusState.PrepareToAttack;

        this.game.time.events.add(this.randomGenerator.getRandomInteger(4000, 6000), () => {
            if (this.alive && this.virusState !== VirusState.HeartIsDead) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        });

        this.attackTimer.start();
    }
}