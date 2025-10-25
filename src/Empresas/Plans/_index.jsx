import React, { useState } from "react";
import {
  Clock,
  Users,
  Calendar,
  CheckCircle,
  Star,
  TrendingUp,
  Smartphone,
  Zap,
  Menu,
  X,
} from "lucide-react";

const TonsusLandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode integrar com sua API de captura de leads
    console.log("Lead capturado:", formData);
    alert("Obrigado pelo interesse! Entraremos em contato em breve.");
    setFormData({ name: "", email: "" });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      <div className="content-wrapper">
        <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ffffff;
          background: #0a0a0a;
          overflow-x: hidden;
        }

        .landing-page {
          width: 100%;
          min-height: 100vh;
          position: relative;
        }

        /* Animated Background para seções */
        .section-with-bg {
          position: relative;
          overflow: hidden;
        }

        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          background: linear-gradient(180deg, #0a0a14 0%, #151530 30%, #1e2250 50%, #151530 70%, #0a0a14 100%);
        }
        
        .animated-bg::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-10%, -10%) scale(1.1);
            opacity: 0.6;
          }
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          opacity: 0.4;
          filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.8));
          animation: float 20s infinite ease-in-out;
        }

        .shape:nth-child(1) {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
          animation-duration: 25s;
        }

        .shape:nth-child(2) {
          top: 60%;
          left: 80%;
          animation-delay: 5s;
          animation-duration: 30s;
        }

        .shape:nth-child(3) {
          top: 40%;
          left: 60%;
          animation-delay: 10s;
          animation-duration: 35s;
        }

        .shape:nth-child(4) {
          top: 80%;
          left: 20%;
          animation-delay: 15s;
          animation-duration: 28s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .light-beam {
          position: absolute;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.7), transparent);
          box-shadow: 0 0 30px rgba(59, 130, 246, 1), 0 0 60px rgba(59, 130, 246, 0.5);
          animation: beamMove 8s linear infinite;
        }

        @keyframes beamMove {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(59, 130, 246, 1);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(59, 130, 246, 1), 0 0 40px rgba(59, 130, 246, 0.5);
          animation: particleFloat 15s infinite ease-in-out;
        }

        .particle:nth-child(odd) {
          background: rgba(147, 51, 234, 1);
          box-shadow: 0 0 20px rgba(147, 51, 234, 1), 0 0 40px rgba(147, 51, 234, 0.5);
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        /* Barber pole stripes - Padrão clássico de barbeiro */
        .barber-stripes {
          position: absolute;
          top: -100%;
          left: -50%;
          width: 200%;
          height: 300%;
          background: repeating-linear-gradient(
            -45deg,
            #ffffff 0px,
            #ffffff 150px,
            #3b82f6 150px,
            #3b82f6 300px,
            #ffffff 300px,
            #ffffff 450px,
            #ef4444 450px,
            #ef4444 600px
          );
          opacity: 0.2;
          animation: barberPoleMove 30s linear infinite;
        }

        @keyframes barberPoleMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-600px);
          }
        }

        @keyframes stripeMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(320px); }
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
        }

        /* Header */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-desktop {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #d1d5db;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
          cursor: pointer;
        }

        .nav-link:hover {
          color: #3b82f6;
        }

        .cta-button {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 10, 10, 0.98);
          z-index: 999;
          padding: 6rem 2rem 2rem;
          flex-direction: column;
          gap: 2rem;
        }

        .mobile-menu.open {
          display: flex;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          padding: 8rem 2rem 4rem;
        }

        .hero-content {
          max-width: 1200px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          margin-bottom: 2rem;
          color: #3b82f6;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff, #a0a0a0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-slogan {
          font-size: 1.5rem;
          color: #3b82f6;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #d1d5db;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .hero-cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-primary {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
        }

        .cta-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #3b82f6;
        }

        /* Features Section */
        .features {
          padding: 6rem 2rem;
          background: #0a0a0a;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #9ca3af;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.05));
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 2rem;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .feature-description {
          color: #9ca3af;
          line-height: 1.6;
        }

        /* Differential Section */
        .differential {
          padding: 6rem 2rem;
          background: #0a0a0a;
          position: relative;
        }

        .differential .container {
          position: relative;
          z-index: 1;
        }

        .differential-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .differential-text h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .differential-text p {
          color: #bdc4d1ff;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .differential-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .diff-feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(0, 1, 3, 0.2);
          padding: 1rem;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .diff-feature-icon {
          color: #3b83f6ff;
        }

        .differential-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          position: relative;
          overflow: hidden;
        }

        .phone-mockup {
          width: 340px;
          height: 680px;
          background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
          border-radius: 45px;
          padding: 12px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #1e1e1e;
          border-radius: 38px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .phone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 25px;
          background: #1e1e1e;
          border-radius: 0 0 20px 20px;
          z-index: 10;
        }

        .phone-header {
          background: #2c2c2c;
          padding: 2.5rem 1.5rem 1.2rem;
          text-align: center;
        }

        .phone-header h3 {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
        }

        .phone-content {
          flex: 1;
          background: #2c2c2c;
          overflow-y: auto;
        }

        .queue-card {
          background: linear-gradient(135deg, #4169E1, #6B8FFF);
          margin: 1rem 1.5rem;
          padding: 2.5rem 1.5rem 2rem;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(65, 105, 225, 0.3);
        }

        .queue-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.2rem;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .queue-number {
          font-size: 2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 0.3rem;
          line-height: 1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .queue-label {
          font-size: 1.0rem;
          color: #ffffff;
          margin-bottom: 1.8rem;
          font-weight: 500;
        }

        .time-estimate {
          background: rgba(255, 255, 255, 0.25);
          padding: 0.9rem 1.8rem;
          border-radius: 50px;
          font-weight: 600;
          color: #ffffff;
          font-size: 0.65rem;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .phone-info {
          padding: 1.5rem;
          color: #9ca3af;
          background: #2c2c2c;
        }

        .info-section {
          background: #3a3a3a;
          padding: 1.2rem;
          border-radius: 16px;
          margin-bottom: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-section h4 {
          color: #ffffff;
          font-size: 0.95rem;
          margin-bottom: 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
        }

        .info-section p {
          color: #a0a0a0;
          font-size: 0.88rem;
          margin: 0;
          line-height: 1.5;
        }

        .info-section p + p {
          margin-top: 0.7rem;
        }

        .schedule-info {
          background: #3a3a3a;
          padding: 1.2rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .schedule-info h4 {
          color: #ffffff;
          font-size: 0.95rem;
          margin-bottom: 0.6rem;
          font-weight: 600;
        }

        .schedule-info p {
          color: #a0a0a0;
          font-size: 0.88rem;
          margin: 0;
        }

        /* Testimonials */
        .testimonials {
          padding: 6rem 2rem;
          background: #0a0a0a;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .testimonial-card {
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.05));
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 2rem;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .testimonial-text {
          color: #d1d5db;
          font-style: italic;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .author-info h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .author-info p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        /* Pricing */
        .pricing {
          padding: 6rem 2rem;
          background: #0a0a0a;
          position: relative;
        }

        .pricing .container {
          position: relative;
          z-index: 1;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .pricing-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          padding: 2.5rem;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }

        .pricing-card.featured {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(59, 131, 246, 0.24));
          border: 2px solid #3b82f6;
          transform: scale(1.05);
        }

        .pricing-badge {
          position: absolute;
          top: -15px;
          right: 20px;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .pricing-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
        }

        .plan-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .plan-description {
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }

        .plan-price {
          font-size: 3rem;
          font-weight: 900;
          color: #3b82f6;
          margin-bottom: 0.5rem;
        }

        .plan-price span {
          font-size: 1rem;
          color: #9ca3af;
        }

        .plan-features {
          list-style: none;
          margin: 2rem 0;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #d1d5db;
        }

        .plan-features svg {
          color: #3b82f6;
          flex-shrink: 0;
        }

        /* FAQ */
        .faq {
          padding: 6rem 2rem;
          background: #0a0a0a;
        }

        .faq-list {
          max-width: 800px;
          margin: 4rem auto 0;
        }

        .faq-item {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          text-align: left;
          padding: 1.5rem;
          background: none;
          border: none;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s;
        }

        .faq-question:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, padding 0.3s;
          padding: 0 1.5rem;
          color: #9ca3af;
          line-height: 1.6;
        }

        .faq-answer.open {
          max-height: 300px;
          padding: 0 1.5rem 1.5rem;
        }

        /* Contact Form */
        .contact {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
        }

        .contact-form {
          max-width: 600px;
          margin: 4rem auto 0;
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          padding: 3rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #d1d5db;
        }

        .form-group input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: border-color 0.3s, background 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.08);
        }

        .submit-button {
          width: 100%;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 1rem 2rem;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.3s;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
        }

        /* Footer */
        .footer {
          background: #000000;
          padding: 3rem 2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          margin-bottom: 1rem;
          color: #3b82f6;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section ul li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-section a:hover {
          color: #3b82f6;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          color: #6b7280;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-desktop {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .hero-slogan {
            font-size: 1.2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .differential-content {
            grid-template-columns: 1fr;
          }

          .differential-text h2 {
            font-size: 2rem;
          }

          .pricing-card.featured {
            transform: scale(1);
          }

          .hero-cta-group {
            flex-direction: column;
          }

          .cta-primary, .cta-secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo">TONSUS</div>
            <nav className="nav-desktop">
              <a
                onClick={() => scrollToSection("features")}
                className="nav-link"
              >
                Funcionalidades
              </a>
              <a
                onClick={() => scrollToSection("pricing")}
                className="nav-link"
              >
                Preços
              </a>
              <a
                onClick={() => scrollToSection("testimonials")}
                className="nav-link"
              >
                Depoimentos
              </a>
              <a onClick={() => scrollToSection("faq")} className="nav-link">
                FAQ
              </a>
              <a href="https://www.tonsus.com.br/create" className="cta-button">
                Começar Agora
              </a>
            </nav>
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <a onClick={() => scrollToSection("features")} className="nav-link">
            Funcionalidades
          </a>
          <a onClick={() => scrollToSection("pricing")} className="nav-link">
            Preços
          </a>
          <a
            onClick={() => scrollToSection("testimonials")}
            className="nav-link"
          >
            Depoimentos
          </a>
          <a onClick={() => scrollToSection("faq")} className="nav-link">
            FAQ
          </a>
          <a href="https://www.tonsus.com.br/create" className="cta-button">
            Começar Agora
          </a>
        </div>

        {/* Hero Section */}
        <section className="hero section-with-bg">
          <div className="animated-bg">
            <div className="barber-stripes"></div>
          </div>
          <div className="hero-content">
            <h1>
              Sua barbearia
              <br />
              no próximo nível
            </h1>
            <p className="hero-slogan">
              Os serviços da sua barbearia e tudo mais em um só lugar
            </p>
            <p className="hero-description">
              Mostre a fila em tempo real para seus clientes! Eles veem quantas
              pessoas estão esperando e o tempo estimado de atendimento — sem
              precisar ligar.{" "}
              <strong>Mais clientes, menos ligações, mais crescimento!</strong>
            </p>
            <div className="hero-badge">
              A revolução no gerenciamento de barbearias
            </div>
            <div className="hero-cta-group">
              <a
                href="https://www.tonsus.com.br/create"
                className="cta-primary"
              >
                Criar Conta Grátis
              </a>
              <button
                className="cta-secondary"
                onClick={() => scrollToSection("features")}
              >
                Ver Funcionalidades
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="container">
            <h2 className="section-title">
              Funcionalidades que fazem a diferença
            </h2>
            <p className="section-subtitle">
              Tudo que você precisa para gerenciar sua barbearia de forma
              profissional e eficiente
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Users size={32} color="white" />
                </div>
                <h3 className="feature-title">Fila em Tempo Real</h3>
                <p className="feature-description">
                  Seus clientes veem quantas pessoas estão na fila, direto do
                  celular. Acabou a confusão de ligações perguntando "quanto
                  tempo falta?".
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Clock size={32} color="white" />
                </div>
                <h3 className="feature-title">Previsão de Atendimento</h3>
                <p className="feature-description">
                  Estimativa inteligente do tempo de espera. Seus clientes
                  decidem quando ir com base em informações reais.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Calendar size={32} color="white" />
                </div>
                <h3 className="feature-title">Agendamento Inteligente</h3>
                <p className="feature-description">
                  Sistema completo de agendamentos para quem prefere marcar
                  horário. Notificações automáticas e gestão simplificada.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Smartphone size={32} color="white" />
                </div>
                <h3 className="feature-title">Acesso pelo Celular</h3>
                <p className="feature-description">
                  Seus clientes acessam direto pelo navegador e podem salvar
                  como ícone na tela inicial. Acompanham fila, tempo de espera e
                  agendamentos facilmente.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <TrendingUp size={32} color="white" />
                </div>
                <h3 className="feature-title">Aumente seu Faturamento</h3>
                <p className="feature-description">
                  Com transparência na fila, mais clientes visitam sua
                  barbearia. Menos desistências, mais cadeiras ocupadas.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Zap size={32} color="white" />
                </div>
                <h3 className="feature-title">Rápido e Fácil</h3>
                <p className="feature-description">
                  Interface simples e intuitiva. Configure sua barbearia em
                  minutos e comece a usar imediatamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Differential Section */}
        <section className="differential section-with-bg">
          <div className="animated-bg">
            <div className="barber-stripes"></div>
          </div>
          <div className="container">
            <div className="differential-content">
              <div className="differential-text">
                <h2>O único sistema com controle de fila para barbearias</h2>
                <p>
                  Enquanto outras plataformas só oferecem agendamento, o{" "}
                  <strong>Tonsus</strong> é pioneiro em mostrar a fila em tempo
                  real para seus clientes.
                </p>
                <p>
                  Perfeito para barbearias que atendem por ordem de chegada ou
                  que mesclam fila e agendamento. Seus clientes sabem exatamente
                  quando ir.
                </p>
                <div className="differential-features">
                  <div className="diff-feature">
                    <CheckCircle className="diff-feature-icon" size={24} />
                    <span>Primeira plataforma com fila em tempo real</span>
                  </div>
                  <div className="diff-feature">
                    <CheckCircle className="diff-feature-icon" size={24} />
                    <span>Ideal para barbearias sem agendamento</span>
                  </div>
                  <div className="diff-feature">
                    <CheckCircle className="diff-feature-icon" size={24} />
                    <span>Reduz ligações e aumenta visitação</span>
                  </div>
                  <div className="diff-feature">
                    <CheckCircle className="diff-feature-icon" size={24} />
                    <span>Funciona com ou sem agendamento</span>
                  </div>
                </div>
              </div>
              <div className="differential-visual">
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="phone-notch"></div>
                    <div className="phone-header">
                      <h3>Fila de atendimento</h3>
                    </div>
                    <div className="phone-content">
                      <div className="queue-card">
                        <div className="queue-number">3</div>
                        <div className="queue-label">pessoas na fila</div>
                        <div className="time-estimate">
                          <Clock size={20} strokeWidth={2.5} />
                          Tempo médio de espera: 45 minutos
                        </div>
                      </div>
                      <div className="phone-info">
                        <div className="info-section">
                          <h4>
                            <span style={{ fontSize: "1.3rem" }}>💈</span> Como
                            funciona?
                          </h4>
                          <p>
                            Ao entrar na fila, você receberá uma notificação
                            quando estiver próximo de ser atendido.
                          </p>
                          <p>
                            Você não pode entrar na fila por aqui pois o
                            barbeiro está no controle, compareça ao local para
                            ser atendido!
                          </p>
                        </div>
                        <div className="schedule-info">
                          <h4>Horário de atendimento</h4>
                          <p>Das 08:00h às 18:00h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="testimonials">
          <div className="container">
            <h2 className="section-title">O que nossos clientes dizem</h2>
            <p className="section-subtitle">
              Barbeiros que já transformaram seus negócios com o Tonsus
            </p>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="stars">
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                </div>
                <p className="testimonial-text">
                  "O Tonsus resolveu um problema gigante da minha barbearia.
                  Antes os clientes ligavam o tempo todo perguntando sobre a
                  fila. Agora eles veem tudo pelo celular e vêm na hora certa.
                  Aumentei meu faturamento em 30%!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">RC</div>
                  <div className="author-info">
                    <h4>Ricardo Costa</h4>
                    <p>Barbearia Costa Premium</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="stars">
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                </div>
                <p className="testimonial-text">
                  "Simples demais! Configurei tudo em 10 minutos. Meus clientes
                  amaram poder ver a fila antes de sair de casa. Não sei como
                  vivia sem isso antes."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">MS</div>
                  <div className="author-info">
                    <h4>Marcos Silva</h4>
                    <p>Barbearia Estilo Urbano</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="stars">
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                  <Star size={20} fill="#fbbf24" />
                </div>
                <p className="testimonial-text">
                  "A transparência da fila em tempo real mudou o jogo. Menos
                  desistências, mais clientes satisfeitos. O site é lindo e meus
                  clientes adoram usar pelo celular!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">PF</div>
                  <div className="author-info">
                    <h4>Paulo Ferreira</h4>
                    <p>The Barber's House</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="pricing section-with-bg">
          <div className="animated-bg">
            <div className="barber-stripes"></div>
          </div>
          <div className="container">
            <h2 className="section-title">Planos que cabem no seu bolso</h2>
            <p className="section-subtitle">
              Escolha o plano ideal para o tamanho da sua barbearia
            </p>
            <div className="pricing-grid">
              <div className="pricing-card">
                <h3 className="plan-name">Starter</h3>
                <p className="plan-description">Para barbearias iniciantes</p>
                <div className="plan-price">
                  R$ 29,90<span>/mês</span>
                </div>
                <ul className="plan-features">
                  <li>
                    <CheckCircle size={20} /> Até 3 barbeiros
                  </li>
                  <li>
                    <CheckCircle size={20} /> Fila em tempo real
                  </li>
                  <li>
                    <CheckCircle size={20} /> Agendamentos ilimitados
                  </li>
                  <li>
                    <CheckCircle size={20} /> Acesso web para clientes
                  </li>
                  <li>
                    <CheckCircle size={20} /> Suporte por email
                  </li>
                </ul>
                <a
                  href="https://www.tonsus.com.br/create"
                  className="cta-primary"
                >
                  Começar Agora
                </a>
              </div>
              <div className="pricing-card featured">
                <div className="pricing-badge">Mais Popular</div>
                <h3 className="plan-name">Professional</h3>
                <p className="plan-description">
                  Para barbearias em crescimento
                </p>
                <div className="plan-price">
                  R$ 49,90<span>/mês</span>
                </div>
                <ul className="plan-features">
                  <li>
                    <CheckCircle size={20} /> Até 8 barbeiros
                  </li>
                  <li>
                    <CheckCircle size={20} /> Fila em tempo real
                  </li>
                  <li>
                    <CheckCircle size={20} /> Agendamentos ilimitados
                  </li>
                  <li>
                    <CheckCircle size={20} /> Acesso web para clientes
                  </li>
                  <li>
                    <CheckCircle size={20} /> Relatórios e análises
                  </li>
                  <li>
                    <CheckCircle size={20} /> Marketing automático
                  </li>
                  <li>
                    <CheckCircle size={20} /> Suporte prioritário
                  </li>
                </ul>
                <a
                  href="https://www.tonsus.com.br/create"
                  className="cta-primary"
                >
                  Começar Agora
                </a>
              </div>
              <div className="pricing-card">
                <h3 className="plan-name">Enterprise</h3>
                <p className="plan-description">Para redes de barbearias</p>
                <div className="plan-price">Customizado</div>
                <ul className="plan-features">
                  <li>
                    <CheckCircle size={20} /> Barbeiros ilimitados
                  </li>
                  <li>
                    <CheckCircle size={20} /> Múltiplas unidades
                  </li>
                  <li>
                    <CheckCircle size={20} /> Todas as funcionalidades
                  </li>
                  <li>
                    <CheckCircle size={20} /> API personalizada
                  </li>
                  <li>
                    <CheckCircle size={20} /> Treinamento dedicado
                  </li>
                  <li>
                    <CheckCircle size={20} /> Gerente de conta
                  </li>
                  <li>
                    <CheckCircle size={20} /> Suporte 24/7
                  </li>
                </ul>
                <button
                  className="cta-primary"
                  onClick={() => scrollToSection("contact")}
                >
                  Falar com Vendas
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq">
          <div className="container">
            <h2 className="section-title">Perguntas Frequentes</h2>
            <p className="section-subtitle">Tire suas dúvidas sobre o Tonsus</p>
            <div className="faq-list">
              {[
                {
                  question: "Como funciona o controle de fila em tempo real?",
                  answer:
                    "Quando um cliente chega, você adiciona ele na fila pelo sistema. Automaticamente, todos os clientes que acessarem o site conseguem ver quantas pessoas estão na fila e o tempo estimado de atendimento. É atualizado em tempo real!",
                },
                {
                  question: "Preciso ter conhecimento técnico para usar?",
                  answer:
                    "Não! O Tonsus foi feito pensando em você. A interface é super simples e intuitiva. Em poucos minutos você configura tudo e já começa a usar. Oferecemos também tutoriais em vídeo e suporte para te ajudar.",
                },
                {
                  question: "Meus clientes precisam baixar algum app?",
                  answer:
                    "Não! Seus clientes acessam direto pelo navegador do celular, sem precisar instalar nada. Mas se quiserem, podem salvar como ícone na tela inicial para acesso rápido, como se fosse um app.",
                },
                {
                  question:
                    "Funciona para barbearia que não trabalha com agendamento?",
                  answer:
                    "Sim! Esse é nosso diferencial. O Tonsus foi criado justamente pensando em barbearias que atendem por ordem de chegada. Você pode usar só a funcionalidade de fila, só agendamento, ou ambos!",
                },
                {
                  question: "Posso testar antes de assinar?",
                  answer:
                    "Claro! Oferecemos 14 dias de teste grátis, sem precisar de cartão de crédito. Você testa todas as funcionalidades e decide se quer continuar.",
                },
                {
                  question: "Como funciona o cancelamento?",
                  answer:
                    "Você pode cancelar quando quiser, sem multa ou burocracia. É só acessar sua conta e cancelar. Simples assim!",
                },
              ].map((item, index) => (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() =>
                      setActiveQuestion(activeQuestion === index ? null : index)
                    }
                  >
                    {item.question}
                    <span>{activeQuestion === index ? "−" : "+"}</span>
                  </button>
                  <div
                    className={`faq-answer ${
                      activeQuestion === index ? "open" : ""
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>TONSUS</h3>
              <p style={{ color: "#9ca3af", marginTop: "1rem" }}>
                A plataforma completa de gerenciamento para barbearias modernas.
              </p>
            </div>
            <div className="footer-section">
              <h3>Produto</h3>
              <ul>
                <li>
                  <a href="#features">Funcionalidades</a>
                </li>
                <li>
                  <a href="#pricing">Preços</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#testimonials">Depoimentos</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Empresa</h3>
              <ul>
                <li>
                  <a href="#about">Sobre nós</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#contact">Contato</a>
                </li>
                <li>
                  <a href="#careers">Carreiras</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li>
                  <a
                    href="https://www.tonsus.com.br/faq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tonsus.com.br/faq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tonsus.com.br/faq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Tonsus. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TonsusLandingPage;
