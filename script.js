const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
const scoreElement = document.getElementById("score");

// গেমের গাড়ি বা অবজেক্টের ডেটা
let car = {
    x: 170,
    y: 250,
    width: 60,
    height: 100,
    color: "red",
    speed: 2
};

// গেম লুপ বা ড্রয়িং ফাংশন
function update() {
    // স্ক্রিন ক্লিয়ার করা
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // রাস্তার মিডল লাইন ড্র করা
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // গাড়ি ওপর থেকে নিচে নামানো
    car.y += car.speed;
    if (car.y > canvas.height) {
        car.y = -100; // স্ক্রিনের বাইরে চলে গেলে আবার ওপরে নিয়ে আসা
        // র‍্যান্ডম পজিশনে গাড়ি পাঠানোর জন্য X পজিশন বদলাতে পারেন
        car.x = Math.random() * (canvas.width - car.width - 100) + 50;
    }

    // গাড়ি আঁকা
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    
    // গাড়ির ওপর টেক্সট
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText("সিএনজি/গাড়ি", car.x - 5, car.y - 5);

    // গেম লুপ সচল রাখা
    requestAnimationFrame(update);
}

// গাড়িতে ক্লিক করলে চাঁদা উঠবে
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // ক্লিকের পজিশন গাড়ির সীমানার ভেতরে আছে কি না চেক করা
    if (
        mouseX >= car.x &&
        mouseX <= car.x + car.width &&
        mouseY >= car.y &&
        mouseY <= car.y + car.height
    ) {
        score += 50; // ৫০ টাকা চাঁদা উঠল!
        scoreElement.innerText = score;
        
        // গাড়ি চাঁদা দিয়ে স্পিডে পালিয়ে যাওয়ার ইফেক্ট
        car.y = -100;
        car.x = Math.random() * (canvas.width - car.width - 100) + 50;
    }
});

// গেম শুরু করা
update();