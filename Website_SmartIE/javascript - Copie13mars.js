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
                        <div class="course-materials" style="display: flex; flex-direction: column; align-items: center;">
                            <button class="course-button" style="max-width: 400px;" onclick="showMidtermTest()">Midterm Test</button>
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
                        <button class="course-button" style="max-width: 400px;" onclick="showMidtermSubmissions()">Midterm Test Submissions</button>
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
    { term: 'Needs', definition: 'States of felt deprivation' },
    { term: 'Wants', definition: 'The form human needs take as they are shaped by culture and individual personality' },
    { term: 'Demands', definition: 'Human wants that are backed by buying power' },
    { term: 'Market offerings', definition: 'Combinations of products, services, info or experiences offered to a market to satisfy needs or wants' },
    { term: 'Marketing myopia', definition: 'Paying more attention to the product that the benefits and experiences produced' },
    { term: 'Consumer market', definition: 'Consumers search for products, interact with companies to obtain information and make purchases' },
    { term: 'Marketing management', definition: 'Choosing target markets and building profitable relationship with them' },
    { term: 'Value proposition', definition: 'Set of benefits or values it promises to deliver to customers to satisfy their needs' },
    { term: 'Value driven marketing strategy', definition: 'Production/product/selling/marketing/societal marketing concepts' },
    { term: 'Societal marketing', definition: 'Consider consumers wants, company requirements, consumers long run interests and society long run interests' },
    { term: 'Marketing mix', definition: 'Product/price/promotion/place' },
    { term: 'Integrated marketing', definition: 'Plan that communicates and delivers intended value' },
    { term: 'Customer relationship management', definition: 'The overall process of building and maintaining profitable customer relationships by delivering superior customer value and satisfaction' },
    { term: 'Customer perceived value', definition: 'Difference btw total customer perceived benefits and customer cost' },
    { term: 'Customer engagement marketing', definition: 'Direct and continuous customer involvement' },
    { term: 'Consumer generated marketing', definition: 'Brand exchanges created by consumers themselves' },
    { term: 'Partner relationship management', definition: 'Working with partners in other company departments and outside the company' },
    { term: 'Customer lifetime value', definition: 'Value of entire stream of purchases that the customer would make over a lifetime of patronage' },
    { term: 'Customer satisfaction', definition: 'The extent to which perceived performance matches a buyer\'s expectations' },
    { term: 'Share of customer', definition: 'Portion of the customers purchasing that a company gets in its product categories' },
    { term: 'Customer equity', definition: 'Total combined customer lifetime values of all of the company\'s customers' }
];

const chapter2Definitions = [
    { term: 'Strategic planning', definition: 'Process of developing and maintaining a strategic fit between the organization\'s goals and capabilities and its changing marketing opportunities' },
    { term: 'Mission statement', definition: 'The organization\'s purpose, what it wants to accomplish in the larger environment' },
    { term: 'Business objectives', definition: 'Build profitable customer relationship/invest in research/improve profits' },
    { term: 'Marketing objectives', definition: 'Increase market share/create local partnership/increase promotion' },
    { term: 'Business portfolio', definition: 'Collection of businesses and products that make up the company' },
    { term: 'Portfolio analysis', definition: 'Major activity in strategic planning whereby management evaluates the products and businesses that make up the company' },
    { term: 'Strategic business units', definition: 'Company division/product line within a division/single product or brand' },
    { term: 'Problems matrix approaches', definition: 'Define SBU and measuring share and growth/time consuming/expensive/may not apply well to markets facing structural changes or disruptions' },
    { term: 'Downsizing', definition: 'A company must harvest or divest businesses that are unprofitable or that no longer fit the strategy' },
    { term: 'Value chain', definition: 'Series of departments that carry out value creating activities to design, produce, market, deliver and support a firm\'s product' },
    { term: 'Value delivery network', definition: 'Made up of companies suppliers, distributors, customers who partner with each other to improve performance of the entire system' },
    { term: 'Marketing mix', definition: 'Is the set of controllable, tactical marketing tools product, price, place, and promotion that the firm blends to produce the response it wants in the target market' },
    { term: 'Managing marketing', definition: 'Analysis/planning/implementation/control' },
    { term: 'SWOT analysis', definition: 'Strengths/weaknesses/opportunities/threats' },
    { term: 'Marketing implementation', definition: 'Turning marketing strategies and plans into marketing actions to accomplish strategic marketing objectives' }
];

