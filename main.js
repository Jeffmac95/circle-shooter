const main = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 850;

    ctx.fillStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "teal";
    const speed = 10;


    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.projectiles = [];


            window.addEventListener("keydown", (e) => {
                switch (e.key) {
                    case 'd':
                        game.moveRight();
                        break;
                    case 'a':
                        game.moveLeft();
                        break;
                    case " ":
                        this.shootProjectile();
                        break;
                }

                this.player.move();
            });
        }

        moveRight() {
            this.player.x += speed;
            this.player.move();
        }

        moveLeft() {
            this.player.x -= speed;
            this.player.move();
        }

        shootProjectile() {
            const projectile = new Projectile(this, this.player.x + this.player.spriteWidth / 2, this.player.y);
            this.projectiles.push(projectile);
        }

        update() {
            this.projectiles.forEach(projectile => projectile.update());

            this.projectiles = this.projectiles.filter(projectile => projectile.y + projectile.height >= 0);
        }

        render(context) {
            this.player.render(context);

            this.projectiles.forEach(projectile => projectile.render(context));
        }
    }


    class Player {
        constructor(game) {
            this.game = game;
            this.spriteWidth = 70; // drew the rocket this size 
            this.spriteHeight = 70;
            this.x = this.game.width / 2 - this.spriteWidth / 2;
            this.y = this.game.height - this.spriteHeight;
            this.image = document.getElementById("mainPlayer");
        }

        render(context) {
            context.beginPath();
            context.drawImage(this.image, this.x, this.y);
            context.stroke();
        }

        move() {
            if (this.x < -this.spriteWidth) {
                this.x = this.game.width;
            } else if (this.x > this.game.width) {
                this.x = -this.spriteWidth;
            }
        }
    }

    class Projectile {
        constructor(game, firedX, firedY) {
            this.game = game;
            this.x = firedX;
            this.y = firedY;
            this.width = 5;
            this.height = 10;
            this.projectileSpeed = 15;
        }

        update() {
            this.y -= this.projectileSpeed;
        }

        render(context) {
            context.fillStyle = "red";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }


    const game = new Game(canvas);
    game.render(ctx);
    console.log(game);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update()
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
}

main();