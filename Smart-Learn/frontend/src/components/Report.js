import { useEffect, useState } from 'react';

import { 
  FaTrophy, 
  FaVideo, 
  FaCheckCircle, 
  FaClock, 
  FaChartBar,
  FaSpinner,
  FaExclamationCircle,
  FaStar,
  FaFire,
  FaArrowUp,
  FaArrowDown,
  FaPlayCircle,
  FaTrash  // ← ADD THIS LINE
} from 'react-icons/fa';
import styles from './Report.module.css';

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/report', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load report');
      }

      const data = await response.json();
      setReportData(data);
      console.log('📊 Report loaded:', data);

    } catch (err) {
      console.error('Report fetch error:', err);
      setError('Failed to load report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


 // ADD DELETE FUNCTION HERE (After fetchReport, before formatTime)
const handleDeleteVideo = async (videoId, videoTitle) => {
  if (!window.confirm(`Are you sure you want to delete "${videoTitle}"?\n\nThis will also delete all associated quizzes and progress.`)) {
    return;
  }

  setIsDeleting(true);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete video');
    }

    const data = await response.json();
    console.log('✅ Video deleted:', data);

    // Refresh report data
    await fetchReport();
    
    alert(`Video "${videoTitle}" deleted successfully!`);

  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete video. Please try again.');
  } finally {
    setIsDeleting(false);
  }
};

 // EXISTING formatTime function...
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };



  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading your report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationCircle className={styles.errorIcon} />
        <h2>{error}</h2>
        <button onClick={fetchReport} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  const { overview, videoPerformance, segmentPerformance, recentActivity, scoreDistribution } = reportData;

  return (
    <div className={styles.reportPage}>
      {/* Header */}
      <div className={styles.reportHeader}>
        <h1>Learning Report</h1>
        <p>Track your progress and performance</p>
      </div>

      {/* Overview Stats */}
      <div className={styles.overviewSection}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#4a90e2' }}>
              <FaVideo />
            </div>
            <div className={styles.statContent}>
              <h3>{overview.totalVideos}</h3>
              <p>Total Videos</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#10b981' }}>
              <FaCheckCircle />
            </div>
            <div className={styles.statContent}>
              <h3>{overview.completedVideos}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f59e0b' }}>
              <FaPlayCircle />
            </div>
            <div className={styles.statContent}>
              <h3>{overview.inProgressVideos}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#8b5cf6' }}>
              <FaTrophy />
            </div>
            <div className={styles.statContent}>
              <h3>{overview.totalQuizzesTaken}</h3>
              <p>Quizzes Taken</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#06b6d4' }}>
              <FaStar />
            </div>
            <div className={styles.statContent}>
              <h3>{overview.averageScore}%</h3>
              <p>Average Score</p>
              <span className={styles.performanceLabel} style={{ color: getScoreColor(overview.averageScore) }}>
                {getPerformanceLevel(overview.averageScore)}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#ef4444' }}>
              <FaFire />
            </div>
            <div className={styles.statContent}>
              <h3>{overview.currentStreak}</h3>
              <p>Day Streak</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#ec4899' }}>
              <FaClock />
            </div>
            <div className={styles.statContent}>
              <h3>{formatTime(overview.totalWatchTimeMinutes)}</h3>
              <p>Watch Time</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#14b8a6' }}>
              <FaCheckCircle />
            </div>
            <div className={styles.statContent}>
              <h3>{overview.passRate}%</h3>
              <p>Pass Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>Recent Activity (Last 7 Days)</h2>
        <div className={styles.activityCards}>
          <div className={styles.activityCard}>
            <FaVideo className={styles.activityIcon} />
            <div className={styles.activityContent}>
              <h3>{recentActivity.videosWatchedLast7Days}</h3>
              <p>Videos Watched</p>
            </div>
          </div>
          <div className={styles.activityCard}>
            <FaTrophy className={styles.activityIcon} />
            <div className={styles.activityContent}>
              <h3>{recentActivity.quizAttemptsLast7Days}</h3>
              <p>Quiz Attempts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className={styles.distributionSection}>
        <h2 className={styles.sectionTitle}>Score Distribution</h2>
        <div className={styles.distributionGrid}>
          <div className={styles.distributionCard} style={{ borderColor: '#10b981' }}>
            <div className={styles.distributionHeader}>
              <span className={styles.distributionLabel}>90-100%</span>
              <span className={styles.distributionCount}>{scoreDistribution.scores90Plus}</span>
            </div>
            <div className={styles.distributionBar}>
              <div 
                className={styles.distributionFill} 
                style={{ 
                  width: `${(scoreDistribution.scores90Plus / overview.totalQuizAttempts * 100) || 0}%`,
                  background: '#10b981'
                }}
              />
            </div>
          </div>

          <div className={styles.distributionCard} style={{ borderColor: '#3b82f6' }}>
            <div className={styles.distributionHeader}>
              <span className={styles.distributionLabel}>80-89%</span>
              <span className={styles.distributionCount}>{scoreDistribution.scores80To89}</span>
            </div>
            <div className={styles.distributionBar}>
              <div 
                className={styles.distributionFill} 
                style={{ 
                  width: `${(scoreDistribution.scores80To89 / overview.totalQuizAttempts * 100) || 0}%`,
                  background: '#3b82f6'
                }}
              />
            </div>
          </div>

          <div className={styles.distributionCard} style={{ borderColor: '#f59e0b' }}>
            <div className={styles.distributionHeader}>
              <span className={styles.distributionLabel}>70-79%</span>
              <span className={styles.distributionCount}>{scoreDistribution.scores70To79}</span>
            </div>
            <div className={styles.distributionBar}>
              <div 
                className={styles.distributionFill} 
                style={{ 
                  width: `${(scoreDistribution.scores70To79 / overview.totalQuizAttempts * 100) || 0}%`,
                  background: '#f59e0b'
                }}
              />
            </div>
          </div>

          <div className={styles.distributionCard} style={{ borderColor: '#ef4444' }}>
            <div className={styles.distributionHeader}>
              <span className={styles.distributionLabel}>Below 70%</span>
              <span className={styles.distributionCount}>{scoreDistribution.scoresBelow70}</span>
            </div>
            <div className={styles.distributionBar}>
              <div 
                className={styles.distributionFill} 
                style={{ 
                  width: `${(scoreDistribution.scoresBelow70 / overview.totalQuizAttempts * 100) || 0}%`,
                  background: '#ef4444'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Performance */}
      <div className={styles.videoPerformanceSection}>
        <h2 className={styles.sectionTitle}>Video-wise Performance</h2>
        <div className={styles.videoPerformanceList}>
          {videoPerformance.map((video) => (
            <div key={video.videoId} className={styles.videoPerformanceCard}>
              <div className={styles.videoPerformanceHeader}>
                <img src={video.thumbnail} alt={video.title} className={styles.videoThumbnail} />
                <div className={styles.videoPerformanceInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <div className={styles.videoMetrics}>
                    <span className={styles.metric}>
                      <FaPlayCircle /> {video.completedSegments}/{video.totalSegments} segments
                    </span>
                    <span className={styles.metric}>
                      <FaTrophy /> {video.quizzesPassed}/{video.quizzesTaken} passed
                    </span>
                    <span className={styles.metric}>
                      <FaStar /> Avg: {video.averageScore}%
                    </span>
                    <span className={styles.metric}>
                      <FaClock /> {video.totalAttempts} attempts
                    </span>
                  </div>
                </div>
                <div className={styles.videoPerformanceStatus}>
                  <div className={styles.statusBadges}>
                    {video.isCompleted ? (
                      <span className={styles.completedBadge}>
                        <FaCheckCircle /> Completed
                      </span>
                    ) : (
                      <span className={styles.inProgressBadge}>
                        <FaPlayCircle /> {video.progress}%
                      </span>
                    )}
                  </div>
                  <div className={styles.videoActions}>
                    <button
                      className={styles.viewDetailsButton}
                      onClick={() => setSelectedVideo(selectedVideo === video.videoId ? null : video.videoId)}
                    >
                      {selectedVideo === video.videoId ? 'Hide Details' : 'View Details'}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteVideo(video.videoId, video.title)}
                      disabled={isDeleting}
                      title="Delete this video"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>

              {/* Segment Details */}
              {selectedVideo === video.videoId && segmentPerformance[video.videoId] && (
                <div className={styles.segmentDetails}>
                  <h4>Segment-wise Performance</h4>
                  <div className={styles.segmentGrid}>
                    {segmentPerformance[video.videoId].map((segment) => (
                      <div 
                        key={segment.segment} 
                        className={`${styles.segmentCard} ${segment.passed ? styles.segmentPassed : styles.segmentFailed}`}
                      >
                        <div className={styles.segmentHeader}>
                          <span className={styles.segmentNumber}>Segment {segment.segment + 1}</span>
                          {segment.passed ? (
                            <FaCheckCircle className={styles.segmentPassIcon} />
                          ) : (
                            <FaExclamationCircle className={styles.segmentFailIcon} />
                          )}
                        </div>
                        <div className={styles.segmentStats}>
                          <p>Attempts: {segment.attempts}</p>
                          <p>Best Score: {segment.bestScore}%</p>
                          <p>Status: {segment.passed ? 'Passed' : segment.attempts > 0 ? 'Not Passed' : 'Not Attempted'}</p>
                        </div>
                        
                        {/* Attempt History */}
                        {segment.attemptDetails.length > 0 && (
                          <div className={styles.attemptHistory}>
                            <p className={styles.attemptHistoryTitle}>Attempt History:</p>
                            {segment.attemptDetails.map((attempt, idx) => (
                              <div key={idx} className={styles.attemptItem}>
                                <span className={styles.attemptNumber}>#{idx + 1}</span>
                                <span className={styles.attemptScore} style={{ color: getScoreColor(attempt.score) }}>
                                  {attempt.score}% ({attempt.correctAnswers}/{attempt.totalQuestions})
                                </span>
                                <span className={styles.attemptStatus}>
                                  {attempt.passed ? <FaCheckCircle color="#10b981" /> : <FaExclamationCircle color="#ef4444" />}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {videoPerformance.length === 0 && (
            <div className={styles.emptyState}>
              <FaVideo className={styles.emptyIcon} />
              <p>No videos found. Start learning to see your performance!</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.reportActions}>
        <button 
          className={styles.dashboardButton}
          onClick={() => window.location.href = '/dashboard'}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Report;
