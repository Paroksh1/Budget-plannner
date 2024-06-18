document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeRecommendation = document.querySelector('.theme-recommendation');
    const balanceEl = document.getElementById('balance');
    const incomeEl = document.getElementById('income');
    const expenseEl = document.getElementById('expense');
    const transactionForm = document.getElementById('transaction-form');
    const incomeList = document.getElementById('income-list');
    const expenseList = document.getElementById('expense-list');
    const loginContainer = document.getElementById('login-page');
    const signupContainer = document.getElementById('signup-page');
    const homeContainer = document.getElementById('home-page');
    const appContainer = document.getElementById('app-page');
    const profileContainer = document.getElementById('profile-page');
    const dashboardContainer = document.getElementById('dashboard-page');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const showLoginPage = document.getElementById('show-login-page');
    const startPlanning = document.getElementById('start-planning');
    const showProfileButton = document.getElementById('show-profile');
    const toggleTheme = document.getElementById('toggle-theme');
    const profileForm = document.getElementById('profile-form');
    const goalForm = document.getElementById('goal-form');
    const receiptForm = document.getElementById('receipt-form');
    const receiptUpload = document.getElementById('receipt-upload');
    const showBillSplitter = document.getElementById('show-bill-splitter');
    const billSplitterPage = document.getElementById('bill-splitter-page');
    const billSplitterForm = document.getElementById('bill-splitter-form');
    const billSplitterResult = document.getElementById('bill-splitter-result');
    const showFeedback = document.getElementById('show-feedback');
    const feedbackPage = document.getElementById('feedback-page');
    const feedbackForm = document.getElementById('feedback-form');
    const showChatbot = document.getElementById('show-chatbot');
    const chatbotPage = document.getElementById('chatbot-page');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const logoutButton = document.getElementById('logout-button');
    const showAppPage = document.getElementById('show-app-page');
    const homeButton = document.getElementById('home-button');
    const showDashboard = document.getElementById('show-dashboard');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let budgetGoal = JSON.parse(localStorage.getItem('budgetGoal')) || null;

    // Initialize the theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    // Hide all sections
    function hideAllSections() {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'none';
        homeContainer.style.display = 'none';
        appContainer.style.display = 'none';
        profileContainer.style.display = 'none';
        billSplitterPage.style.display = 'none';
        feedbackPage.style.display = 'none';
        chatbotPage.style.display = 'none';
        dashboardContainer.style.display = 'none';
    }

    // Event listener for toggle theme
    toggleTheme.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Event listener for theme recommendation
    themeRecommendation.addEventListener('click', () => {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    });

    // Event listener for showing signup form
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        signupContainer.style.display = 'block';
    });

    // Event listener for showing login form
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        loginContainer.style.display = 'block';
    });

    // Event listener for showing login page from home
    showLoginPage.addEventListener('click', () => {
        hideAllSections();
        loginContainer.style.display = 'block';
    });

    // Event listener for starting planning from home page
    startPlanning.addEventListener('click', () => {
        hideAllSections();
        if (currentUser) {
            appContainer.style.display = 'block';
            init();
        } else {
            loginContainer.style.display = 'block';
        }
    });

    // Event listener for login form submission
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            hideAllSections();
            appContainer.style.display = 'block';
            logoutButton.style.display = 'block';
            init();
        } else {
            alert('Invalid login credentials');
        }
    });

    // Event listener for signup form submission
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const name = document.getElementById('signup-name').value;
        const dob = document.getElementById('signup-dob').value;
        const age = document.getElementById('signup-age').value;
        const isEarning = document.getElementById('signup-earning').checked;

        if (users.some(user => user.email === email)) {
            alert('User already exists');
        } else {
            const newUser = { email, password, name, dob, age, isEarning };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('User registered successfully');
            hideAllSections();
            loginContainer.style.display = 'block';
        }
    });

    // Event listener for adding transaction
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const date = document.getElementById('date').value;
        const isRecurring = document.getElementById('recurring').checked;

        if (description && amount && date) {
            const transaction = {
                id: generateID(),
                description,
                amount: type === 'expense' ? -amount : amount,
                type,
                date,
                isRecurring
            };

            transactions.push(transaction);
            addTransactionDOM(transaction);
            updateValues();
            saveTransactions();
            transactionForm.reset();
        }
    });

    // Event listener for setting budget goal
    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const goalAmount = parseFloat(document.getElementById('goal-amount').value);

        if (goalAmount) {
            budgetGoal = goalAmount;
            localStorage.setItem('budgetGoal', JSON.stringify(budgetGoal));
            alert('Budget goal set successfully!');
        }
    });

    // Event listener for showing profile form
    showProfileButton.addEventListener('click', () => {
        hideAllSections();
        profileContainer.style.display = 'block';
        initProfile();
    });

    // Event listener for profile form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const picture = document.getElementById('profile-picture').files[0];
        currentUser.name = name;
        if (picture) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentUser.picture = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                alert('Profile updated successfully');
            };
            reader.readAsDataURL(picture);
        } else {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert('Profile updated successfully');
        }
        hideAllSections();
        appContainer.style.display = 'block';
    });

    // Event listener for receipt scanning form submission
    receiptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = receiptUpload.files[0];
        if (file) {
            scanReceipt(file).then(text => {
                const amountMatch = text.match(/\d+(\.\d{1,2})?/);
                if (amountMatch) {
                    const amount = parseFloat(amountMatch[0]);
                    const description = 'Receipt Scan';
                    const transaction = {
                        id: generateID(),
                        description,
                        amount: -amount,
                        type: 'expense',
                        date: new Date().toISOString().split('T')[0]
                    };
                    transactions.push(transaction);
                    addTransactionDOM(transaction);
                    updateValues();
                    saveTransactions();
                } else {
                    alert('Could not detect amount in the receipt.');
                }
            }).catch(err => {
                alert('Error scanning receipt: ' + err.message);
            });
        }
    });

    // Mock function to handle receipt scanning (for demonstration purposes)
    function scanReceipt(file) {
        return new Promise((resolve) => {
            // Mock OCR functionality
            const mockText = 'Total: 123.45'; // Replace with actual OCR processing
            setTimeout(() => resolve(mockText), 1000);
        });
    }

    // Event listener for bill splitter form submission
    billSplitterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const numberOfPeople = parseInt(document.getElementById('number-of-people').value);
        const participantsDiv = document.getElementById('participants');
        participantsDiv.innerHTML = ''; // Clear previous participants

        for (let i = 1; i <= numberOfPeople; i++) {
            const participantDiv = document.createElement('div');
            participantDiv.innerHTML = `
                <h3>Participant ${i}</h3>
                <input type="text" id="participant-${i}-name" placeholder="Name" required>
                <input type="text" id="participant-${i}-expenses" placeholder="Expenses (comma-separated)" required>
            `;
            participantsDiv.appendChild(participantDiv);
        }

        const calculateButton = document.createElement('button');
        calculateButton.innerHTML = '<i class="fas fa-calculator"></i> Calculate Split';
        calculateButton.addEventListener('click', calculateBillSplit);
        participantsDiv.appendChild(calculateButton);
    });

    function calculateBillSplit() {
        const numberOfPeople = parseInt(document.getElementById('number-of-people').value);
        const participants = [];
        for (let i = 1; i <= numberOfPeople; i++) {
            const name = document.getElementById(`participant-${i}-name`).value;
            const expenses = document.getElementById(`participant-${i}-expenses`).value.split(',').map(Number);
            participants.push({ name, expenses });
        }

        const totalExpenses = participants.reduce((total, participant) => {
            return total + participant.expenses.reduce((sum, expense) => sum + expense, 0);
        }, 0);

        const equalShare = totalExpenses / numberOfPeople;

        const result = participants.map(participant => {
            const totalParticipantExpenses = participant.expenses.reduce((sum, expense) => sum + expense, 0);
            const owes = (totalParticipantExpenses - equalShare).toFixed(2);
            return `${participant.name}: ${owes >= 0 ? 'owes' : 'should receive'} ₹${Math.abs(owes)}`;
        });

        billSplitterResult.innerHTML = `
            Total Expenses: ₹${totalExpenses.toFixed(2)}<br>
            Each person's equal share: ₹${equalShare.toFixed(2)}<br>
            ${result.join('<br>')}
        `;
    }

    // Event listener for showing bill splitter page
    showBillSplitter.addEventListener('click', () => {
        hideAllSections();
        billSplitterPage.style.display = 'block';
    });

    // Event listener for showing feedback page
    showFeedback.addEventListener('click', () => {
        hideAllSections();
        feedbackPage.style.display = 'block';
    });

    // Event listener for feedback form submission
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedbackText = document.getElementById('feedback-text').value;
        if (feedbackText) {
            alert('Thank you for your feedback!');
            document.getElementById('feedback-text').value = '';
        } else {
            alert('Please enter your feedback.');
        }
    });

    // Event listener for showing chatbot page
    showChatbot.addEventListener('click', () => {
        hideAllSections();
        chatbotPage.style.display = 'block';
    });

    // Event listener for chatbot send button
    chatbotSend.addEventListener('click', () => {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            appendMessage('user', userMessage);
            handleChatbotResponse(userMessage);
            chatbotInput.value = '';
        }
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatbotSend.click();
        }
    });

    // Function to append a message to the chatbot
    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerText = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to handle chatbot response
    function handleChatbotResponse(message) {
        let response = '';

        if (message.toLowerCase().includes('balance')) {
            response = `Your balance is ₹${balanceEl.innerText}`;
        } else if (message.toLowerCase().includes('spent')) {
            response = `You have spent ₹${expenseEl.innerText}`;
        } else if (message.toLowerCase().includes('earned')) {
            response = `You have earned ₹${incomeEl.innerText}`;
        } else if (message.toLowerCase().includes('budget goal')) {
            response = budgetGoal ? `Your budget goal is ₹${budgetGoal}` : `You have not set a budget goal yet.`;
        } else if (message.toLowerCase().includes('financial tip')) {
            response = `Identify unnecessary expenses, set spending limits, and track your expenses to find areas where you can cut back.`;
        } else if (message.toLowerCase().includes('motivational quote')) {
            response = `The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt`;
        } else if (message.toLowerCase().includes('income to expense ratio')) {
            const income = parseFloat(incomeEl.innerText);
            const expense = parseFloat(expenseEl.innerText);
            const ratio = (income / expense).toFixed(2);
            response = `Your income to expense ratio is ${ratio}`;
        } else if (message.toLowerCase().includes('recent transactions')) {
            response = transactions.length ? transactions.slice(-5).map(t => `${t.description}: ₹${t.amount}`).join(', ') : `You have no recent transactions.`;
        } else if (message.toLowerCase().includes('save more money')) {
            response = `Try to cut down on unnecessary expenses and allocate a portion of your income to savings every month.`;
        } else if (message.toLowerCase().includes('highest expense')) {
            const highestExpense = transactions.filter(t => t.amount < 0).sort((a, b) => b.amount - a.amount)[0];
            response = highestExpense ? `Your highest expense is ${highestExpense.description}: ₹${Math.abs(highestExpense.amount)}` : `You have no expenses yet.`;
        } else if (message.toLowerCase().includes('reduce my expenses')) {
            response = `Identify unnecessary expenses, set spending limits, and track your expenses to find areas where you can cut back.`;
        } else {
            response = `I'm sorry, I didn't understand that. Please try asking something else.`;
        }

        setTimeout(() => {
            appendMessage('bot', response);
        }, 500);
    }

    // Function to generate a unique ID
    function generateID() {
        return Math.floor(Math.random() * 100000000);
    }

    // Function to add a transaction to the DOM
    function addTransactionDOM(transaction) {
        const sign = transaction.type === 'expense' ? '-' : '+';
        const item = document.createElement('li');
        item.innerHTML = `
            ${transaction.description} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
            <button onclick="removeTransaction(${transaction.id})"><i class="fas fa-trash-alt"></i></button>
        `;

        if (transaction.type === 'income') {
            incomeList.appendChild(item);
        } else {
            expenseList.appendChild(item);
        }
    }

    // Function to update balance, income, and expense
    function updateValues() {
        const amounts = transactions.map(transaction => transaction.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);
        const expense = (
            amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
        ).toFixed(2);

        balanceEl.innerText = total;
        incomeEl.innerText = income;
        expenseEl.innerText = expense;

        if (budgetGoal && total < budgetGoal) {
            alert(`Warning: Your balance is below the set budget goal of ₹${budgetGoal.toFixed(2)}`);
        }
    }

    // Function to save transactions to local storage
    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Function to remove a transaction
    window.removeTransaction = function (id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactions();
        init();
    };

    // Initialize the app
    function init() {
        incomeList.innerHTML = '';
        expenseList.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
        if (currentUser) {
            showDashboardCharts();
        }
    }

    // Initialize profile form with current user data
    function initProfile() {
        if (currentUser) {
            document.getElementById('profile-name').value = currentUser.name || '';
            document.getElementById('profile-email').value = currentUser.email;
        }
    }

    // Auto-login if user is already logged in
    if (currentUser) {
        hideAllSections();
        homeContainer.style.display = 'block';
        logoutButton.style.display = 'block';
    } else {
        homeContainer.style.display = 'block';
    }

    // Event listener for logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        hideAllSections();
        homeContainer.style.display = 'block';
        logoutButton.style.display = 'none';
    });

    // Event listener for showing app page
    showAppPage.addEventListener('click', () => {
        hideAllSections();
        if (currentUser) {
            appContainer.style.display = 'block';
            init();
        } else {
            loginContainer.style.display = 'block';
        }
    });

    // Event listener for home button
    homeButton.addEventListener('click', () => {
        hideAllSections();
        homeContainer.style.display = 'block';
    });

    // Event listener for showing dashboard page
    showDashboard.addEventListener('click', () => {
        hideAllSections();
        if (currentUser) {
            dashboardContainer.style.display = 'block';
            showDashboardCharts();
        } else {
            loginContainer.style.display = 'block';
        }
    });

    // Fetch real data for charts
    function getChartData() {
        const spendingData = new Array(12).fill(0);
        const budgetData = new Array(12).fill(0);
        
        transactions.forEach(transaction => {
            const month = new Date(transaction.date).getMonth(); // Get month from date
            if (transaction.type === 'expense') {
                spendingData[month] += Math.abs(transaction.amount);
            } else if (transaction.type === 'income') {
                budgetData[month] += transaction.amount;
            }
        });

        const financialHealthData = calculateFinancialHealth(); // Define this function based on your criteria

        return { spendingData, budgetData, financialHealthData };
    }

    // Function to calculate financial health score based on your criteria
    function calculateFinancialHealth() {
        // Example calculation, adjust according to your logic
        const totalIncome = transactions
            .filter(transaction => transaction.type === 'income')
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        
        const totalExpenses = transactions
            .filter(transaction => transaction.type === 'expense')
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        
        const healthScore = (totalIncome - totalExpenses) / totalIncome * 100;
        return [healthScore];
    }

    // Function to show dashboard charts
    function showDashboardCharts() {
        const { spendingData, budgetData, financialHealthData } = getChartData();

        const spendingTrendCtx = document.getElementById('spending-trend-chart').getContext('2d');
        const budgetForecastCtx = document.getElementById('budget-forecast-chart').getContext('2d');
        const financialHealthCtx = document.getElementById('financial-health-chart').getContext('2d');

        new Chart(spendingTrendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Spending',
                    data: spendingData,
                    borderColor: '#00bcd4',
                    backgroundColor: 'rgba(0, 188, 212, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#555' } }
                }
            }
        });

        new Chart(budgetForecastCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Income',
                    data: budgetData,
                    backgroundColor: '#00bcd4'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#555' } }
                }
            }
        });

        new Chart(financialHealthCtx, {
            type: 'doughnut',
            data: {
                labels: ['Financial Health'],
                datasets: [{
                    data: financialHealthData,
                    backgroundColor: ['#00bcd4', '#0097a7', '#00796b']
                }]
            },
            options: {
                responsive: true,
                cutoutPercentage: 80,
                rotation: Math.PI / 2,
                circumference: Math.PI,
                legend: { display: false }
            }
        });
    }
});
