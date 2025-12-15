/**
 * ================================================================
 * PROJECTHUB - PORTFOLIO SHOWCASE PLATFORM
 * ================================================================
 * 
 * A comprehensive project management and showcase platform for students
 * and developers to display their work with ratings, views, and bookmarks.
 * 
 * FEATURES:
 * - User authentication (login/register/logout)
 * - Project CRUD operations (create, read, update, delete)
 * - Image upload with compression and Base64 storage
 * - Star rating system (1-5 stars with average calculation)
 * - View counter tracking
 * - Bookmark/save functionality
 * - Toast notifications for user feedback
 * - Responsive design (mobile, tablet, desktop)
 * - Full accessibility compliance (WCAG AA)
 * - localStorage persistence
 * 
 * BROWSER COMPATIBILITY:
 * - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
 * 
 * @author ProjectHub Team
 * @version 2.0.0
 * @license MIT
 * ================================================================
 */

// ============= MODULE 1: GLOBAL STATE & CONFIGURATION =============

/**
 * Current authenticated user object
 * @type {Object|null}
 */
let currentUser = null;

/**
 * Array of project IDs bookmarked by current user
 * @type {Array<number>}
 */
let userBookmarks = [];

/**
 * ID of project pending deletion (for confirmation dialog)
 * @type {number|null}
 */
let projectToDelete = null;

/**
 * Base64 data of uploaded image (for new projects)
 * @type {string|null}
 */
let uploadImageData = null;

/**
 * Base64 data of edited image (for existing projects)
 * @type {string|null}
 */
let editImageData = null;

// Image upload constants
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_DIMENSION = 1920; // Maximum width/height in pixels
const COMPRESSION_QUALITY = 0.85; // JPEG compression quality (0-1)
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// ============= MODULE 2: TOAST NOTIFICATION SYSTEM =============

/**
 * Display toast notification to user
 * @param {string} message - Message to display
 * @param {string} type - Notification type: 'success', 'error', 'info'
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.25rem;">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span style="flex: 1;">${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============= MODULE 3: DATA PERSISTENCE (localStorage) =============

/**
 * Save all projects to localStorage
 * Persists the entire projectDatabase array
 */
function saveProjectsToStorage() {
    localStorage.setItem('projectHubProjects', JSON.stringify(projectDatabase));
}

/**
 * Load projects from localStorage and merge with default data
 * Avoids duplicates by checking project IDs
 */
function loadProjectsFromStorage() {
    const stored = localStorage.getItem('projectHubProjects');
    if (stored) {
        const storedProjects = JSON.parse(stored);
        // Merge stored projects with default projects, avoiding duplicates
        storedProjects.forEach(sp => {
            if (!projectDatabase.find(p => p.id === sp.id)) {
                projectDatabase.push(sp);
            }
        });
    }
}

// ============= MODULE 4: SESSION MANAGEMENT =============

/**
 * Save current user session to sessionStorage
 * @param {Object} user - User object to save
 */
function saveCurrentSession(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Load current user session from sessionStorage
 * @returns {Object|null} User object or null if not logged in
 */
function loadCurrentSession() {
    const session = sessionStorage.getItem('currentUser');
    return session ? JSON.parse(session) : null;
}

function clearCurrentSession() {
    sessionStorage.removeItem('currentUser');
}

// Check authentication status on page load
function checkAuthAndUpdateNav() {
    currentUser = loadCurrentSession();
    loadProjectsFromStorage();
    loadUserBookmarks();
    updateNavigation();
}

// Require authentication for protected pages
function requireAuth() {
    if (!currentUser) {
        alert('⚠️ Please sign in to access this page');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ============= VALIDATION UTILITIES =============

/**
 * Validate GitHub URL format
 */
function isValidGitHubUrl(url) {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+(\/.*)?$/;
    return githubPattern.test(url);
}

/**
 * Validate general URL format
 */
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'file:';
    } catch (e) {
        return false;
    }
}

/**
 * Validate title (minimum 10 characters)
 */
function validateTitle(title) {
    if (!title || title.trim().length < 10) {
        return { valid: false, message: 'Title must be at least 10 characters' };
    }
    return { valid: true };
}

/**
 * Validate description (minimum 10 characters)
 */
function validateDescription(description) {
    if (!description || description.trim().length < 10) {
        return { valid: false, message: 'Description must be at least 10 characters' };
    }
    return { valid: true };
}

/**
 * Validate category selection
 */
function validateCategory(category) {
    if (!category) {
        return { valid: false, message: 'Please select a category' };
    }
    return { valid: true };
}

/**
 * Validate technologies (at least one required)
 */
function validateTechnologies(techString) {
    const technologies = techString ? techString.split(',').map(t => t.trim()).filter(t => t) : [];
    if (technologies.length === 0) {
        return { valid: false, message: 'Please add at least one technology' };
    }
    return { valid: true, technologies };
}

/**
 * Generate unique project ID
 */
function generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// ============= MODAL MANAGEMENT =============
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus first input if available
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
}

