// تنظیمات اولیه
document.addEventListener('DOMContentLoaded', function() {
    // پاک کردن خودکار فیلدهای ورودی هنگام فوکوس
    const clearableInputs = document.querySelectorAll('.clearable-input');
    clearableInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.value = '';
        });
    });
    
    // مقداردهی اولیه مثلث
    updateTriangleVisualization(3, 4, 5);
});

// محاسبه وتر فیثاغورس
function calculateHypotenuse() {
    const a = parseFloat(document.getElementById('side-a').value);
    const b = parseFloat(document.getElementById('side-b').value);
    
    if (a && b && a > 0 && b > 0) {
        const c = Math.sqrt(a*a + b*b);
        document.getElementById('hypotenuse-result').innerHTML = 
            `وتر (c) = ${c.toFixed(2)} <br> a² + b² = ${(a*a).toFixed(2)} + ${(b*b).toFixed(2)} = ${(a*a + b*b).toFixed(2)} <br> c = √${(a*a + b*b).toFixed(2)} = ${c.toFixed(2)}`;
        
        updateTriangleVisualization(a, b, c);
    } else {
        document.getElementById('hypotenuse-result').innerHTML = 
            '<span style="color: var(--danger)">لطفاً مقادیر معتبر وارد کنید!</span>';
    }
}

// محاسبه ضلع مجاور
function calculateSide() {
    const c = parseFloat(document.getElementById('side-c').value);
    const known = parseFloat(document.getElementById('side-known').value);
    
    if (c && known && c > 0 && known > 0 && c > known) {
        const side = Math.sqrt(c*c - known*known);
        document.getElementById('side-result').innerHTML = 
            `ضلع مجهول = ${side.toFixed(2)} <br> c² - a² = ${(c*c).toFixed(2)} - ${(known*known).toFixed(2)} = ${(c*c - known*known).toFixed(2)} <br> b = √${(c*c - known*known).toFixed(2)} = ${side.toFixed(2)}`;
    } else {
        document.getElementById('side-result').innerHTML = 
            '<span style="color: var(--danger)">لطفاً مقادیر معتبر وارد کنید! (وتر باید بزرگتر از ضلع دیگر باشد)</span>';
    }
}

// به روز رسانی نمایش گرافیکی مثلث
function updateTriangleVisualization(a, b, c) {
    const scale = 200 / Math.max(a, b, c);
    const scaledA = a * scale;
    const scaledB = b * scale;
    const scaledC = c * scale;
    const angle = Math.atan2(b, a) * (180 / Math.PI);
    
    document.querySelector('.side-a').style.width = `${scaledA}px`;
    document.querySelector('.side-b').style.height = `${scaledB}px`;
    document.querySelector('.side-c').style.width = `${scaledC}px`;
    document.querySelector('.side-c').style.transform = `rotate(${-angle}deg)`;
    document.querySelector('.side-c').style.bottom = `${scaledB}px`;
    
    document.querySelector('.label-a').textContent = `a = ${a}`;
    document.querySelector('.label-b').textContent = `b = ${b}`;
    document.querySelector('.label-c').textContent = `c = ${c.toFixed(2)}`;
}

// بازی تاس
let rollCount = 0;
let results = Array(11).fill(0);

function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2;
    
    document.getElementById('dice1').textContent = dice1;
    document.getElementById('dice2').textContent = dice2;
    document.getElementById('dice-sum').textContent = sum;
    
    rollCount++;
    document.getElementById('roll-count').textContent = rollCount;
    
    results[sum-2]++;
    updateChart();
}

// به روز رسانی نمودار
function updateChart() {
    const chartContainer = document.getElementById('chart');
    chartContainer.innerHTML = '';
    
    const maxValue = Math.max(...results);
    const chartHeight = 200;
    const barWidth = 30;
    const gap = (chartContainer.offsetWidth - (11 * barWidth)) / 12;
    
    for (let i = 0; i < 11; i++) {
        const value = results[i];
        const height = value > 0 ? (value / maxValue) * chartHeight * 0.9 : 5;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.left = `${gap + i * (barWidth + gap)}px`;
        bar.style.height = `${height}px`;
        bar.style.width = `${barWidth}px`;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = i+2;
        
        const barValue = document.createElement('div');
        barValue.className = 'bar-value';
        barValue.textContent = value;
        
        bar.appendChild(label);
        bar.appendChild(barValue);
        chartContainer.appendChild(bar);
    }
}

// بازی محاسبات سریع
let score = 0;
let timeLeft = 30;
let timer;
let currentQuestion = {};
let gameActive = false;

const operations = [
    { symbol: '+', method: (a, b) => a + b },
    { symbol: '-', method: (a, b) => a - b },
    { symbol: '×', method: (a, b) => a * b },
    { symbol: '÷', method: (a, b) => a / b }
];

function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    score = 0;
    timeLeft = 30;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = timeLeft;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    
    document.querySelector('.start-btn').style.display = 'none';
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
    
    generateQuestion();
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function generateQuestion() {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;
    
    if (operation.symbol === '÷') {
        num2 = Math.floor(Math.random() * 9) + 1;
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    } else if (operation.symbol === '-') {
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
    } else {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
    }
    
    currentQuestion = {
        num1: num1,
        num2: num2,
        operation: operation.symbol,
        answer: operation.method(num1, num2)
    };
    
    document.getElementById('question').textContent = 
        `${num1} ${operation.symbol} ${num2} = ?`;
}

function checkAnswer() {
    if (!gameActive) return;
    
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const feedback = document.getElementById('feedback');
    
    if (userAnswer === currentQuestion.answer) {
        score++;
        document.getElementById('score').textContent = score;
        feedback.textContent = 'درست! ✓';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = `نادرست! پاسخ صحیح: ${currentQuestion.answer}`;
        feedback.className = 'feedback incorrect';
    }
    
    document.getElementById('answer').value = '';
    generateQuestion();
    document.getElementById('answer').focus();
}

function endGame() {
    clearInterval(timer);
    gameActive = false;
    document.querySelector('.start-btn').style.display = 'block';
    document.getElementById('question').textContent = 'بازی پایان یافت!';
    document.getElementById('feedback').textContent = `امتیاز نهایی شما: ${score}`;
    document.getElementById('feedback').className = 'feedback';
}