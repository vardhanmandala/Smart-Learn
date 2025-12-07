import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHome, 
  FaInfoCircle, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaChevronDown,
  FaVideo,
  FaChartBar,
  FaBookmark
} from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
  // State Management
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const userMenuRef = useRef(null);

  // Navigation Links Configuration
  const navLinks = [
    { id: 'home', label: 'Home', icon: <FaHome />, route: '/', public: true },
    { id: 'about', label: 'About', icon: <FaInfoCircle />, route: '/about', public: true },
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar />, route: '/dashboard', public: false },
  ];

  const authLinks = [
    { id: 'login', label: 'Login', icon: <FaSignInAlt />, route: '/login' },
    { id: 'register', label: 'Register', icon: <FaUserPlus />, route: '/register' },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'Profile', icon: <FaUser />, route: '/profile' },
    { id: 'saved', label: 'Saved Videos', icon: <FaBookmark />, route: '/saved' },
    { id: 'settings', label: 'Settings', icon: <FaCog />, route: '/settings' },
  ];

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch user authentication status from backend
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          fetchNotifications(token);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch notifications count from backend
  const fetchNotifications = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications/count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      localStorage.removeItem('token');
      setUser(null);
      setIsUserMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  // Handle link click
  const handleLinkClick = (linkId) => {
    setActiveLink(linkId);
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Render navigation links
  const renderNavLinks = () => {
    return navLinks
      .filter(link => link.public || user)
      .map(link => (
        <li
          key={link.id}
          className={`${styles.navItem} ${activeLink === link.id ? styles.active : ''}`}
        >
          <a
            href={link.route}
            className={styles.navLink}
            onClick={() => handleLinkClick(link.id)}
          >
            <span className={styles.navIcon}>{link.icon}</span>
            <span className={styles.navLabel}>{link.label}</span>
          </a>
        </li>
      ));
  };

  // Render auth buttons
  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className={styles.userSection}>
          {/* Notifications */}
          <button className={styles.iconButton} onClick={() => window.location.href = '/notifications'}>
            <FaBell />
            {notifications > 0 && (
              <span className={styles.notificationBadge}>{notifications}</span>
            )}
          </button>

          {/* User Menu */}
          <div className={styles.userMenu} ref={userMenuRef}>
            <button
              className={styles.userButton}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className={styles.userAvatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className={styles.userName}>{user.name}</span>
              <FaChevronDown className={`${styles.chevron} ${isUserMenuOpen ? styles.chevronRotate : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className={styles.userDropdown}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatarLarge}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userDetails}>
                    <p className={styles.userNameLarge}>{user.name}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                </div>
                <div className={styles.dropdownDivider}></div>
                {userMenuItems.map(item => (
                  <a
                    key={item.id}
                    href={item.route}
                    className={styles.dropdownItem}
                  >
                    <span className={styles.dropdownIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
                <div className={styles.dropdownDivider}></div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.authButtons}>
        {authLinks.map(link => (
          <a
            key={link.id}
            href={link.route}
            className={`${styles.authButton} ${link.id === 'register' ? styles.primaryButton : ''}`}
          >
            <span className={styles.authIcon}>{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <nav className={`${styles.navbar} ${styles.loading}`}>
        <div className={styles.loadingBar}></div>
      </nav>
    );
  }

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Brand/Logo */}
        <div className={styles.brand}>
          <a href="/" className={styles.logoLink}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🎓</span>
              <span className={styles.logoText}>Learnify</span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {renderNavLinks()}
        </ul>

        {/* Auth/User Section */}
        <div className={styles.rightSection}>
          {renderAuthButtons()}
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenu}>
            <ul className={styles.mobileNavLinks}>
              {renderNavLinks()}
            </ul>
            <div className={styles.mobileAuthSection}>
              {user ? (
                <>
                  <div className={styles.mobileUserInfo}>
                    <div className={styles.mobileAvatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.mobileUserName}>{user.name}</p>
                      <p className={styles.mobileUserEmail}>{user.email}</p>
                    </div>
                  </div>
                  {userMenuItems.map(item => (
                    <a key={item.id} href={item.route} className={styles.mobileMenuItem}>
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  ))}
                  <button onClick={handleLogout} className={styles.mobileLogoutButton}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                authLinks.map(link => (
                  <a key={link.id} href={link.route} className={styles.mobileAuthButton}>
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