/**
 * Close modal with smooth fade-out animation
 * @param {string} modalId - The ID of the modal to close
 */
function closeModal(modalId) {
    console.log(`[closeModal] Attempting to close modal: ${modalId}`);
    
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`[closeModal] Modal not found: ${modalId}`);
        return;
    }
    
    // Remove active class for fade-out animation
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    
    // Reset display after animation
    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
        }
    }, 300);
    
    console.log(`[closeModal] Successfully closed modal: ${modalId}`);
    
    // Return focus to the trigger button if it exists
    const triggerButton = document.querySelector(`[onclick*="${modalId}"]`);
    if (triggerButton) {
        setTimeout(() => triggerButton.focus(), 350);
    }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        console.log('[ESC Key] Closing all open modals');
        const modals = ['loginModal', 'registerModal', 'uploadModal', 'editModal', 'projectDetailModal', 'deleteConfirmModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && modal.classList.contains('active')) {
                closeModal(modalId);
            }
        });
    }
});

// Close modal on overlay click (clicking outside the modal content)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
        console.log('[Click Outside] Closing modal:', e.target.id);
        closeModal(e.target.id);
    }
});

function openLoginModal() { openModal('loginModal'); }
function openRegisterModal() { openModal('registerModal'); }
function openUploadModal() { 
    if (!currentUser) {
        showToast('Please sign in to upload projects', 'error');
        openLoginModal();
        return;
    }
    
    const uploadModal = document.getElementById('uploadModal');
    if (!uploadModal) {
        showToast('Upload feature is not available on this page', 'error');
        return;
    }
    
    openModal('uploadModal');
}

// ============= USER STORAGE MANAGEMENT =============
function saveUserToStorage(userData) {
    let users = JSON.parse(localStorage.getItem('projectHubUsers')) || [];
    users.push(userData);
    localStorage.setItem('projectHubUsers', JSON.stringify(users));
}

function getUserByEmail(email) {
    let users = JSON.parse(localStorage.getItem('projectHubUsers')) || [];
    return users.find(user => user.email === email);
}

function validateCredentials(email, password) {
    let users = JSON.parse(localStorage.getItem('projectHubUsers')) || [];
    return users.find(user => user.email === email && user.password === password);
}

function updateUserInStorage(updatedUser) {
    let users = JSON.parse(localStorage.getItem('projectHubUsers')) || [];
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('projectHubUsers', JSON.stringify(users));
    }
}

// Note: Modal management functions (openModal, closeModal) are defined earlier
// Additional specific modal openers use the generic openModal function

// ============= AUTHENTICATION HANDLERS =============
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate input
    if (!email || !password) {
        alert('⚠️ Please enter both email and password');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Please enter a valid email address');
        return;
    }

    // Check credentials in real-time
    const user = validateCredentials(email, password);
    
    if (user) {
        currentUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            field: user.field,
            bio: user.bio || '',
            skills: user.skills || ''
        };

        closeModal('loginModal');
        saveCurrentSession(currentUser);
        updateNavigation();
        
        // Redirect to browse page
        alert(`Welcome back, ${currentUser.name}! 👋`);
        window.location.href = 'browse.html';
    } else {
        alert('❌ Invalid email or password. Please try again or register for a new account.');
    }
}

function handleRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const field = document.getElementById('regField').value;

    // Validate inputs
    if (!name || !email || !password || !field) {
        alert('⚠️ Please fill in all fields');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Please enter a valid email address');
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        alert('⚠️ Password must be at least 6 characters long');
        return;
    }

    // Check if email already exists
    if (getUserByEmail(email)) {
        alert('⚠️ This email is already registered. Please login instead.');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        field: field,
        bio: '',
        skills: '',
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    saveUserToStorage(newUser);

    // Set as current user
    currentUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        field: newUser.field,
        bio: newUser.bio,
        skills: newUser.skills
    };

    closeModal('registerModal');
    saveCurrentSession(currentUser);
    updateNavigation();
    
    // Redirect to browse page
    alert(`Welcome, ${name}! 🎉 Your account has been created successfully.`);
    window.location.href = 'browse.html';
}

function updateNavigation() {
    const navRight = document.querySelector('.nav-right') || document.getElementById('navButtons');
    if (!navRight) return;
    
    if (currentUser) {
        navRight.innerHTML = `
            <span style="color: #6b7280; font-weight: 500;">👤 ${currentUser.name}</span>
            <button class="btn btn-secondary" onclick="handleLogout()">Sign Out</button>
        `;
    } else {
        navRight.innerHTML = `
            <button class="btn btn-primary" onclick="openLoginModal()">Sign In</button>
            <button class="btn btn-secondary" onclick="openRegisterModal()">Join Us</button>
        `;
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        currentUser = null;
        userBookmarks = [];
        clearCurrentSession();
        updateNavigation();
        alert('👋 You have been signed out successfully.');
        window.location.href = 'index.html';
    }
}

