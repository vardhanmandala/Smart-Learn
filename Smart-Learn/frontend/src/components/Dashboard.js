import React, { useState, useEffect } from 'react';
import { 
  FaVideo, 
  FaChartLine, 
  FaTrophy,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaBookmark,
  FaSpinner,
  FaExclamationCircle,
  FaArrowRight,
  FaFire,
  FaStar
} from 'react-icons/fa';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // State management
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalVideos: 0,
    completedVideos: 0,
    quizzesTaken: 0,
    averageScore: 0,
    streakDays: 0,
    totalWatchTime: 0
  });
  const [recentVideos, setRecentVideos] = useState([]);
  const [inProgressVideos, setInProgressVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('continue'); // continue, saved, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  // Fetch user data and dashboard content on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Fetch user profile
      const userResponse = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const userData = await userResponse.json();
      setUser(userData.user);

      // Fetch user statistics
      const statsResponse = await fetch('http://localhost:5000/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent videos
      const videosResponse = await fetch('http://localhost:5000/api/user/videos/recent', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setRecentVideos(videosData.videos || []);
      }

      // Fetch in-progress videos
      const progressResponse = await fetch('http://localhost:5000/api/user/videos/in-progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setInProgressVideos(progressData.videos || []);
      }

      // Fetch saved videos
      const savedResponse = await fetch('http://localhost:5000/api/user/videos/saved', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (savedResponse.ok) {
        const savedData = await savedResponse.json();
        setSavedVideos(savedData.videos || []);
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding new video
  const handleAddVideo = async (e) => {
    e.preventDefault();
    
    if (!newVideoUrl.trim()) return;

    setIsAddingVideo(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/videos/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: newVideoUrl })
      });

      const data = await response.json();

      if (response.ok) {
        setNewVideoUrl('');
        setShowAddVideoModal(false);
        // Redirect to video player
        window.location.href = `/video/${data.videoId}`;
      } else {
        alert(data.message || 'Failed to add video');
      }
    } catch (err) {
      console.error('Add video error:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsAddingVideo(false);
    }
  };

  // Format time
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Filter videos based on search
  const getFilteredVideos = () => {
    let videos = [];
    
    switch (activeTab) {
      case 'continue':
        videos = inProgressVideos;
        break;
      case 'saved':
        videos = savedVideos;
        break;
      case 'completed':
        videos = recentVideos.filter(v => v.progress === 100);
        break;
      default:
        videos = inProgressVideos;
    }

    if (searchQuery.trim()) {
      return videos.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return videos;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.loadingSpinner} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationCircle className={styles.errorIcon} />
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}
{/* // Inside Dashboard.js, update the header section: */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            Ready to continue your learning journey?
          </p>
        </div>
        <div className={styles.headerActions}>
          {/* NEW: Report Button */}
          <button
            className={styles.reportButton}
            onClick={() => window.location.href = '/report'}
          >
            <FaChartLine />
            <span>View Report</span>
          </button>
          <button
            className={styles.addVideoButton}
            onClick={() => setShowAddVideoModal(true)}
          >
            <FaPlus />
            <span>Add New Video</span>
          </button>
        </div>
      </div>


      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#4a90e2' }}>
            <FaVideo />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Videos Watched</p>
            <h3 className={styles.statValue}>{stats.totalVideos}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#10b981' }}>
            <FaCheckCircle />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Completed</p>
            <h3 className={styles.statValue}>{stats.completedVideos}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f59e0b' }}>
            <FaTrophy />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Quizzes Taken</p>
            <h3 className={styles.statValue}>{stats.quizzesTaken}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#8b5cf6' }}>
            <FaStar />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Average Score</p>
            <h3 className={styles.statValue}>{stats.averageScore}%</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ef4444' }}>
            <FaFire />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Day Streak</p>
            <h3 className={styles.statValue}>{stats.streakDays}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#06b6d4' }}>
            <FaClock />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Watch Time</p>
            <h3 className={styles.statValue}>{formatTime(stats.totalWatchTime)}</h3>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className={styles.videosSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'continue' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('continue')}
            >
              <FaPlayCircle />
              <span>Continue Watching</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'saved' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <FaBookmark />
              <span>Saved Videos</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <FaCheckCircle />
              <span>Completed</span>
            </button>
          </div>

          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className={styles.videoGrid}>
          {getFilteredVideos().length === 0 ? (
            <div className={styles.emptyState}>
              <FaVideo className={styles.emptyIcon} />
              <h3>No videos found</h3>
              <p>
                {activeTab === 'continue' && "You haven't started any videos yet."}
                {activeTab === 'saved' && "You haven't saved any videos yet."}
                {activeTab === 'completed' && "You haven't completed any videos yet."}
              </p>
              <button 
                className={styles.emptyButton}
                onClick={() => setShowAddVideoModal(true)}
              >
                <FaPlus />
                <span>Add Your First Video</span>
              </button>
            </div>
          ) : (
            getFilteredVideos().map((video) => (
              <div key={video.id} className={styles.videoCard}>
                <div className={styles.videoThumbnail}>
                  <img src={video.thumbnail} alt={video.title} />
                  <div className={styles.videoDuration}>{formatTime(video.duration)}</div>
                  {video.progress > 0 && (
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.videoInfo}>
                  <h4 className={styles.videoTitle}>{video.title}</h4>
                  <p className={styles.videoMeta}>
                    <FaCalendar />
                    <span>{new Date(video.lastWatched).toLocaleDateString()}</span>
                  </p>
                  <div className={styles.videoStats}>
                    <span className={styles.videoStat}>
                      <FaPlayCircle />
                      {video.currentSegment}/{video.totalSegments} segments
                    </span>
                    {video.quizScore && (
                      <span className={styles.videoStat}>
                        <FaTrophy />
                        {video.quizScore}% score
                      </span>
                    )}
                  </div>
                  <button 
                    className={styles.continueButton}
                    onClick={() => window.location.href = `/video/${video.id}`}
                  >
                    <span>{video.progress === 100 ? 'Review' : 'Continue'}</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      {showAddVideoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddVideoModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add New Video</h2>
            <p className={styles.modalSubtitle}>Paste a YouTube video URL to get started</p>
            <form onSubmit={handleAddVideo} className={styles.modalForm}>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className={styles.modalInput}
                required
                disabled={isAddingVideo}
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowAddVideoModal(false)}
                  disabled={isAddingVideo}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isAddingVideo}
                >
                  {isAddingVideo ? (
                    <>
                      <FaSpinner className={styles.spinner} />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      <span>Add Video</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
