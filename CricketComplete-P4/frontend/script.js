// ============================================
// API CLIENT PATTERN
// ============================================

const API = {
    baseURL: 'http://localhost:5000/api',
    
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };
        
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }
            
            if (response.status === 204) {
                return null;
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    },
    
    get(endpoint) {
        return this.request(endpoint);
    },
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
};

// ============================================
// AUTH FUNCTIONS
// ============================================

async function loginUser(email, password) {
    const result = await API.post('/users/login', { email, password });
    if (result.data && result.data.token) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        return result.data.user;
    }
    throw new Error('Login failed');
}

async function registerUser(name, email, password, age) {
    const payload = { name, email, password };
    if (age) payload.age = age;
    const result = await API.post('/users', payload);
    return result.data;
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateUIForAuth();
    showPage('home');
    showSuccess('Logged out successfully');
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// ============================================
// PLAYER FUNCTIONS
// ============================================

async function loadPlayers(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const result = await API.get(`/players${query}`);
    return result.data || result.players || [];
}

async function createPlayer(playerData) {
    const result = await API.post('/players', playerData);
    return result.data;
}

async function updatePlayer(id, playerData) {
    const result = await API.put(`/players/${id}`, playerData);
    return result.data;
}

async function deletePlayer(id) {
    await API.delete(`/players/${id}`);
}

// ============================================
// UI FUNCTIONS
// ============================================

function displayPlayers(players) {
    const container = document.getElementById('players-container');
    
    if (!players || players.length === 0) {
        container.innerHTML = '<p class="no-results">No players found.</p>';
        return;
    }
    
    container.innerHTML = players.map(player => `
        <div class="player-card" data-id="${player._id || player.id}">
            <h3>${escapeHtml(player.name)}</h3>
            <p>🏏 ${escapeHtml(player.role)}</p>
            <p>🏠 ${escapeHtml(player.team)}</p>
            <p>🎂 ${player.age} years</p>
            <div class="stats">
                <span>📊 ${player.stats?.matches || 0} matches</span>
                <span>🏏 ${player.stats?.runs || 0} runs</span>
                <span>🎯 ${player.stats?.wickets || 0} wickets</span>
            </div>
            <div class="card-actions">
                <button onclick="openEditPlayerForm('${player._id || player.id}')">✏️ Edit</button>
                <button onclick="deletePlayerHandler('${player._id || player.id}')" class="delete">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if(container) {
        container.innerHTML = '<div class="loading-spinner">⏳ Loading...</div>';
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showError(message) {
    showToast(message, 'error');
}

function showSuccess(message) {
    showToast(message, 'success');
}

// ============================================
// PAGE MANAGEMENT
// ============================================

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    if (pageId === 'players') {
        if (!isAuthenticated()) {
            showError('Please login to view players');
            showPage('home');
            openAuthModal();
            return;
        }
        loadAndDisplayPlayers();
    } else if (pageId === 'profile') {
        if (!isAuthenticated()) {
            showError('Please login to view your profile');
            showPage('home');
            openAuthModal();
            return;
        }
        loadAndDisplayProfile();
    }
}

// ============================================
// MAIN FUNCTIONS
// ============================================

let allPlayers = []; // Cache for editing

async function loadAndDisplayPlayers(search = '') {
    const container = document.getElementById('players-container');
    showLoading('players-container');
    
    try {
        const players = await loadPlayers(search);
        allPlayers = players;
        displayPlayers(players);
    } catch (error) {
        showError(`Failed to load players: ${error.message}`);
        if(container) container.innerHTML = '<p class="error">Failed to load players. Please try again.</p>';
    }
}

async function loadAndDisplayProfile() {
    const container = document.getElementById('profile-container');
    
    showLoading('profile-container');
    
    try {
        const result = await API.get('/users/profile');
        const user = result.data;
        
        container.innerHTML = `
            <div class="profile-card">
                <h3>${escapeHtml(user.name)}</h3>
                <p>📧 ${escapeHtml(user.email)}</p>
                <p>👤 Role: ${user.role}</p>
                ${user.age ? `<p>🎂 ${user.age} years old</p>` : ''}
                ${user.city ? `<p>📍 ${escapeHtml(user.city)}</p>` : ''}
                <p>📅 Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
                <button onclick="logoutUser()">🚪 Logout</button>
            </div>
        `;
    } catch (error) {
        showError(`Failed to load profile: ${error.message}`);
        container.innerHTML = '<p class="error">Failed to load profile.</p>';
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

// Add/Edit Player Form
document.getElementById('add-player-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('player-id').value;
    const playerData = {
        name: document.getElementById('player-name').value,
        age: parseInt(document.getElementById('player-age').value),
        role: document.getElementById('player-role').value,
        team: document.getElementById('player-team').value
    };
    
    try {
        if(id) {
            await updatePlayer(id, playerData);
            showSuccess('Player updated successfully!');
        } else {
            await createPlayer(playerData);
            showSuccess('Player added successfully!');
        }
        
        closeModal('add-player-modal');
        loadAndDisplayPlayers();
        document.getElementById('add-player-form').reset();
    } catch (error) {
        showError(`Failed to save player: ${error.message}`);
    }
});

// Delete Player
async function deletePlayerHandler(id) {
    if (!confirm('Are you sure you want to delete this player?')) {
        return;
    }
    
    try {
        await deletePlayer(id);
        showSuccess('Player deleted successfully!');
        loadAndDisplayPlayers();
    } catch (error) {
        showError(`Failed to delete player: ${error.message}`);
    }
}

// Search Players
let searchTimeout;
function searchPlayers(value) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadAndDisplayPlayers(value);
    }, 500);
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAddPlayerForm() {
    if (!isAuthenticated()) {
        showError('Please login first to manage players');
        openAuthModal();
        return;
    }
    document.getElementById('player-modal-title').textContent = 'Add New Player';
    document.getElementById('add-player-form').reset();
    document.getElementById('player-id').value = '';
    openModal('add-player-modal');
}

function openEditPlayerForm(id) {
    const player = allPlayers.find(p => (p._id || p.id) === id);
    if(!player) return;
    
    document.getElementById('player-modal-title').textContent = 'Edit Player';
    document.getElementById('player-id').value = id;
    document.getElementById('player-name').value = player.name;
    document.getElementById('player-age').value = player.age;
    document.getElementById('player-role').value = player.role;
    document.getElementById('player-team').value = player.team;
    
    openModal('add-player-modal');
}

// ============================================
// AUTHENTICATION MODAL
// ============================================

let isLoginMode = true;

function openAuthModal() {
    isLoginMode = true;
    document.getElementById('auth-title').textContent = 'Login';
    document.getElementById('auth-submit').textContent = 'Login';
    document.getElementById('auth-fields').style.display = 'none';
    document.getElementById('auth-toggle').textContent = "Don't have an account? Register";
    document.getElementById('auth-form').reset();
    openModal('auth-modal');
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').textContent = isLoginMode ? 'Login' : 'Register';
    document.getElementById('auth-submit').textContent = isLoginMode ? 'Login' : 'Register';
    document.getElementById('auth-fields').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('auth-toggle').textContent = isLoginMode 
        ? "Don't have an account? Register"
        : "Already have an account? Login";
}

document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    try {
        if (isLoginMode) {
            await loginUser(email, password);
            showSuccess('Login successful!');
            updateUIForAuth();
            closeModal('auth-modal');
            
            // Refresh current page if needed
            const activePage = document.querySelector('.page.active');
            if (activePage) {
                const pageId = activePage.id.replace('-page', '');
                if(pageId === 'players' || pageId === 'profile') showPage(pageId);
                else showPage('players'); // redirect to players after login
            }
        } else {
            const name = document.getElementById('auth-name').value;
            const age = document.getElementById('auth-age').value ? parseInt(document.getElementById('auth-age').value) : null;
            
            if (!name) {
                showError('Name is required for registration');
                return;
            }
            
            await registerUser(name, email, password, age);
            showSuccess('Registration successful! Please login.');
            toggleAuthMode(); // Switch to login mode
        }
    } catch (error) {
        showError(`Authentication failed: ${error.message}`);
    }
});

function handleAuth() {
    if (isAuthenticated()) {
        logoutUser();
    } else {
        openAuthModal();
    }
}

function updateUIForAuth() {
    const authLink = document.getElementById('authLink');
    const profileLink = document.getElementById('profileLink');
    const heroBtn = document.getElementById('heroAuthBtn');
    
    if (isAuthenticated()) {
        const user = getCurrentUser();
        authLink.textContent = user ? `Logout (${user.name})` : 'Logout';
        profileLink.style.display = 'inline-block';
        if(heroBtn) heroBtn.style.display = 'none';
    } else {
        authLink.textContent = 'Login';
        profileLink.style.display = 'none';
        if(heroBtn) heroBtn.style.display = 'inline-block';
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Show home page
    showPage('home');
    
    // Update auth UI
    updateUIForAuth();
});

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
