import React, { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaCheckCircle, 
  FaUsers, 
  FaVideo, 
  FaChartLine, 
  FaClock,
  FaLightbulb,
  FaGraduationCap,
  FaTrophy,
  FaRocket,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';
import Footer from './Footer';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  // State management
  const [stats, setStats] = useState({
    users: 0,
    videos: 0,
    quizzes: 0,
    successRate: 0
  });
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [isVisible, setIsVisible] = useState({});

  // Animated statistics
  const finalStats = {
    users: 5000,
    videos: 10000,
    quizzes: 15000,
    successRate: 92
  };

  // Features data
  const features = [
    {
      id: 0,
      icon: <FaVideo />,
      title: 'Segmented Learning',
      description: 'Watch videos in manageable 10-minute segments for better focus and retention',
      color: '#3a6ec4'
    },
    {
      id: 1,
      icon: <FaCheckCircle />,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with MCQs after each segment to reinforce learning',
      color: '#4ecdc4'
    },
    {
      id: 2,
      icon: <FaLightbulb />,
      title: 'AI-Powered Transcription',
      description: 'Get instant transcriptions of video content powered by Gemini API',
      color: '#ff6b6b'
    },
    {
      id: 3,
      icon: <FaChartLine />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights',
      color: '#ffd93d'
    }
  ];

  // How it works steps
  const steps = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Create your free account in seconds',
      icon: <FaUsers />
    },
    {
      step: 2,
      title: 'Choose Video',
      description: 'Paste any YouTube video URL',
      icon: <FaVideo />
    },
    {
      step: 3,
      title: 'Learn & Test',
      description: 'Watch segments and take quizzes',
      icon: <FaGraduationCap />
    },
    {
      step: 4,
      title: 'Track Progress',
      description: 'Monitor your learning achievements',
      icon: <FaTrophy />
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Software Engineer',
      avatar: 'R',
      rating: 5,
      text: 'This platform transformed how I learn from YouTube videos. The quiz feature really helps retention!'
    },
    {
      name: 'Priya Sharma',
      role: 'College Student',
      avatar: 'P',
      rating: 5,
      text: 'Breaking videos into segments makes learning so much easier. Highly recommended for students!'
    },
    {
      name: 'Amit Patel',
      role: 'Data Analyst',
      avatar: 'A',
      rating: 5,
      text: 'The transcription feature is a game-changer. I can review content anytime without rewatching.'
    }
  ];

  // FAQ data
  const faqs = [
    {
      id: 0,
      question: 'How does the video segmentation work?',
      answer: 'Our platform automatically divides videos into 10-minute segments, making it easier to learn in focused sessions without overwhelming yourself.'
    },
    {
      id: 1,
      question: 'What happens if I fail a quiz?',
      answer: 'You can retake the quiz as many times as needed. We encourage learning at your own pace until you master the content.'
    },
    {
      id: 2,
      question: 'Can I use any YouTube video?',
      answer: 'Yes! Simply paste any public YouTube video URL and start learning immediately.'
    },
    {
      id: 3,
      question: 'Is the transcription feature free?',
      answer: 'Yes, AI-powered transcription is included in all accounts at no additional cost.'
    },
    {
      id: 4,
      question: 'How accurate are the AI-generated quizzes?',
      answer: 'Our quizzes are generated using advanced AI models trained on educational content, ensuring high relevance and accuracy.'
    }
  ];

  // Animate statistics on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = {
      users: finalStats.users / steps,
      videos: finalStats.videos / steps,
      quizzes: finalStats.quizzes / steps,
      successRate: finalStats.successRate / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setStats({
          users: Math.floor(increment.users * currentStep),
          videos: Math.floor(increment.videos * currentStep),
          quizzes: Math.floor(increment.quizzes * currentStep),
          successRate: Math.floor(increment.successRate * currentStep)
        });
      } else {
        clearInterval(timer);
        setStats(finalStats);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeMessage('Successfully subscribed! Check your email.');
        setEmail('');
      } else {
        setSubscribeMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setSubscribeMessage('Network error. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Toggle FAQ
  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero} id="hero" data-animate>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Learn Smarter with
              <span className={styles.highlight}> Video Segments</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Transform any YouTube video into an interactive learning experience with 
              AI-powered quizzes, transcriptions, and progress tracking.
            </p>
            <div className={styles.heroCta}>
              <a href="/register" className={styles.primaryBtn}>
                <FaRocket />
                <span>Get Started Free</span>
              </a>
              <a href="#how-it-works" className={styles.secondaryBtn}>
                <FaPlay />
                <span>Watch Demo</span>
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.floatingCard}>
              <FaVideo className={styles.cardIcon} />
              <p>10-Minute Segments</p>
            </div>
            <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
              <FaCheckCircle className={styles.cardIcon} />
              <p>Interactive Quizzes</p>
            </div>
            <div className={`${styles.floatingCard} ${styles.floatingCard3}`}>
              <FaChartLine className={styles.cardIcon} />
              <p>Progress Analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats} id="stats" data-animate>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <FaUsers className={styles.statIcon} />
            <h3 className={styles.statNumber}>{stats.users.toLocaleString()}+</h3>
            <p className={styles.statLabel}>Active Learners</p>
          </div>
          <div className={styles.statCard}>
            <FaVideo className={styles.statIcon} />
            <h3 className={styles.statNumber}>{stats.videos.toLocaleString()}+</h3>
            <p className={styles.statLabel}>Videos Watched</p>
          </div>
          <div className={styles.statCard}>
            <FaCheckCircle className={styles.statIcon} />
            <h3 className={styles.statNumber}>{stats.quizzes.toLocaleString()}+</h3>
            <p className={styles.statLabel}>Quizzes Completed</p>
          </div>
          <div className={styles.statCard}>
            <FaTrophy className={styles.statIcon} />
            <h3 className={styles.statNumber}>{stats.successRate}%</h3>
            <p className={styles.statLabel}>Success Rate</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features" data-animate>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Powerful Features</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need for an effective learning experience
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`${styles.featureCard} ${activeFeature === feature.id ? styles.activeFeature : ''}`}
              onMouseEnter={() => setActiveFeature(feature.id)}
              style={{ '--feature-color': feature.color }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks} id="how-it-works" data-animate>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Start learning in four simple steps
          </p>
        </div>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={step.step} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.step}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {index < steps.length - 1 && (
                <FaArrowRight className={styles.stepArrow} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyChoose} id="why-choose" data-animate>
        <div className={styles.whyContent}>
          <div className={styles.whyText}>
            <h2 className={styles.sectionTitle}>Why Choose Learnify?</h2>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                <FaCheckCircle className={styles.benefitIcon} />
                <div>
                  <h4>Enhanced Focus</h4>
                  <p>10-minute segments prevent information overload and maintain concentration</p>
                </div>
              </li>
              <li className={styles.benefitItem}>
                <FaCheckCircle className={styles.benefitIcon} />
                <div>
                  <h4>Active Learning</h4>
                  <p>Interactive quizzes ensure you understand and retain the material</p>
                </div>
              </li>
              <li className={styles.benefitItem}>
                <FaCheckCircle className={styles.benefitIcon} />
                <div>
                  <h4>Time Efficient</h4>
                  <p>Learn at your own pace with flexible scheduling and progress tracking</p>
                </div>
              </li>
              <li className={styles.benefitItem}>
                <FaCheckCircle className={styles.benefitIcon} />
                <div>
                  <h4>AI-Powered</h4>
                  <p>Leverage cutting-edge AI for transcriptions and intelligent quiz generation</p>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.whyImage}>
            <div className={styles.statsHighlight}>
              <FaClock />
              <h3>10 Minutes</h3>
              <p>Optimal Learning Duration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials} id="testimonials" data-animate>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Our Users Say</h2>
          <p className={styles.sectionSubtitle}>
            Join thousands of satisfied learners
          </p>
        </div>
        <div className={styles.testimonialContainer}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialAvatar}>
              {testimonials[testimonialIndex].avatar}
            </div>
            <div className={styles.testimonialContent}>
              <div className={styles.stars}>
                {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                  <FaStar key={i} className={styles.star} />
                ))}
              </div>
              <p className={styles.testimonialText}>
                "{testimonials[testimonialIndex].text}"
              </p>
              <div className={styles.testimonialAuthor}>
                <h4>{testimonials[testimonialIndex].name}</h4>
                <p>{testimonials[testimonialIndex].role}</p>
              </div>
            </div>
          </div>
          <div className={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === testimonialIndex ? styles.activeDot : ''}`}
                onClick={() => setTestimonialIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq} id="faq" data-animate>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to know
          </p>
        </div>
        <div className={styles.faqContainer}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${activeFaq === faq.id ? styles.activeFaq : ''}`}
                onClick={() => toggleFaq(faq.id)}
              >
                <FaQuestionCircle className={styles.faqIcon} />
                <span>{faq.question}</span>
                {activeFaq === faq.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {activeFaq === faq.id && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta} id="cta" data-animate>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Learning?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of learners who are already mastering content with Learnify
          </p>
          <a href="/register" className={styles.ctaButton}>
            <FaRocket />
            <span>Start Learning Now</span>
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter} id="newsletter" data-animate>
        <div className={styles.newsletterContent}>
          <h3 className={styles.newsletterTitle}>Stay Updated</h3>
          <p className={styles.newsletterSubtitle}>
            Get the latest features and learning tips delivered to your inbox
          </p>
          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.newsletterInput}
              required
            />
            <button
              type="submit"
              className={styles.newsletterButton}
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {subscribeMessage && (
            <p className={styles.subscribeMessage}>{subscribeMessage}</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
