const midtermQuestions = [
    {
        question: "Which environment shows trends including shortages of certain raw materials, higher pollution levels, and more government intervention?",
        options: [
            "The political environment",
            "The economic environment",
            "The technological environment",
            "The sociocultural environment",
            "The natural environment"
        ],
        correct: "The natural environment"
    },
    {
        question: "What is the purpose of a value proposition?",
        options: [
            "To define the target market",
            "To balance customer management with demand management",
            "To differentiate and position a market offering in the marketplace",
            "To determine the prices a company will charge for its products",
            "To determine whom a company will serve with its market offerings"
        ],
        correct: "To differentiate and position a market offering in the marketplace"
    },
    {
        question: "A wedding services company changes its marketing strategy to reflect the fact that more LGBTQ marriages are taking place. The company is offering a broader range of ceremonies that cater to this market. Which of the following environments must this wedding company analyze?",
        options: [
            "Technological",
            "Natural",
            "Cultural",
            "Economic",
            "Political"
        ],
        correct: "Cultural"
    },
    {
        question: "A marketing plan begins with ________ and ends with a(n) ________.",
        options: [
            "objectives; outline of controls",
            "a marketing strategy; profit forecast",
            "an executive summary; action plan",
            "objectives; budget forecast",
            "an executive summary; outline of controls"
        ],
        correct: "objectives; outline of controls"
    },
    {
        question: "Which growth strategy seeks to increase sales to current customers without changing the product?",
        options: [
            "Product development",
            "Market development",
            "Portfolio analysis",
            "Market penetration",
            "Diversification"
        ],
        correct: "Market penetration"
    },
    {
        question: "Which of the following is NOT an element of the marketing mix?",
        options: [
            "Place",
            "Promotion",
            "Product",
            "Purchase",
            "Price"
        ],
        correct: "Purchase"
    },
    {
        question: "According to the BCG, which of the following describes a STAR?",
        options: [
            "High market share, high market growth",
            "High market share, low market growth",
            "Low market share, high market growth",
            "Low market investment, high market growth",
            "High market investment, high market growth"
        ],
        correct: "High market share, high market growth"
    },
    {
        question: "Amazon Echo's Alexa is an example of:",
        options: [
            "Artificial intelligence",
            "Digital learning",
            "Data analytics",
            "Desktop computing",
            "The worldwide web"
        ],
        correct: "Artificial intelligence"
    },
    {
        question: "________ occurs when satisfied customers initiate favorable interactions with others about a brand.",
        options: [
            "Partnership marketing",
            "Customer intrusion",
            "Targeting new customers",
            "Customer brand advocacy",
            "Customer-engagement marketing"
        ],
        correct: "Customer brand advocacy"
    },
    {
        question: "The IoT is part of which external marketing environment?",
        options: [
            "The natural environment",
            "The sociocultural environment",
            "The technological environment",
            "The demographic environment",
            "The economic environment"
        ],
        correct: "The technological environment"
    },
    {
        question: "In a SWOT analysis, ________ include favorable trends in the external environment.",
        options: [
            "Opportunities",
            "Strengths",
            "Challenges",
            "Threats",
            "Weaknesses"
        ],
        correct: "Opportunities"
    },
    {
        question: "Arranging for a product to occupy a clear, distinctive, and desirable place relative to competing products in the minds of target consumers is known as:",
        options: [
            "Diversifying",
            "Positioning",
            "Segmenting",
            "Prospecting",
            "Satisficing"
        ],
        correct: "Positioning"
    },
    {
        question: "The technology that involves machines that think and learn like humans is known as:",
        options: [
            "Analytics",
            "Artificial intelligence",
            "The Internet of Things",
            "Big data",
            "Digital thinking"
        ],
        correct: "Artificial intelligence"
    },
    {
        question: "A video game manufacturer wants to enter the Japanese market with their current line of games. Based on the product/market expansion grid, which growth strategy is the firm using?",
        options: [
            "Market penetration",
            "Market development",
            "Diversification",
            "Product development",
            "Harvesting"
        ],
        correct: "Market development"
    },
    {
        question: "Reese's is developing a special edition for their chocolates for Halloween, with a new packaging and dedicated communication strategy. Which strategy is this more likely to be according to the ANSOFF matrix?",
        options: [
            "Product development",
            "Market penetration",
            "Market development",
            "Diversification",
            "Need development"
        ],
        correct: "Product development"
    }
];

