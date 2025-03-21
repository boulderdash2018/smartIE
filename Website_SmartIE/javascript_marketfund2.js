// Midterm 2 Questions Array
const midterm2Questions = [
    {
        question: "A university is buying new overhead projectors for its classrooms. The university's Information Technology Department has been asked to provide specifications and recommendations for this purchase. The IT Department is playing which role in the university's buying center?",
        options: [
            "Buyer",
            "Decider",
            "Gatekeeper",
            "Influencer",
            "User"
        ],
        correct: "Gatekeeper"
    },
    {
        question: "Which of the following statements regarding the buyer decision process is correct?",
        options: [
            "Consumers tend to take the same amount of time going through the stages of the buyer decision process.",
            "Consumers go through all stages of the buyer decision process for every purchase situation.",
            "The nature of the product has no effect on the buyer decision process.",
            "The buyer decision process consists of four stages.",
            "Consumers may, in some situations, skip steps in the buyer decision process."
        ],
        correct: "Consumers may, in some situations, skip steps in the buyer decision process."
    },
    {
        question: "Which of the following correctly defines the consumer market?",
        options: [
            "Consumers and the businesses who sell to them",
            "Consumers who spend more than $5,000 yearly on goods and services",
            "Consumers and the resellers who consumers buy their products from",
            "Manufacturers, resellers, and consumers",
            "Individuals and households that buy goods and services for personal consumption"
        ],
        correct: "Individuals and households that buy goods and services for personal consumption"
    },
    {
        question: "Business-to-business marketing involves buying and selling goods or services by which of the following?",
        options: [
            "Manufacturers, producers, retailers, wholesalers",
            "Manufacturers, retailers, consumers, wholesalers",
            "Consumers, manufacturers, resellers, suppliers",
            "Manufacturers, producers, retailers, the government",
            "Manufacturers, producers, retailers, consumers"
        ],
        correct: "Manufacturers, producers, retailers, wholesalers"
    },
    {
        question: "Alfie is a GPS tracker for dogs. The company decided to use the same provider for storage, shipping, and handling returns. This is an example of:",
        options: [
            "Straight rebuy",
            "Modified rebuy",
            "New task",
            "Group rebuy",
            "System selling"
        ],
        correct: "System selling"
    },
    {
        question: "When consumers engage in __________ buying behavior, they go through a learning process and are faced with brands that significantly differ between them, so it is most important that marketers understand information gathering and evaluation behavior.",
        options: [
            "Low involvement",
            "Habitual",
            "Dissonance-reducing",
            "Variety-seeking",
            "Complex"
        ],
        correct: "Variety-seeking"
    },
    {
        question: "Which of the following statements is correct regarding consumer buying decisions?",
        options: [
            "Consumers are often unaware of what influences their purchases.",
            "Marketers are interested in what and where consumers buy, but not how much they buy.",
            "The easiest part of studying buying decisions is determining the whys behind consumer buying behavior.",
            "A buyer's characteristics such as age and income have little influence on buying decisions.",
            "The consumer buying decision process is of little interest to marketers."
        ],
        correct: "Consumers are often unaware of what influences their purchases."
    },
    {
        question: "People can be classified into adopter categories. Which two categories are the first to adopt a new product idea?",
        options: [
            "Early mainstream and the late mainstream",
            "Early adopters and lagging adopters",
            "Innovators and the early mainstream",
            "Early adopters and early innovators",
            "Innovators and early adopters"
        ],
        correct: "Innovators and early adopters"
    },
    {
        question: "Which of the following is a business-to-business market transaction?",
        options: [
            "A person buying their weekly groceries",
            "A person getting a parking ticket",
            "The U.S. government buying supplies for military personnel",
            "A family vacationing at Disneyland",
            "A grocery store buying cereal from Kellogg's"
        ],
        correct: "A grocery store buying cereal from Kellogg's"
    },
    {
        question: "Which of the following statements is correct regarding major influences on business buyer behavior?",
        options: [
            "Culture is more important to domestic B-to-B marketers than to global B-to-B marketers.",
            "Emotion plays an important role in business buying decisions.",
            "Interpersonal factors have little influence on business buyer behavior.",
            "Economic factors have little influence on business buying decisions.",
            "Marketers in the B-to-B market are not concerned with competitive developments in their environment."
        ],
        correct: "Interpersonal factors have little influence on business buyer behavior."
    }
];

