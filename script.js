function generate() {
    let dictionary = "";

    // Check selected options and build the character pool
    if (document.getElementById("lowercaseCb").checked) {
        dictionary += "qwertyuiopasdfghjklzxcvbnm";
    }
    if (document.getElementById("uppercaseCb").checked) {
        dictionary += "QWERTYUIOPASDFGHJKLZXCVBNM";
    }
    if (document.getElementById("digitsCb").checked) {
        dictionary += "0123456789";
    }
    if (document.getElementById("specialsCb").checked) {
        dictionary += "!@#$%^&*()_+-={}[];<>:";
    }

    const length = document.getElementById('passwordLength').value;

    if (dictionary.length === 0) {
        alert("Please select at least one character type.");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const pos = Math.floor(Math.random() * dictionary.length);
        password += dictionary[pos];
    }

    document.getElementById('passwordOutput').value = password;
}

function savePasswordToHistory() {
    const password = document.getElementById('passwordOutput').value;
    const name = document.getElementById('passwordName').value.trim();

    if (!password || !name) {
        alert("Generate a password and enter a name.");
        return;
    }

    let history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    history.push({ name, password });

    if (history.length > 10) {
        history.shift();
    }

    localStorage.setItem('passwordHistory', JSON.stringify(history));
    displayPasswordHistory();
    document.getElementById('passwordName').value = '';
}

function displayPasswordHistory() {
    const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    const historyList = document.getElementById('passwordHistory');
    historyList.innerHTML = ''; // Clear the current list
    
    history.forEach(({ name, password }) => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${password}`;
        historyList.appendChild(li);
    });
}

function downloadPasswordHistory() {
    const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    if (history.length === 0) {
        alert("No passwords to download!");
        return;
    }
    const content = history.map(({ name, password }) => `${name}: ${password}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password_history.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
}

function clearPasswordHistory() {
    localStorage.removeItem('passwordHistory');
    displayPasswordHistory();
}

// Event Listeners
document.getElementById('generateBtn').addEventListener('click', () => {
    generate();
    savePasswordToHistory();
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const password = document.getElementById('passwordOutput').value;
    if (password) {
        navigator.clipboard.writeText(password).then(() => {
            alert('Password copied to clipboard!');
        });
    } else {
        alert('No password to copy!');
    }
});

// Update the password when the range slider changes
document.getElementById('passwordLength').addEventListener('input', (e) => {
    document.getElementById('rangeValue').textContent = e.target.value;
    generate();  // Regenerate the password as the length changes
});

document.getElementById('downloadBtn').addEventListener('click', downloadPasswordHistory);
document.getElementById('clearBtn').addEventListener('click', clearPasswordHistory);

// Initialize the page with history and a generated password
document.addEventListener('DOMContentLoaded', () => {
    displayPasswordHistory();
    generate();  // Generate an initial password
});