const explanations = [
    {
        explanation: "The natural environment involves natural resources and ecological factors like raw material availability, pollution, and environmental regulations that affect businesses.",
        example: "For example, a car company facing a shortage of lithium (used in electric car batteries) and stricter pollution laws must adapt to these natural environment changes."
    },
    {
        explanation: "A value proposition explains why a customer should choose a company's product by showing its unique benefits and value compared to competitors.",
        example: "Apple's value proposition is premium quality, innovation, and design, which sets it apart from other smartphone brands."
    },
    {
        explanation: "The cultural environment reflects societal values, beliefs, and trends that businesses must consider to meet changing customer preferences.",
        example: "The wedding company updates its services to reflect growing societal acceptance and demand for LGBTQ ceremonies."
    },
    {
        explanation: "A marketing plan starts by setting clear objectives and finishes with controls to measure if goals were achieved and adjust as needed.",
        example: "A company may set a goal to grow sales by 10% and later use sales reports to check progress and control outcomes."
    },
    {
        explanation: "Market penetration focuses on selling more of the existing product to the current market.",
        example: "McDonald's offering discounts or loyalty programs to encourage customers to buy more burgers."
    },
    {
        explanation: "The marketing mix includes Product, Price, Place, Promotion – not Purchase.",
        example: "Setting the product price and deciding where to sell it are part of the marketing mix, but the customer's act of purchase is not."
    },
    {
        explanation: "A STAR has a high market share in a fast-growing market, needing investment to maintain leadership.",
        example: "Tesla's Model 3 in the booming electric vehicle market."
    },
    {
        explanation: "Artificial intelligence (AI) refers to machines like Alexa that can understand and respond to voice commands.",
        example: "Alexa answering your questions and controlling smart home devices."
    },
    {
        explanation: "This is called Customer brand advocacy, where happy customers promote the brand to others.",
        example: "A customer posting positive reviews about Nike shoes on social media."
    },
    {
        explanation: "The Technological environment includes innovations like the Internet of Things (IoT) that connect devices.",
        example: "Smart fridges that connect to apps to help manage groceries."
    },
    {
        explanation: "Opportunities are positive external trends that companies can exploit for growth.",
        example: "A growing demand for electric cars is an opportunity for car manufacturers."
    },
    {
        explanation: "Positioning is making a product stand out clearly in consumers' minds compared to competitors.",
        example: "Volvo positions itself as the safest car brand."
    },
    {
        explanation: "Artificial Intelligence (AI) refers to machines that mimic human thinking and learning.",
        example: "Chatbots that answer customer service questions automatically."
    },
    {
        explanation: "Market development is selling current products in new geographic or demographic markets.",
        example: "Launching existing games in Japan for the first time."
    },
    {
        explanation: "Product development means modifying products (e.g., packaging) for current markets.",
        example: "Reese's Halloween-themed chocolate packaging to boost sales during the holiday."
    }
];

let midtermSubmissions = [];