const chapter3Definitions = [
    { term: 'Marketing environment', definition: 'Includes the actors and forces outside marketing that affect marketing management\'s ability to build and maintain successful relationships with target customers' },
    { term: 'Microenvironment', definition: 'Consists of the actors close to the company that affect its ability to serve its customers' },
    { term: 'Macroenvironments', definition: 'Consists of the larger societal forces that affect the microenvironment' },
    { term: 'Marketing intermediaries', definition: 'Are firms that help the company to promote, finance, sell, and distribute its goods to final buyers' },
    { term: 'Publics', definition: 'Any group that has an actual or potential interest in or impact on an organization\'s ability to achieve its objectives' },
    { term: 'Demographic environment', definition: 'Study of human populations size, density, location, age, gender, race, occupation' },
    { term: 'Demographic trends', definition: 'Include changing age and family structures, geographic population shifts, educational characteristics, and population diversity' },
    { term: 'Economic environment', definition: 'Consumers adopted a new back to basics sensibility in their lifestyles and spending patterns' },
    { term: 'Natural environment', definition: 'Physical environment and the natural resources that are needed as inputs by marketers or that are affected by marketing activities' },
    { term: 'Environmental sustainability', definition: 'Developing strategies and practices that create a world economy that the planet can support indefinitely' },
    { term: 'Technological environment', definition: 'Most dramatic force in changing the marketplace/new products, opportunities/concern for the safety of new products' },
    { term: 'Political & social environment', definition: 'Increase emphasis on ethics and socially responsible actions and its cause-related marketing' },
    { term: 'Cultural environment', definition: 'Institutions that affect a society basic values, perceptions and behaviors' }
];

const chapter4Definitions = [
    { term: 'Customer insights', definition: 'Fresh marketing information-based understandings of customers and the marketplace' },
    { term: 'Big data', definition: 'The huge and complex data sets generated by today\'s sophisticated information technologies' },
    { term: 'Marketing information ecosystem', definition: 'People, processes, and assets dedicated to assessing managers\' information needs' },
    { term: 'Marketing information system', definition: 'Provides information to the company\'s marketing and other managers and external partners' },
    { term: 'Internal data', definition: 'Collections of consumers and market info obtained from data sources within the company network' },
    { term: 'Marketing research', definition: 'Systematic design, collection, analysis and reporting of data relevant to a specific marketing situation' },
    { term: 'Observational research', definition: 'Involves gathering primary data by observing relevant people, actions, and situations' },
    { term: 'Ethnographic research', definition: 'Involves sending trained observers to watch and interact with consumers in their "natural environments"' },
    { term: 'Survey research', definition: 'Involves sending trained observers to watch and interact with consumers in their "natural environments"' },
    { term: 'Experimental research', definition: 'Involves gathering primary data by selecting matched groups of subjects' },
    { term: 'Marketing analytics', definition: 'Involves analysis tools, technologies, and processes by which marketers dig out meaningful patterns in big data' }
];

const chapter5Definitions = [
    { term: 'Consumer buyer behavior', definition: 'Buying behavior of final consumers and households that buy goods and services for personal consumption' },
    { term: 'Consumer market', definition: 'All the individuals and households that buy goods and services for personal consumption' },
    { term: 'Cultural factors', definition: 'Set of basic values, perceptions, wants and behavior learned by a member of society' },
    { term: 'Subcultures', definition: 'Groups of people within a culture with shared value systems based on common life experiences' },
    { term: 'Social factors', definition: 'Family/role and status' },
    { term: 'Personal factors', definition: 'Lifestyle/personality/age/occupations' },
    { term: 'Psychological factors', definition: 'Motivation/perception/learning/beliefs and attitudes' },
    { term: 'Motivation research', definition: 'Qualitative research designed to probe consumer\'s hidden subconscious motivations' },
    { term: 'Selective attention', definition: 'The tendency for people to screen out most of the info to which they are exposed' },
    { term: 'Selective distortion', definition: 'The tendency for people to interpret info in a way that will support what they already believe' },
    { term: 'Customer journey', definition: 'The sum of the ongoing experiences consumers have with a brand' }
];

