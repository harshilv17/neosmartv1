'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subtle parallax effect on orbs
    const handleMouseMove = (e) => {
      const orbs = document.querySelectorAll('.gradient-orb');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        
        orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✨ Thanks! We\'ll notify you when we launch.');
        setIsError(false);
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Unable to connect. Please try again later.');
      setIsError(true);
    } finally {
      setIsLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  return (
    <>
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="noise-overlay"></div>
      
      <main className="container">
        <div className="content">
          <div className="logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">NeoSmart Labs</span>
          </div>
          
          <h1 className="title">
            <span className="title-small">We&apos;re crafting</span>
            <span className="title-large">Something <span className="gradient-text">Amazing</span></span>
          </h1>
          
          <p className="description">
            Our team is working hard to bring you an extraordinary experience. 
            Get notified when we launch.
          </p>

          <form className="notify-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="email"
                id="emailInput"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" className="submit-btn" disabled={isLoading}>
                <span>{isLoading ? 'Sending...' : 'Notify Me'}</span>
                <span className="btn-icon">→</span>
              </button>
            </div>
            {message && (
              <p className={`form-message ${isError ? 'error' : 'success'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
        
        <footer className="footer">
          <p>© 2026 NeoSmart Labs. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
