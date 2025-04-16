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
    
    // محاسبه مختصات با حفظ نسبت‌ها
    const maxSide = Math.max(a, b, c);
    const scale = 160 / maxSide;
    const scaledA = a * scale;
    const scaledB = b * scale;
    const scaledC = c * scale;
    
    // مختصات شروع
    const startX = 20, startY = 200;
    
    // ایجاد مسیر مثلث
    const pathData = `M${startX},${startY} L${startX},${startY - scaledB} L${startX + scaledA},${startY} Z`;
    path.setAttribute('d', pathData);
    
    // به روز رسانی برچسب‌ها
    document.getElementById('side-a-label').textContent = `a = ${a}`;
    document.getElementById('side-b-label').textContent = `b = ${b}`;
    document.getElementById('side-c-label').textContent = `c = ${c.toFixed(2)}`;
    
    // تنظیم موقعیت برچسب‌ها
    document.getElementById('side-a-label').setAttribute('x', startX + (scaledA / 2));
    document.getElementById('side-a-label').setAttribute('y', startY + 20);
    
    document.getElementById('side-b-label').setAttribute('x', startX - 15);
    document.getElementById('side-b-label').setAttribute('y', startY - (scaledB / 2));
    
    document.getElementById('side-c-label').setAttribute('x', startX + (scaledA / 2) - 15);
    document.getElementById('side-c-label').setAttribute('y', startY - (scaledB / 2) - 10);
}

// بخش احتمال - متغیرهای جهانی
// بخش احتمال - متغیرهای جهانی
let probabilityScore = 0;
let currentProbabilityProblem = {};
let userProbabilityAnswer = null;
let currentQuestionIndex = 0;
let totalQuestions = 10;
let probabilityProblems = [];
let usedQuestionIndices = [];