// ============= PROJECT MANAGEMENT =============
function renderProjectGrid() {
    const grid = document.getElementById('projectsList');
    if (!grid) return;
    grid.innerHTML = projectDatabase.map(project => createProjectCard(project)).join('');
}

function createProjectCard(project) {
    const projectImage = project.image || 'https://via.placeholder.com/400x250/667eea/ffffff?text=' + encodeURIComponent(project.title.substring(0, 20));
    const isBookmarked = userBookmarks.includes(project.id);
    const bookmarkIcon = isBookmarked ? '❤️' : '💾';
    const bookmarkText = isBookmarked ? 'Saved' : 'Save';
    const isOwnProject = currentUser && project.creatorId === currentUser.id;
    
    return `
        <div class="project-card">
            <div class="project-image" style="background-image: url('${projectImage}'); background-size: cover; background-position: center; min-height: 200px; cursor: pointer;" onclick="viewProjectDetails(${project.id})"></div>
            <div class="project-body">
                <div class="project-category">${project.category}</div>
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description.substring(0, 100)}...</div>
                <div class="tech-stack">
                    ${project.technologies.slice(0, 3).map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <div class="stat-item">
                        <span class="rating">★ ${project.rating.toFixed(1)}</span>
                        <span>(${project.reviews})</span>
                    </div>
                    <div class="stat-item">👁️ <span data-project-views="${project.id}">${project.views}</span></div>
                </div>
                <div class="project-actions">
                    <button onclick="viewProjectDetails(${project.id})" class="btn-view">👁️ View</button>
                    <button onclick="toggleBookmark(${project.id})" class="btn-save">${bookmarkIcon} ${bookmarkText}</button>
                    ${isOwnProject ? `<button onclick="openEditModal(${project.id})" class="btn-edit">✏️ Edit</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

function applyFilters() {
    const searchField = document.getElementById('searchField');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const grid = document.getElementById('projectsList');
    
    if (!searchField || !categoryDropdown || !grid) return;
    
    const searchTerm = searchField.value.toLowerCase();
    const categoryFilter = categoryDropdown.value;

    const filtered = projectDatabase.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm) || 
                            p.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    grid.innerHTML = filtered.map(p => createProjectCard(p)).join('');
}

function renderUserProjects() {
    const grid = document.getElementById('userProjectsList');
    if (!grid) return;
    
    if (!currentUser) {
        grid.innerHTML = '<p>Please sign in to view your projects</p>';
        return;
    }

    const userProjects = projectDatabase.filter(p => p.creatorId === currentUser.id);
    
    if (userProjects.length === 0) {
        grid.innerHTML = '<p>You haven\'t published any projects yet. Click "New Project" to get started!</p>';
        return;
    }

    grid.innerHTML = userProjects.map(p => createProjectCard(p)).join('');
}

function handleProjectUpload(e) {
    e.preventDefault();
    
    // Validate inputs
    const title = document.getElementById('projTitle').value.trim();
    const description = document.getElementById('projDesc').value.trim();
    const category = document.getElementById('projCategory').value;
    const techString = document.getElementById('projTech').value.trim();
    
    // Title validation (minimum 10 characters)
    if (!title || title.length < 10) {
        showToast('Project title must be at least 10 characters', 'error');
        return;
    }
    
    // Description validation (minimum 10 characters)
    if (!description || description.length < 10) {
        showToast('Description must be at least 10 characters', 'error');
        return;
    }
    
    // Category validation
    if (!category) {
        showToast('Please select a category', 'error');
        return;
    }
    
    // Image validation
    if (!uploadImageData) {
        showToast('Please upload a project image', 'error');
        return;
    }
    
    // Technologies validation (at least one)
    const technologies = techString ? techString.split(',').map(t => t.trim()).filter(t => t) : [];
    if (technologies.length === 0) {
        showToast('Please add at least one technology', 'error');
        return;
    }
    
    // GitHub URL validation (optional but must be valid if provided)
    const githubUrl = document.getElementById('projGithub').value.trim();
    if (githubUrl && !isValidGitHubUrl(githubUrl)) {
        showToast('Please enter a valid GitHub repository URL', 'error');
        return;
    }
    
    // Demo URL validation (optional but must be valid if provided)
    const demoUrl = document.getElementById('projDemo').value.trim();
    if (demoUrl && !isValidUrl(demoUrl)) {
        showToast('Please enter a valid demo URL', 'error');
        return;
    }
    
    // Create new project
    const newProject = {
        id: Date.now(), // Use timestamp for unique ID
        title: title,
        category: category,
        description: description,
        technologies: technologies,
        image: uploadImageData,
        imageUploadDate: new Date().toISOString(),
        creator: currentUser.name,
        creatorId: currentUser.id,
        views: 0,
        rating: 0,
        reviews: 0,
        bookmarks: 0,
        github: githubUrl || '',
        demo: demoUrl || '',
        dateCreated: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
    };

    projectDatabase.push(newProject);
    saveProjectsToStorage();
    closeModal('uploadModal');
    showToast('🎉 Your project has been published successfully!', 'success');
    
    // Reset form and image data
    document.getElementById('uploadModal').querySelector('form').reset();
    resetImagePreview('upload');
    uploadImageData = null;
    
    // Refresh the display
    renderUserProjects();
}

