document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
});

function checkAuth() {
    const user = localStorage.getItem("currentUser");
    if (user) {
        document.getElementById("presentation").style.display = "none";
        document.getElementById("navbar").style.display = "flex";
        // Show admin button only for admin user
        if (user === 'leo.tran@outlook.fr') {
            document.getElementById("adminButton").style.display = "block";
        }
        navigate('offers');
    }
}

function navigate(page) {
    const app = document.getElementById("app");
    if (page === 'offers') {
        loadOffers();
    } else if (page === 'courses') {
        loadMyCourses();
    } else if (page === 'myinfo') {
        loadUserInfo();
    } else if (page === 'admin') {
        loadAdminPanel();
    }
}

function showLogin() {
    document.getElementById("presentation").style.display = "none";
    document.getElementById("app").innerHTML = `
        <div class="auth-container">
            <h1>Login</h1>
            <div id="login-error" class="error-message" style="display: none;"></div>
            <input type="email" id="login-email" placeholder="Email Address">
            <input type="password" id="login-password" placeholder="Password">
            <button class="auth-btn" onclick="login()">Sign In</button>
            <div class="auth-links">
                <a href="#" onclick="showSignup()">Sign Up</a>
            </div>
        </div>
    `;
}

function showSignup() {
    document.getElementById("presentation").style.display = "none";
    document.getElementById("app").innerHTML = `
        <div class="auth-container">
            <h1>Sign Up</h1>
            <div id="signup-error" class="error-message" style="display: none;"></div>
            <input type="text" id="signup-name" placeholder="Full Name">
            <input type="email" id="signup-email" placeholder="Email Address">
            <input type="password" id="signup-password" placeholder="Password">
            <input type="password" id="confirm-password" placeholder="Confirm Password">
            <button class="auth-btn" onclick="signup()">Sign Up</button>
            <div class="auth-links">
                <a href="#" onclick="showLogin()">Already have an account? Sign In</a>
            </div>
        </div>
    `;
}

function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const now = new Date().toISOString();

    // Check if email exists
    const storedPassword = localStorage.getItem(`${email}_password`);
    if (!storedPassword) {
        showError('login-error', 'Email address not found. Please sign up first.');
        return;
    }

    // Validate password
    if (storedPassword !== password) {
        showError('login-error', 'Incorrect password. Please try again.');
        return;
    }
    
    // Update user data and proceed with login
    localStorage.setItem("currentUser", email);
    localStorage.setItem(`${email}_lastLogin`, now);
    
    // Track activity
    const today = new Date().toISOString().split('T')[0];
    const week = getWeekNumber(new Date());
    const month = new Date().toISOString().slice(0, 7);
    
    // Daily activity
    let dailyActivity = JSON.parse(localStorage.getItem('dailyActivity') || '{}');
    dailyActivity[today] = [...new Set([...(dailyActivity[today] || []), email])];
    localStorage.setItem('dailyActivity', JSON.stringify(dailyActivity));
    
    // Weekly activity
    let weeklyActivity = JSON.parse(localStorage.getItem('weeklyActivity') || '{}');
    weeklyActivity[week] = [...new Set([...(weeklyActivity[week] || []), email])];
    localStorage.setItem('weeklyActivity', JSON.stringify(weeklyActivity));
    
    // Monthly activity
    let monthlyActivity = JSON.parse(localStorage.getItem('monthlyActivity') || '{}');
    monthlyActivity[month] = [...new Set([...(monthlyActivity[month] || []), email])];
    localStorage.setItem('monthlyActivity', JSON.stringify(monthlyActivity));

    const connections = parseInt(localStorage.getItem(`${email}_connections`) || '0');
    localStorage.setItem(`${email}_connections`, connections + 1);
    
    document.getElementById("navbar").style.display = "flex";
    if (email === 'leo.tran@outlook.fr') {
        document.getElementById("adminButton").style.display = "block";
    }
    navigate('offers');
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1)/7);
    return d.getUTCFullYear() + '-W' + weekNo;
}

function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const name = document.getElementById("signup-name").value;
    const now = new Date().toISOString();

    // Show error if email already exists
    if (localStorage.getItem(`${email}_password`)) {
        showError('signup-error', 'This email is already registered. Please login instead.');
        return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
        showError('signup-error', 'Passwords do not match.');
        return;
    }

    // Store user data
    localStorage.setItem(`${email}_password`, password);
    localStorage.setItem(`${email}_name`, name);
    localStorage.setItem(`${email}_created`, now);
    localStorage.setItem(`${email}_connections`, '0');
    localStorage.setItem(`${email}_paid`, 'false');

    // Automatically log in after signup
    localStorage.setItem("currentUser", email);
    document.getElementById("navbar").style.display = "flex";
    navigate('offers');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000); // Hide error after 5 seconds
}

function loadOffers() {
    document.getElementById("app").innerHTML = `
        <div class="offers-container">
            <h1>Offers</h1>
            <button class="big-btn" onclick="loadYearCourses(1)">1st Year Courses</button>
            <button class="big-btn" onclick="loadYearCourses(2)">2nd Year Courses</button>
            <button class="big-btn" onclick="loadPacks()">Packs</button>
            <button class="big-btn" onclick="loadFreeDemo()">Free Demo</button>
        </div>
    `;
}

function loadPacks() {
    document.getElementById("app").innerHTML = `
        <div class="offers-container">
            <h1>Course Packs</h1>
            <button class="big-btn">1st Year Full First Semester's Courses</button>
            <button class="big-btn">1st Year Full Second Semester's Courses</button>
            <button class="big-btn">2nd Year Full First Semester's Courses</button>
            <button class="big-btn">2nd Year Full Second Semester's Courses</button>
            <button class="back-btn" onclick="loadOffers()">Back to Offers</button>
        </div>
    `;
}

function loadFreeDemo() {
    document.getElementById("app").innerHTML = `
        <div class="offers-container">
            <h1>Free Demo Course</h1>
            <button class="big-btn" onclick="loadMarketingFundamentals()">Marketing Fundamentals</button>
            <button class="back-btn" onclick="loadOffers()">Back to Offers</button>
        </div>
    `;
}

function loadYearCourses(year) {
    document.getElementById("app").innerHTML = `
        <div class="offers-container">
            <h1>${year}st Year Courses</h1>
            <button class="big-btn" onclick="loadSemesterCourses(${year}, 1)">Semester 1</button>
            <button class="big-btn" onclick="loadSemesterCourses(${year}, 2)">Semester 2</button>
            <button class="back-btn" onclick="loadOffers()">Back to Offers</button>
        </div>
    `;
}

function loadSemesterCourses(year, semester) {
    let courses = {
        "1-1": ["Applied Business Mathematics", "Financial Accounting", "Management Tools and Principles", "Marketing Fundamentals"],
        "1-2": ["Mathematics For Management", "Introduction To Programming", "Cost Accounting", "Microeconomics"],
        "2-1": ["Business Driven-Information", "Corporate Finance", "Macroeconomics", "Marketing Management", "Statistics & Data Analysis"],
        "2-2": ["Capital Markets", "Financial Reporting & Analysis", "Global Economic Environment", "Operations Management", "Organizational Behavior"]
    };

    let courseList = courses[`${year}-${semester}`]
        .map(course => `<button class="big-btn">${course}</button>`)
        .join("");

    document.getElementById("app").innerHTML = `
        <div class="offers-container">
            <h1>${year}st Year - Semester ${semester}</h1>
            ${courseList}
            <button class="back-btn" onclick="loadYearCourses(${year})">Back to ${year}st Year</button>
        </div>
    `;
}

