// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Optimize mobile menu toggle with passive listeners
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}, { passive: true });

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}, { passive: true }));

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}, { passive: true });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Use requestAnimationFrame for better mobile performance
            requestAnimationFrame(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });
});

// Server configuration
const SERVER_CONFIG = {
    java: {
        host: 'mc.narova.org',
        port: 25565
    },
    bedrock: {
        host: 'mc.narova.org',
        port: 19132
    }
};

// Sample player data for fallback - replace with your actual player data
const samplePlayers = [
    { name: 'AlexTheBuilder', status: 'online', playtime: '2h 15m', uuid: '12345678-1234-1234-1234-123456789abc' },
    { name: 'MinecraftPro', status: 'online', playtime: '1h 45m', uuid: '87654321-4321-4321-4321-cba987654321' },
    { name: 'RedstoneWizard', status: 'away', playtime: '3h 30m', uuid: '11111111-2222-3333-4444-555555555555' },
    { name: 'DiamondHunter', status: 'online', playtime: '45m', uuid: '66666666-7777-8888-9999-aaaaaaaaaaaa' },
    { name: 'CreeperSlayer', status: 'online', playtime: '4h 20m', uuid: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff' },
    { name: 'VillageHero', status: 'away', playtime: '1h 10m', uuid: 'gggggggg-hhhh-iiii-jjjj-kkkkkkkkkkkk' },
    { name: 'NetherExplorer', status: 'online', playtime: '2h 55m', uuid: 'llllllll-mmmm-nnnn-oooo-pppppppppppp' },
    { name: 'EndDragon', status: 'online', playtime: '6h 15m', uuid: 'qqqqqqqq-rrrr-ssss-tttt-uuuuuuuuuuuu' }
];

// Server status tracking
let serverStatus = {
    online: false,
    lastChecked: null,
    offlineModalShown: false
};

// Generate gradient colors for player avatars
function generateGradient(name) {
    const colors = [
        ['#FF6B6B', '#4ECDC4'],
        ['#45B7D1', '#96CEB4'],
        ['#FFEAA7', '#DDA0DD'],
        ['#A8E6CF', '#DCEDC8'],
        ['#FFD93D', '#FF6B6B'],
        ['#6C5CE7', '#A29BFE'],
        ['#FD79A8', '#FDCB6E'],
        ['#00B894', '#00CEC9']
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

// Create player avatar with gradient background
function createPlayerAvatar(name) {
    const gradients = generateGradient(name);
    const initials = name.substring(0, 2).toUpperCase();
    
    const avatar = document.createElement('div');
    avatar.className = 'player-avatar';
    avatar.style.background = `linear-gradient(135deg, ${gradients[0]}, ${gradients[1]})`;
    avatar.textContent = initials;
    
    return avatar;
}

// Format playtime from minutes to readable format
function formatPlaytime(minutes) {
    if (!minutes || minutes < 0) return '0m';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    } else {
        return `${mins}m`;
    }
}

// Update server status indicator
function updateServerStatusIndicator(status, message = '') {
    const statusBadge = document.getElementById('server-status-badge');
    if (!statusBadge) return;
    
    // Remove existing classes
    statusBadge.classList.remove('online', 'offline', 'checking');
    
    // Add appropriate class and update content
    switch (status) {
        case 'online':
            statusBadge.classList.add('online');
            statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="status-text">Online</span>';
            break;
        case 'offline':
            statusBadge.classList.add('offline');
            statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="status-text">Offline</span>';
            break;
        case 'checking':
            statusBadge.classList.add('checking');
            statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="status-text">Checking...</span>';
            break;
        default:
            statusBadge.classList.add('checking');
            statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="status-text">Unknown</span>';
    }
}

// Show offline modal
function showOfflineModal() {
    // Temporarily disabled during development
    return;
    
    if (serverStatus.offlineModalShown) return;
    
    const modal = document.getElementById('server-offline-modal');
    if (modal) {
        modal.style.display = 'block';
        serverStatus.offlineModalShown = true;
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            closeOfflineModal();
        }, 10000);
    }
}

// Close offline modal
function closeOfflineModal() {
    const modal = document.getElementById('server-offline-modal');
    if (modal) {
        modal.style.display = 'none';
        serverStatus.offlineModalShown = false;
    }
}

// Refresh server status
function refreshServerStatus() {
    updateServerStatusIndicator('checking');
    populatePlayersTable();
}