const midterm2Explanations = [
    {
        explanation: "The IT Department acts as a Gatekeeper, controlling the flow of information and recommendations to decision-makers.",
        example: "The IT team researches projector specs and recommends brands, filtering the options for the university's purchasing department."
    },
    {
        explanation: "Consumers may skip steps depending on how complex or familiar the purchase is.",
        example: "For routine grocery shopping, a consumer may skip researching or evaluating alternatives."
    },
    {
        explanation: "The consumer market includes individuals and households who buy goods for personal use.",
        example: "Families buying groceries or clothing are part of the consumer market."
    },
    {
        explanation: "Business-to-business (B2B) marketing involves transactions between manufacturers, producers, retailers, and wholesalers.",
        example: "A retailer buying large quantities of products from a wholesaler."
    },
    {
        explanation: "System selling means buying a complete solution (e.g., storage, shipping, returns) from one provider.",
        example: "Alfie choosing one logistics company to handle everything instead of multiple suppliers."
    },
    {
        explanation: "Consumers who like trying different brands for fun, not loyalty, show variety-seeking behavior.",
        example: "A person buying a different brand of chips each time they shop."
    },
    {
        explanation: "Consumers are often unaware of what influences their buying decisions (like ads, trends).",
        example: "Buying a popular sneaker brand due to peer influence without realizing it."
    },
    {
        explanation: "Innovators and early adopters are the first people to try new products.",
        example: "Tech enthusiasts who buy the latest smartphones as soon as they're launched."
    },
    {
        explanation: "A grocery store buying cereal from Kellogg's is a B2B transaction.",
        example: "The store buys in bulk to resell to consumers."
    },
    {
        explanation: "In B2B, interpersonal factors like relationships and communication strongly influence buying decisions.",
        example: "A company may prefer suppliers they trust and communicate well with, even if prices are higher."
    }
];

let midterm2Submissions = [];

function showMidterm2Test() {
    const content = document.getElementById('course-content');
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm 2</h2>
            <div id="quiz-container">
                ${midterm2Questions.map((q, index) => `
                    <div class="quiz-question">
                        <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
                        <div class="options" style="display: flex; flex-direction: column; gap: 10px;">
                            ${q.options.map(option => `
                                <button class="option-btn" style="width: 100%; text-align: left; padding: 10px;" onclick="selectMidterm2Option(this, ${index})">${option}</button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <div class="nav-container">
                    <button class="nav-btn" onclick="checkAndSubmitMidterm2()">Submit Test</button>
                    <button class="nav-btn secondary" onclick="showMainMenu()">Back to Menu</button>
                </div>
            </div>
        </div>
    `;
}

function selectMidterm2Option(button, questionIndex) {
    // Get all option buttons for this question
    const questionDiv = button.closest('.quiz-question');
    const allOptions = questionDiv.querySelectorAll('.option-btn');
    
    // Remove selected class from all options in this question
    allOptions.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked button
    button.classList.add('selected');
}

function checkAndSubmitMidterm2() {
    const questions = document.querySelectorAll('.quiz-question');
    const unansweredCount = Array.from(questions).filter(q => !q.querySelector('.option-btn.selected')).length;
    
    if (unansweredCount > 0) {
        const confirmSubmit = confirm(`Warning: You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Do you want to submit anyway?`);
        if (!confirmSubmit) {
            return;
        }
    }
    
    submitMidterm2();
}

function submitMidterm2() {
    // Create an array of all questions with their selected answers
    const questions = document.querySelectorAll('.quiz-question');
    let score = 0;
    const answers = [];
    
    // Go through each question
    questions.forEach((questionDiv, index) => {
        const selectedButton = questionDiv.querySelector('.option-btn.selected');
        const answer = {
            question: midterm2Questions[index].question,
            answer: selectedButton ? selectedButton.textContent : 'Not answered',
            correct: midterm2Questions[index].correct,
            isCorrect: false
        };
        
        // Check if the question was answered and if it's correct
        if (selectedButton) {
            answer.isCorrect = selectedButton.textContent === midterm2Questions[index].correct;
            if (answer.isCorrect) score++;
        }
        
        answers.push(answer);
    });

    // Store the submission
    const submission = {
        date: new Date().toLocaleString(),
        score: score,
        total: midterm2Questions.length,
        answers: answers,
        unansweredCount: answers.filter(a => a.answer === 'Not answered').length
    };

    if (!midterm2Submissions) {
        midterm2Submissions = [];
    }
    midterm2Submissions.unshift(submission);

    showMidterm2Review(0);
}

function showMidterm2Review(submissionIndex) {
    const submission = midterm2Submissions[submissionIndex];
    const content = document.getElementById('course-content');
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm 2 Review</h2>
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
                        ${index < midterm2Explanations.length ? `
                            <div class="flyout-menu">
                                <button class="flyout-button">View Explanation</button>
                                <div class="flyout-content">
                                    <div class="explanation-title">Explanation:</div>
                                    <div class="explanation-text">
                                        ${midterm2Explanations[index].explanation}
                                    </div>
                                    <div class="example-title">Example:</div>
                                    <div class="example-text">
                                        ${midterm2Explanations[index].example}
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            <div class="nav-container">
                <button class="nav-btn" onclick="showMidterm2Submissions()">Back to Submissions</button>
                <button class="nav-btn secondary" onclick="showMainMenu()">Back to Menu</button>
            </div>
        </div>
    `;
}

function showMidterm2Submissions() {
    const content = document.getElementById('course-content');
    const submissions = midterm2Submissions || [];
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm 2 Submissions</h2>
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
                            <button class="quiz-btn" onclick="showMidterm2Review(${index})">Review Answers</button>
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
