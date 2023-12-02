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
            this.spawnCircles();

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
                    case 'g':
                        console.log(this.circles);
                        break;
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
            const maxCircleCount = 3; 
            for (let i = 0; i < maxCircleCount; i++) {
                this.circles.push(new Circle(this));
            }
        }

        detectCollision() {
            this.circles.forEach((circle, i) => {
                if (circle.x + circle.radius > this.player.x &&
                    circle.x - circle.radius < this.player.x + this.player.spriteWidth &&
                    circle.y + circle.radius > this.player.y &&
                    circle.y - circle.radius < this.player.y + this.player.spriteHeight) {

                        console.log("hit");

                        this.player.hp--;
                        this.player.hpDisplay.textContent -= 1;

                        this.circles.splice(i, 1);
                        
                    }
            });

            this.projectiles.forEach((projectile, i) => {

            })
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

            this.detectCollision();
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


    class Circle {
        constructor(game) {
            this.game = game;
            this.minRadius = 10;
            this.maxRadius = 50;
            this.radius = Math.floor(Math.random() * (this.maxRadius - this.minRadius + 1)) + this.minRadius;
            this.x = Math.floor(Math.random() * (this.game.width - this.radius));
            this.y = Math.floor(Math.random() * 100);
            this.fallSpeed = this.getFallSpeed();
        }

        getFallSpeed() {
            const speed = 25;
            return speed / this.radius;
        }

        update() {
            this.y += this.fallSpeed;
            // console.log(`circle pos:\nx: ${this.x}, y: ${this.y}`);
        }

        render(context) {
            context.fillStyle = `hsl(${this.x - 200}, 100%, 50%)`;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }
    }


    const game = new Game(canvas);
    // game.render(ctx);
    console.log(game);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
}

main();