// State management
let settings = {
    studentCount: 36,
    activeSeats: Array(36).fill(true),
    preConfiguredSeats: Array(36).fill(null)
};

let shuffleState = {
    isShuffling: false,
    intervalId: null,
    currentNumbers: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    initializeShuffleGrid();
    initializeSettingsGrids();
});

// Page navigation
function showHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('shufflePage').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'none';
    stopShuffle();
}

function showShuffleMode() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('shufflePage').style.display = 'block';
    document.getElementById('settingsPage').style.display = 'none';
    resetShuffleGrid();
}

function showSettingsMode() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('shufflePage').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'block';
    loadSettingsToUI();
}

// Load and save settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('seatShufflerSettings');
    if (saved) {
        settings = JSON.parse(saved);
    }
}

function saveSettings() {
    // Get student count
    const count = parseInt(document.getElementById('studentCount').value);
    if (count < 1 || count > 36) {
        alert('人数は1～36の範囲で入力してください。');
        return;
    }
    settings.studentCount = count;

    // Save active seats
    const activeSeats = document.querySelectorAll('#activeSeatGrid .seat-small');
    activeSeats.forEach((seat, index) => {
        settings.activeSeats[index] = seat.classList.contains('active');
    });

    // Save pre-configured seats
    const preConfigInputs = document.querySelectorAll('#preConfigGrid input');
    preConfigInputs.forEach((input, index) => {
        const value = input.value.trim();
        settings.preConfiguredSeats[index] = value === '' ? null : parseInt(value);
    });

    // Validate active seat count matches student count
    const activeSeatCount = settings.activeSeats.filter(active => active).length;
    if (activeSeatCount !== count) {
        alert(`アクティブな座席数（${activeSeatCount}）が人数（${count}）と一致しません。`);
        return;
    }

    // Save to localStorage
    localStorage.setItem('seatShufflerSettings', JSON.stringify(settings));
    alert('設定を保存しました！');
}

function cancelSettings() {
    if (confirm('変更を破棄してもよろしいですか？')) {
        loadSettingsToUI();
    }
}

function loadSettingsToUI() {
    // Load student count
    document.getElementById('studentCount').value = settings.studentCount;

    // Load active seats
    const activeSeats = document.querySelectorAll('#activeSeatGrid .seat-small');
    activeSeats.forEach((seat, index) => {
        if (settings.activeSeats[index]) {
            seat.classList.add('active');
            seat.classList.remove('inactive');
        } else {
            seat.classList.remove('active');
            seat.classList.add('inactive');
        }
    });

    // Load pre-configured seats
    const preConfigInputs = document.querySelectorAll('#preConfigGrid input');
    preConfigInputs.forEach((input, index) => {
        input.value = settings.preConfiguredSeats[index] || '';
        input.disabled = !settings.activeSeats[index];
    });
}

// Initialize grids
function initializeShuffleGrid() {
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = '';
    for (let i = 0; i < 36; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.id = `seat-${i}`;
        grid.appendChild(seat);
    }
}

function initializeSettingsGrids() {
    // Active seats grid
    const activeSeatGrid = document.getElementById('activeSeatGrid');
    activeSeatGrid.innerHTML = '';
    for (let i = 0; i < 36; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat-small active';
        seat.textContent = i + 1;
        seat.onclick = function() {
            this.classList.toggle('active');
            this.classList.toggle('inactive');
            updatePreConfigInputs();
        };
        activeSeatGrid.appendChild(seat);
    }

    // Pre-configured seats grid
    const preConfigGrid = document.getElementById('preConfigGrid');
    preConfigGrid.innerHTML = '';
    for (let i = 0; i < 36; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'seat-input';
        input.min = 1;
        input.max = settings.studentCount;
        input.placeholder = i + 1;
        preConfigGrid.appendChild(input);
    }
}

function updatePreConfigInputs() {
    const activeSeats = document.querySelectorAll('#activeSeatGrid .seat-small');
    const preConfigInputs = document.querySelectorAll('#preConfigGrid input');
    
    activeSeats.forEach((seat, index) => {
        const isActive = seat.classList.contains('active');
        preConfigInputs[index].disabled = !isActive;
        if (!isActive) {
            preConfigInputs[index].value = '';
        }
    });
}

