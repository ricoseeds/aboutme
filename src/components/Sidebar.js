import React, { useState, useEffect, useMemo } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeLink, setActiveLink] = useState('about');
  
  // Define links first to avoid the initialization error
  const mainLinks = useMemo(() => [
    { id: 'about', title: 'About Me', icon: 'bi-person' },
    { id: 'education', title: 'Education', icon: 'bi-mortarboard' },
    { id: 'projects', title: 'Projects', icon: 'bi-code-square' },
    { id: 'experience', title: 'Work Experience', icon: 'bi-briefcase' },
    { id: 'publications', title: 'Publications', icon: 'bi-journal-text' },
    { id: 'contact', title: 'Contact', icon: 'bi-envelope' },
    { id: 'schedule', title: 'Schedule', icon: 'bi-calendar-check' }
  ], []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Completely revised scroll detection approach
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Check each section in reverse order (bottom to top)
      // This ensures we highlight the correct section when scrolling down
      for (let i = mainLinks.length - 1; i >= 0; i--) {
        const sectionId = mainLinks[i].id;
        const section = document.getElementById(sectionId);
        
        if (section) {
          const rect = section.getBoundingClientRect();
          
          // If a significant portion of the section is visible, mark it as active
          // For the last section (Schedule), be more lenient with detection
          if (sectionId === 'schedule') {
            if (rect.top < viewportHeight && rect.bottom > 0) {
              setActiveLink(sectionId);
              break;
            }
          } else {
            // For other sections, require at least 30% visibility
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const visiblePercentage = visibleHeight / rect.height;
            
            if (visiblePercentage > 0.3) {
              setActiveLink(sectionId);
              break;
            }
          }
        }
      }
    };
    
    // Run handleScroll on initial load
    handleScroll();
    
    // Add event listener for scrolling
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mainLinks]);

  const externalLinks = [
    { id: 'hobbies', title: 'Hobbies', url: '#', icon: 'bi-heart' },
    { id: 'journal', title: 'Journal', url: '#', icon: 'bi-journal' },
    { id: 'blog', title: 'Blog', url: '#', icon: 'bi-rss' }
  ];

  const handleNavClick = (linkId) => {
    setActiveLink(linkId);
  };

  const handleExternalClick = (e, link) => {
    e.preventDefault();
    // In a real app, you would have actual URLs here
    alert(`The ${link.title} page will be available soon!`);
  };

  // Mobile Navigation
  if (isMobile) {
    return (
      <Navbar bg="white" expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">Argha Chakraborty</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {mainLinks.map(link => (
                <Nav.Link 
                  key={link.id} 
                  as={Link} 
                  to={`/#${link.id}`}
                  className={activeLink === link.id ? 'active px-3' : 'px-3'}
                  onClick={() => handleNavClick(link.id)}
                >
                  <i className={`bi ${link.icon} me-2`}></i>
                  {link.title}
                </Nav.Link>
              ))}
              <div className="border-top my-2 d-lg-none"></div>
              {externalLinks.map(link => (
                <Nav.Link 
                  key={link.id} 
                  href={link.url}
                  onClick={(e) => handleExternalClick(e, link)}
                  className="text-muted px-3 d-lg-none"
                >
                  <i className={`bi ${link.icon} me-2`}></i>
                  {link.title}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  // Desktop Sidebar
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 shadow-sm" style={{ width: '280px', height: '100vh', position: 'fixed' }}>
      <Nav className="flex-column sidebar-nav">
        {mainLinks.map(link => (
          <Nav.Link 
            key={link.id} 
            as={Link} 
            to={`/#${link.id}`} 
            className={`nav-link-custom mb-2 ${activeLink === link.id ? 'active' : ''}`}
            onClick={() => handleNavClick(link.id)}
          >
            <div className="d-flex align-items-center">
              <i className={`bi ${link.icon} me-3`}></i>
              <span>{link.title}</span>
            </div>
          </Nav.Link>
        ))}
        
        <div className="text-muted small text-uppercase px-3 my-3">
          External Links
        </div>
        
        {externalLinks.map(link => (
          <Nav.Link 
            key={link.id} 
            href={link.url} 
            className="nav-link-custom text-muted mb-2"
            onClick={(e) => handleExternalClick(e, link)}
          >
            <div className="d-flex align-items-center">
              <i className={`bi ${link.icon} me-3`}></i>
              <span>{link.title}</span>
            </div>
          </Nav.Link>
        ))}
      </Nav>
      
      <div className="mt-auto pt-3 border-top text-center text-muted small">
        <p className="mb-0">&copy; {new Date().getFullYear()} Argha Chakraborty</p>
        <div className="social-icons mt-2">
          <a href="https://github.com" className="me-2"><i className="bi bi-github"></i></a>
          <a href="https://linkedin.com" className="me-2"><i className="bi bi-linkedin"></i></a>
          <a href="https://twitter.com" className="me-2"><i className="bi bi-twitter"></i></a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 