const chapter6Definitions = [
    { term: 'Business buyer behavior', definition: 'Buying behavior of organizations that buy goods and services for use in production' },
    { term: 'Business market', definition: 'Fewer but larger buyers/derived demand/inelastic demand/fluctuating demand' },
    { term: 'Straight rebuy', definition: 'The buyer routinely reorders something without any modifications' },
    { term: 'Modified rebuy', definition: 'Buyer wants to modify product specifications, prices, terms or suppliers' },
    { term: 'New task', definition: 'Buyer purchases a product or service for the first time' },
    { term: 'System selling', definition: 'Buying a complete solution to a problem from a single seller' },
    { term: 'Buying center', definition: 'All the participants in the business purchase decision making process' },
    { term: 'Deciders', definition: 'Formal or informal power to select and approve final suppliers' },
    { term: 'Value analysis', definition: 'Approach to cost reduction where components are studied' },
    { term: 'General need description', definition: 'Describes the characteristics and quantity of the needed item' },
    { term: 'Product specification', definition: 'Describes the technical criteria' }
];

const chapter7Definitions = [
    { term: 'Market segmentation', definition: 'Dividing a market into smaller segments with distinct needs or characteristics' },
    { term: 'Geographic segmentation', definition: 'Different geographical units such as nations, regions, states, counties, cities' },
    { term: 'Demographic segmentation', definition: 'Age, life cycle stage, gender, income, occupations, educations, religion, ethnicity' },
    { term: 'Psychographic segmentation', definition: 'Social class, lifestyle, personality' },
    { term: 'Behavioral segmentation', definition: 'Consumer knowledge, attitudes, uses of a product, responses to a product' },
    { term: 'Multiple segmentation', definition: 'Identify smaller and better defined target groups' },
    { term: 'Target market', definition: 'Set of buyers who share common needs or characteristics that the company decides to serve' },
    { term: 'Local marketing', definition: 'Tailoring brands and promotion to the needs and wants of local customer segments' },
    { term: 'Product position', definition: 'The way the product is defined by consumers on important attributes' },
    { term: 'Value proposition', definition: 'Full mix of benefits upon which a brand is positioned' }
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
                definition: correct.definition,
                options: options,
                correct: correct.term,
                type: 'multiple_choice'
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
                    <p>Welcome to Marketing Fundamentals! This course covers essential marketing concepts, strategies, and modern business practices.</p>
                    
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
                        <div class="course-materials" style="display: flex; flex-direction: column; align-items: center;">
                            <button class="course-button" style="max-width: 400px;" onclick="showMidtermTest()">Midterm Test</button>
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
                        <button class="course-button" style="max-width: 400px;" onclick="showMidtermSubmissions()">Midterm Test Submissions</button>
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
                        <button class="quiz-btn" onclick="showStoredReview(${chapter}, ${index})">Review Answers</button>
                    </div>
                `;
            }).join('')
        }
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

function showMidtermTest() {
    const content = document.getElementById('course-content');
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm Test</h2>
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
                    <button class="nav-btn" onclick="submitMidterm()">Submit Test</button>
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

function submitMidterm() {
    const selectedAnswers = Array.from(document.querySelectorAll('.option-btn.selected')).map(btn => btn.textContent);
    let score = 0;
    const answers = selectedAnswers.map((answer, index) => {
        const isCorrect = answer === midtermQuestions[index].correct;
        if (isCorrect) score++;
        return {
            question: midtermQuestions[index].question,
            answer: answer,
            correct: midtermQuestions[index].correct,
            isCorrect: isCorrect
        };
    });

    // Store the submission
    const submission = {
        date: new Date().toLocaleString(),
        score: score,
        total: midtermQuestions.length,
        answers: answers
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
    const progress = (submission.score / submission.total) * 100;
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm Review</h2>
            <div class="review-progress">
                <span>${submission.score}/${submission.total}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span>${Math.round(progress)}%</span>
            </div>
            <p>Date: ${submission.date}</p>
            ${submission.answers.map((answer, index) => `
                <div class="review-card ${answer.isCorrect ? 'correct' : 'incorrect'}">
                    <h3>Question ${index + 1}</h3>
                    <p>${answer.question}</p>
                    <p>Your answer: ${answer.answer}</p>
                    ${!answer.isCorrect ? `<p>Correct answer: ${answer.correct}</p>` : ''}
                </div>
            `).join('')}
            <div class="nav-container">
                <button class="nav-btn" onclick="showMidtermSubmissions()">Back to Submissions</button>
                <button class="nav-btn" onclick="showMainMenu()">Back to Menu</button>
            </div>
        </div>
    `;
}

