const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 5, speedY: 5 };
let player1 = { x: 10, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0, velocityY: 0 };
let player2 = { x: canvas.width - 20, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0, velocityY: 0 };

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top/bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < player1.x + player1.width &&
         ball.y > player1.y && ball.y < player1.y + player1.height) ||
        (ball.x + ball.radius > player2.x &&
         ball.y > player2.y && ball.y < player2.y + player2.height)
    ) {
        ball.speedX *= -1;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        player2.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        resetBall();
    }

    // Move paddles
    player1.y += player1.velocityY;
    player2.y += player2.velocityY;

    // Paddle boundaries
    player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));
    player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw score
    ctx.font = '30px Arial';
    ctx.fillText(player1.score, canvas.width / 4, 30);
    ctx.fillText(player2.score, canvas.width * 3 / 4, 30);
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX *= -1; // Change direction after scoring
}

// Handle user input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            player1.velocityY = -5;
            break;
        case 's':
            player1.velocityY = 5;
            break;
        case 'ArrowUp':
            player2.velocityY = -5;
            break;
        case 'ArrowDown':
            player2.velocityY = 5;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        case 's':
            player1.velocityY = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            player2.velocityY = 0;
            break;
    }
});

// Start the game loop
gameLoop();