/**
 * Display project details in modal with interactive features
 * @param {number} projectId - ID of project to display
 */
function viewProjectDetails(projectId) {
    const project = projectDatabase.find(p => p.id === projectId);
    if (!project) {
        showToast('Project not found', 'error');
        return;
    }
    
    // Increment view count
    project.views++;
    saveProjectsToStorage();
    
    const projectImage = project.image || 'https://via.placeholder.com/600x400/667eea/ffffff?text=' + encodeURIComponent(project.title);
    const isOwnProject = currentUser && project.creatorId === currentUser.id;
    const canRate = currentUser && !isOwnProject;
    
    const detailsHTML = `
        <div style="padding: 1.5rem;">
            <!-- Project Image -->
            <img src="${projectImage}" alt="${project.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Project Title (as heading) -->
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #111827;">${project.title}</h2>
            
            <!-- Meta Information -->
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <span class="category-badge" style="background: #3b82f6; color: white; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">${project.category}</span>
                <span style="color: #6b7280; font-size: 0.95rem;">by ${project.creator}</span>
                <span style="color: #6b7280; font-size: 0.95rem;">• ${project.dateCreated}</span>
            </div>
            
            <!-- Stats Bar (Views + Rating) -->
            <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 8px; border: 1px solid #d1d5db;">
                <!-- View Count -->
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">👁️</span>
                    <div>
                        <div style="font-weight: 700; font-size: 1.25rem; color: #111827;" id="viewCount_${project.id}">${project.views}</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">views</div>
                    </div>
                </div>
                
                <!-- Rating Display -->
                <div style="flex: 1;">
                    <div style="font-size: 1.5rem; color: #f59e0b; margin-bottom: 0.25rem;" id="ratingStars_${project.id}">
                        ${generateInteractiveStars(project.rating, project.id, canRate)}
                    </div>
                    <div style="color: #6b7280; font-size: 0.9rem;" id="ratingText_${project.id}">
                        ${project.rating > 0 ? `⭐ ${project.rating.toFixed(1)} out of 5 - ${project.reviews} ${project.reviews === 1 ? 'person' : 'people'} rated` : 'No ratings yet'}
                    </div>
                </div>
            </div>
            
            ${canRate ? `
            <!-- Interactive Rating Section -->
            <div style="background: #fffbeb; border: 2px solid #fbbf24; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: #92400e;">Rate this project:</div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="interactive-rating" style="display: flex; gap: 0.25rem;" id="interactiveRating_${project.id}">
                        ${[1,2,3,4,5].map(star => `
                            <button onclick="submitRating(${project.id}, ${star})" 
                                    onmouseover="highlightStars(${star}, ${project.id})" 
                                    onmouseout="resetStarHighlight(${project.id})" 
                                    class="star-button" 
                                    data-star="${star}"
                                    aria-label="Rate ${star} out of 5 stars"
                                    style="background: none; border: none; cursor: pointer; font-size: 2rem; padding: 0; transition: transform 0.2s;">
                                ☆
                            </button>
                        `).join('')}
                    </div>
                    <span style="color: #92400e; font-size: 0.9rem; font-style: italic;">Click a star to rate</span>
                </div>
            </div>
            ` : ''}
            
            <!-- Description Section -->
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #111827;">Description</h3>
            <p style="line-height: 1.8; margin-bottom: 1.5rem; color: #374151; white-space: pre-wrap;">${project.description}</p>
            
            <!-- Technologies Section -->
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827;">Technologies Used</h3>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                ${project.technologies.map(tech => `<span class="tech-badge" style="background: #e0e7ff; color: #4338ca; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.9rem; font-weight: 500;">${tech}</span>`).join('')}
            </div>
            
            <!-- Links Section -->
            ${project.github || project.demo ? `
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827;">Project Links</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
                ${project.github ? `
                <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <span style="font-weight: 600; color: #6b7280; min-width: 80px;">GitHub:</span>
                    <a href="${project.github}" target="_blank" style="flex: 1; color: #2563eb; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${project.github}">${project.github}</a>
                    <button onclick="copyToClipboard('${project.github.replace(/'/g, "\\'")}'', 'GitHub link copied!')" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; white-space: nowrap;" aria-label="Copy GitHub link to clipboard">
                        📋 Copy
                    </button>
                </div>
                ` : ''}
                ${project.demo ? `
                <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <span style="font-weight: 600; color: #6b7280; min-width: 80px;">Demo:</span>
                    <a href="${project.demo}" target="_blank" style="flex: 1; color: #2563eb; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${project.demo}">${project.demo}</a>
                    <button onclick="copyToClipboard('${project.demo.replace(/'/g, "\\'")}'', 'Demo link copied!')" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; white-space: nowrap;" aria-label="Copy demo link to clipboard">
                        📋 Copy
                    </button>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; padding-top: 1.5rem; border-top: 2px solid #e5e7eb;">
                ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-primary" style="text-decoration: none; flex: 1; min-width: 150px; text-align: center;">📂 View on GitHub</a>` : ''}
                ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-secondary" style="text-decoration: none; flex: 1; min-width: 150px; text-align: center;">🚀 Live Demo</a>` : ''}
                ${isOwnProject ? `<button onclick="closeModal('projectDetailModal'); openEditModal(${project.id});" class="btn btn-secondary" style="flex: 1; min-width: 150px;">✏️ Edit Project</button>` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('projectDetailContent').innerHTML = detailsHTML;
    document.getElementById('detailTitle').textContent = 'Project Details';
    openModal('projectDetailModal');
    
    // Update view count in background on any visible project cards
    updateProjectCardViewCount(project.id, project.views);
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '½' : '') + 
           '☆'.repeat(emptyStars);
}