// Fetch server status and player list
async function fetchServerStatus() {
    try {
        // Try to fetch from a Minecraft server status API
        // You can replace this URL with your own API endpoint
        const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_CONFIG.java.host}:${SERVER_CONFIG.java.port}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch server status');
        }
        
        const data = await response.json();
        
        if (data.online) {
            serverStatus.online = true;
            serverStatus.lastChecked = new Date();
            updateServerStatusIndicator('online');
            
            return {
                online: true,
                players: data.players?.list || [],
                maxPlayers: data.players?.max || 0,
                currentPlayers: data.players?.online || 0,
                motd: data.motd?.clean || 'Welcome to our Minecraft Server!'
            };
        } else {
            serverStatus.online = false;
            serverStatus.lastChecked = new Date();
            updateServerStatusIndicator('offline');
            
            // Show offline modal if server was previously online
            if (!serverStatus.offlineModalShown) {
                setTimeout(() => {
                    showOfflineModal();
                }, 2000);
            }
            
            return {
                online: false,
                players: [],
                maxPlayers: 0,
                currentPlayers: 0,
                motd: 'Server is offline'
            };
        }
    } catch (error) {
        console.log('Using fallback player data:', error.message);
        
        // If we can't reach the API, assume server is offline
        serverStatus.online = false;
        serverStatus.lastChecked = new Date();
        updateServerStatusIndicator('offline');
        
        // Show offline modal
        if (!serverStatus.offlineModalShown) {
            setTimeout(() => {
                showOfflineModal();
            }, 2000);
        }
        
        // Return fallback data if API fails
        return {
            online: true,
            players: samplePlayers,
            maxPlayers: 100,
            currentPlayers: samplePlayers.length,
            motd: 'Welcome to our Minecraft Server!'
        };
    }
}

// Update player count display
function updatePlayerCount(current, max) {
    const playerCountElement = document.querySelector('.player-count');
    if (playerCountElement) {
        playerCountElement.textContent = `${current}/${max}`;
    }
}