function loadMyCourses() {
    const courses = {
        "1-1": ["Applied Business Mathematics", "Financial Accounting", "Management Tools and Principles", "Marketing Fundamentals"],
        "1-2": ["Mathematics For Management", "Introduction To Programming", "Cost Accounting", "Microeconomics"],
        "2-1": ["Business Driven-Information", "Corporate Finance", "Macroeconomics", "Marketing Management", "Statistics & Data Analysis"],
        "2-2": ["Capital Markets", "Financial Reporting & Analysis", "Global Economic Environment", "Operations Management", "Organizational Behavior"]
    };

    const semesters = {
        "1-1": "1st Year First Semester",
        "1-2": "1st Year Second Semester",
        "2-1": "2nd Year First Semester",
        "2-2": "2nd Year Second Semester"
    };

    document.getElementById("app").innerHTML = `
        <div class="offers-container">
            <h1>My Courses</h1>
            ${Object.entries(semesters).map(([id, title]) => `
                <div class="semester-section">
                    <h2>${title}</h2>
                    <div class="courses-grid">
                        ${courses[id].map(course => `
                            <button class="course-button" onclick="loadCourse('${encodeURIComponent(course)}')">${course}</button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function loadCourse(courseName) {
    const decodedName = decodeURIComponent(courseName);
    document.getElementById("app").innerHTML = `
        <div class="offers-container">
            <h1>${decodedName}</h1>
            <div class="course-navigation">
                <button class="course-nav-btn active" onclick="showCourseSection('${encodeURIComponent(courseName)}', 'class')">Class</button>
                <button class="course-nav-btn" onclick="showCourseSection('${encodeURIComponent(courseName)}', 'exercises')">Exercises</button>
                <button class="course-nav-btn" onclick="showCourseSection('${encodeURIComponent(courseName)}', 'progress')">Progress</button>
            </div>
            <div id="course-content" class="course-content-section">
                <h2>Welcome to ${decodedName}</h2>
                <p>Select a section above to begin your learning journey:</p>
                <ul>
                    <li><strong>Class:</strong> Access lecture materials, videos, and course content</li>
                    <li><strong>Exercises:</strong> Practice with interactive exercises and assignments</li>
                    <li><strong>Progress:</strong> Track your learning progress and achievements</li>
                </ul>
            </div>
            <button class="back-btn" onclick="loadMyCourses()">Back to My Courses</button>
        </div>
    `;
}

function showCourseSection(courseName, section) {
    const decodedName = decodeURIComponent(courseName);
    const content = document.getElementById('course-content');
    
    // Update navigation buttons
    document.querySelectorAll('.course-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === section) {
            btn.classList.add('active');
        }
    });

    // Update content based on section
    switch(section) {
        case 'class':
            content.innerHTML = `
                <h2>Class Materials</h2>
                <div class="course-materials">
                    <button class="course-button">Lecture Notes</button>
                    <button class="course-button">Video Lectures</button>
                    <button class="course-button">Supplementary Materials</button>
                    <button class="course-button">Discussion Forum</button>
                </div>
            `;
            break;
        case 'exercises':
            content.innerHTML = `
                <div class="quiz-wrapper">
                    <h2>Definition Quizzes</h2>
                    <div class="course-materials">
                        <button class="course-button" onclick="showDefinitionQuiz(1)">Definition Quiz Chapter 1</button>
                        <button class="course-button" onclick="showDefinitionQuiz(2)">Definition Quiz Chapter 2</button>
                        <button class="course-button" onclick="showDefinitionQuiz(3)">Definition Quiz Chapter 3</button>
                        <button class="course-button" onclick="showDefinitionQuiz(4)">Definition Quiz Chapter 4</button>
                        <button class="course-button" onclick="showDefinitionQuiz(5)">Definition Quiz Chapter 5</button>
                        <button class="course-button" onclick="showDefinitionQuiz(6)">Definition Quiz Chapter 6</button>
                        <button class="course-button" onclick="showDefinitionQuiz(7)">Definition Quiz Chapter 7</button>
                    </div>
                    <div class="quiz-wrapper" style="margin-top: 40px;">
                        <h2 style="margin-bottom: 20px;">Midterm and Final's Questions</h2>
                        <div class="course-materials" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                            <button class="course-button" style="max-width: 400px;" onclick="showMidtermTest()">Midterm 1</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showMidterm2Test()">Midterm 2</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showMidterm3Test()">Midterm 3</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showMidterm4Test()">Midterm 4</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showFinal1Test()">Final 1</button>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'progress':
            content.innerHTML = `
                <div class="quiz-wrapper">
                    <h2>Your Progress</h2>
                    <div class="course-materials" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                        <button class="course-button" style="max-width: 400px;" onclick="showMainSubmissions()">Definition Quiz Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidtermSubmissions()">Midterm 1 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidterm2Submissions()">Midterm 2 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidterm3Submissions()">Midterm 3 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidterm4Submissions()">Midterm 4 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showFinal1Submissions()">Final 1 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showFinalQuestions()">Final's Questions</button>
                    </div>
                </div>
            `;
            break;
    }
}

function loadUserInfo() {
    document.getElementById("app").innerHTML = `
        <h1>My Information</h1>
        <p><strong>Email:</strong> ${localStorage.getItem("currentUser")}</p>
        <button class="logout-btn" onclick="logout()">Logout</button>
    `;
}

function loadAdminPanel() {
    const allUsers = Object.keys(localStorage)
        .filter(key => key.includes('@') && key.endsWith('_created'))
        .map(key => {
            const email = key.replace('_created', '');
            const lastLogin = localStorage.getItem(`${email}_lastLogin`) || new Date().toISOString();
            const connections = parseInt(localStorage.getItem(`${email}_connections`) || '0');
            const created = localStorage.getItem(`${email}_created`);
            const paid = localStorage.getItem(`${email}_paid`) === 'true';
            const name = localStorage.getItem(`${email}_name`) || email.split('@')[0];
            const sponsorships = parseInt(localStorage.getItem(`${email}_sponsorships`) || '0');
            return { email, name, paid, created, connections, lastLogin, sponsorships };
        });

    const totalUsers = allUsers.length;
    const paidAccounts = allUsers.filter(user => user.paid).length;
    const totalSponsorships = allUsers.reduce((sum, user) => sum + user.sponsorships, 0);
    
    document.getElementById("app").innerHTML = `
        <div class="admin-page">
            <h1 class="admin-main-title">Admin Dashboard</h1>
            
            <div class="admin-card">
                <div class="admin-nav">
                    <button class="admin-nav-btn active" onclick="showAdminSection('metrics')">Metrics</button>
                    <button class="admin-nav-btn" onclick="showAdminSection('users')">Users</button>
                </div>
                
                <div id="metrics-section" class="admin-section active">
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-label">Total Users</div>
                            <div class="metric-value">${totalUsers}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Paid Accounts</div>
                            <div class="metric-value">${paidAccounts}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Total Sponsorships</div>
                            <div class="metric-value">${totalSponsorships}</div>
                        </div>
                    </div>

                    <div class="activity-charts">
                        <div class="chart-container">
                            <h3>Daily Active Users</h3>
                            <canvas id="dailyChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Weekly Active Users</h3>
                            <canvas id="weeklyChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Monthly Active Users</h3>
                            <canvas id="monthlyChart"></canvas>
                        </div>
                    </div>
                </div>

                <div id="users-section" class="admin-section">
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-label">Total Users</div>
                            <div class="metric-value">${totalUsers}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Paid Accounts</div>
                            <div class="metric-value">${paidAccounts}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Total Sponsorships</div>
                            <div class="metric-value">${totalSponsorships}</div>
                        </div>
                    </div>
                    <div class="users-table-container">
                        <table class="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Account Status</th>
                                    <th>Sponsorships</th>
                                    <th>Date of Creation</th>
                                    <th>Number of Connections</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${allUsers.map(user => `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.paid ? '<span class="status-paid">Paid</span>' : '<span class="status-unpaid">Unpaid</span>'}</td>
                                        <td>${user.sponsorships}</td>
                                        <td>${new Date(user.created).toLocaleDateString()}</td>
                                        <td class="connections-count">${user.connections}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Create charts after DOM is ready
    setTimeout(() => {
        // Daily Chart
        new Chart(document.getElementById('dailyChart'), {
            type: 'line',
            data: {
                labels: Array.from({length: 7}, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse(),
                datasets: [{
                    label: 'Daily Active Users',
                    data: Array.from({length: 7}, (_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const dailyActivity = JSON.parse(localStorage.getItem('dailyActivity') || '{}');
                        return (dailyActivity[d.toISOString().split('T')[0]] || []).length;
                    }).reverse(),
                    borderColor: '#1E3A5F',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });

        // Weekly Chart
        new Chart(document.getElementById('weeklyChart'), {
            type: 'line',
            data: {
                labels: Array.from({length: 4}, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (i * 7));
                    return getWeekNumber(d);
                }).reverse(),
                datasets: [{
                    label: 'Weekly Active Users',
                    data: Array.from({length: 4}, (_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (i * 7));
                        const weeklyActivity = JSON.parse(localStorage.getItem('weeklyActivity') || '{}');
                        return (weeklyActivity[getWeekNumber(d)] || []).length;
                    }).reverse(),
                    borderColor: '#1E3A5F',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });

        // Monthly Chart
        new Chart(document.getElementById('monthlyChart'), {
            type: 'line',
            data: {
                labels: Array.from({length: 6}, (_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    return d.toISOString().slice(0, 7);
                }).reverse(),
                datasets: [{
                    label: 'Monthly Active Users',
                    data: Array.from({length: 6}, (_, i) => {
                        const d = new Date();
                        d.setMonth(d.getMonth() - i);
                        const monthlyActivity = JSON.parse(localStorage.getItem('monthlyActivity') || '{}');
                        return (monthlyActivity[d.toISOString().slice(0, 7)] || []).length;
                    }).reverse(),
                    borderColor: '#1E3A5F',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }, 0);
}

function showAdminSection(section) {
    // Update button states
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(section)) {
            btn.classList.add('active');
        }
    });

    // Update section visibility with animation
    const metricsSection = document.getElementById('metrics-section');
    const usersSection = document.getElementById('users-section');

    if (section === 'metrics') {
        usersSection.classList.remove('active');
        setTimeout(() => {
            metricsSection.classList.add('active');
        }, 50);
    } else {
        metricsSection.classList.remove('active');
        setTimeout(() => {
            usersSection.classList.add('active');
        }, 50);
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    document.getElementById("navbar").style.display = "none";
    document.getElementById("presentation").style.display = "flex";
    document.getElementById("app").innerHTML = "";
}

function loadMarketingFundamentals() {
    document.getElementById("app").innerHTML = `
        <div class="quiz-wrapper">
            <h1>Marketing Fundamentals</h1>
            <div class="course-navigation">
                <button class="course-nav-btn active" onclick="showMarketingSection('class')">Class</button>
                <button class="course-nav-btn" onclick="showMarketingSection('exercises')">Exercises</button>
                <button class="course-nav-btn" onclick="showMarketingSection('progress')">Progress</button>
            </div>
            <div id="course-content" class="course-content-section"></div>
            <button class="back-btn" onclick="loadFreeDemo()">Back to Free Demo</button>
        </div>
    `;
    showMarketingSection('class');
}

// Store all chapter 1 definitions
const chapter1Definitions = [
    { 
        term: 'Needs', 
        definition: 'States of felt deprivation',
        explanation: 'A need is something essential for survival or well-being.',
        example: 'You need food to stay alive'
    },
    { 
        term: 'Wants', 
        definition: 'The form human needs take as they are shaped by culture and individual personality',
        explanation: 'A want is how you choose to satisfy a need, influenced by culture or personal taste.',
        example: 'You want pizza (to satisfy your need for food).'
    },
    { 
        term: 'Demands', 
        definition: 'Human wants that are backed by buying power',
        explanation: 'A demand is a want that you have the money and ability to buy.',
        example: 'You buy pizza because you want it and have the money to pay for it.'
    },
    { 
        term: 'Market offerings', 
        definition: 'Combinations of products, services, info or experiences offered to a market to satisfy needs or wants',
        example: 'A smartphone comes with a warranty and customer support.'
    },
    { 
        term: 'Marketing myopia', 
        definition: 'Paying more attention to the product that the benefits and experiences produced',
        example: 'A camera company only promotes camera specs, forgetting customers want to capture memories easily.'
    },
    { 
        term: 'Consumer market', 
        definition: 'All the individuals and households that buy goods and services for personal consumption',
        explanation: 'People who buy products for personal use.',
        example: 'Shoppers buying clothes from a store.'
    },
    { 
        term: 'Marketing management', 
        definition: 'Choosing target markets and building profitable relationship with them',
        example: 'Nike targets athletes and builds loyalty through personalized offers.'
    },
    { 
        term: 'Value proposition', 
        definition: 'Set of benefits or values it promises to deliver to customers to satisfy their needs',
        example: 'Uber promises fast, easy, and affordable rides.'
    },
    { 
        term: 'Value driven marketing strategy', 
        definition: 'Production/product/selling/marketing/societal marketing concepts',
        explanation: 'Different ways companies focus',
        example: 'Tesla focuses on societal marketing by promoting clean energy cars.'
    },
    { 
        term: 'Societal marketing', 
        definition: 'Consider consumers wants, company requirements, consumers long run interests and society long run interests',
        example: 'Body Shop uses natural ingredients and fights animal testing.'
    },
    { 
        term: 'Sustainable marketing', 
        definition: 'Corporate ethics and social responsibility have become important for every business',
        example: 'A coffee brand using recyclable packaging and supporting fair-trade farmers.'
    },
    { 
        term: 'Marketing mix', 
        definition: 'Product/price/promotion/place',
        example: 'Coca-Cola\'s product (soda), price ($1), ads (promotion), and stores (place).'
    },
    { 
        term: 'Integrated marketing', 
        definition: 'Plan that communicates and delivers intended value',
        explanation: 'Coordinated efforts to deliver value consistently across all channels.',
        example: 'Apple\'s website, ads, and stores all deliver the same premium brand message.'
    },
    { 
        term: 'Customer relationship management', 
        definition: 'The overall process of building and maintaining profitable customer relationships by delivering superior customer value and satisfaction',
        example: 'Amazon recommends products based on past purchases.'
    },
    { 
        term: 'Customer perceived value', 
        definition: 'Difference btw total customer perceived benefits and customer cost',
        explanation: 'What customers feel they gain vs. what they pay.',
        example: 'Buying a $5 coffee that feels worth it because of quality and service.'
    },
    { 
        term: 'Customer engagement marketing', 
        definition: 'Direct and continuous customer involvement',
        example: 'Starbucks\' app rewards program keeps customers engaged.'
    },
    { 
        term: 'Consumer generated marketing', 
        definition: 'Brand exchanges created by consumers themselves',
        explanation: 'Customers create content or promote the brand.',
        example: 'Hashtag challenges on TikTok promoting a brand.'
    },
    { 
        term: 'Partner relationship management', 
        definition: 'Working with partners in other company departments and outside the company',
        example: 'Nike collaborates with influencers and retail partners.'
    },
    { 
        term: 'Customer lifetime value', 
        definition: 'Value of entire stream of purchases that the customer would make over a lifetime of patronage',
        explanation: 'Total value a customer brings over their lifetime.',
        example: 'A loyal Netflix subscriber for 10 years.'
    },
    { 
        term: 'Customer satisfaction', 
        definition: 'The extent to which perceived performance matches a buyer\'s expectations',
        example: 'Getting fast delivery when you expected a delay.'
    },
    { 
        term: 'Share of customer', 
        definition: 'Portion of the customers purchasing that a company gets in its product categories',
        example: 'One person buys all their groceries from Walmart.'
    },
    { 
        term: 'Customer equity', 
        definition: 'Total combined customer lifetime values of all of the company\'s customers',
        example: 'Amazon\'s overall customer base value.'
    },
    { 
        term: 'The changing marketing landscape', 
        definition: 'Digital age/economic environment/growth of not for profit marketing/rapid globalization/sustainable marketing',
        explanation: 'New trends reshaping marketing.',
        example: 'Social media, globalization, and sustainable practices influencing how companies operate.'
    },
    { 
        term: 'Sustainable marketing', 
        definition: 'Corporate ethics and social responsibility have become important for every business',
        example: 'A coffee brand using recyclable packaging and supporting fair-trade farmers.'
    },
    { 
        term: 'BCG Matrix', 
        definition: 'A tool that helps companies analyze their business units or product lines based on market growth and relative market share',
        explanation: 'The BCG Matrix divides products into four categories:\n- Stars: High growth, high market share\n- Question Marks: High growth, low market share\n- Cash Cows: Low growth, high market share\n- Dogs: Low growth, low market share',
        example: 'A company analyzes its products: new tech gadget (Star), experimental product (Question Mark), established product (Cash Cow), declining product (Dog)',
        image: {
            url: './images/bcg-matrix.png',
            alt: 'BCG Matrix showing four quadrants: Question Mark (high growth, low market share), Star (high growth, high market share), Dog (low growth, low market share), and Cash Cow (low growth, high market share)'
        }
    },
    { 
        term: 'Maslow\'s hierarchy of needs',
        definition: 'A psychological theory that suggests human needs are arranged in a hierarchy, starting with basic needs like food and safety and progressing to higher-level needs like self-actualization'
    },
    { 
        term: 'Selective attention',
        definition: 'The tendency for people to screen out most of the info to which they are exposed',
        explanation: 'The tendency for people to ignore most of the information they encounter and only focus on what catches their attention.',
        example: 'A person may only notice ads for their favorite brand of sneakers while ignoring ads for other brands.'
    },
    { 
        term: 'Selective distortion',
        definition: 'The tendency for people to interpret info in a way that will support what they already believe',
        explanation: 'The tendency for people to interpret information in a way that supports their existing beliefs or opinions.',
        example: 'A consumer might hear a product review and twist the details to make it seem more favorable if it matches their preference for that brand.'
    },
    { 
        term: 'Selective retention',
        definition: 'The tendency to remember good points made about a brand they favor and forget good points made about competing brands',
        explanation: 'The tendency to remember information that aligns with one\'s own preferences and forget information that doesn\'t.',
        example: 'A loyal customer may remember all the positive things said about their favorite smartphone brand but forget the complaints about it.'
    },
    { 
        term: 'Buying behavior',
        definition: 'The decision-making process and actions involved in purchasing products',
        explanation: 'The decision-making process and actions of consumers when purchasing goods or services.',
        example: 'A person decides to buy a new laptop based on factors like price, brand reputation, and features that fit their needs.'
    },
    { 
        term: 'Buyer decision process',
        definition: '1st step: consumer recognizes a problem triggered by internal and external stimuli\n2nd step: consumer motivated to search for more information (personal, commercial, public, experiential sources)\n3rd step: consumer uses info to evaluate alternative brands in the choice set\n4th step: is the buyer\'s decision about which brand to purchase.\n5th step: consumers take further action after purchase, based on their satisfaction or dissatisfaction.',
        explanation: 'The decision-making process and actions of consumers when purchasing goods and services, influenced by various factors such as personal preferences, social influences, and psychological factors.',
        example: 'A person buys a new laptop based on their need for a faster processor and better battery life, considering factors like price, brand reputation, and online reviews before making the final purchase decision.'
    },
    { 
        term: 'Cognitive dissonance',
        definition: 'Buyer discomfort caused by postpurchase conflict',
        explanation: 'The discomfort or tension a buyer feels after making a purchase, caused by conflicting thoughts or doubts about the decision.',
        example: 'After buying an expensive car, a person starts questioning if they made the right choice, feeling uneasy about the high cost despite wanting the vehicle.'
    },
    { 
        term: 'Customer journey',
        definition: 'The sum of the ongoing experiences consumers have with a brand that affect their buying behavior, engagement, and brand advocacy over time',
        explanation: 'The overall experience a consumer has with a brand, from first learning about it to post-purchase interactions, influencing their behavior, engagement, and loyalty.',
        example: 'A person discovers a brand on social media, interacts with it through an email campaign, makes a purchase online, and then continues to engage with the brand through loyalty programs and customer support.'
    },
    { 
        term: 'Adoption process',
        definition: 'Mental process an individual goes through from first learning about an innovation to final regular use',
        example: 'A person first hears about a new fitness app, researches its features, tries it out, and eventually incorporates it into their daily workout routine.'
    }
];

const chapter2Definitions = [
    { 
        term: 'Strategic planning',
        definition: 'Process of developing and maintaining a strategic fit between the organization\'s goals and capabilities and its changing marketing opportunities',
        explanation: 'Creating a long-term plan to align company goals with market opportunities.',
        example: 'Apple adjusts its product strategy based on new tech trends.'
    },
    { 
        term: 'Mission statement',
        definition: 'The organization\'s purpose, what it wants to accomplish in the larger environment',
        example: 'Google\'s mission: "To organize the world\'s information."'
    },
    { 
        term: 'Business objectives',
        definition: 'Build profitable customer relationship/invest in research/improve profits',
        example: 'Investing in R&D to launch new products.'
    },
    { 
        term: 'Marketing objectives',
        definition: 'Increase market share/create local partnership/increase promotion',
        example: 'Partnering locally to boost brand visibility.'
    },
    { 
        term: 'Business portfolio',
        definition: 'Collection of businesses and products that make up the company',
        example: 'Unilever\'s portfolio includes Dove, Lipton, and Ben & Jerry\'s.'
    },
    { 
        term: 'Portfolio analysis',
        definition: 'Major activity in strategic planning whereby management evaluates the products and businesses that make up the company',
        explanation: 'Evaluating each product or business to decide resource allocation.',
        example: 'Dropping underperforming brands and investing in best-sellers.'
    },
    { 
        term: 'Strategic business units',
        definition: 'Company division/product line within a division/single product or brand',
        explanation: 'Divisions or product lines treated as separate businesses.',
        example: 'PepsiCo\'s snacks division vs. beverages division.'
    },
    { 
        term: 'The BCG growth-share matrix',
        definition: 'A tool to analyze business portfolio',
        explanation: 'Tool to classify products as Stars, Cash Cows, Question Marks, or Dogs.',
        example: 'Apple\'s iPhone = Star; older products = Cash Cow.'
    },
    { 
        term: 'Problems matrix approaches',
        definition: 'Define SBU and measuring share and growth/time consuming/expensive/may not apply well to markets facing structural changes or disruptions/doesn\'t suit specific situations(customized approach)'
    },
    { 
        term: 'The product/market expansion grid',
        definition: 'Market penetration/market development/product development/diversification'
    },
    { 
        term: 'Downsizing',
        definition: 'A company must harvest or divest businesses that are unprofitable or that no longer fit the strategy',
        explanation: 'Reducing product lines or selling off units that don\'t fit the strategy.',
        example: 'Ford stopped producing sedans to focus on SUVs.'
    },
    { 
        term: 'Value chain',
        definition: 'Series of departments that carry out value creating activities to design, produce, market, deliver and support a firm\'s product',
        explanation: 'Activities within a company that add value to the product.',
        example: 'Design, production, marketing, and delivery steps at Zara.'
    },
    { 
        term: 'Value delivery network',
        definition: 'Made up of companies suppliers, distributors, customers who partner with each other to improve performance of the entire system',
        explanation: 'Partnerships between suppliers, distributors, and customers to deliver value.',
        example: 'Amazon\'s network includes suppliers, warehouses, and delivery partners.'
    },
    { 
        term: 'Customer value-driven marketing strategy',
        definition: 'Is the marketing logic by which the company hopes to create customer value and achieve profitable customer relationships',
        explanation: 'Creating strategies to deliver value and build strong relationships.',
        example: 'Netflix\'s personalized recommendations keep customers loyal.'
    },
    { 
        term: 'Market segmentation',
        definition: 'Division of a market into distinct groups of buyers who have different needs, characteristics or behaviors and who might require separate products or marketing mixes',
        explanation: 'Dividing the market into smaller groups with specific needs.',
        example: 'Segmenting by age: kids, teens, adults.'
    },
    { 
        term: 'Market segment',
        definition: 'Is a group of consumers who respond in a similar way to a given set of marketing efforts',
        explanation: 'A group of consumers who react similarly to marketing.',
        example: 'Young professionals interested in eco-friendly products.'
    },
    { 
        term: 'Market targeting',
        definition: 'Process of evaluating each market segment\'s attractiveness and selecting one or more segments to enter',
        explanation: 'Selecting which segment(s) to focus on.',
        example: 'Targeting college students for affordable laptops.'
    },
    { 
        term: 'Market positioning',
        definition: 'Arranging for a product to occupy a clear and desirable place relative to competing products in the minds of target consumers(begin with differentiation)',
        explanation: 'Placing a product in a distinct spot in customers\' minds.',
        example: 'Volvo positions itself as the safest car brand.'
    },
    { 
        term: 'Positioning',
        definition: 'Is arranging for a product to occupy a clear, distinctive, and desirable place relative to competing products from competing brands and give them the greatest advantage in their target markets',
        explanation: 'Defining how the product stands out versus competitors.',
        example: 'Nike = performance and innovation.'
    },
    { 
        term: 'Managing marketing',
        definition: 'Analysis/planning/implementation/control',
        explanation: 'Managing marketing involves 4 key steps:\nAnalysis – Studying the market and environment.\nPlanning – Setting objectives and strategies.\nImplementation – Putting plans into action.\nControl – Monitoring results and making adjustments.',
        example: 'Launching a new product:\nAnalyze customer needs\nPlan pricing and promotion\nImplement the campaign\nControl by checking sales performance'
    },
    { 
        term: 'SWOT analysis',
        definition: 'Strengths/weaknesses/opportunities/threats',
        explanation: 'A tool used to assess internal (Strengths & Weaknesses) and external (Opportunities & Threats) factors.',
        example: 'For Coca-Cola:\nStrength: Strong brand\nWeakness: High sugar content\nOpportunity: Growing demand for healthy drinks\nThreat: Competitors like Pepsi'
    },
    { 
        term: 'Marketing implementation',
        definition: 'Turning marketing strategies and plans into marketing actions to accomplish strategic marketing objectives(who, where, when, how)',
        example: 'Planning an Instagram ad campaign, then scheduling posts, assigning designers, setting deadlines, and launching.'
    },
    { 
        term: 'Marketing departments organization',
        definition: 'Functional organization/geographic organization/product management organization/market or customer organization',
        explanation: 'How a company structures its marketing team:\nFunctional Organization – By tasks (e.g., advertising, sales).\nGeographic Organization – By regions (e.g., North America, Europe).\nProduct Management Organization – By product lines.\nMarket or Customer Organization – By customer types (e.g., B2B vs B2C).',
        example: 'Nike may have product managers for shoes, apparel, and accessories, each with their own marketing team.'
    },
    { 
        term: 'Marketing control',
        definition: 'Management/operating control/strategic control',
        explanation: 'Monitoring marketing efforts to ensure objectives are met:\nManagement Control – Overall performance.\nOperating Control – Day-to-day activities like sales targets.\nStrategic Control – Checking if strategies align with long-term goals.',
        example: 'Starbucks reviews sales data weekly (operating control), checks annual profits (management control), and revisits long-term strategies (strategic control).'
    }
];

const chapter3Definitions = [
    { 
        term: 'Marketing environment',
        definition: 'Includes the actors and forces outside marketing that affect marketing management\'s ability to build and maintain successful relationships with target customers',
        explanation: 'All external factors that affect how a company builds strong customer relationships.',
        example: 'New government regulations affecting how fast-food chains market to kids.'
    },
    { 
        term: 'Microenvironment',
        definition: 'Consists of the actors close to the company that affect its ability to serve its customers the company, suppliers, marketing intermediaries, customer markets, competitors, and publics',
        example: 'Suppliers raising prices impacts product costs.'
    },
    { 
        term: 'Macroenvironments',
        definition: 'Consists of the larger societal forces that affect the microenvironment demographic, economic,natural, technological, political, and cultural forces',
        example: 'Economic recession affects consumer buying power.'
    },
    { 
        term: 'Marketing intermediaries',
        definition: 'Are firms that help the company to promote, finance, sell, and distribute its goods to final buyers',
        example: 'Retailers like Walmart sell products from brands to customers.'
    },
    { 
        term: 'Publics',
        definition: 'Any group that has an actual or potential interest in or impact on an organization\'s ability to achieve its objectives',
        example: 'Media reporting on a company\'s sustainability efforts.'
    },
    { 
        term: 'Demographic environment',
        definition: 'Study of human populations size, density, location, age, gender, race, occupation…',
        example: 'Targeting ads to millennials based on age group data.'
    },
    { 
        term: 'Demographic trends',
        definition: 'Include changing age and family structures, geographic population shifts, educational characteristics, and population diversity',
        example: 'More single-person households influencing demand for smaller homes.'
    },
    { 
        term: 'Generational marketing',
        definition: 'Important in segmenting people by lifestyle or life stage instead of age',
        example: 'Marketing eco-friendly products to Gen Z due to their sustainability focus.'
    },
    { 
        term: 'Economic environment',
        definition: 'Consumers adopted a new back to basics sensibility in their lifestyles and spending patterns',
        example: 'During a recession, consumers choose cheaper brands.'
    },
    { 
        term: 'Natural environment',
        definition: 'Physical environment and the natural resources that are needed as inputs by marketers or that are affected by marketing activities',
        explanation: 'Resources and physical conditions affecting businesses.',
        example: 'Shortage of water impacting beverage companies.'
    },
    { 
        term: 'Environmental sustainability',
        definition: 'Developing strategies and practices that create a world economy that the planet can support indefinitely',
        example: 'Using recyclable packaging to reduce waste.'
    },
    { 
        term: 'Technological environment',
        definition: 'Most dramatic force in changing the marketplace/new products, opportunities/concern for the safety of new products',
        explanation: 'New tech developments that change the market.',
        example: 'Smartphones revolutionized communication and app industries.'
    },
    { 
        term: 'Political & social environment',
        definition: 'Increase emphasis on ethics and socially responsible actions and its cause-related marketing',
        explanation: 'Laws, ethics, and social responsibility affecting marketing.',
        example: 'Ban on plastic bags influencing retail packaging.'
    },
    { 
        term: 'Cultural environment',
        definition: 'Institutions that affect a society basic values, perceptions and behaviors',
        example: 'Health-conscious cultures prefer organic food brands.'
    }
];

const chapter4Definitions = [
    { 
        term: 'Customer insights',
        definition: 'Fresh marketing information-based understandings of customers and the marketplace that become the basis for creating customer value, engagement, relationship',
        explanation: 'Understanding customers better based on fresh data to create value and build relationships.',
        example: 'A clothing brand learns that customers prefer eco-friendly fabrics, so they start offering more sustainable options.'
    },
    { 
        term: 'Big data',
        definition: 'Is the huge and complex data sets generated by today\'s sophisticated information generation, collection, storage, and analysis technologies.(like marketing research, internal transactions data, real time data flowing from its social media monitoring, connected devices, and other digital sources)',
        explanation: 'Large and complex data sets gathered from various digital sources, analyzed to understand trends.',
        example: 'A company analyzes data from its website, social media, and customer purchases to improve marketing strategies.'
    },
    { 
        term: 'Marketing information ecosystem',
        definition: 'People, processes, and assets dedicated to assessing managers\' information needs, developing the needed information, and helping managers and decision makers apply that information to generate and validate actionable customer and market insights',
        explanation: 'The system of people, processes, and tools that helps gather and use information to make better marketing decisions.',
        example: 'A marketing team uses customer surveys, internal sales data, and market reports to improve campaigns.'
    },
    { 
        term: 'Marketing information system',
        definition: 'Provides information to the company\'s marketing and other managers and external partners such as suppliers, resellers and marketing service agencies',
        explanation: 'A system that provides necessary information to managers and partners for decision-making.',
        example: 'A retail store uses a system that shares sales data and customer feedback with suppliers to adjust stock levels.'
    },
    { 
        term: 'Marketers obtain info from',
        definition: 'Internal data/marketing intelligence/marketing research',
        explanation: 'Sources like internal data, marketing intelligence, and marketing research to make decisions.',
        example: 'A marketer uses customer data (internal), competitor insights (intelligence), and market surveys (research) to plan a campaign.'
    },
    { 
        term: 'Internal data',
        definition: 'Collections of consumers and market info obtained from data sources within the company network',
        explanation: 'Data from within the company, like sales records and customer feedback.',
        example: 'A store reviews its sales data to determine which products are selling well.'
    },
    { 
        term: 'Competitive marketing intelligence',
        definition: 'Collection and analysis of publicity available info about consumers, competitors and developments in the marketing environment',
        example: 'A company tracks competitors\' social media ads and customer reviews to improve its own offerings.'
    },
    { 
        term: 'Marketing research',
        definition: 'Systematic design, collection, analysis and reporting of data relevant to a specific marketing situation facing an organization',
        explanation: 'Systematic collection and analysis of data to understand a specific marketing issue.',
        example: 'A company surveys customers to understand why they stopped buying a product.'
    },
    { 
        term: 'Secondary data',
        definition: 'Informations that already exists somewhere, having been collected for another purpose(lower cost and obtained quickly)',
        explanation: 'Existing data collected for a different purpose, often cheaper and faster to gather.',
        example: 'A company uses government statistics about consumer behavior instead of conducting their own survey.'
    },
    { 
        term: 'Primary data',
        definition: 'Informations collected for a specific purpose(relevant, accurate, current, impartial) through observation, ethnography, surveys, experiences, contacts',
        explanation: 'New data collected for a specific purpose, usually more relevant and accurate.',
        example: 'A company conducts a new survey to understand customer preferences for a new product.'
    },
    { 
        term: 'Observational research',
        definition: 'Involves gathering primary data by observing relevant people, actions, and situations',
        example: 'A store observes how customers interact with products to decide where to place items.'
    },
    { 
        term: 'Ethnographic research',
        definition: 'Involves sending trained observers to watch and interact with consumers in their "natural environments"',
        example: 'A researcher spends time in a home to see how families use a kitchen appliance.'
    },
    { 
        term: 'Survey research',
        definition: 'A research method where data is collected by asking people questions, typically through surveys or questionnaires, to gather information on their opinions, behaviors, or experiences',
        example: 'A company sends out a questionnaire to understand customer satisfaction.'
    },
    { 
        term: 'Experimental research',
        definition: 'Involves gathering primary data by selecting matched groups of subjects, giving them different treatments, controlling related factors, and checking for differences in group responses',
        explanation: 'Gathering data by testing different conditions and observing how they affect results.',
        example: 'A retailer tests two different store layouts to see which one results in more sales.'
    },
    { 
        term: 'Online marketing survey research',
        definition: 'Collecting primary marketing research data through internet and mobile surveys, online focus groups, and online panels and brand communities',
        example: 'A brand sends an online survey to collect feedback from customers about a new product.'
    },
    { 
        term: 'Customer relationship management',
        definition: 'Managing detailed info about individual customers and carefully managing customer touch point to maximize customer loyalty',
        example: 'A company uses CRM software to track customer interactions and offer personalized promotions.'
    },
    { 
        term: 'Marketing analytics',
        definition: 'Involves analysis tools, technologies, and processes by which marketers dig out meaningful patterns in big data to gain customer insights and gauge marketing performance',
        explanation: 'Analyzing big data to find patterns and improve marketing strategies.',
        example: 'A company uses analytics to determine which marketing channels bring the most traffic to its website.'
    }
];

const chapter5Definitions = [
    {
        term: 'Consumer buyer behavior',
        definition: 'Buying behavior of final consumers and households that buy goods and services for personal consumption',
        explanation: 'The decision-making process and actions of consumers when purchasing goods or services.',
        example: 'A person decides to buy a new laptop based on factors like price, brand reputation, and features that fit their needs.'
    },
    {
        term: 'Consumer market',
        definition: 'All the individuals and households that buy goods and services for personal consumption',
        explanation: 'The market of people who purchase groceries, clothing, or electronics for their own use.',
        example: 'Shoppers buying clothes from a store.'
    },
    {
        term: 'Cultural factors',
        definition: 'Set of basic values, perceptions, wants and behavior learned by a member of society from family and other important institutions',
        explanation: 'The influence of culture on consumer behavior.',
        example: 'In some cultures, it is traditional to buy gifts for major holidays, influencing purchasing decisions.'
    },
    {
        term: 'Subcultures',
        definition: 'Groups of people within a culture with shared value systems based on common life experiences and situations',
        explanation: 'Subgroups within a culture that share similar values and behaviors.',
        example: 'The hip-hop community may have its own preferences for clothing brands or music-related products.'
    },
    {
        term: 'Social factors',
        definition: 'Family/role and status',
        explanation: 'The influence of family, social roles, and status on buying decisions.',
        example: 'A person may buy a luxury car to align with their status as a successful professional, or because of family preferences.'
    },
    {
        term: 'Personal factors',
        definition: 'Lifestyle/economic situations/age and life stage/occupations/personality',
        explanation: 'Characteristics such as lifestyle, economic situation, age, life stage, occupation, and personality that influence buying behavior.',
        example: 'A young professional might buy trendy clothing, while a retiree might prioritize comfort over style in their clothing choices.'
    },
    {
        term: 'Psychological factors',
        definition: 'Motivation/perception/learning/beliefs and attitudes',
        explanation: 'Factors like motivation, perception, learning, beliefs, and attitudes that affect consumer decisions.',
        example: 'A person might choose a brand based on positive beliefs about its environmental impact or because they perceive it to be higher quality.'
    },
    {
        term: 'Motivation research',
        definition: 'Qualitative research designed to probe consumer\'s hidden subconscious motivations',
        example: 'A company conducts in-depth interviews to uncover why consumers prefer certain products even though they are more expensive.'
    },
    {
        term: 'Maslow\'s hierarchy of needs',
        definition: 'A psychological theory that suggests human needs are arranged in a hierarchy, starting with basic needs like food and safety and progressing to higher-level needs like self-actualization'
    },
    {
        term: 'Selective attention',
        definition: 'The tendency for people to screen out most of the info to which they are exposed',
        explanation: 'The tendency for people to ignore most of the information they encounter and only focus on what catches their attention.',
        example: 'A person may only notice ads for their favorite brand of sneakers while ignoring ads for other brands.'
    },
    {
        term: 'Selective distortion',
        definition: 'The tendency for people to interpret info in a way that will support what they already believe',
        explanation: 'The tendency for people to interpret information in a way that supports their existing beliefs or opinions.',
        example: 'A consumer might hear a product review and twist the details to make it seem more favorable if it matches their preference for that brand.'
    },
    {
        term: 'Selective retention',
        definition: 'The tendency to remember good points made about a brand they favor and forget good points made about competing brands',
        explanation: 'The tendency to remember information that aligns with one\'s own preferences and forget information that doesn\'t.',
        example: 'A loyal customer may remember all the positive things said about their favorite smartphone brand but forget the complaints about it.'
    },
    {
        term: 'Buying behavior',
        definition: 'The decision-making process and actions involved in purchasing products',
        explanation: 'The decision-making process and actions of consumers when purchasing goods or services.',
        example: 'A person decides to buy a new laptop based on factors like price, brand reputation, and features that fit their needs.'
    },
    {
        term: 'Buyer decision process',
        definition: '1st step: consumer recognizes a problem triggered by internal and external stimuli\n2nd step: consumer motivated to search for more information (personal, commercial, public, experiential sources)\n3rd step: consumer uses info to evaluate alternative brands in the choice set\n4th step: is the buyer\'s decision about which brand to purchase.\n5th step: consumers take further action after purchase, based on their satisfaction or dissatisfaction.',
        explanation: 'The decision-making process and actions of consumers when purchasing goods and services, influenced by various factors such as personal preferences, social influences, and psychological factors.',
        example: 'A person buys a new laptop based on their need for a faster processor and better battery life, considering factors like price, brand reputation, and online reviews before making the final purchase decision.'
    },
    {
        term: 'Cognitive dissonance',
        definition: 'Buyer discomfort caused by postpurchase conflict',
        explanation: 'The discomfort or tension a buyer feels after making a purchase, caused by conflicting thoughts or doubts about the decision.',
        example: 'After buying an expensive car, a person starts questioning if they made the right choice, feeling uneasy about the high cost despite wanting the vehicle.'
    },
    {
        term: 'Customer journey',
        definition: 'The sum of the ongoing experiences consumers have with a brand that affect their buying behavior, engagement, and brand advocacy over time',
        explanation: 'The overall experience a consumer has with a brand, from first learning about it to post-purchase interactions, influencing their behavior, engagement, and loyalty.',
        example: 'A person discovers a brand on social media, interacts with it through an email campaign, makes a purchase online, and then continues to engage with the brand through loyalty programs and customer support.'
    },
    {
        term: 'Adoption process',
        definition: 'Mental process an individual goes through from first learning about an innovation to final regular use',
        example: 'A person first hears about a new fitness app, researches its features, tries it out, and eventually incorporates it into their daily workout routine.'
    }
];

const chapter6Definitions = [
    {
        term: 'Business buyer behavior',
        definition: 'Buying behavior of organizations that buy goods and services for use in production',
        explanation: 'How businesses make purchasing decisions for their operations.',
        example: 'A manufacturing company buying raw materials or machinery for production.'
    },
    {
        term: 'Business market',
        definition: 'Fewer but larger buyers/derived demand/inelastic demand/fluctuating demand',
        explanation: 'Market where businesses sell to other businesses, characterized by fewer buyers making larger purchases.',
        example: 'A company selling industrial equipment to factories.'
    },
    {
        term: 'Straight rebuy',
        definition: 'The buyer routinely reorders something without any modifications',
        explanation: 'Regular reordering of the same product with no changes.',
        example: 'An office regularly ordering the same paper supplies from the same vendor.'
    },
    {
        term: 'Modified rebuy',
        definition: 'Buyer wants to modify product specifications, prices, terms or suppliers',
        explanation: 'Changing some aspects of a regular purchase.',
        example: 'A restaurant switching to a new supplier for better prices on ingredients.'
    },
    {
        term: 'New task',
        definition: 'Buyer purchases a product or service for the first time',
        explanation: 'First-time purchase requiring extensive research and decision-making.',
        example: 'A company buying a new type of software system they\'ve never used before.'
    },
    { 
        term: 'System selling', 
        definition: 'Buying a complete solution to a problem from a single seller',
        explanation: 'Purchasing an entire system or solution rather than individual components.',
        example: 'A business buying a complete IT system including hardware, software, and support services from one vendor.'
    },
    { 
        term: 'Buying center', 
        definition: 'All the participants in the business purchase decision making process',
        explanation: 'Group of people involved in making business purchasing decisions.',
        example: 'A purchasing team including technical experts, users, and financial analysts deciding on new equipment.'
    },
    { 
        term: 'Deciders', 
        definition: 'Formal or informal power to select and approve final suppliers',
        explanation: 'People with authority to make final purchase decisions.',
        example: 'A CEO approving a major equipment purchase.'
    },
    { 
        term: 'Value analysis', 
        definition: 'Approach to cost reduction where components are studied',
        explanation: 'Systematic evaluation of products to reduce costs while maintaining quality.',
        example: 'A manufacturer analyzing each component of their product to find cost-saving opportunities.'
    },
    { 
        term: 'General need description', 
        definition: 'Describes the characteristics and quantity of the needed item',
        explanation: 'Detailed specification of what the business needs to purchase.',
        example: 'A company creating specifications for new manufacturing equipment, including capacity and technical requirements.'
    },
    { 
        term: 'Product specification', 
        definition: 'Describes the technical criteria',
        explanation: 'Detailed technical requirements for a product or service.',
        example: 'A company specifying exact dimensions, materials, and performance requirements for custom machinery.'
    },
    { 
        term: 'Supplier search', 
        definition: 'Compiling a list of qualified suppliers to find the best vendors',
        explanation: 'This is the process of looking for suppliers who can provide the product or service a company needs, and finding the best ones.',
        example: 'A company that needs to buy office chairs checks out various furniture suppliers to find those who offer high-quality and reasonably priced options.'
    },
    { 
        term: 'Proposal solicitation', 
        definition: 'The process of requesting proposals from qualified suppliers',
        explanation: 'This is when a company asks for offers (proposals) from suppliers on how much they will charge and what they will provide.',
        example: 'A university sends out a request for proposals to different catering companies to see which one can offer the best menu for their upcoming event.'
    },
    { 
        term: 'Supplier selection', 
        definition: 'When the buying center creates a list of desired supplier attributes and negotiates with preferred suppliers for favorable terms and conditions',
        explanation: 'After reviewing suppliers, the company decides which ones are the best match for their needs and starts negotiating terms like price and delivery.',
        example: 'A company looks at three different suppliers for computer parts and chooses the one with the best prices and delivery terms.'
    },
    { 
        term: 'Order routine specifications', 
        definition: 'The final order with the chosen supplier and lists all of the specifications and terms of the purchase',
        example: 'After selecting a supplier, a company finalizes the order with a document that confirms the price, delivery date, and product details like size and quantity.'
    },
    { 
        term: 'Performance review', 
        definition: 'A critique of supplier performance to the order routine specifications',
        explanation: 'This is when the company checks how well the supplier is meeting the terms of the contract, such as product quality and delivery times.',
        example: 'A business checks if a supplier is delivering the right amount of products on time and whether the quality matches the agreed standards.'
    },
    { 
        term: 'Advantages E procurement', 
        definition: 'Access to new supplier/lower cost/speeds order processing/improves sales/facilitate service and support',
        example: 'A company uses an online platform to order supplies, which helps them find better prices, place orders faster, and get quicker responses from suppliers.'
    },
    { 
        term: 'B to B digital', 
        definition: 'Use digital and social media marketing approaches to engage business customers and manage customers relationship anywhere any time',
        example: 'A company sells products online to other businesses and uses social media to keep in touch with customers and answer their questions instantly.'
    },
    { 
        term: 'Institutional markets', 
        definition: 'Consist of schools, hospitals, nursing homes, and prisons that provide goods and services to people in their care. (low budget, captive patrons)',
        explanation: 'These markets consist of organizations like schools, hospitals, and prisons that buy goods and services to provide for the people they care for. They often work with a limited budget.',
        example: 'A hospital buys medical supplies on a tight budget, needing to choose suppliers that can provide low-cost items without sacrificing quality.'
    },
    { 
        term: 'Government markets', 
        definition: 'Favor domestic suppliers, require them to submit bids and normally award the contract to the lowest bidder',
        explanation: 'These markets involve the government buying goods and services. The government usually chooses domestic suppliers, requires bids, and often picks the lowest-priced offer.',
        example: 'The government needs to buy construction materials for public buildings. Several companies submit bids, and the government picks the one with the lowest price.'
    }
];

const chapter7Definitions = [
    {
        term: 'Market segmentation',
        definition: 'Dividing a market into smaller segments with distinct needs, characteristics or behavior that might require separate marketing strategies or mixes',
        explanation: 'Market segmentation is when a company divides a large market into smaller groups of people who have similar needs or behaviors. This helps companies target their marketing better.',
        example: 'A clothing brand divides its market into segments like teenagers, working professionals, and elderly people, each with different styles and needs.'
    },
    {
        term: 'Geographic segmentation',
        definition: 'Different geographical units such as nations, regions, states, counties, cities or even neighborhoods',
        example: 'A coffee chain offers different drinks in colder climates (like hot lattes) and warmer places (like iced coffee).'
    },
    {
        term: 'Demographic segmentation',
        definition: 'Divides the market into segments based on variables such as age, life cycle stage, gender, income, occupations, educations, religion, ethnicity and generation',
        example: 'A brand may offer luxury cars to high-income individuals, while offering budget-friendly models to young people starting their careers.'
    },
    {
        term: 'Psychographic segmentation',
        definition: 'Divides a market into different segments based on social class, lifestyle, personality',
        example: 'A brand selling adventure gear targets outdoor enthusiasts (lifestyle) or a brand may target eco-friendly consumers (environmental values).'
    },
    {
        term: 'Behavioral segmentation',
        definition: 'Consumer knowledge, attitudes, uses of a product, responses to a product',
        example: 'A company might target frequent flyers with special deals on flights or reward long-time customers with loyalty discounts.'
    },
    {
        term: 'Multiple segmentation',
        definition: 'Identify smaller and better defined target groups',
        explanation: 'This combines different types of segmentation to create more precise and better-targeted groups.',
        example: 'A smartphone company might target young, tech-savvy people (psychographic) in urban areas (geographic) with high income (demographic).'
    },
    {
        term: 'Segmenting business markets',
        definition: 'Customer operating characteristics/purchasing approaches/situational factors/personal characteristics',
        explanation: 'When segmenting business markets, companies divide customers based on things like how they operate, how they buy products, and their individual preferences.',
        example: 'A software company might segment its business market into small businesses needing simple tools and large corporations needing complex, customizable software.'
    },
    {
        term: 'Segmenting international markets',
        definition: 'Geographic location/economic factors/political and legal factors/cultural factors',
        explanation: 'This involves dividing international markets based on factors like location, economy, politics, and culture.',
        example: 'A fast-food chain may offer spicy food options in India and non-spicy ones in the U.S. based on local tastes (cultural factors).'
    },
    {
        term: 'Intermarket segmentation',
        definition: 'Forming segments of consumers who have similar needs and buying behaviors even though they are located in different countries',
        example: 'People in various countries who love adventure sports could be grouped together to market outdoor equipment.'
    },
    {
        term: 'Effective segmentation',
        definition: 'Measurable/accessible/substantial/differentiable/actionable',
        explanation: 'For segmentation to be useful, it must be measurable (able to track size), accessible (reachable through marketing), substantial (big enough to matter), differentiable (clearly different), and actionable (can create targeted strategies).',
        example: 'A company segments its market into budget shoppers and luxury shoppers, and can reach both groups with distinct marketing.'
    },
    {
        term: 'Target market',
        definition: 'Set of buyers who share common needs or characteristics that the company decides to serve',
        explanation: 'This is the group of people or businesses that a company decides to focus its marketing efforts on because they share common needs or characteristics.',
        example: 'A fitness brand targets health-conscious individuals aged 25-40 who work out regularly.'
    },
    {
        term: 'Undifferentiated marketing',
        definition: 'Targets the whole market with one offer and focus on common needs (mass marketing)',
        explanation: 'This marketing strategy targets the entire market with one product and focuses on the common needs of everyone.',
        example: 'A salt company uses undifferentiated marketing by selling the same product to everyone.'
    },
    {
        term: 'Differentiated marketing',
        definition: 'Targets several different market segments and designs separate offers for each. Goal is to achieve higher sales and strong position (more expensive than undifferentiated)',
        example: 'A car manufacturer offers different models for different segments: luxury cars for wealthy customers, economy cars for budget-conscious buyers, and SUVs for families.'
    },
    {
        term: 'Concentrated market',
        definition: 'Targets large share of a smaller market, have a good knowledge of the market and have limited company resources(more efficient)',
        explanation: 'This strategy targets a specific, smaller market segment, focusing all resources on serving that segment well.',
        example: 'A small business making luxury chocolates focuses on high-end customers who value premium products.'
    },
    {
        term: 'Micromarketing',
        definition: 'Tailoring products and marketing programs to suit the tastes of specific individuals and locations (local and individual marketing)',
        explanation: 'This is when marketing efforts are tailored very specifically to individuals or very small groups.',
        example: 'A local store sends personalized discounts to customers based on their previous purchases.'
    },
    {
        term: 'Local marketing',
        definition: 'Tailoring brands and promotion to the needs and wants of local customer segments (cities, neighborhoods, stores)',
        example: 'A restaurant tailors its menu to local tastes, offering seafood in coastal areas and steaks in landlocked regions.'
    },
    {
        term: 'Individual marketing',
        definition: 'Tailoring products and marketing programs to the needs and preferences of individuals customers (mass customization, one to one marketing)',
        explanation: 'This takes customization to the next level, creating products or marketing strategies for each individual customer.',
        example: 'A company allows customers to design their own shoes, choosing colors and materials, making each pair unique.'
    },
    {
        term: 'Product position',
        definition: 'The way the product is defined by consumers on important attributes',
        explanation: 'This is how customers view a product in comparison to other products based on key features.',
        example: 'A car brand positions itself as "the safest vehicle," while another car brand positions itself as "the most fuel-efficient."'
    },
    {
        term: 'Positioning mapping',
        definition: 'Consumer perceptions of marketer\'s brands versus competing products on important buying dimensions',
        explanation: 'This is a visual tool used to show how consumers view different brands based on important factors like price and quality.',
        example: 'A graph showing that Brand A is perceived as both high-quality and high-price, while Brand B is low-quality but affordable.'
    },
    {
        term: 'Competitive advantages',
        definition: 'An advantage over competitors gained by offering consumers greater value, either through lower prices or by providing more benefits that justify higher prices. It is important/distinctive/superior/communicable/preemptive/affordable/profitable',
        explanation: 'This is what makes a company\'s product better or different from others, offering consumers more value, either through lower prices or extra benefits.',
        example: 'A phone company offers more features at a lower price than its competitors, giving it a competitive advantage.'
    },
    {
        term: 'Value proposition',
        definition: 'Full mix of benefits upon which a brand is positioned',
        explanation: 'This is the full set of benefits a brand promises to deliver to customers, justifying why they should choose that brand over others.',
        example: 'A hotel\'s value proposition could be, "Luxurious rooms, amazing service, and great location, all at an affordable price."'
    }
];

function generateQuestions(chapter, difficulty) {
    let definitions;
    switch(chapter) {
        case 1:
            definitions = chapter1Definitions;
            break;
        case 2:
            definitions = chapter2Definitions;
            break;
        case 3:
            definitions = chapter3Definitions;
            break;
        case 4:
            definitions = chapter4Definitions;
            break;
        case 5:
            definitions = chapter5Definitions;
            break;
        case 6:
            definitions = chapter6Definitions;
            break;
        case 7:
            definitions = chapter7Definitions;
            break;
        default:
            definitions = chapter1Definitions;
    }

    const questions = [];
    const totalQuestions = definitions.length; // Use all definitions

    if (difficulty === 'easy') {
        // Create multiple choice questions for all definitions
        definitions.forEach((correct, index) => {
            // Get 3 random wrong options
            const wrongOptions = definitions
                .filter((_, i) => i !== index)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(def => def.term);

            const options = [...wrongOptions, correct.term]
                .sort(() => Math.random() - 0.5);

            questions.push({
                definition: correct.definition,
                options: options,
                correct: correct.term,
                type: 'multiple_choice'
            });
        });
    } else if (difficulty === 'medium') {
        // Half multiple choice, half write-in
        const halfLength = Math.ceil(definitions.length / 2);
        
        // First half: multiple choice
        definitions.slice(0, halfLength).forEach((correct, index) => {
            const wrongOptions = definitions
                .filter((_, i) => i !== index)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(def => def.term);

            const options = [...wrongOptions, correct.term]
                .sort(() => Math.random() - 0.5);

            questions.push({
                definition: correct.definition,
                options: options,
                correct: correct.term,
                type: 'multiple_choice'
            });
        });

        // Second half: write-in terms
        definitions.slice(halfLength).forEach(def => {
            questions.push({
                definition: def.definition,
                correct: def.term,
                type: 'write_term'
            });
        });
    } else {
        // Hard - split into thirds
        const thirdLength = Math.ceil(definitions.length / 3);
        
        // First third: multiple choice
        definitions.slice(0, thirdLength).forEach((correct, index) => {
            const wrongOptions = definitions
                .filter((_, i) => i !== index)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(def => def.term);

            const options = [...wrongOptions, correct.term]
                .sort(() => Math.random() - 0.5);

            questions.push({
                type: 'multiple_choice',
                definition: correct.definition,
                options: options,
                correct: correct.term
            });
        });

        // Second third: write-in terms
        definitions.slice(thirdLength, thirdLength * 2).forEach(def => {
            questions.push({
                definition: def.definition,
                correct: def.term,
                type: 'write_term'
            });
        });

        // Final third: write-in definitions
        definitions.slice(thirdLength * 2).forEach(def => {
            questions.push({
                term: def.term,
                correct: def.definition,
                type: 'write_definition'
            });
        });
    }

    return shuffleArray(questions);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showDefinitionQuiz(chapter) {
    currentChapter = chapter;
    const content = document.getElementById('course-content');
    content.innerHTML = `
        <h2>Definition Quiz - Chapter ${chapter}</h2>
        <div class="difficulty-selection">
            <div class="difficulty-card">
                <h3>Easy</h3>
                <p>Multiple choice questions</p>
                <button class="quiz-btn" onclick="startQuiz(${chapter}, 'easy')">Start Quiz</button>
            </div>
            <div class="difficulty-card">
                <h3>Medium</h3>
                <p>Fill in the blank questions</p>
                <button class="quiz-btn" onclick="startQuiz(${chapter}, 'medium')">Start Quiz</button>
            </div>
            <div class="difficulty-card">
                <h3>Hard</h3>
                <p>Short answer questions</p>
                <button class="quiz-btn" onclick="startQuiz(${chapter}, 'hard')">Start Quiz</button>
            </div>
        </div>
        <div class="nav-container">
            <button class="nav-btn" onclick="showMainMenu()">Back to Menu</button>
            <button class="nav-btn" onclick="showSubmissions(${chapter})">View Submissions</button>
        </div>
    `;
}

function startQuiz(chapter, difficulty) {
    currentChapter = chapter;
    const questions = generateQuestions(chapter, difficulty);
    let currentQuestion = 0;
    const answers = [];

    function showQuestion() {
        const content = document.getElementById('course-content');
        const question = questions[currentQuestion];
        
        content.innerHTML = `
            <div class="quiz-container">
                <h2>Question ${currentQuestion + 1} of ${questions.length}</h2>
                ${question.type === 'write_definition' ?
                    `<p>Term: <strong>${question.term}</strong>?</p>` :
                    `<p>Definition: <em>${question.definition}</em></p>`
                }
                ${question.type === 'multiple_choice' ?
                    `<div class="options-container">
                        ${question.options.map((option, index) => `
                            <button class="option-btn" onclick="submitAnswer('${option}')">${option}</button>
                        `).join('')}
                    </div>` :
                    `<div class="input-container">
                        <input type="text" id="answer-input" placeholder="Type your answer here">
                        <button class="submit-btn" onclick="submitAnswer(document.getElementById('answer-input').value)">Submit</button>
                    </div>`
                }
            </div>
        `;
    }

    window.submitAnswer = function(userAnswer) {
        const question = questions[currentQuestion];
        const isCorrect = userAnswer.toLowerCase().trim() === question.correct.toLowerCase().trim();
        
        answers.push({
            question: question,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            type: question.type
        });

        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            const score = answers.filter(a => a.isCorrect).length;
            
            // Save submission
            const submission = {
                date: new Date().toLocaleString(),
                score: score,
                total: questions.length,
                answers: answers
            };
            if (!quizSubmissions[currentChapter]) {
                quizSubmissions[currentChapter] = [];
            }
            quizSubmissions[currentChapter].unshift(submission);
            
            // Show results
            const content = document.getElementById('course-content');
            content.innerHTML = `
                <div class="quiz-results">
                    <h2>Quiz Complete!</h2>
                    <p class="score">Your Score: ${score} out of ${questions.length}</p>
                    <button class="quiz-btn" onclick="showStoredReview(${currentChapter}, 0)">Review Answers</button>
                    <button class="quiz-btn" onclick="showDefinitionQuiz(${currentChapter})">Try Again</button>
                    <button class="quiz-btn" onclick="showSubmissions(${currentChapter})">View All Submissions</button>
                </div>
            `;
        }
    };

    showQuestion();
}

let understandingStates = {};

function getUnderstandingState(chapter, index) {
    const key = `${chapter}-${index}`;
    return understandingStates[key];
}

function markUnderstanding(chapter, index, state) {
    const key = `${chapter}-${index}`;
    const definitionCard = document.getElementById(`def-${key}`);
    
    // Remove existing states
    definitionCard.classList.remove('understood', 'review-later');
    
    // Update state
    understandingStates[key] = state;
    
    // Apply new state
    if (state === true) {
        definitionCard.classList.add('understood');
    } else if (state === false) {
        definitionCard.classList.add('review-later');
    }

    // Update button states
    const buttons = definitionCard.querySelectorAll('.understanding-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if ((state === true && btn.classList.contains('understood')) ||
            (state === false && btn.classList.contains('review-later'))) {
            btn.classList.add('active');
        }
    });
}

function toggleExplanation(chapter, index) {
    const explanationContent = document.getElementById(`explanation-${chapter}-${index}`);
    const viewMoreBtn = document.getElementById(`view-more-${chapter}-${index}`);
    
    if (explanationContent.classList.contains('visible')) {
        explanationContent.classList.remove('visible');
        viewMoreBtn.textContent = 'view more';
    } else {
        explanationContent.classList.add('visible');
        viewMoreBtn.textContent = 'view less';
    }
}

function showChapterDefinitions(chapter) {
    document.querySelectorAll('.chapter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === `Chapter ${chapter}`) {
            btn.classList.add('active');
        }
    });

    const definitionsDiv = document.getElementById('chapter-definitions');
    let definitions;
    
    switch(chapter) {
        case 1:
            definitions = chapter1Definitions;
            break;
        case 2:
            definitions = chapter2Definitions;
            break;
        case 3:
            definitions = chapter3Definitions;
            break;
        case 4:
            definitions = chapter4Definitions;
            break;
        case 5:
            definitions = chapter5Definitions;
            break;
        case 6:
            definitions = chapter6Definitions;
            break;
        case 7:
            definitions = chapter7Definitions;
            break;
        default:
            definitions = [];
    }
    
    definitionsDiv.innerHTML = `
        <div class="definitions-container">
            <h3>Chapter ${chapter} Definitions</h3>
            <div class="definitions-list">
                ${definitions.map((def, index) => {
                    const state = getUnderstandingState(chapter, index);
                    const stateClass = state === true ? 'understood' : state === false ? 'review-later' : '';
                    return `
                        <div class="definition-item ${stateClass}" id="def-${chapter}-${index}">
                            <div class="definition-content">
                                <h4>${def.term}</h4>
                                <p>${def.definition}</p>
                                ${(def.explanation || def.example) ? `
                                    <button class="view-more-btn" id="view-more-${chapter}-${index}" 
                                            onclick="toggleExplanation(${chapter}, ${index})">
                                        view more
                                    </button>
                                    <div class="explanation-content" id="explanation-${chapter}-${index}">
                                        ${def.explanation ? `<p class="simple-text"><em>Explanation:</em> ${def.explanation}</p>` : ''}
                                        ${def.example ? `<p class="simple-text"><em>Example:</em> ${def.example}</p>` : ''}
                                        ${def.image ? `
                                            <p class="simple-text">
                                                <img src="${def.image.url}" alt="${def.image.alt}" style="max-width: 100%; margin: 20px 0;">
                                            </p>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="understanding-controls">
                                <button class="understanding-btn understood ${state === true ? 'active' : ''}" 
                                        onclick="markUnderstanding(${chapter}, ${index}, true)">
                                    Understood
                                </button>
                                <button class="understanding-btn review-later ${state === false ? 'active' : ''}" 
                                        onclick="markUnderstanding(${chapter}, ${index}, false)">
                                    Review Later
                                </button>
                                <button class="understanding-btn reset" 
                                        onclick="markUnderstanding(${chapter}, ${index}, null)">
                                    Reset
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function showMarketingSection(section) {
    const content = document.getElementById('course-content');
    
    document.querySelectorAll('.course-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === section) {
            btn.classList.add('active');
        }
    });

    switch(section) {
        case 'class':
            content.innerHTML = `
                <div class="quiz-wrapper">
                    <h2>Course Summary</h2>
                    <div style="text-align: left;">
                        <p>Marketing Fundamentals is a very theoretical subject, in which you'll mainly have to learn definitions. Depending on the teacher, there will be <strong>two different types of exam</strong>:</p>
                        <ul>
                            <li><strong>50 multiple choice questions</strong></li>
                            <li><strong>40% multiple choice and 60% open-ended questions</strong> (3 questions of 20% each)</li>
                        </ul>
                        
                        <p>In combination with your teacher's lessons or the book, this section will give you <strong>everything you need to know for your exams</strong>. Below you'll find all the definitions from the book/course (it's important to know these sentence formulations because the exams are based on them).</p>
                        
                        <p>Knowing ourselves that these definitions can be unclear and difficult to remember, we've added to each definition <strong>a simpler explanation with examples</strong> for each situation.</p>
                        
                        <p>Once you're comfortable with these terms, you'll be able to practice in the exercise section. We've included:</p>
                        <ul>
                            <li><strong>A quiz with 3 levels of difficulty</strong> to help you practice with the definitions</li>
                            <li><strong>Midterm and final exams from previous years</strong> - these are probably the closest versions of what you will get</li>
                        </ul>
                        
                        <p>You'll find all your submissions in the <strong>progress section</strong>.</p>
                    </div>
                    
                    <h2>Definitions by Chapter</h2>
                    <div class="chapter-buttons">
                        <button class="chapter-btn active" onclick="showChapterDefinitions(1)">Chapter 1</button>
                        <button class="chapter-btn" onclick="showChapterDefinitions(2)">Chapter 2</button>
                        <button class="chapter-btn" onclick="showChapterDefinitions(3)">Chapter 3</button>
                        <button class="chapter-btn" onclick="showChapterDefinitions(4)">Chapter 4</button>
                        <button class="chapter-btn" onclick="showChapterDefinitions(5)">Chapter 5</button>
                        <button class="chapter-btn" onclick="showChapterDefinitions(6)">Chapter 6</button>
                        <button class="chapter-btn" onclick="showChapterDefinitions(7)">Chapter 7</button>
                    </div>
                    <div id="chapter-definitions"></div>
                </div>
            `;
            showChapterDefinitions(1);
            break;
        case 'exercises':
            content.innerHTML = `
                <div class="quiz-wrapper">
                    <h2>Definition Quizzes</h2>
                    <div class="course-materials">
                        <button class="course-button" onclick="showDefinitionQuiz(1)">Definition Quiz Chapter 1</button>
                        <button class="course-button" onclick="showDefinitionQuiz(2)">Definition Quiz Chapter 2</button>
                        <button class="course-button" onclick="showDefinitionQuiz(3)">Definition Quiz Chapter 3</button>
                        <button class="course-button" onclick="showDefinitionQuiz(4)">Definition Quiz Chapter 4</button>
                        <button class="course-button" onclick="showDefinitionQuiz(5)">Definition Quiz Chapter 5</button>
                        <button class="course-button" onclick="showDefinitionQuiz(6)">Definition Quiz Chapter 6</button>
                        <button class="course-button" onclick="showDefinitionQuiz(7)">Definition Quiz Chapter 7</button>
                    </div>
                    <div class="quiz-wrapper" style="margin-top: 40px;">
                        <h2 style="margin-bottom: 20px;">Midterm and Final's Questions</h2>
                        <div class="course-materials" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                            <button class="course-button" style="max-width: 400px;" onclick="showMidtermTest()">Midterm 1</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showMidterm2Test()">Midterm 2</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showMidterm3Test()">Midterm 3</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showMidterm4Test()">Midterm 4</button>
                            <button class="course-button" style="max-width: 400px;" onclick="showFinal1Test()">Final 1</button>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'progress':
            content.innerHTML = `
                <div class="quiz-wrapper">
                    <h2>Your Progress</h2>
                    <div class="course-materials" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                        <button class="course-button" style="max-width: 400px;" onclick="showMainSubmissions()">Definition Quiz Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidtermSubmissions()">Midterm 1 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidterm2Submissions()">Midterm 2 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidterm3Submissions()">Midterm 3 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showMidterm4Submissions()">Midterm 4 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showFinal1Submissions()">Final 1 Submissions</button>
                        <button class="course-button" style="max-width: 400px;" onclick="showFinalQuestions()">Final's Questions</button>
                    </div>
                </div>
            `;
            break;
    }
}

let quizSubmissions = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
};
let currentChapter = 1;

function showSubmissions(chapter) {
    const content = document.getElementById('course-content');
    const submissions = quizSubmissions[chapter] || [];
    
    content.innerHTML = `
        <h2>Submissions - Chapter ${chapter}</h2>
        ${submissions.length === 0 ? 
            '<p>No submissions yet for this chapter.</p>' :
            submissions.map((sub, index) => `
                <div class="review-card">
                    <div class="review-progress">
                        <span>${sub.score}/${sub.total}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${sub.score / sub.total * 100}%"></div>
                        </div>
                        <span>${Math.round(sub.score / sub.total * 100)}%</span>
                    </div>
                    <p>${sub.date}</p>
                    <button class="quiz-btn" onclick="showStoredReview(${chapter}, ${index})">Review Answers</button>
                </div>
            `).join('')}
        </div>
        <div class="nav-container">
            <button class="nav-btn" onclick="showDefinitionQuiz(${chapter})">Back to Quiz</button>
            <button class="nav-btn" onclick="showMainMenu()">Back to Menu</button>
        </div>
    `;
}

function showFinalQuestions() {
    const content = document.getElementById('course-content');
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Final's Questions</h2>
            <div class="course-materials">
                <button class="course-button" onclick="showFinalQuiz(1)">Chapter 1-2 Questions</button>
                <button class="course-button" onclick="showFinalQuiz(2)">Chapter 3-4 Questions</button>
                <button class="course-button" onclick="showFinalQuiz(3)">Chapter 5-7 Questions</button>
            </div>
            <button class="nav-btn" onclick="showMainMenu()">Back to Menu</button>
        </div>
    `;
}

function showFinalQuiz(section) {
    let startChapter, endChapter;
    switch(section) {
        case 1:
            startChapter = 1;
            endChapter = 2;
            break;
        case 2:
            startChapter = 3;
            endChapter = 4;
            break;
        case 3:
            startChapter = 5;
            endChapter = 7;
            break;
    }

    // Combine definitions from the chapters
    let allDefinitions = [];
    for(let chapter = startChapter; chapter <= endChapter; chapter++) {
        switch(chapter) {
            case 1: allDefinitions = allDefinitions.concat(chapter1Definitions); break;
            case 2: allDefinitions = allDefinitions.concat(chapter2Definitions); break;
            case 3: allDefinitions = allDefinitions.concat(chapter3Definitions); break;
            case 4: allDefinitions = allDefinitions.concat(chapter4Definitions); break;
            case 5: allDefinitions = allDefinitions.concat(chapter5Definitions); break;
            case 6: allDefinitions = allDefinitions.concat(chapter6Definitions); break;
            case 7: allDefinitions = allDefinitions.concat(chapter7Definitions); break;
        }
    }

    // Shuffle the definitions
    allDefinitions = allDefinitions.sort(() => Math.random() - 0.5);

    // Take first 10 definitions for the quiz
    const quizDefinitions = allDefinitions.slice(0, 10);

    // Generate questions
    const questions = [];
    quizDefinitions.forEach((correct, index) => {
        // Get 3 random wrong options
        const wrongOptions = allDefinitions
            .filter(d => d.term !== correct.term)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(d => d.term);

        // Combine and shuffle all options
        const options = [...wrongOptions, correct.term]
            .sort(() => Math.random() - 0.5);

        questions.push({
            type: 'multiple_choice',
            definition: correct.definition,
            options: options,
            correct: correct.term
        });
    });

    currentChapter = `Final ${startChapter}-${endChapter}`;
    startQuiz(questions);
}

function showMainSubmissions() {
    const content = document.getElementById('course-content');
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Definition Quiz Submissions</h2>
            <div class="course-materials">
                <button class="course-button" onclick="showSubmissions(1)">Chapter 1 Submissions</button>
                <button class="course-button" onclick="showSubmissions(2)">Chapter 2 Submissions</button>
                <button class="course-button" onclick="showSubmissions(3)">Chapter 3 Submissions</button>
                <button class="course-button" onclick="showSubmissions(4)">Chapter 4 Submissions</button>
                <button class="course-button" onclick="showSubmissions(5)">Chapter 5 Submissions</button>
                <button class="course-button" onclick="showSubmissions(6)">Chapter 6 Submissions</button>
                <button class="course-button" onclick="showSubmissions(7)">Chapter 7 Submissions</button>
            </div>
            <button class="nav-btn" onclick="showMainMenu()">Back to Menu</button>
        </div>
    `;
}

function showStoredReview(chapter, submissionIndex) {
    const submission = quizSubmissions[chapter][submissionIndex];
    const content = document.getElementById('course-content');
    
    // Calculate progress
    const progress = (submission.score / submission.total) * 100;
    
    content.innerHTML = `
        <h2>Review - Chapter ${chapter}</h2>
        <div class="review-progress">
            <span>${submission.score}/${submission.total}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span>${Math.round(progress)}%</span>
        </div>
        <p>Date: ${submission.date}</p>
        ${submission.answers.map((answer, i) => `
            <div class="review-card ${answer.isCorrect ? 'correct' : 'incorrect'}">
                <h3>Question ${i + 1}</h3>
                ${answer.type === 'write_definition' ?
                    `<p>Term: ${answer.question.term}</p>` :
                    `<p>Definition: ${answer.question.definition}</p>`
                }
                <p>Your answer: ${answer.userAnswer}</p>
                ${!answer.isCorrect ? 
                    `<p>Correct answer: ${answer.question.correct}</p>` : 
                    ''
                }
            </div>
        `).join('')}
        <div class="nav-container">
            <button class="nav-btn" onclick="showDefinitionQuiz(${chapter})">Try Again</button>
            <button class="nav-btn" onclick="showSubmissions(${chapter})">Back to Submissions</button>
        </div>
    `;
}