/**
 * Generate interactive star rating display
 * @param {number} rating - Current average rating
 * @param {number} projectId - Project ID
 * @param {boolean} interactive - Whether to show as interactive
 * @returns {string} HTML string for stars
 */
function generateInteractiveStars(rating, projectId, interactive) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '⯨' : '') + 
           '☆'.repeat(emptyStars);
}

/**
 * Copy text to clipboard with feedback
 * @param {string} text - Text to copy
 * @param {string} message - Success message to display
 */
function copyToClipboard(text, message) {
    // Use modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message || '✓ Copied to clipboard!', 'success');
        }).catch(err => {
            // Fallback for errors
            fallbackCopyToClipboard(text, message);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text, message);
    }
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 * @param {string} message - Success message
 */
function fallbackCopyToClipboard(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast(message || '✓ Copied to clipboard!', 'success');
        } else {
            showToast('Failed to copy. Please copy manually.', 'error');
        }
    } catch (err) {
        showToast('Failed to copy. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Highlight stars on hover
 * @param {number} starCount - Number of stars to highlight (1-5)
 * @param {number} projectId - Project ID
 */
function highlightStars(starCount, projectId) {
    const container = document.getElementById(`interactiveRating_${projectId}`);
    if (!container) return;
    
    const buttons = container.querySelectorAll('.star-button');
    buttons.forEach((btn, index) => {
        if (index < starCount) {
            btn.textContent = '★';
            btn.style.color = '#f59e0b';
            btn.style.transform = 'scale(1.2)';
        } else {
            btn.textContent = '☆';
            btn.style.color = '#d1d5db';
            btn.style.transform = 'scale(1)';
        }
    });
}

/**
 * Reset star highlight to default state
 * @param {number} projectId - Project ID
 */
function resetStarHighlight(projectId) {
    const container = document.getElementById(`interactiveRating_${projectId}`);
    if (!container) return;
    
    const buttons = container.querySelectorAll('.star-button');
    buttons.forEach(btn => {
        btn.textContent = '☆';
        btn.style.color = '#d1d5db';
        btn.style.transform = 'scale(1)';
    });
}

/**
 * Submit rating for a project
 * @param {number} projectId - Project ID
 * @param {number} rating - Rating value (1-5)
 */
function submitRating(projectId, rating) {
    if (!currentUser) {
        showToast('Please sign in to rate projects', 'error');
        return;
    }
    
    const project = projectDatabase.find(p => p.id === projectId);
    if (!project) {
        showToast('Project not found', 'error');
        return;
    }
    
    // Don't allow rating own projects
    if (project.creatorId === currentUser.id) {
        showToast('You cannot rate your own project', 'error');
        return;
    }
    
    // Calculate new average rating
    const totalRating = project.rating * project.reviews;
    project.reviews++;
    project.rating = (totalRating + rating) / project.reviews;
    
    saveProjectsToStorage();
    showToast('✓ Thank you for rating!', 'success');
    
    // Update the displayed rating without closing modal
    updateRatingDisplay(projectId, project.rating, project.reviews);
    
    // Hide the rating input after submission
    const ratingSection = document.querySelector(`#interactiveRating_${projectId}`);
    if (ratingSection && ratingSection.parentElement && ratingSection.parentElement.parentElement) {
        ratingSection.parentElement.parentElement.style.display = 'none';
    }
}

/**
 * Update rating display in modal
 * @param {number} projectId - Project ID
 * @param {number} rating - New average rating
 * @param {number} reviews - Total number of reviews
 */
function updateRatingDisplay(projectId, rating, reviews) {
    const starsElement = document.getElementById(`ratingStars_${projectId}`);
    const textElement = document.getElementById(`ratingText_${projectId}`);
    
    if (starsElement) {
        starsElement.innerHTML = generateInteractiveStars(rating, projectId, false);
    }
    
    if (textElement) {
        textElement.textContent = rating > 0 ? `⭐ ${rating.toFixed(1)} out of 5 - ${reviews} ${reviews === 1 ? 'person' : 'people'} rated` : 'No ratings yet';
    }
}

/**
 * Update view count on project card in background
 * @param {number} projectId - Project ID
 * @param {number} views - New view count
 */
function updateProjectCardViewCount(projectId, views) {
    // Find all elements with view counts for this project
    const viewElements = document.querySelectorAll(`[data-project-views="${projectId}"]`);
    viewElements.forEach(el => {
        el.textContent = views;
    });
}

function rateProject(projectId) {
    if (!currentUser) {
        showToast('Please sign in to rate projects', 'error');
        return;
    }
    
    const rating = prompt('Rate this project (1-5 stars):\n1 = Poor\n2 = Fair\n3 = Good\n4 = Very Good\n5 = Excellent');
    
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        if (rating !== null) showToast('Please enter a valid rating between 1 and 5', 'error');
        return;
    }
    
    const project = projectDatabase.find(p => p.id === projectId);
    if (!project) return;
    
    // Calculate new average rating
    const totalRating = project.rating * project.reviews;
    project.reviews++;
    project.rating = (totalRating + parseFloat(rating)) / project.reviews;
    
    saveProjectsToStorage();
    showToast('Thank you for rating this project!', 'success');
    
    // Refresh the view
    viewProjectDetails(projectId);
}

function toggleBookmark(projectId) {
    if (!currentUser) {
        showToast('Please sign in to save projects', 'error');
        return;
    }
    
    const index = userBookmarks.indexOf(projectId);
    const project = projectDatabase.find(p => p.id === projectId);
    
    if (index > -1) {
        // Remove bookmark
        userBookmarks.splice(index, 1);
        if (project) project.bookmarks--;
        showToast('Removed from saved projects', 'info');
    } else {
        // Add bookmark
        userBookmarks.push(projectId);
        if (project) project.bookmarks++;
        showToast('Project saved successfully!', 'success');
    }
    
    saveProjectsToStorage();
    localStorage.setItem('projectHubBookmarks_' + currentUser.id, JSON.stringify(userBookmarks));
    
    // Refresh display
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'browse.html') {
        renderProjectGrid();
    } else if (currentPage === 'mywork.html') {
        renderUserProjects();
    }
}

