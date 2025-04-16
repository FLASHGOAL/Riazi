// ========== بخش فیثاغورس ==========
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

function updateTriangleVisualization(a, b, c) {
    const svg = document.querySelector('.triangle-svg');
    const path = document.querySelector('.triangle-path');
    
    const maxSide = Math.max(a, b, c);
    const scale = 160 / maxSide;
    const scaledA = a * scale;
    const scaledB = b * scale;
    const scaledC = c * scale;
    
    const startX = 20, startY = 200;
    const pathData = `M${startX},${startY} L${startX},${startY - scaledB} L${startX + scaledA},${startY} Z`;
    path.setAttribute('d', pathData);
    
    document.getElementById('side-a-label').textContent = `a = ${a}`;
    document.getElementById('side-b-label').textContent = `b = ${b}`;
    document.getElementById('side-c-label').textContent = `c = ${c.toFixed(2)}`;
    
    document.getElementById('side-a-label').setAttribute('x', startX + (scaledA / 2));
    document.getElementById('side-a-label').setAttribute('y', startY + 20);
    
    document.getElementById('side-b-label').setAttribute('x', startX - 15);
    document.getElementById('side-b-label').setAttribute('y', startY - (scaledB / 2));
    
    document.getElementById('side-c-label').setAttribute('x', startX + (scaledA / 2) - 15);
    document.getElementById('side-c-label').setAttribute('y', startY - (scaledB / 2) - 10);
}

// ========== بخش آمار و احتمال ==========
let currentProbabilityProblem = {};
let userProbabilityAnswer = null;
let probabilityScore = 0;
let currentQuestionIndex = 0;
const totalQuestions = 10;
let usedQuestionIndices = [];

const probabilityProblems = [
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
    },
    {
        question: "در یک کلاس 12 نفره، 7 نفر دختر و 5 نفر پسر هستند. اگر یک نفر به تصادف انتخاب شود، احتمال اینکه پسر باشد چقدر است؟",
        options: [
            { text: "5/7", value: "5/7", correct: false },
            { text: "7/12", value: "7/12", correct: false },
            { text: "5/12", value: "5/12", correct: true },
            { text: "12/5", value: "12/5", correct: false }
        ],
        explanation: "تعداد کل دانش‌آموزان: 12<br>تعداد پسرها: 5<br>احتمال = 5/12"
    },
    {
        question: "اگر دو تاس سالم را پرتاب کنیم، احتمال اینکه مجموع اعداد 7 شود چقدر است؟",
        options: [
            { text: "1/6", value: "1/6", correct: true },
            { text: "1/12", value: "1/12", correct: false },
            { text: "1/36", value: "1/36", correct: false },
            { text: "6/36", value: "6/36", correct: true }
        ],
        explanation: "تعداد حالت‌های ممکن: 36<br>حالت‌های مطلوب: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) - 6 حالت<br>احتمال = 6/36 = 1/6"
    },
    {
        question: "در یک کشو 4 جوراب سفید و 6 جوراب سیاه وجود دارد. اگر یک جوراب به تصادف بیرون آوریم، احتمال اینکه سیاه باشد چقدر است؟",
        options: [
            { text: "4/10", value: "4/10", correct: false },
            { text: "6/10", value: "6/10", correct: true },
            { text: "4/6", value: "4/6", correct: false },
            { text: "6/4", value: "6/4", correct: false }
        ],
        explanation: "تعداد کل جوراب‌ها: 10<br>تعداد جوراب سیاه: 6<br>احتمال = 6/10"
    },
    {
        question: "احتمال اینکه یک عدد بین 1 تا 10 زوج باشد چقدر است؟",
        options: [
            { text: "1/2", value: "1/2", correct: true },
            { text: "5/10", value: "5/10", correct: true },
            { text: "1/10", value: "1/10", correct: false },
            { text: "10/5", value: "10/5", correct: false }
        ],
        explanation: "اعداد زوج بین 1 تا 10: 2, 4, 6, 8, 10 (5 عدد)<br>تعداد کل اعداد: 10<br>احتمال = 5/10 = 1/2"
    },
    {
        question: "اگر یک کارت از یک دسته 52 تایی کارت بازی به تصادف انتخاب شود، احتمال اینکه خال دل باشد چقدر است؟",
        options: [
            { text: "1/52", value: "1/52", correct: false },
            { text: "13/52", value: "13/52", correct: true },
            { text: "4/52", value: "4/52", correct: false },
            { text: "1/4", value: "1/4", correct: true }
        ],
        explanation: "تعداد کارت‌های خال دل: 13<br>تعداد کل کارت‌ها: 52<br>احتمال = 13/52 = 1/4"
    },
    {
        question: "احتمال اینکه یک عدد بین 1 تا 20 بر 3 بخش‌پذیر باشد چقدر است؟",
        options: [
            { text: "3/20", value: "3/20", correct: false },
            { text: "6/20", value: "6/20", correct: true },
            { text: "20/6", value: "20/6", correct: false },
            { text: "1/3", value: "1/3", correct: false }
        ],
        explanation: "اعداد بخش‌پذیر بر 3 بین 1 تا 20: 3, 6, 9, 12, 15, 18 (6 عدد)<br>تعداد کل اعداد: 20<br>احتمال = 6/20"
    },
    {
        question: "اگر دو سکه را همزمان پرتاب کنیم، احتمال اینکه هر دو شیر بیایند چقدر است؟",
        options: [
            { text: "1/2", value: "1/2", correct: false },
            { text: "1/4", value: "1/4", correct: true },
            { text: "2/4", value: "2/4", correct: false },
            { text: "3/4", value: "3/4", correct: false }
        ],
        explanation: "حالت‌های ممکن: شیر-شیر، شیر-خط، خط-شیر، خط-خط<br>حالت مطلوب: فقط شیر-شیر<br>احتمال = 1/4"
    },
    {
        question: "در یک بسته 12 تایی تخم مرغ، 3 تا شکسته هستند. احتمال انتخاب یک تخم مرغ سالم چقدر است؟",
        options: [
            { text: "3/12", value: "3/12", correct: false },
            { text: "9/12", value: "9/12", correct: true },
            { text: "12/9", value: "12/9", correct: false },
            { text: "1/4", value: "1/4", correct: false }
        ],
        explanation: "تعداد تخم مرغ‌های سالم: 12 - 3 = 9<br>تعداد کل: 12<br>احتمال = 9/12"
    },
    {
        question: "احتمال انتخاب یک حرف صدادار از حروف الفبای انگلیسی چقدر است؟",
        options: [
            { text: "5/26", value: "5/26", correct: true },
            { text: "21/26", value: "21/26", correct: false },
            { text: "26/5", value: "26/5", correct: false },
            { text: "1/5", value: "1/5", correct: false }
        ],
        explanation: "تعداد حروف صدادار: A, E, I, O, U (5 حرف)<br>تعداد کل حروف: 26<br>احتمال = 5/26"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    updateTriangleVisualization(3, 4, 5);
    startProbabilityGame();
});

