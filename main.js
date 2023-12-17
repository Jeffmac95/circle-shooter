const main = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 850;


    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.projectiles = [];
            this.circles = [];
            this.score = 0;
            this.scoreDisplay = document.getElementById("score");
            this.scoreDisplay.textContent = this.score;

            window.addEventListener("keydown", (e) => {
                switch (e.key) {
                    case 'd':
                        game.moveRight();
                        break;
                    case "ArrowRight":
                        game.moveRight();
                        break;
                    case 'a':
                        game.moveLeft();
                        break;
                    case "ArrowLeft":
                        game.moveLeft();
                        break;
                    case " ":
                        this.shootProjectile();
                        break;
                    default:
                        console.log(e.key);
                }

                this.player.move();
            });
        }

        moveRight() {
            this.player.x += this.player.speed;
            this.player.move();
        }

        moveLeft() {
            this.player.x -= this.player.speed;
            this.player.move();
        }

        shootProjectile() {
            const projectile = new Projectile(this, this.player.x + this.player.spriteWidth / 2, this.player.y);
            this.projectiles.push(projectile);
        }

        spawnCircles() {
            const maxCircleCount = 6; 
            for (let i = 0; i < maxCircleCount; i++) {
                this.circles.push(new Circle(this));
            }
        }

        gameOver() {
            console.log("Game Over");
            cancelAnimationFrame(this.animationId);
        }

        update() {
            this.projectiles.forEach(projectile => projectile.update());
            this.projectiles = this.projectiles.filter(projectile => projectile.y + projectile.height >= 0);

            this.circles.forEach(circle => circle.update());
            this.circles = this.circles.filter(circle => circle.y + circle.radius / 2 < this.canvas.height);
            this.circles = this.circles.filter(circle => circle.y + circle.radius * 2 >= 0);

            if (this.circles.length <= 5) {
                this.spawnCircles();
            }


            this.player.playerCircleCollision();
        }

        render(context) {
            this.player.render(context);

            this.projectiles.forEach(projectile => projectile.render(context));

            this.circles.forEach(circle => circle.render(context));
        }
    }


    class Player {
        constructor(game) {
            this.game = game;
            this.spriteWidth = 70; // drew the rocket this size 
            this.spriteHeight = 70;
            this.x = this.game.width / 2 - this.spriteWidth / 2;
            this.y = this.game.height - this.spriteHeight;
            this.speed = 10;
            this.image = document.getElementById("mainPlayer");
            this.hp = 10;
            this.hpDisplay = document.getElementById("hp");
            this.hpDisplay.textContent = this.hp;
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

        update() {
            this.playerCircleCollision();
        }

        playerCircleCollision() {
            this.game.circles.forEach((circle, i) => {
                if (circle.x + circle.radius > this.x &&
                    circle.x - circle.radius < this.x + this.spriteWidth &&
                    circle.y + circle.radius > this.y &&
                    circle.y - circle.radius < this.y + this.spriteHeight) {

                        this.hp--;
                        console.log(`player circle collision\nhp:${this.hp}`);
                        this.hpDisplay.textContent = this.hp;
                        this.game.circles.splice(i, 1);
                    }
            });
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
            this.projectileCircleCollision();
        }

        projectileCircleCollision() {
            this.game.circles.forEach((circle, index) => {
                const dx = this.x - circle.x;
                const dy = this.y - circle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < circle.radius) {
                    console.log("bullet circle collision");
                    this.game.projectiles.splice(this.game.projectiles.indexOf(this), 1);
                    this.game.circles.splice(index, 1);

                    this.game.score++;
                    this.game.scoreDisplay.textContent = this.game.score;
                }
            });
        }

        render(context) {
            context.fillStyle = "red";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }


    class Circle {
        constructor(game) {
            this.game = game;
            this.minRadius = 20;
            this.maxRadius = 60;
            this.radius = Math.floor(Math.random() * (this.maxRadius - this.minRadius + 1)) + this.minRadius;
            this.x = Math.floor(Math.random() * (this.game.width - this.radius));
            this.y = Math.floor(Math.random() * this.radius);
            this.fallSpeed = this.getFallSpeed();
        }

        getFallSpeed() {
            const speed = 40;
            return speed / this.radius;
        }

        update() {
            this.y += this.fallSpeed;
        }

        render(context) {
            context.fillStyle = `hsl(${this.x}, 100%, 50%)`;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }
    }


    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        if (game.player.hp > 0) {
            game.render(ctx);
            game.animationId = requestAnimationFrame(animate);
        } else {
            game.gameOver();
        }
    }

    const game = new Game(canvas);
    console.log(game);
    animate();
}

main();