// بانک سوالات احتمال
const probabilityQuestionBank = [
    {
        question: "در یک کیسه 3 توپ قرمز و 2 توپ آبی وجود دارد. احتمال کشیدن یک توپ آبی چقدر است؟",
        options: [
            { text: "1/5", value: "1/5", correct: false },
            { text: "2/5", value: "2/5", correct: true },
            { text: "3/5", value: "3/5", correct: false },
            { text: "2/3", value: "2/3", correct: false }
        ],
        explanation: "تعداد کل توپ‌ها: 5 (3 قرمز + 2 آبی)<br>تعداد توپ‌های آبی: 2<br>احتمال = تعداد حالت‌های مطلوب / تعداد کل حالت‌ها = 2/5"
    },
    {
        question: "احتمال اینکه در پرتاب دو سکه حداقل یک شیر بیاید چقدر است؟",
        options: [
            { text: "1/4", value: "1/4", correct: false },
            { text: "1/2", value: "1/2", correct: false },
            { text: "3/4", value: "3/4", correct: true },
            { text: "1", value: "1", correct: false }
        ],
        explanation: "حالت‌های ممکن: شیر-شیر، شیر-خط، خط-شیر، خط-خط<br>حالت‌های مطلوب: 3 حالت اول<br>احتمال = 3/4"
    },
    {
        question: "احتمال آمدن عددی زوج یا بزرگتر از 4 در پرتاب تاس چقدر است؟",
        options: [
            { text: "1/6", value: "1/6", correct: false },
            { text: "1/2", value: "1/2", correct: false },
            { text: "2/3", value: "2/3", correct: true },
            { text: "5/6", value: "5/6", correct: false }
        ],
        explanation: "اعداد زوج: 2, 4, 6<br>اعداد بزرگتر از 4: 5, 6<br>اعداد مطلوب: 2, 4, 5, 6 (4 عدد)<br>احتمال = 4/6 = 2/3"
    },
    {
        question: "اگر احتمال بارانی بودن فردا 30% باشد، احتمال نبارانی بودن چقدر است؟",
        options: [
            { text: "30%", value: "30", correct: false },
            { text: "50%", value: "50", correct: false },
            { text: "70%", value: "70", correct: true },
            { text: "100%", value: "100", correct: false }
        ],
        explanation: "احتمال نبارانی بودن = 100% - احتمال بارانی بودن = 100% - 30% = 70%"
    },
    {
        question: "احتمال اینکه عددی اول بین 1 تا 10 در پرتاب تاس بیاید چقدر است؟",
        options: [
            { text: "1/6", value: "1/6", correct: false },
            { text: "1/3", value: "1/3", correct: false },
            { text: "1/2", value: "1/2", correct: true },
            { text: "2/3", value: "2/3", correct: false }
        ],
        explanation: "اعداد اول بین 1 تا 10: 2, 3, 5, 7 (4 عدد)<br>احتمال = 4/6 = 2/3 ≈ 1/2"
    },
    {
        question: "در یک کلاس 12 نفره، 5 دختر و 7 پسر هستند. احتمال انتخاب تصادفی یک دختر چقدر است؟",
        options: [
            { text: "5/7", value: "5/7", correct: false },
            { text: "7/12", value: "7/12", correct: false },
            { text: "5/12", value: "5/12", correct: true },
            { text: "12/5", value: "12/5", correct: false }
        ],
        explanation: "تعداد کل دانش‌آموزان: 12<br>تعداد دختران: 5<br>احتمال = 5/12"
    },
    {
        question: "احتمال اینکه در پرتاب سه سکه حداقل دو شیر بیاید چقدر است؟",
        options: [
            { text: "1/8", value: "1/8", correct: false },
            { text: "1/2", value: "1/2", correct: true },
            { text: "3/8", value: "3/8", correct: false },
            { text: "5/8", value: "5/8", correct: false }
        ],
        explanation: "حالت‌های ممکن: 8 حالت<br>حالت‌های مطلوب (2 شیر یا 3 شیر): 4 حالت<br>احتمال = 4/8 = 1/2"
    },
    {
        question: "اگر احتمال برنده شدن در یک بازی 0.2 باشد، احتمال باخت چقدر است؟",
        options: [
            { text: "0.2", value: "0.2", correct: false },
            { text: "0.5", value: "0.5", correct: false },
            { text: "0.8", value: "0.8", correct: true },
            { text: "1", value: "1", correct: false }
        ],
        explanation: "احتمال باخت = 1 - احتمال برنده شدن = 1 - 0.2 = 0.8"
    },
    {
        question: "احتمال آمدن عددی فرد در پرتاب تاس چقدر است؟",
        options: [
            { text: "1/6", value: "1/6", correct: false },
            { text: "1/3", value: "1/3", correct: false },
            { text: "1/2", value: "1/2", correct: true },
            { text: "2/3", value: "2/3", correct: false }
        ],
        explanation: "اعداد فرد: 1, 3, 5 (3 عدد)<br>احتمال = 3/6 = 1/2"
    },
    {
        question: "در یک کیسه 4 مهره سبز و 6 مهره زرد وجود دارد. احتمال کشیدن یک مهره سبز چقدر است؟",
        options: [
            { text: "4/6", value: "4/6", correct: false },
            { text: "6/10", value: "6/10", correct: false },
            { text: "4/10", value: "4/10", correct: true },
            { text: "10/4", value: "10/4", correct: false }
        ],
        explanation: "تعداد کل مهره‌ها: 10<br>تعداد مهره‌های سبز: 4<br>احتمال = 4/10"
    },
    {
        question: "احتمال اینکه عددی بین 2 تا 5 در پرتاب تاس بیاید چقدر است؟",
        options: [
            { text: "1/6", value: "1/6", correct: false },
            { text: "1/3", value: "1/3", correct: false },
            { text: "2/3", value: "2/3", correct: true },
            { text: "5/6", value: "5/6", correct: false }
        ],
        explanation: "اعداد بین 2 تا 5: 2, 3, 4, 5 (4 عدد)<br>احتمال = 4/6 = 2/3"
    },
    {
        question: "اگر احتمال موفقیت در آزمون 0.75 باشد، احتمال عدم موفقیت چقدر است؟",
        options: [
            { text: "0.25", value: "0.25", correct: true },
            { text: "0.5", value: "0.5", correct: false },
            { text: "0.75", value: "0.75", correct: false },
            { text: "1", value: "1", correct: false }
        ],
        explanation: "احتمال عدم موفقیت = 1 - احتمال موفقیت = 1 - 0.75 = 0.25"
    }
];

