const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let currentAreaIndex = 0;
const areas = ["ফার্মগেট", "মিরপুর ১০", "উত্তরা আজমপুর", "গুলিস্তান", "সদরঘাট"];
const locationElement = document.getElementById("location-name");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

// চাঁদা তোলার মেইন ক্যারেক্টার (নিচে থাকবে)
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 60,
    speed: 6,
    dx: 0
};

// গাড়ি, রিকশা এবং পুলিশের অ্যারে
let obstacles = [];
let spawnTimer = 0;

// কি-বোর্ড কন্ট্রোল (ডানে বায়ে যাওয়ার জন্য)
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
        player.dx = -player.speed;
    } else if (e.key === "ArrowRight" || e.key === "d") {
        player.dx = player.speed;
    }
});

window.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
        player.dx = 0;
    }
});

// মোবাইল টাচ কন্ট্রোল
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // গাড়ির ওপর ক্লিক করলে চাঁদা উঠবে বা পুলিশের ক্ষেত্রে ধরা খাবো
    obstacles.forEach((obs, index) => {
        if (
            clickX >= obs.x &&
            clickX <= obs.x + obs.width &&
            clickY >= obs.y &&
            clickY <= obs.y + obs.height
        ) {
            if (obs.type === "police") {
                // পুলিশের হাতে ধরা পড়লে জীবন কমবে
                lives--;
                updateLivesUI();
                alert("পুলিশের হাতে ধরা পড়েছেন! জরিমানা দিতে হলো!");
                obstacles.splice(index, 1);
                if (lives <= 0) {
                    alert("গেম ওভার! সব ইনকাম পুলিশ নিয়ে গেছে! 😂");
                    resetGame();
                }
            } else {
                // সাধারণ গাড়ি বা রিকশা থেকে চাঁদা আদায়
                score += obs.amount;
                scoreElement.innerText = score;
                
                // লোকেশন পরিবর্তন আপডেট (প্রতি ৩০০ টাকায় এলাকা বদলাবে)
                currentAreaIndex = Math.floor(score / 300) % areas.length;
                locationElement.innerText = areas[currentAreaIndex];

                // চাঁদা দিয়ে গাড়ি উধাও বা সাইড হয়ে যাওয়া
                obstacles.splice(index, 1);
            }
        }
    });

    // স্ক্রিনের বাম বা ডানপাশে টাচ করলে প্লেয়ার মুভ করবে
    if (clickX < canvas.width / 2) {
        player.x -= 25;
    } else {
        player.x += 25;
    }
});

function updateLivesUI() {
    let hearts = "";
    for (let i = 0; i < lives; i++) hearts += "❤️ ";
    livesElement.innerText = hearts;
}

function resetGame() {
    score = 0;
    lives = 3;
    scoreElement.innerText = score;
    updateLivesUI();
    obstacles = [];
}

// নতুন ভেহিকেল বা পুলিশ জেনারেট করা
function spawnObstacle() {
    spawnTimer++;
    if (spawnTimer > 70) { // প্রতি নির্দিষ্ট সময় পর পর গাড়ি আসবে
        spawnTimer = 0;
        const types = ["rickshaw", "cng", "bus", "police"];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        
        let width = 50, height = 80, color = "red", amount = 50, speed = 3;

        if (selectedType === "rickshaw") {
            width = 40; height = 60; color = "#f39c12"; amount = 20; speed = 2.5;
        } else if (selectedType === "cng") {
            width = 45; height = 70; color = "#27ae60"; amount = 50; speed = 4;
        } else if (selectedType === "bus") {
            width = 65; height = 110; color = "#2980b9"; amount = 100; speed = 3;
        } else if (selectedType === "police") {
            width = 50; height = 75; color = "#34495e"; amount = 0; speed = 4.5; // পুলিশ চাঁদা দেয় না, ধরে!
        }

        const laneX = [70, 170, 270, 340]; // রাস্তার বিভিন্ন লেন
        const randomX = laneX[Math.floor(Math.random() * laneX.length)];

        obstacles.push({
            x: randomX,
            y: -120,
            width: width,
            height: height,
            color: color,
            type: selectedType,
            amount: amount,
            speed: speed
        });
    }
}

// গেমের মেইন লুপ
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ১. রাস্তার ব্যাকগ্রাউন্ড ও সাইডের বিল্ডিংয়ের আবহ আঁকা
    ctx.fillStyle = "#353b48";
    ctx.fillRect(0, 0, 50, canvas.height); // বাম পাশের বিল্ডিং জোন
    ctx.fillRect(canvas.width - 50, 0, 50, canvas.height); // ডান পাশের বিল্ডিং জোন

    // বিল্ডিংয়ের জানালা বা সাইনবোর্ড এফেক্ট (ঢাকাই স্টাইল সাইনবোর্ড টেক্সট)
    ctx.fillStyle = "#718093";
    ctx.fillRect(10, 50, 30, 40);
    ctx.fillRect(canvas.width - 40, 150, 30, 40);
    ctx.fillRect(10, 300, 30, 40);

    ctx.fillStyle = "#f1c40f";
    ctx.font = "10px Arial";
    ctx.fillText("মার্কেট", 12, 45);
    ctx.fillText("হোটেল", canvas.width - 38, 145);

    // পিচ ঢালাই রাস্তা
    ctx.fillStyle = "#596275";
    ctx.fillRect(50, 0, canvas.width - 100, canvas.height);

    // রাস্তার মাঝের হলুদ ও সাদা দাগ
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // ২. প্লেয়ার মুভমেন্ট আপডেট ও ড্র করা
    player.x += player.dx;
    if (player.x < 50) player.x = 50;
    if (player.x > canvas.width - 50 - player.width) player.x = canvas.width - 50 - player.width;

    // চাঁদা তোলার ক্যারেক্টার ড্র
    ctx.fillStyle = "#e84118";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText("চাঁদাবাজ ভাই", player.x - 7, player.y - 8);

    // ৩. অবজেক্ট বা গাড়িগুলো আপডেট করা
    spawnObstacle();

    obstacles.forEach((obs, index) => {
        obs.y += obs.speed;

        // গাড়ি ড্র করা
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // গাড়ির ওপর নাম বা লেবেল
        ctx.fillStyle = "white";
        ctx.font = "11px Arial";
        if (obs.type === "police") {
            ctx.fillStyle = "#e74c3c";
            ctx.fillText("🚨 পুলিশ!", obs.x + 2, obs.y - 5);
        } else {
            ctx.fillText(`${obs.type.toUpperCase()} (${obs.amount}৳)`, obs.x - 5, obs.y - 5);
        }

        // স্ক্রিন পার হয়ে নিচে চলে গেলে রিমুভ করা
        if (obs.y > canvas.height) {
            obstacles.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}

// গেম শুরু
updateLivesUI();
gameLoop();