function openEditModal(projectId) {
    const project = projectDatabase.find(p => p.id === projectId);
    if (!project) {
        showToast('Project not found', 'error');
        return;
    }
    
    if (!currentUser || project.creatorId !== currentUser.id) {
        showToast('You can only edit your own projects', 'error');
        return;
    }
    
    // Populate form with current values
    document.getElementById('editProjId').value = project.id;
    document.getElementById('editProjTitle').value = project.title;
    document.getElementById('editProjDesc').value = project.description;
    document.getElementById('editProjCategory').value = project.category;
    document.getElementById('editProjTech').value = project.technologies.join(', ');
    document.getElementById('editProjGithub').value = project.github || '';
    document.getElementById('editProjDemo').value = project.demo || '';
    
    // Load existing image
    if (project.image) {
        editImageData = project.image;
        const previewImg = document.getElementById('editPreviewImg');
        if (previewImg) {
            previewImg.src = project.image;
            document.getElementById('editImagePreview').style.display = 'block';
        }
    } else {
        editImageData = null;
        document.getElementById('editImagePreview').style.display = 'none';
    }
    
    openModal('editModal');
}

function handleProjectEdit(e) {
    e.preventDefault();
    
    const projectId = parseInt(document.getElementById('editProjId').value);
    const project = projectDatabase.find(p => p.id === projectId);
    
    if (!project) {
        showToast('Project not found', 'error');
        return;
    }
    
    // Validate inputs
    const title = document.getElementById('editProjTitle').value.trim();
    const description = document.getElementById('editProjDesc').value.trim();
    const category = document.getElementById('editProjCategory').value;
    const techString = document.getElementById('editProjTech').value.trim();
    
    // Title validation (minimum 10 characters)
    if (!title || title.length < 10) {
        showToast('Project title must be at least 10 characters', 'error');
        return;
    }
    
    // Description validation (minimum 10 characters)
    if (!description || description.length < 10) {
        showToast('Description must be at least 10 characters', 'error');
        return;
    }
    
    // Category validation
    if (!category) {
        showToast('Please select a category', 'error');
        return;
    }
    
    // Technologies validation
    const technologies = techString ? techString.split(',').map(t => t.trim()).filter(t => t) : [];
    if (technologies.length === 0) {
        showToast('Please add at least one technology', 'error');
        return;
    }
    
    // GitHub URL validation (optional but must be valid if provided)
    const githubUrl = document.getElementById('editProjGithub').value.trim();
    if (githubUrl && !isValidGitHubUrl(githubUrl)) {
        showToast('Please enter a valid GitHub repository URL', 'error');
        return;
    }
    
    // Demo URL validation (optional but must be valid if provided)
    const demoUrl = document.getElementById('editProjDemo').value.trim();
    if (demoUrl && !isValidUrl(demoUrl)) {
        showToast('Please enter a valid demo URL', 'error');
        return;
    }
    
    // Update project
    project.title = title;
    project.description = description;
    project.category = category;
    project.technologies = technologies;
    project.image = editImageData || project.image;
    project.imageUploadDate = editImageData ? new Date().toISOString() : project.imageUploadDate;
    project.github = githubUrl || '';
    project.demo = demoUrl || '';
    project.lastUpdated = new Date().toISOString().split('T')[0];
    
    saveProjectsToStorage();
    closeModal('editModal');
    showToast('✅ Project updated successfully!', 'success');
    
    // Reset edit image data
    editImageData = null;
    
    // Refresh display
    renderUserProjects();
}