// شروع بازی احتمال
function startProbabilityGame() {
    probabilityScore = 0;
    currentQuestionIndex = 0;
    usedQuestionIndices = [];
    document.getElementById('probability-score').textContent = probabilityScore;
    document.getElementById('question-count').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = totalQuestions;
    document.querySelector('.start-btn').style.display = 'none';
    
    // انتخاب سوالات تصادفی غیرتکراری
    probabilityProblems = [];
    while (probabilityProblems.length < totalQuestions) {
        const randomIndex = Math.floor(Math.random() * probabilityQuestionBank.length);
        if (!usedQuestionIndices.includes(randomIndex)) {
            probabilityProblems.push(probabilityQuestionBank[randomIndex]);
            usedQuestionIndices.push(randomIndex);
        }
    }
    
    showProbabilityQuestion();
}

// نمایش سوال احتمال
function showProbabilityQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        endProbabilityGame();
        return;
    }
    
    currentProbabilityProblem = probabilityProblems[currentQuestionIndex];
    document.getElementById('probability-problem').innerHTML = currentProbabilityProblem.question;
    document.getElementById('question-count').textContent = currentQuestionIndex + 1;
    
    const optionsContainer = document.getElementById('probability-options');
    optionsContainer.innerHTML = '';
    
    currentProbabilityProblem.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = option.text;
        optionElement.dataset.value = option.value;
        optionElement.dataset.correct = option.correct;
        optionElement.addEventListener('click', selectProbabilityAnswer);
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('probability-result').textContent = '';
    document.getElementById('probability-explanation').textContent = '';
}

// انتخاب پاسخ احتمال
function selectProbabilityAnswer(e) {
    if (document.getElementById('probability-result').textContent !== '') return;
    
    const selectedOption = e.target;
    const options = document.querySelectorAll('.option');
    
    // نشان دادن انتخاب کاربر
    options.forEach(opt => opt.classList.remove('selected'));
    selectedOption.classList.add('selected');
    
    // بررسی پاسخ
    const isCorrect = selectedOption.dataset.correct === 'true';
    const feedback = document.getElementById('probability-result');
    const explanation = document.getElementById('probability-explanation');
    
    if (isCorrect) {
        probabilityScore += 10;
        feedback.innerHTML = '<span style="color: var(--success)">پاسخ شما صحیح است! +10 امتیاز</span>';
        feedback.className = 'probability-feedback correct';
    } else {
        feedback.innerHTML = '<span style="color: var(--danger)">پاسخ شما نادرست است!</span>';
        feedback.className = 'probability-feedback incorrect';
        
        // نشان دادن پاسخ صحیح
        options.forEach(opt => {
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else {
                opt.classList.add('incorrect');
            }
        });
    }
    
    // نمایش راه حل
    explanation.innerHTML = currentProbabilityProblem.explanation;
    
    // به روز رسانی امتیاز
    document.getElementById('probability-score').textContent = probabilityScore;
    
    // نمایش دکمه ادامه
    const nextBtn = document.createElement('button');
    nextBtn.className = 'next-btn';
    nextBtn.textContent = 'سوال بعدی';
    nextBtn.onclick = nextProbabilityQuestion;
    
    const resultDiv = document.getElementById('probability-result');
    resultDiv.appendChild(nextBtn);
}

// رفتن به سوال بعدی
function nextProbabilityQuestion() {
    currentQuestionIndex++;
    showProbabilityQuestion();
}

// پایان بازی احتمال
function endProbabilityGame() {
    const feedback = document.getElementById('probability-result');
    feedback.innerHTML = `
        <h3>پایان بازی!</h3>
        <p>امتیاز نهایی شما: ${probabilityScore} از ${totalQuestions * 10}</p>
        <button class="start-btn" onclick="startProbabilityGame()">شروع مجدد</button>
    `;
    feedback.className = 'probability-feedback';
    
    document.getElementById('probability-problem').textContent = '';
    document.getElementById('probability-options').innerHTML = '';
    document.getElementById('probability-explanation').textContent = '';
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
    
    // نمایش اعداد از چپ به راست برای ضرب
    if (operation.symbol === '×') {
        document.getElementById('question').innerHTML = 
            `<span class="ltr-number">${num1}</span> ${operation.symbol} <span class="ltr-number">${num2}</span> = ?`;
    } else {
        document.getElementById('question').textContent = 
            `${num1} ${operation.symbol} ${num2} = ?`;
    }
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
    
    // برای ضرب، دقت بیشتری در تشخیص پاسخ لازم است
    const tolerance = currentQuestion.operation === '×' ? 0.0001 : 0.001;
    
    if (Math.abs(userAnswer - currentQuestion.answer) < tolerance) {
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