// Populate players table with real data
async function populatePlayersTable() {
    const playersList = document.getElementById('players-list');
    const loadingElement = document.querySelector('.players-loading');
    
    // Show loading state
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    try {
        const serverData = await fetchServerStatus();
        
        // Clear existing players
        playersList.innerHTML = '';
        
        if (serverData.online && serverData.players.length > 0) {
            // Add each player to the table
            serverData.players.forEach(player => {
                const row = document.createElement('tr');
                
                const profileCell = document.createElement('td');
                const profile = document.createElement('div');
                profile.className = 'player-profile';
                
                const avatar = createPlayerAvatar(player.name);
                const nameSpan = document.createElement('span');
                nameSpan.className = 'player-name';
                nameSpan.textContent = player.name;
                
                profile.appendChild(avatar);
                profile.appendChild(nameSpan);
                profileCell.appendChild(profile);
                
                const statusCell = document.createElement('td');
                const statusSpan = document.createElement('span');
                statusSpan.className = 'player-status status-online';
                statusSpan.textContent = 'online';
                statusCell.appendChild(statusSpan);
                
                const playtimeCell = document.createElement('td');
                // Use actual playtime if available, otherwise show "Active"
                const playtime = player.playtime ? formatPlaytime(player.playtime) : 'Active';
                playtimeCell.textContent = playtime;
                
                row.appendChild(profileCell);
                row.appendChild(statusCell);
                row.appendChild(playtimeCell);
                
                playersList.appendChild(row);
            });
            
            // Update player count
            updatePlayerCount(serverData.currentPlayers, serverData.maxPlayers);
            
        } else {
            // Show offline message
            const offlineRow = document.createElement('tr');
            offlineRow.innerHTML = `
                <td colspan="3" style="text-align: center; padding: 40px; color: #86868b;">
                    <i class="fas fa-wifi-slash" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    <p>No players online</p>
                    <small>Server may be offline or no players are currently connected</small>
                </td>
            `;
            playersList.appendChild(offlineRow);
            
            updatePlayerCount(0, serverData.maxPlayers);
        }
        
    } catch (error) {
        console.error('Error fetching player data:', error);
        
        // Show error message
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `
            <td colspan="3" style="text-align: center; padding: 40px; color: #86868b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <p>Unable to load player data</p>
                <small>Please try again later</small>
            </td>
        `;
        playersList.appendChild(errorRow);
        
        updatePlayerCount(0, 0);
    } finally {
        // Hide loading state
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Auto-refresh player list every 30 seconds
function startPlayerListRefresh() {
    setInterval(() => {
        populatePlayersTable();
    }, 30000); // 30 seconds
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Server address copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Server address copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy address', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#34C759' : type === 'error' ? '#FF3B30' : '#007AFF'};
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Join Java server functionality
function joinJava() {
    // Check if server is offline
    if (!serverStatus.online) {
        showNotification('Server is currently offline. Please try again later.', 'error');
        return;
    }
    
    // Check if we're on a desktop platform
    const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    if (isDesktop) {
        // Try to launch Minecraft using the minecraft:// protocol
        try {
            window.location.href = `minecraft://connect/${SERVER_CONFIG.java.host}:${SERVER_CONFIG.java.port}`;
            
            // Fallback: show instructions if protocol doesn't work
            setTimeout(() => {
                showNotification('If Minecraft doesn\'t open automatically, please copy the server address and add it manually.', 'info');
            }, 2000);
        } catch (error) {
            showNotification('Please copy the server address and add it to Minecraft manually.', 'info');
        }
    } else {
        showNotification('Please use the desktop version of Minecraft to join Java servers.', 'info');
    }
}

// Join Bedrock server functionality
function joinBedrock() {
    // Check if server is offline
    if (!serverStatus.online) {
        showNotification('Server is currently offline. Please try again later.', 'error');
        return;
    }
    
    const modal = document.getElementById('bedrock-modal');
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('bedrock-modal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('bedrock-modal');
    const offlineModal = document.getElementById('server-offline-modal');
    
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    
    if (event.target === offlineModal) {
        closeOfflineModal();
    }
});

// Close modal with X button
document.querySelector('.close').addEventListener('click', closeModal);

// Scroll to join section
function scrollToJoin() {
    const joinSection = document.getElementById('join');
    joinSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Enhanced navbar background change on scroll with liquid glass effect
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        // Scrolled down - enhance the liquid glass effect
        navbar.style.background = 'rgba(255, 255, 255, 0.4)';
        navbar.style.backdropFilter = 'blur(35px) saturate(200%)';
        navbar.style.webkitBackdropFilter = 'blur(35px) saturate(200%)';
        navbar.style.boxShadow = `
            0 12px 40px rgba(0, 0, 0, 0.12),
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 -1px 0 rgba(255, 255, 255, 0.5) inset
        `;
        navbar.style.transform = 'translateX(-50%) translateY(0)';
        navbar.style.border = '1px solid rgba(255, 255, 255, 0.4)';
    } else {
        // At top - lighter liquid glass effect
        navbar.style.background = 'rgba(255, 255, 255, 0.25)';
        navbar.style.backdropFilter = 'blur(30px) saturate(180%)';
        navbar.style.webkitBackdropFilter = 'blur(30px) saturate(180%)';
        navbar.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 1px 0 rgba(255, 255, 255, 0.8) inset,
            0 -1px 0 rgba(255, 255, 255, 0.4) inset
        `;
        navbar.style.transform = 'translateX(-50%) translateY(0)';
        navbar.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    }
    
    // Add subtle parallax effect
    if (scrollY > 50) {
        navbar.style.transform = `translateX(-50%) translateY(${Math.min(scrollY * 0.1, 10)}px)`;
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Placeholder functions for privacy policy and terms of service
function showPrivacyPolicy() {
    showNotification('Privacy Policy page would open here', 'info');
}

function showTermsOfService() {
    showNotification('Terms of Service page would open here', 'info');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Optimize for mobile devices
    const isMobile = window.innerWidth <= 768;
    
    // Initialize server status
    updateServerStatusIndicator('checking');
    
    // Initialize player list
    populatePlayersTable();
    
    // Start auto-refresh (less frequent on mobile for better performance)
    if (!isMobile) {
        startPlayerListRefresh();
    } else {
        // Mobile: refresh every 30 seconds instead of 15
        setInterval(populatePlayersTable, 30000);
    }
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .join-card, .staff-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add liquid glass hover effects to nav links (desktop only)
    if (!isMobile) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-1px) scale(1.02)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
});

// Add some interactive hover effects (desktop only)
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        // Add hover effect to player rows
        const playerRows = document.querySelectorAll('.players-table tbody tr');
        playerRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = '#f8f9fa';
                row.style.transform = 'scale(1.01)';
            });
            
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
                row.style.transform = '';
            });
        });
        
        // Add click effect to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = '';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    } else {
        // Mobile: Add touch feedback for buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }
}); 