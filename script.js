// تنظیمات اولیه
document.addEventListener('DOMContentLoaded', function() {
    // مقداردهی اولیه مثلث
    updateTriangleVisualization(3, 4, 5);
    
    // شروع اولین مسئله احتمال
    generateProbabilityProblem();
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
    const svg = document.querySelector('.triangle-svg');
    const path = document.querySelector('.triangle-path');
    
    // محاسبه مختصات بر اساس نسبت اضلاع
    const maxSide = Math.max(a, b, c);
    const scale = 160 / maxSide;
    const scaledA = a * scale;
    const scaledB = b * scale;
    
    // ایجاد مسیر مثلث
    const pathData = `M20,180 L20,${180 - scaledB} L${20 + scaledA},180 Z`;
    path.setAttribute('d', pathData);
    
    // به روز رسانی برچسب‌ها
    const labels = document.querySelectorAll('.side-label');
    labels[0].textContent = `a = ${a}`;
    labels[0].setAttribute('x', 10);
    labels[0].setAttribute('y', 190);
    
    labels[1].textContent = `b = ${b}`;
    labels[1].setAttribute('x', 10);
    labels[1].setAttribute('y', 180 - (scaledB / 2));
    
    labels[2].textContent = `c = ${c.toFixed(2)}`;
    labels[2].setAttribute('x', 20 + (scaledA / 2) - 20);
    labels[2].setAttribute('y', 180 - (scaledB / 2) - 10);
}

// بخش احتمال - متغیرهای جهانی
let currentProbabilityProblem = {};
let userProbabilityAnswer = null;

// تولید مسئله احتمال
function generateProbabilityProblem() {
    const problemTypes = [
        {
            question: "در یک کیسه 3 توپ قرمز و 2 توپ آبی وجود دارد. اگر یک توپ به تصادف از کیسه خارج کنیم، احتمال اینکه توپ آبی باشد چقدر است؟",
            options: [
                { text: "1/5", value: "1/5", correct: false },
                { text: "2/5", value: "2/5", correct: true },
                { text: "3/5", value: "3/5", correct: false },
                { text: "2/3", value: "2/3", correct: false }
            ],
            explanation: "تعداد کل توپ‌ها: 5 (3 قرمز + 2 آبی)<br>تعداد توپ‌های آبی: 2<br>احتمال = تعداد حالت‌های مطلوب / تعداد کل حالت‌ها = 2/5"
        },
        {
            question: "اگر یک سکه سالم را دو بار پرتاب کنیم، احتمال اینکه حداقل یک بار شیر بیاید چقدر است؟",
            options: [
                { text: "1/4", value: "1/4", correct: false },
                { text: "1/2", value: "1/2", correct: false },
                { text: "3/4", value: "3/4", correct: true },
                { text: "1", value: "1", correct: false }
            ],
            explanation: "حالت‌های ممکن: شیر-شیر، شیر-خط، خط-شیر، خط-خط<br>حالت‌های مطلوب: 3 حالت اول<br>احتمال = 3/4"
        },
        {
            question: "اگر یک تاس سالم را پرتاب کنیم، احتمال اینکه عددی زوج یا بزرگتر از 4 بیاید چقدر است؟",
            options: [
                { text: "1/6", value: "1/6", correct: false },
                { text: "1/2", value: "1/2", correct: false },
                { text: "2/3", value: "2/3", correct: true },
                { text: "5/6", value: "5/6", correct: false }
            ],
            explanation: "اعداد زوج: 2, 4, 6<br>اعداد بزرگتر از 4: 5, 6<br>اعداد مطلوب: 2, 4, 5, 6 (4 عدد)<br>احتمال = 4/6 = 2/3"
        }
    ];
    
    // انتخاب تصادفی یک مسئله
    currentProbabilityProblem = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    
    // نمایش مسئله
    document.getElementById('probability-problem').innerHTML = currentProbabilityProblem.question;
    
    // نمایش گزینه‌ها
    const optionsContainer = document.getElementById('probability-options');
    optionsContainer.innerHTML = '';
    
    currentProbabilityProblem.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="probability" id="option-${index}" value="${option.value}">
            <label for="option-${index}">${option.text}</label>
        `;
        optionElement.querySelector('input').addEventListener('change', function() {
            userProbabilityAnswer = this.value;
        });
        optionsContainer.appendChild(optionElement);
    });
    
    // پاک کردن نتیجه و راه حل قبلی
    document.getElementById('probability-result').textContent = '';
    document.getElementById('probability-explanation').textContent = '';
}

// بررسی پاسخ احتمال
function checkProbabilityAnswer() {
    if (!userProbabilityAnswer) {
        alert('لطفاً یک گزینه را انتخاب کنید');
        return;
    }
    
    const resultElement = document.getElementById('probability-result');
    const correctAnswer = currentProbabilityProblem.options.find(opt => opt.correct).value;
    
    if (userProbabilityAnswer === correctAnswer) {
        resultElement.innerHTML = '<span style="color: var(--success)">پاسخ شما صحیح است! ✓</span>';
    } else {
        resultElement.innerHTML = '<span style="color: var(--danger)">پاسخ شما نادرست است!</span>';
    }
    
    // نمایش راه حل
    document.getElementById('probability-explanation').innerHTML = currentProbabilityProblem.explanation;
}

// مسئله بعدی احتمال
function nextProbabilityProblem() {
    userProbabilityAnswer = null;
    generateProbabilityProblem();
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
    
    if (isNaN(userAnswer)) {
        feedback.textContent = 'لطفاً یک عدد وارد کنید';
        feedback.className = 'feedback incorrect';
        return;
    }
    
    // مقایسه با دقت 0.001 برای اعداد اعشاری
    if (Math.abs(userAnswer - currentQuestion.answer) < 0.001) {
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