function startProbabilityGame() {
    probabilityScore = 0;
    currentQuestionIndex = 0;
    usedQuestionIndices = [];
    document.getElementById('probability-score').textContent = probabilityScore;
    document.getElementById('total-qs').textContent = totalQuestions;
    generateProbabilityProblem();
}

function generateProbabilityProblem() {
    // اگر تمام سوالات استفاده شده‌اند، بازی را از نو شروع کن
    if (usedQuestionIndices.length >= probabilityProblems.length) {
        usedQuestionIndices = [];
    }
    
    // انتخاب سوال تصادفی که قبلاً استفاده نشده
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * probabilityProblems.length);
    } while (usedQuestionIndices.includes(randomIndex));
    
    usedQuestionIndices.push(randomIndex);
    currentProbabilityProblem = probabilityProblems[randomIndex];
    
    // نمایش سوال
    document.getElementById('probability-problem').innerHTML = currentProbabilityProblem.question;
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    
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
    
    // پاک کردن نتیجه قبلی
    document.getElementById('probability-result').textContent = '';
}

function nextProbabilityProblem() {
    if (!userProbabilityAnswer) {
        alert('لطفاً یک گزینه را انتخاب کنید');
        return;
    }
    
    // بررسی پاسخ
    const correctAnswer = currentProbabilityProblem.options.find(opt => opt.correct).value;
    const resultElement = document.getElementById('probability-result');
    
    if (userProbabilityAnswer === correctAnswer) {
        probabilityScore += 10;
        resultElement.innerHTML = '<span style="color: var(--success)">پاسخ شما صحیح است! ✓ +10 امتیاز</span>';
    } else {
        probabilityScore = Math.max(0, probabilityScore - 5);
        resultElement.innerHTML = `<span style="color: var(--danger)">پاسخ شما نادرست است! -5 امتیاز<br>پاسخ صحیح: ${correctAnswer}</span>`;
    }
    
    // به‌روزرسانی امتیاز
    document.getElementById('probability-score').textContent = probabilityScore;
    
    // رفتن به سوال بعدی یا پایان بازی
    currentQuestionIndex++;
    userProbabilityAnswer = null;
    
    if (currentQuestionIndex < totalQuestions) {
        setTimeout(() => {
            generateProbabilityProblem();
        }, 1500);
    } else {
        setTimeout(() => {
            resultElement.innerHTML += `<br><br>امتیاز نهایی شما: ${probabilityScore} از ${totalQuestions * 10}`;
            document.querySelector('.next-btn').textContent = 'شروع مجدد';
            document.querySelector('.next-btn').onclick = startProbabilityGame;
        }, 1000);
    }
}

// ========== بازی محاسبات سریع ==========
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
    
    // نمایش سوال به فرمت فارسی (؟ = عدد عملگر عدد)
    const operatorSymbol = operation.symbol === '×' ? '×' : operation.symbol;
    document.getElementById('question').innerHTML = 
        `؟ = <span class="ltr-number">${num2}</span> ${operatorSymbol} <span class="ltr-number">${num1}</span>`;
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
    
    const tolerance = currentQuestion.operation === '×' ? 0.0001 : 0.001;
    
    if (Math.abs(userAnswer - currentQuestion.answer) < tolerance) {
        score += 5;
        document.getElementById('score').textContent = score;
        feedback.textContent = 'درست! ✓ +5 امتیاز';
        feedback.className = 'feedback correct';
    } else {
        score = Math.max(0, score - 2);
        document.getElementById('score').textContent = score;
        feedback.innerHTML = `نادرست! -2 امتیاز<br>پاسخ صحیح: <span class="ltr-number">${currentQuestion.answer}</span>`;
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