function showMidtermTest() {
    const content = document.getElementById('course-content');
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm 1</h2>
            <div id="quiz-container">
                ${midtermQuestions.map((q, index) => `
                    <div class="quiz-question">
                        <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
                        <div class="options" style="display: flex; flex-direction: column; gap: 10px;">
                            ${q.options.map(option => `
                                <button class="option-btn" style="width: 100%; text-align: left; padding: 10px;" onclick="selectMidtermOption(this, ${index})">${option}</button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <div class="nav-container">
                    <button class="nav-btn" onclick="checkAndSubmitMidterm()">Submit Test</button>
                    <button class="nav-btn secondary" onclick="showMainMenu()">Back to Menu</button>
                </div>
            </div>
        </div>
    `;
}

function selectMidtermOption(button, questionIndex) {
    // Get all option buttons for this question
    const questionDiv = button.closest('.quiz-question');
    const allOptions = questionDiv.querySelectorAll('.option-btn');
    
    // Remove selected class from all options in this question
    allOptions.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked button
    button.classList.add('selected');
}

function checkAndSubmitMidterm() {
    const questions = document.querySelectorAll('.quiz-question');
    const unansweredCount = Array.from(questions).filter(q => !q.querySelector('.option-btn.selected')).length;
    
    if (unansweredCount > 0) {
        const confirmSubmit = confirm(`Warning: You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Do you want to submit anyway?`);
        if (!confirmSubmit) {
            return;
        }
    }
    
    submitMidterm();
}

function submitMidterm() {
    // Create an array of all questions with their selected answers
    const questions = document.querySelectorAll('.quiz-question');
    let score = 0;
    const answers = [];
    
    // Go through each question
    questions.forEach((questionDiv, index) => {
        const selectedButton = questionDiv.querySelector('.option-btn.selected');
        const answer = {
            question: midtermQuestions[index].question,
            answer: selectedButton ? selectedButton.textContent : 'Not answered',
            correct: midtermQuestions[index].correct,
            isCorrect: false
        };
        
        // Check if the question was answered and if it's correct
        if (selectedButton) {
            answer.isCorrect = selectedButton.textContent === midtermQuestions[index].correct;
            if (answer.isCorrect) score++;
        }
        
        answers.push(answer);
    });

    // Store the submission
    const submission = {
        date: new Date().toLocaleString(),
        score: score,
        total: midtermQuestions.length,
        answers: answers,
        unansweredCount: answers.filter(a => a.answer === 'Not answered').length
    };

    if (!midtermSubmissions) {
        midtermSubmissions = [];
    }
    midtermSubmissions.unshift(submission);

    showMidtermReview(0);
}

function showMidtermReview(submissionIndex) {
    const submission = midtermSubmissions[submissionIndex];
    const content = document.getElementById('course-content');
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm 1 Review</h2>
            <div class="review-progress">
                <span>Score:</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="--progress: ${(submission.score / submission.total) * 100}%"></div>
                </div>
                <span>${submission.score}/${submission.total}</span>
            </div>
            <div class="submissions-list">
                ${submission.answers.map((answer, index) => `
                    <div class="review-card ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        <p><strong>Question ${index + 1}:</strong> ${answer.question}</p>
                        <p>Your answer: ${answer.answer}</p>
                        <p>Correct answer: ${answer.correct}</p>
                        <div class="flyout-menu">
                            <button class="flyout-button">View Explanation</button>
                            <div class="flyout-content">
                                <div class="explanation-title">Explanation:</div>
                                <div class="explanation-text">
                                    ${explanations[index].explanation}
                                </div>
                                <div class="example-title">Example:</div>
                                <div class="example-text">
                                    ${explanations[index].example}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="nav-container">
                <button class="nav-btn" onclick="showMidtermSubmissions()">Back to Submissions</button>
                <button class="nav-btn secondary" onclick="showMainMenu()">Back to Menu</button>
            </div>
        </div>
    `;
}

function showMidtermSubmissions() {
    const content = document.getElementById('course-content');
    const submissions = midtermSubmissions || [];
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm 1 Submissions</h2>
            ${submissions.length === 0 ? 
                '<p>No submissions yet.</p>' :
                submissions.map((sub, index) => {
                    const progress = (sub.score / sub.total) * 100;
                    return `
                        <div class="review-card">
                            <div class="review-progress">
                                <span>${sub.score}/${sub.total}</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress}%"></div>
                                </div>
                                <span>${Math.round(progress)}%</span>
                            </div>
                            <p>${sub.date}</p>
                            <button class="quiz-btn" onclick="showMidtermReview(${index})">Review Answers</button>
                        </div>
                    `;
                }).join('')
            }
            <div class="nav-container">
                <button class="nav-btn" onclick="showMainMenu()">Back to Menu</button>
            </div>
        </div>
    `;
}

function showMainMenu() {
    const content = document.getElementById('course-content');
    content.innerHTML = `
        <div class="menu-container">
            <div class="menu-section">
                <h2>Definition Quizzes</h2>
                <div class="button-grid">
                    <button onclick="showDefinitionQuiz(1)" class="menu-btn">Definition Quiz Chapter 1</button>
                    <button onclick="showDefinitionQuiz(2)" class="menu-btn">Definition Quiz Chapter 2</button>
                    <button onclick="showDefinitionQuiz(3)" class="menu-btn">Definition Quiz Chapter 3</button>
                    <button onclick="showDefinitionQuiz(4)" class="menu-btn">Definition Quiz Chapter 4</button>
                    <button onclick="showDefinitionQuiz(5)" class="menu-btn">Definition Quiz Chapter 5</button>
                    <button onclick="showDefinitionQuiz(6)" class="menu-btn">Definition Quiz Chapter 6</button>
                    <button onclick="showDefinitionQuiz(7)" class="menu-btn">Definition Quiz Chapter 7</button>
                </div>
            </div>
            <div class="menu-section">
                <h2>Tests</h2>
                <div class="button-grid" style="display: flex; flex-direction: column; gap: 20px;">
                    <button onclick="showMidtermTest()" class="menu-btn">Midterm 1</button>
                    <button onclick="showMidterm2Test()" class="menu-btn">Midterm 2</button>
                    <button onclick="showMidterm3Test()" class="menu-btn">Midterm 3</button>
                    <button onclick="showFinal1Test()" class="menu-btn">Final 1</button>
                </div>
            </div>
            <div class="menu-section">
                <h2>Progress</h2>
                <div class="button-grid" style="display: flex; flex-direction: column; gap: 20px; max-width: 400px; margin: 0 auto;">
                    <button onclick="showMainSubmissions()" class="menu-btn">Definition Quiz Submissions</button>
                    <button onclick="showMidtermSubmissions()" class="menu-btn">Midterm 1 Submissions</button>
                    <button onclick="showMidterm2Submissions()" class="menu-btn">Midterm 2 Submissions</button>
                    <button onclick="showMidterm3Submissions()" class="menu-btn">Midterm 3 Submissions</button>
                    <button onclick="showFinal1Submissions()" class="menu-btn">Final 1 Submissions</button>
                </div>
            </div>
        </div>
    `;
}

// Show main menu when page loads
document.addEventListener('DOMContentLoaded', function() {
    showMainMenu();
});