// ============= DELETE PROJECT =============
function openDeleteModal(projectId) {
    projectToDelete = projectId;
    openModal('deleteConfirmModal');
}

function confirmDeleteProject() {
    if (projectToDelete) {
        deleteProject(projectToDelete);
    }
}

function deleteProject(projectId) {
    const projectIndex = projectDatabase.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        showToast('Project not found', 'error');
        closeModal('deleteConfirmModal');
        return;
    }
    
    const project = projectDatabase[projectIndex];
    
    if (!currentUser || project.creatorId !== currentUser.id) {
        showToast('You can only delete your own projects', 'error');
        closeModal('deleteConfirmModal');
        return;
    }
    
    // Remove from database
    projectDatabase.splice(projectIndex, 1);
    
    // Remove from bookmarks
    userBookmarks = userBookmarks.filter(id => id !== projectId);
    localStorage.setItem('projectHubBookmarks_' + currentUser.id, JSON.stringify(userBookmarks));
    
    // Save changes
    saveProjectsToStorage();
    
    closeModal('deleteConfirmModal');
    showToast('Project deleted successfully', 'success');
    
    // Refresh display
    renderUserProjects();
}

// ============= IMAGE MANAGEMENT SYSTEM =============

/**
 * Handle image upload from file input (alias for handleImageSelect)
 */
function handleImageUpload(event, mode) {
    handleImageSelect(event, mode);
}

/**
 * Handle image file selection
 */
function handleImageSelect(event, mode) {
    const file = event.target.files[0];
    if (!file) return;
    
    processImageFile(file, mode);
}

/**
 * Process and validate image file
 */
function processImageFile(file, mode) {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        showToast('Please upload a valid image file (JPG, PNG, WEBP, GIF)', 'error');
        return;
    }
    
    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        showToast(`Image too large (${sizeMB}MB). Maximum size is 5MB`, 'error');
        return;
    }
    
    // Show loading state
    const previewArea = document.getElementById(mode === 'upload' ? 'uploadImagePreview' : 'editImagePreview');
    previewArea.innerHTML = '<div class="image-loading"><div class="spinner"></div><p>Processing image...</p></div>';
    
    // Read and process image
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Validate dimensions
            if (img.width < 300 || img.height < 200) {
                showToast('Image too small. Minimum dimensions: 300x200px', 'error');
                resetImagePreview(mode);
                return;
            }
            
            // Compress and convert to Base64
            compressImage(img, file.type, (compressedBase64) => {
                if (mode === 'upload') {
                    uploadImageData = compressedBase64;
                    displayImagePreview(compressedBase64, file.name, file.size, img.width, img.height, 'upload');
                } else {
                    editImageData = compressedBase64;
                    displayImagePreview(compressedBase64, file.name, file.size, img.width, img.height, 'edit');
                }
                
                showToast('Image uploaded successfully!', 'success');
            });
        };
        img.onerror = function() {
            showToast('Failed to load image. Please try another file', 'error');
            resetImagePreview(mode);
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        showToast('Failed to read file. Please try again', 'error');
        resetImagePreview(mode);
    };
    reader.readAsDataURL(file);
}

/**
 * Compress image using Canvas API
 */
function compressImage(img, fileType, callback) {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;
    
    // Resize if image is too large
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
    }
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to JPEG for better compression (except GIF)
    const outputType = fileType === 'image/gif' ? 'image/png' : 'image/jpeg';
    const compressedBase64 = canvas.toDataURL(outputType, COMPRESSION_QUALITY);
    
    callback(compressedBase64);
}

/**
 * Display image preview in modal
 */
