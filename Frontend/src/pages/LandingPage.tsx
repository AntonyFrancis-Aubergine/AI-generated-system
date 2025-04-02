import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="site-title">Fitness Class Booking</h1>
          <div className="header-buttons">
            <Link to="/login">
              <Button variant="outline" className="login-button">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="signup-button">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        <section className="hero-section">
          <h1 className="hero-title">Book Your Fitness Classes</h1>
          <p className="hero-subtitle">
            Join our fitness community and book classes with top instructors.
          </p>
          <Link to="/register">
            <Button className="hero-button">
              Get Started
            </Button>
          </Link>
        </section>
        
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <h2 className="feature-title">Wide Range of Classes</h2>
              <p className="feature-description">
                From yoga to high-intensity workouts, we offer a variety of classes to suit your fitness goals.
              </p>
            </div>
            
            <div className="feature-card">
              <h2 className="feature-title">Expert Instructors</h2>
              <p className="feature-description">
                Our certified instructors are passionate about helping you achieve your fitness goals.
              </p>
            </div>
            
            <div className="feature-card">
              <h2 className="feature-title">Easy Booking</h2>
              <p className="feature-description">
                Book classes anytime, anywhere with our simple and intuitive booking system.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Fitness Class Booking</h3>
            <p>
              Your one-stop platform for all your fitness class needs.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Classes</a></li>
              <li><a href="#">Instructors</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>
              123 Fitness Street<br />
              Workout City, WO 12345<br />
              info@fitnessclassbooking.com
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Fitness Class Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 