// Shuffle mode logic
function resetShuffleGrid() {
    // Generate initial sequential numbers for active seats
    const numbers = [];
    for (let i = 0; i < settings.studentCount; i++) {
        numbers.push(i + 1);
    }
    
    // Set numbers to active seats
    let numberIndex = 0;
    for (let i = 0; i < 36; i++) {
        const seat = document.getElementById(`seat-${i}`);
        if (settings.activeSeats[i]) {
            seat.textContent = numbers[numberIndex++];
            seat.classList.remove('inactive');
        } else {
            seat.textContent = '';
            seat.classList.add('inactive');
        }
    }
    
    shuffleState.currentNumbers = [...numbers];
}

function getRandomNumbers() {
    const numbers = [];
    for (let i = 0; i < settings.studentCount; i++) {
        numbers.push(i + 1);
    }
    
    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    return numbers;
}

function displayNumbers(numbers) {
    let numberIndex = 0;
    for (let i = 0; i < 36; i++) {
        if (settings.activeSeats[i]) {
            const seat = document.getElementById(`seat-${i}`);
            seat.textContent = numbers[numberIndex++];
        }
    }
}

function startShuffle() {
    if (shuffleState.isShuffling) return;
    
    shuffleState.isShuffling = true;
    hideCompletionMessage();
    
    shuffleState.intervalId = setInterval(() => {
        const numbers = getRandomNumbers();
        displayNumbers(numbers);
        shuffleState.currentNumbers = numbers;
    }, 200);
}

function stopShuffle() {
    if (!shuffleState.isShuffling) return;
    
    shuffleState.isShuffling = false;
    if (shuffleState.intervalId) {
        clearInterval(shuffleState.intervalId);
        shuffleState.intervalId = null;
    }
    
    showCompletionMessage();
}

function stopShuffleWithPreConfig() {
    if (!shuffleState.isShuffling) return;
    
    shuffleState.isShuffling = false;
    if (shuffleState.intervalId) {
        clearInterval(shuffleState.intervalId);
        shuffleState.intervalId = null;
    }
    
    // Check if pre-configured seats are set
    const hasPreConfig = settings.preConfiguredSeats.some(seat => seat !== null);
    
    if (hasPreConfig) {
        // Use pre-configured seats
        const numbers = [];
        for (let i = 0; i < 36; i++) {
            if (settings.activeSeats[i] && settings.preConfiguredSeats[i] !== null) {
                numbers.push(settings.preConfiguredSeats[i]);
            }
        }
        
        // If pre-config is incomplete, fill with random for missing seats
        if (numbers.length < settings.studentCount) {
            // Use random instead
            const randomNumbers = getRandomNumbers();
            displayNumbers(randomNumbers);
        } else {
            let numberIndex = 0;
            for (let i = 0; i < 36; i++) {
                if (settings.activeSeats[i]) {
                    const seat = document.getElementById(`seat-${i}`);
                    seat.textContent = settings.preConfiguredSeats[i] !== null 
                        ? settings.preConfiguredSeats[i] 
                        : numbers[numberIndex];
                    numberIndex++;
                }
            }
        }
    }
    
    showCompletionMessage();
}

function showCompletionMessage() {
    const message = document.getElementById('completionMessage');
    message.style.display = 'block';
    
    setTimeout(() => {
        hideCompletionMessage();
    }, 3000);
}

function hideCompletionMessage() {
    const message = document.getElementById('completionMessage');
    message.style.display = 'none';
}

// Keyboard event handlers
document.addEventListener('keydown', function(event) {
    // Only handle keyboard events on shuffle page
    if (document.getElementById('shufflePage').style.display === 'none') {
        return;
    }
    
    if (event.code === 'Space') {
        event.preventDefault();
        if (shuffleState.isShuffling) {
            stopShuffle();
        } else {
            startShuffle();
        }
    } else if (event.code === 'Enter') {
        event.preventDefault();
        if (shuffleState.isShuffling) {
            stopShuffleWithPreConfig();
        }
    }
});