function displayImagePreview(base64, filename, filesize, width, height, mode) {
    const previewArea = document.getElementById(mode === 'upload' ? 'uploadImagePreview' : 'editImagePreview');
    const actionsDiv = document.getElementById(mode === 'upload' ? 'uploadImageActions' : 'editImageActions');
    const infoDiv = document.getElementById(mode === 'upload' ? 'uploadImageInfo' : 'editImageInfo');
    
    // Display image
    previewArea.innerHTML = `
        <img src="${base64}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
        <div class="image-overlay">
            <span>✏️ Edit</span>
        </div>
    `;
    
    // Show action buttons
    actionsDiv.style.display = 'flex';
    
    // Show image info
    const sizeMB = (filesize / (1024 * 1024)).toFixed(2);
    const sizeKB = (filesize / 1024).toFixed(0);
    const sizeText = filesize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
    
    infoDiv.innerHTML = `
        <strong>${filename}</strong> • ${width}x${height}px • ${sizeText}
    `;
    infoDiv.style.display = 'block';
}

/**
 * Reset image preview to default state
 */
function resetImagePreview(mode) {
    const previewArea = document.getElementById(mode === 'upload' ? 'uploadImagePreview' : 'editImagePreview');
    const actionsDiv = document.getElementById(mode === 'upload' ? 'uploadImageActions' : 'editImageActions');
    const infoDiv = document.getElementById(mode === 'upload' ? 'uploadImageInfo' : 'editImageInfo');
    
    previewArea.innerHTML = `
        <div class="image-placeholder">
            <span style="font-size: 3rem;">🖼️</span>
            <p>Click to upload or drag & drop</p>
            <small>JPG, PNG, WEBP, GIF (Max 5MB)</small>
        </div>
    `;
    
    actionsDiv.style.display = 'none';
    infoDiv.style.display = 'none';
    
    if (mode === 'upload') {
        uploadImageData = null;
        document.getElementById('projImageFile').value = '';
    } else {
        editImageData = null;
        document.getElementById('editImageFile').value = '';
    }
}

/**
 * Remove uploaded image
 */
function removeUploadImage() {
    if (confirm('Remove this image?')) {
        resetImagePreview('upload');
        showToast('Image removed', 'info');
    }
}

function removeEditImage() {
    if (confirm('Remove this image?')) {
        resetImagePreview('edit');
        showToast('Image removed', 'info');
    }
}

/**
 * Setup drag and drop for image upload
 */
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadImagePreview');
    const editArea = document.getElementById('editImagePreview');
    
    if (uploadArea) {
        setupDragDropEvents(uploadArea, 'upload');
    }
    
    if (editArea) {
        setupDragDropEvents(editArea, 'edit');
    }
}

function setupDragDropEvents(element, mode) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('drag-over');
    });
    
    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('drag-over');
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processImageFile(files[0], mode);
        }
    });
}

// Initialize drag and drop when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupDragAndDrop, 500);
});

function loadUserBookmarks() {
    if (currentUser) {
        const saved = localStorage.getItem('projectHubBookmarks_' + currentUser.id);
        userBookmarks = saved ? JSON.parse(saved) : [];
    }
}

// ============= DASHBOARD & STATS =============
function loadDashboardData() {
    if (!currentUser) {
        document.getElementById('viewsCount').textContent = '0';
        document.getElementById('projectsCount').textContent = '0';
        document.getElementById('ratingAvg').textContent = '0';
        document.getElementById('bookmarksCount').textContent = '0';
        return;
    }

    const userProjects = projectDatabase.filter(p => p.creatorId === currentUser.id);
    const totalViews = userProjects.reduce((sum, p) => sum + p.views, 0);
    const avgRating = userProjects.length > 0 ? 
        (userProjects.reduce((sum, p) => sum + p.rating, 0) / userProjects.length).toFixed(1) : '0';
    const totalBookmarks = userProjects.reduce((sum, p) => sum + p.bookmarks, 0);

    document.getElementById('viewsCount').textContent = totalViews;
    document.getElementById('projectsCount').textContent = userProjects.length;
    document.getElementById('ratingAvg').textContent = avgRating;
    document.getElementById('bookmarksCount').textContent = totalBookmarks;
}

// ============= PROFILE MANAGEMENT =============
function loadAccountData() {
    if (!currentUser) {
        alert('Please sign in to edit your profile');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('fullNameField').value = currentUser.name || '';
    document.getElementById('emailField').value = currentUser.email || '';
    document.getElementById('fieldField').value = currentUser.field || '';
    document.getElementById('bioField').value = currentUser.bio || '';
    document.getElementById('skillsField').value = currentUser.skills || '';
}

function saveProfileChanges(e) {
    e.preventDefault();
    
    currentUser.name = document.getElementById('fullNameField').value;
    currentUser.bio = document.getElementById('bioField').value;
    currentUser.skills = document.getElementById('skillsField').value;
    currentUser.field = document.getElementById('fieldField').value;

    // Update in localStorage
    const fullUser = {
        id: currentUser.id,
        email: currentUser.email,
        password: getUserByEmail(currentUser.email).password,
        name: currentUser.name,
        field: currentUser.field,
        bio: currentUser.bio,
        skills: currentUser.skills
    };
    
    updateUserInStorage(fullUser);
    saveCurrentSession(currentUser);
    updateNavigation();
    alert('✅ Profile updated successfully!');
}