function showMidtermSubmissions() {
    const content = document.getElementById('course-content');
    const submissions = midtermSubmissions || [];
    
    content.innerHTML = `
        <div class="quiz-wrapper">
            <h2>Midterm Submissions</h2>
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
    },
    {
        question: "What is the process of dividing a market into distinct groups of buyers who have different needs, characteristics, or behaviors?",
        options: [
            "Market targeting",
            "Market segmentation",
            "Market positioning",
            "Market differentiation",
            "Market analysis"
        ],
        correct: "Market segmentation"
    },
    {
        question: "Which of the following is NOT a demographic segmentation variable?",
        options: [
            "Age",
            "Gender",
            "Income",
            "Lifestyle",
            "Education"
        ],
        correct: "Lifestyle"
    },
    {
        question: "The practice of managing customer relationships to maximize their value to the company is known as:",
        options: [
            "Customer relationship management (CRM)",
            "Customer value management (CVM)",
            "Customer service management (CSM)",
            "Customer experience management (CEM)",
            "Customer loyalty management (CLM)"
        ],
        correct: "Customer relationship management (CRM)"
    },
    {
        question: "Which of the following is a characteristic of services?",
        options: [
            "Tangibility",
            "Storability",
            "Inseparability",
            "Standardization",
            "Ownership transfer"
        ],
        correct: "Inseparability"
    },
    {
        question: "What term describes the set of marketing tools a company uses to implement its marketing strategy?",
        options: [
            "Marketing mix",
            "Marketing plan",
            "Marketing concept",
            "Marketing environment",
            "Marketing orientation"
        ],
        correct: "Marketing mix"
    },
    {
        question: "Which of the following best describes a market?",
        options: [
            "A physical place where goods are bought and sold",
            "A set of actual and potential buyers of a product",
            "A group of sellers offering similar products",
            "A distribution channel for products",
            "A place where prices are determined"
        ],
        correct: "A set of actual and potential buyers of a product"
    },
    {
        question: "What is the term for a detailed roadmap that guides the company's marketing efforts for a specific period?",
        options: [
            "Marketing strategy",
            "Marketing plan",
            "Marketing concept",
            "Marketing analysis",
            "Marketing audit"
        ],
        correct: "Marketing plan"
    },
    {
        question: "Which of the following is NOT a step in the marketing process?",
        options: [
            "Understanding the marketplace and customer needs",
            "Designing a customer-driven marketing strategy",
            "Constructing an integrated marketing program",
            "Manufacturing products to meet demand",
            "Building profitable customer relationships"
        ],
        correct: "Manufacturing products to meet demand"
    },
    {
        question: "What is the term for the process of evaluating each market segment's attractiveness and selecting one or more segments to enter?",
        options: [
            "Market segmentation",
            "Market targeting",
            "Market positioning",
            "Market differentiation",
            "Market analysis"
        ],
        correct: "Market targeting"
    },
    {
        question: "Which of the following is a microenvironmental factor?",
        options: [
            "Demographics",
            "Economic conditions",
            "Competitors",
            "Cultural trends",
            "Technology"
        ],
        correct: "Competitors"
    },
    {
        question: "What is the process of creating value for customers and building strong customer relationships in order to capture value from customers in return?",
        options: [
            "Marketing",
            "Selling",
            "Advertising",
            "Promotion",
            "Distribution"
        ],
        correct: "Marketing"
    }
];
let midtermSubmissions = [];

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
                <h2>Submissions History</h2>
                <div class="button-grid">
                    <button onclick="showSubmissions(1)" class="menu-btn submission-btn">Submissions Chapter 1</button>
                    <button onclick="showSubmissions(2)" class="menu-btn submission-btn">Submissions Chapter 2</button>
                    <button onclick="showSubmissions(3)" class="menu-btn submission-btn">Submissions Chapter 3</button>
                    <button onclick="showSubmissions(4)" class="menu-btn submission-btn">Submissions Chapter 4</button>
                    <button onclick="showSubmissions(5)" class="menu-btn submission-btn">Submissions Chapter 5</button>
                    <button onclick="showSubmissions(6)" class="menu-btn submission-btn">Submissions Chapter 6</button>
                    <button onclick="showSubmissions(7)" class="menu-btn submission-btn">Submissions Chapter 7</button>
                </div>
            </div>
        </div>
    `;
}

// Show main menu when page loads
document.addEventListener('DOMContentLoaded', function() {
    showMainMenu();
});