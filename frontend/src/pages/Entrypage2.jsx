


import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Calendar,
  UserCheck,
  ClipboardList,
  Bell,
  Shield,
  CreditCard,
  ArrowRight,
  Phone,
  Sparkles,
  Activity,
  Users,
  Zap,
  Clock,
  Lock,
  Check,
  AlertTriangle,
  MessageCircle,
  Target,
  ChevronRight,
  Star,
  Stethoscope,
  Brain,
  Pill,
  Thermometer,
  Eye,
  Home,
  FileText,
  RefreshCw,
  TrendingUp,
  Cloud,
  Cpu,
} from 'lucide-react';

const SmartHospitalLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const heroRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update active section based on scroll
      const sections = [
        'hero',
        'why',
        'journey',
        'precare',
        'postcare',
        'for',
        'emergency',
        'trust',
        'cta',
      ];
      const currentSection = sections.find((section) => {
        const el = sectionRefs.current[section];
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Custom cursor effect
  const [cursorVariant, setCursorVariant] = useState('default');

  // Particle systems for different sections
  const heroParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
  }));

  // Section backgrounds with consistent gradient but unique patterns
  const sectionBackgrounds = {
    hero: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
    why: 'conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 25%, rgba(20, 184, 166, 0.05) 50%, transparent 75%, rgba(16, 185, 129, 0.05) 100%)',
    journey:
      'linear-gradient(45deg, rgba(16, 185, 129, 0.03) 0%, transparent 50%, rgba(20, 184, 166, 0.03) 100%)',
    precare:
      'radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.08) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(20, 184, 166, 0.08) 0%, transparent 40%)',
    postcare:
      'conic-gradient(from 180deg at 50% 50%, rgba(20, 184, 166, 0.06) 0%, transparent 30%, rgba(16, 185, 129, 0.06) 60%, transparent 90%)',
    for: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, transparent 30%, rgba(20, 184, 166, 0.04) 70%, transparent 100%)',
    emergency:
      'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.15) 0%, transparent 60%)',
    trust:
      'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(16, 185, 129, 0.02) 2px, rgba(16, 185, 129, 0.02) 4px)',
    cta: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.15) 30%, transparent 70%)',
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            backgroundPosition: `${scrollY * 0.5}px ${scrollY * 0.5}px`,
          }}
        />
      </div>

      {/* Navigation - Enhanced with scroll indicator */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-30" />
              <span className="relative text-xl font-light tracking-wider text-emerald-300">
                PrioCare
              </span>
            </div>

            {/* Scroll Progress Indicator */}
            <div className="hidden lg:block w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{
                  width: `${
                    (scrollY /
                      (document.body.scrollHeight - window.innerHeight)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-light">
            {[
              'Why PrioCare',
              'How It Works',
              'Pre & Post Care',
              'Emergency',
            ].map((item, i) => (
              <a
                key={i}
                href={`#${item
                  .toLowerCase()
                  .replace(/ & /g, '')
                  .replace(/ /g, '')}`}
                className="relative group hover:text-white transition-colors"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <button className="group relative px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-light hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Book Visit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section - Enhanced with 3D depth */}
      <section
        ref={(el) => (sectionRefs.current.hero = el)}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: sectionBackgrounds.hero }}
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-slow"
              style={{
                background: `radial-gradient(circle at center, ${
                  i === 0
                    ? 'rgba(16, 185, 129, 0.4)'
                    : i === 1
                    ? 'rgba(20, 184, 166, 0.3)'
                    : 'rgba(56, 189, 248, 0.2)'
                } 0%, transparent 70%)`,
                left: `${20 + i * 30}%`,
                top: `${10 + i * 25}%`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}

          {/* Animated Particles */}
          {heroParticles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: 'linear-gradient(45deg, #10b981, #0d9488)',
                animation: `float-particle ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
                boxShadow: '0 0 10px #10b981',
              }}
            />
          ))}

          {/* Interactive Glow */}
          <div
            className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
            style={{
              left: `${mousePos.x - 192}px`,
              top: `${mousePos.y - 192}px`,
            }}
          />
        </div>

        {/* Floating UI Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            {
              icon: Heart,
              top: '15%',
              left: '8%',
              color: 'emerald',
              size: 'lg',
            },
            {
              icon: Brain,
              top: '12%',
              right: '10%',
              color: 'teal',
              size: 'md',
            },
            {
              icon: Pill,
              bottom: '20%',
              left: '15%',
              color: 'cyan',
              size: 'md',
            },
            {
              icon: Thermometer,
              bottom: '15%',
              right: '12%',
              color: 'emerald',
              size: 'lg',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                animation: `float-3d 6s ease-in-out infinite`,
                animationDelay: `${i * 1.5}s`,
              }}
            >
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-${item.color}-500/20 rounded-2xl blur-xl`}
                />
                <div
                  className={`relative ${
                    item.size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'
                  } backdrop-blur-xl bg-white/5 rounded-2xl border border-${
                    item.color
                  }-400/20 flex items-center justify-center`}
                >
                  <item.icon
                    className={`${
                      item.size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'
                    } text-${item.color}-400`}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-12">
            {/* Glowing Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-8 animate-glow-pulse">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                REIMAGINING HEALTHCARE
              </span>
            </div>

            {/* Main Headline with Gradient Mask */}
            <div className="relative">
              <h1 className="text-7xl md:text-8xl font-light leading-tight mb-8">
                <span className="block mb-6 opacity-90">Healthcare That</span>
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 blur-xl opacity-50" />
                  <span className="relative bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Feels Human
                  </span>
                </span>
              </h1>

              {/* Animated Underline */}
              <div className="relative w-64 h-1 mx-auto mt-8">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 animate-shimmer" />
              </div>
            </div>

            {/* Description */}
            <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
              Where your needs come first, care feels personal, and every step
              is guided
            </p>

            {/* CTA Buttons with Enhanced Effects */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-16">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-medium tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <span className="relative flex items-center gap-3">
                  Begin Your Journey
                  <div className="relative w-6 h-6">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </span>
              </button>

              <button className="group relative px-10 py-5 backdrop-blur-xl bg-white/5 rounded-2xl border border-emerald-400/20 text-gray-300 font-medium transition-all duration-500 hover:bg-white/10 hover:text-white hover:border-emerald-400/40">
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Talk to Someone
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-16 flex flex-wrap justify-center gap-8 items-center opacity-80">
              {[
                { icon: Shield, label: 'Secure & Private' },
                { icon: Clock, label: '24/7 Support' },
                { icon: Users, label: 'Expert Team' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative w-6 h-10 rounded-full border-2 border-emerald-400/30 flex justify-center p-1">
              <div className="w-1 h-3 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={(el) => (sectionRefs.current.why = el)}
        id="why"
        className="relative py-32 px-6"
        style={{ background: sectionBackgrounds.why }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Connection Lines */}
          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-10">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                WHY WE'RE DIFFERENT
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Care That Truly{' '}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 blur-xl opacity-30" />
                <span className="relative text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                  Understands You
                </span>
              </span>
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              We've reimagined healthcare from the ground up, focusing on what
              truly matters to you
            </p>

            {/* Connection Dots */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          </div>

          {/* Circular Feature Matrix */}
          <div className="relative min-h-[600px]">
            {/* Animated Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute border border-emerald-400/10 rounded-full animate-spin-slow"
                  style={{
                    width: `${300 + i * 150}px`,
                    height: `${300 + i * 150}px`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                    animationDuration: `${20 + i * 5}s`,
                  }}
                />
              ))}
            </div>

            {/* Central Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl" />
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full border border-emerald-400/20 backdrop-blur-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-emerald-400 font-light mb-2">
                      4x
                    </div>
                    <div className="text-sm text-gray-400 font-light">
                      Better Experience
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features in Orbital Layout - Fixed Positioning */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  icon: Clock,
                  title: 'No More Waiting',
                  description:
                    'Priority-based scheduling gets you care when you need it most',
                  stats: '60% less wait time',
                  color: 'emerald',
                  position: 'top',
                },
                {
                  icon: MessageCircle,
                  title: 'Always Clear',
                  description:
                    'Every step explained simply, no medical jargon confusion',
                  stats: '95% understanding rate',
                  color: 'teal',
                  position: 'right',
                },
                {
                  icon: Target,
                  title: 'Right Care, Right Time',
                  description:
                    'Urgent needs get immediate attention, always prioritized',
                  stats: '24/7 priority access',
                  color: 'cyan',
                  position: 'left',
                },
                {
                  icon: Shield,
                  title: 'Everything Together',
                  description:
                    'All your care needs in one secure, easy-to-use place',
                  stats: 'One unified platform',
                  color: 'blue',
                  position: 'bottom',
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="group perspective-1000"
                  style={{
                    gridArea:
                      benefit.position === 'top'
                        ? '1 / 2 / 2 / 3'
                        : benefit.position === 'right'
                        ? '2 / 3 / 3 / 4'
                        : benefit.position === 'bottom'
                        ? '3 / 2 / 4 / 3'
                        : benefit.position === 'left'
                        ? '2 / 1 / 3 / 2'
                        : '',
                  }}
                >
                  <div className="relative transform-gpu transition-all duration-700 hover:rotate-y-12">
                    {/* Hover Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Feature Card */}
                    <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 transform-gpu transition-all duration-500 group-hover:scale-105 group-hover:border-emerald-400/40">
                      {/* Orbital Position Indicator */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>

                      {/* Icon with Glow */}
                      <div className="relative w-20 h-20 mx-auto mb-8">
                        <div
                          className={`absolute inset-0 bg-${benefit.color}-500/20 rounded-2xl blur-md`}
                        />
                        <div
                          className={`relative w-full h-full bg-${benefit.color}-500/10 rounded-2xl border border-${benefit.color}-400/20 flex items-center justify-center`}
                        >
                          <benefit.icon
                            className={`w-10 h-10 text-${benefit.color}-400`}
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-light text-white mb-4 text-center">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400 text-center font-light leading-relaxed mb-6">
                        {benefit.description}
                      </p>

                      {/* Stats Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-light">
                          {benefit.stats}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your Journey - Enhanced Timeline - FIXED */}
      <section
        ref={(el) => (sectionRefs.current.journey = el)}
        id="journey"
        className="relative py-40 px-6 overflow-hidden"
        style={{ background: sectionBackgrounds.journey }}
      >
        {/* Animated DNA Strand Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2310b981' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              animation: 'background-scroll 20s linear infinite',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-8">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                YOUR CARE PATHWAY
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              A Journey Designed
              <span className="block mt-4 text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                Just For You
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              From first contact to ongoing wellness, every step is thoughtfully
              planned
            </p>
          </div>

          {/* Enhanced Timeline - FIXED LAYOUT */}
          <div className="relative">
            {/* Central Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/20 via-teal-500/20 to-cyan-500/20 -translate-x-1/2" />

            {/* Timeline Items - Fixed Container */}
            <div className="space-y-24 lg:space-y-32">
              {[
                {
                  step: '01',
                  icon: Calendar,
                  title: 'Smart Scheduling',
                  description:
                    'Tell us what you need, and we match you with the perfect time and care',
                  color: 'emerald',
                  position: 'left',
                },
                {
                  step: '02',
                  icon: UserCheck,
                  title: 'Meet Your Team',
                  description:
                    'Get introduced to healthcare professionals who understand your needs',
                  color: 'teal',
                  position: 'right',
                },
                {
                  step: '03',
                  icon: Heart,
                  title: 'Personalized Care',
                  description:
                    "Receive care that's tailored specifically to you and your situation",
                  color: 'cyan',
                  position: 'left',
                },
                {
                  step: '04',
                  icon: Bell,
                  title: 'Ongoing Support',
                  description:
                    'We stay with you, providing continuous care and monitoring progress',
                  color: 'blue',
                  position: 'right',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative ${
                    item.position === 'left'
                      ? 'lg:mr-auto lg:pr-8'
                      : 'lg:ml-auto lg:pl-8'
                  }`}
                >
                  {/* Timeline Node - Fixed Positioning */}
                  <div
                    className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-6 h-6 z-20"
                    style={{
                      left:
                        item.position === 'left' ? 'calc(100% + 20px)' : 'auto',
                      right:
                        item.position === 'right'
                          ? 'calc(100% + 20px)'
                          : 'auto',
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                      <div className="relative w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-black" />
                    </div>
                  </div>

                  {/* Content Card with Fixed Max Width */}
                  <div
                    className="relative group max-w-2xl mx-auto lg:mx-0"
                    style={{
                      marginLeft: item.position === 'left' ? '0' : 'auto',
                      marginRight: item.position === 'right' ? '0' : 'auto',
                    }}
                  >
                    {/* Connection Line - Fixed */}
                    <div
                      className="hidden lg:block absolute top-1/2 -translate-y-1/2 h-0.5 z-10"
                      style={{
                        left: item.position === 'left' ? '100%' : 'auto',
                        right: item.position === 'right' ? '100%' : 'auto',
                        width: '40px',
                        background:
                          item.position === 'left'
                            ? 'linear-gradient(to right, rgba(16, 185, 129, 0.2), transparent)'
                            : 'linear-gradient(to left, rgba(16, 185, 129, 0.2), transparent)',
                      }}
                    />

                    <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 transform-gpu transition-all duration-500 hover:scale-[1.02] hover:border-emerald-400/30">
                      {/* Step Badge */}
                      <div className="absolute -top-4 left-8">
                        <div
                          className={`px-4 py-2 bg-${item.color}-500/20 backdrop-blur-xl rounded-full border border-${item.color}-400/20`}
                        >
                          <span
                            className={`text-sm font-medium text-${item.color}-400`}
                          >
                            Step {item.step}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row items-start gap-6">
                        {/* Icon */}
                        <div
                          className={`w-16 h-16 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-400/20 flex items-center justify-center flex-shrink-0`}
                        >
                          <item.icon
                            className={`w-8 h-8 text-${item.color}-400`}
                            strokeWidth={1.5}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-light text-white mb-4">
                            {item.title}
                          </h3>
                          <p className="text-gray-300 font-light leading-relaxed mb-6">
                            {item.description}
                          </p>

                          {/* Progress Bar */}
                          <div className="pt-6 border-t border-gray-800/30">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-400 font-light">
                                Progress
                              </span>
                              <span
                                className={`text-${item.color}-400 font-light`}
                              >
                                {(index + 1) * 25}% Complete
                              </span>
                            </div>
                            <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`}
                                style={{ width: `${(index + 1) * 25}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Connection Node */}
                      <div className="lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                          <div className="relative w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-2 border-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Connection Line */}
            <div className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/20 via-teal-500/20 to-cyan-500/20 -translate-x-1/2" />
          </div>

          {/* Journey Summary CTA */}
          <div className="mt-24 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-b from-emerald-500/5 to-transparent backdrop-blur-sm border border-emerald-400/10 rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="text-left">
                <h4 className="text-xl font-light text-white mb-3">
                  Ready to Begin Your Journey?
                </h4>
                <p className="text-gray-400 text-sm font-light">
                  Each step builds upon the last, creating a seamless continuum
                  of care
                </p>
              </div>
              <button className="group relative px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-light hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden whitespace-nowrap">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  Start Your Journey
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Care Section - New Section */}
      <section
        ref={(el) => (sectionRefs.current.precare = el)}
        id="precare"
        className="relative py-32 px-6"
        style={{ background: sectionBackgrounds.precare }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-10">
              <Eye className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                BEFORE YOUR VISIT
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Preparing You For
              <span className="block mt-4 text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                Better Care
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Everything you need to feel prepared, informed, and confident
              before your visit
            </p>
          </div>

          {/* Pre-Care Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Clear Instructions',
                description:
                  'Simple, step-by-step guidance on what to expect and how to prepare',
                color: 'emerald',
              },
              {
                icon: Home,
                title: 'Home Preparation',
                description:
                  'Tips to get your home ready for recovery and ongoing care',
                color: 'teal',
              },
              {
                icon: Brain,
                title: 'Peace of Mind',
                description:
                  'Know exactly what will happen, reducing anxiety and uncertainty',
                color: 'cyan',
              },
            ].map((step, i) => (
              <div key={i} className="group relative">
                <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 transform-gpu transition-all duration-500 hover:scale-105 hover:border-emerald-400/30">
                  {/* Number Badge */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg font-medium shadow-lg">
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-${step.color}-500/10 to-${step.color}-600/10 border border-${step.color}-400/20 flex items-center justify-center`}
                  >
                    <step.icon
                      className={`w-10 h-10 text-${step.color}-400`}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-light text-white mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-center font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Post-Care Section - New Section */}
      <section
        ref={(el) => (sectionRefs.current.postcare = el)}
        id="postcare"
        className="relative py-32 px-6"
        style={{ background: sectionBackgrounds.postcare }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-10">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                AFTER YOUR VISIT
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Care That Continues
              <span className="block mt-4 text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                Beyond The Visit
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Ongoing support, monitoring, and guidance for lasting wellness
            </p>
          </div>

          {/* Post-Care Support */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Features */}
            <div className="space-y-8">
              {[
                {
                  icon: Bell,
                  title: 'Follow-up Check-ins',
                  description:
                    'Regular calls and messages to monitor your recovery progress',
                  color: 'emerald',
                },
                {
                  icon: MessageCircle,
                  title: '24/7 Support',
                  description:
                    'Always available to answer questions and provide guidance',
                  color: 'teal',
                },
                {
                  icon: TrendingUp,
                  title: 'Progress Tracking',
                  description:
                    'Visual tracking of your recovery milestones and improvements',
                  color: 'cyan',
                },
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 transform-gpu transition-all duration-500 hover:border-emerald-400/30">
                    <div className="flex items-start gap-6">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/10 border border-${feature.color}-400/20 flex items-center justify-center flex-shrink-0`}
                      >
                        <feature.icon
                          className={`w-7 h-7 text-${feature.color}-400`}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-light text-white mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-300 font-light">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative w-full aspect-square">
                {/* Animated Recovery Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 border-4 border-emerald-400/10 rounded-full animate-pulse" />

                    {/* Progress Ring */}
                    <div
                      className="absolute inset-8 border-4 border-transparent rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, #10b981 0% 75%, transparent 75% 100%)`,
                        WebkitMask:
                          'radial-gradient(circle, transparent 60%, black 61%)',
                        mask: 'radial-gradient(circle, transparent 60%, black 61%)',
                      }}
                    />

                    {/* Center Content */}
                    <div className="absolute inset-16 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-full border border-emerald-400/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-emerald-400 font-light mb-2">
                          75%
                        </div>
                        <div className="text-sm text-gray-400 font-light">
                          Recovery Progress
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-xl rounded-full border border-teal-400/20 animate-float-slow" />
                <div
                  className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-full border border-emerald-400/20 animate-float-slow"
                  style={{ animationDelay: '1s' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For - Enhanced */}
      <section
        ref={(el) => (sectionRefs.current.for = el)}
        className="relative py-32 px-6"
        style={{ background: sectionBackgrounds.for }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-10">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                DESIGNED FOR EVERYONE
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Healthcare That Works
              <span className="block mt-4 text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                For Your Life
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Whether you're managing ongoing needs or seeking occasional care
            </p>
          </div>

          {/* Stacked Cards */}
          <div className="relative max-w-4xl mx-auto">
            {[
              {
                title: 'For Patients',
                description: 'Get care that adapts to your life and schedule',
                icon: Heart,
                color: 'emerald',
                offset: '0',
              },
              {
                title: 'For Families',
                description:
                  "Stay connected and informed about loved ones' care",
                icon: Users,
                color: 'teal',
                offset: '8',
              },
              {
                title: 'For Care Teams',
                description: 'Coordinate better care with clear communication',
                icon: UserCheck,
                color: 'cyan',
                offset: '16',
              },
            ].map((role, i) => (
              <div
                key={i}
                className="group relative mb-8 last:mb-0"
                style={{ transform: `translateY(${role.offset}px)` }}
              >
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 transform-gpu transition-all duration-500 hover:scale-105 hover:border-emerald-400/30 hover:z-10">
                  {/* Stack Shadow */}
                  <div className="absolute -bottom-4 left-4 right-4 h-4 bg-gradient-to-t from-emerald-500/5 to-transparent rounded-b-3xl blur-sm" />

                  <div className="flex items-center gap-6">
                    {/* Icon */}
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${role.color}-500/10 to-${role.color}-600/10 border border-${role.color}-400/20 flex items-center justify-center flex-shrink-0`}
                    >
                      <role.icon
                        className={`w-10 h-10 text-${role.color}-400`}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-3xl font-light text-white mb-3">
                        {role.title}
                      </h3>
                      <p className="text-gray-300 text-lg font-light">
                        {role.description}
                      </p>
                    </div>

                    {/* Indicator */}
                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section - Enhanced */}
      <section
        ref={(el) => (sectionRefs.current.emergency = el)}
        id="emergency"
        className="relative py-32 px-6 overflow-hidden"
        style={{ background: sectionBackgrounds.emergency }}
      >
        {/* Emergency Pulse Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-red-950/20" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-red-400/10 rounded-full animate-emergency-pulse"
              style={{
                animationDelay: `${i * 0.5}s`,
                transform: `scale(${1 + i * 0.2})`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Emergency Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-red-400/20 mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                <AlertTriangle className="relative w-6 h-6 text-red-400" />
              </div>
              <span className="text-red-400 text-sm font-medium tracking-wider uppercase">
                IMMEDIATE CARE AVAILABLE
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              When You Need Help
              <span className="block mt-4 text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
                Right Now
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-12">
              <p className="text-2xl text-gray-300 font-light leading-relaxed">
                Our system ensures urgent cases get immediate attention with
                clear communication every step
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: Activity,
                    title: 'Instant Response',
                    description:
                      'Urgent needs are identified and prioritized immediately',
                    color: 'red',
                  },
                  {
                    icon: MessageCircle,
                    title: 'Live Updates',
                    description:
                      'Real-time information about your care and next steps',
                    color: 'orange',
                  },
                  {
                    icon: Users,
                    title: 'Family Alert',
                    description:
                      'Loved ones are notified and kept informed automatically',
                    color: 'amber',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-6 p-6 bg-gradient-to-r from-red-500/5 to-transparent rounded-2xl border border-red-400/10 hover:border-red-400/30 transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/10 border border-${feature.color}-400/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon
                        className={`w-7 h-7 text-${feature.color}-400`}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-light text-white mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-300 font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-80">
                {/* Pulsing Heart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl animate-pulse opacity-30" />
                    <div className="relative w-48 h-48 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center border-8 border-red-400/30 shadow-2xl">
                      <Heart
                        className="w-24 h-24 text-white"
                        fill="white"
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Badges */}
                <div className="absolute top-0 left-0">
                  <div className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-full border border-red-400/20">
                    <span className="text-red-400 text-sm font-medium">
                      24/7
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0">
                  <div className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-full border border-red-400/20">
                    <span className="text-red-400 text-sm font-medium">
                      Immediate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency CTA */}
          <div className="text-center mt-20">
            <button className="group relative px-12 py-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white font-medium tracking-wide overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center justify-center gap-4">
                <AlertTriangle className="w-6 h-6" />
                Get Emergency Assistance
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>

            <p className="text-gray-500 text-sm mt-6 font-light">
              For immediate life-threatening emergencies, please call 911 first
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section - Enhanced */}
      <section
        ref={(el) => (sectionRefs.current.trust = el)}
        className="relative py-32 px-6"
        style={{ background: sectionBackgrounds.trust }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-10">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                BUILT ON TRUST
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Your Safety Is Our
              <span className="block mt-4 text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                First Priority
              </span>
            </h2>
          </div>

          {/* Security Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Lock,
                title: 'Military-Grade Security',
                description:
                  'Your health information is protected with the highest level of encryption',
                stats: '256-bit Encryption',
                color: 'emerald',
              },
              {
                icon: Cloud,
                title: 'Always Available',
                description:
                  'Access your care information anytime, anywhere with 99.9% uptime',
                stats: '24/7 Access',
                color: 'teal',
              },
              {
                icon: Shield,
                title: 'Privacy First',
                description:
                  'Your data is yours alone, with complete control over who sees it',
                stats: 'HIPAA Compliant',
                color: 'cyan',
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 transform-gpu transition-all duration-500 hover:scale-105 hover:border-emerald-400/30">
                  {/* Icon with Glow */}
                  <div className="relative w-16 h-16 mb-8">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 rounded-2xl blur-md`}
                    />
                    <div
                      className={`relative w-full h-full bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/10 rounded-2xl border border-${item.color}-400/20 flex items-center justify-center`}
                    >
                      <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-light text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 font-light leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-light">
                      {item.stats}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-12 items-center">
            {[
              { icon: Lock, label: 'HIPAA Compliant', color: 'emerald' },
              { icon: Shield, label: 'Data Protected', color: 'teal' },
              { icon: Zap, label: 'Always Available', color: 'cyan' },
              { icon: Check, label: 'Audited Regularly', color: 'blue' },
            ].map((badge, i) => (
              <div
                key={i}
                className="group flex flex-col items-center gap-4 cursor-pointer transform-gpu transition-all duration-300 hover:scale-110"
              >
                <div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-${badge.color}-500/10 to-${badge.color}-600/10 border border-${badge.color}-400/20 flex items-center justify-center`}
                >
                  <badge.icon className={`w-10 h-10 text-${badge.color}-400`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 rounded-full group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                </div>
                <span className="text-gray-500 text-sm font-light group-hover:text-emerald-400 transition-colors">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section
        ref={(el) => (sectionRefs.current.cta = el)}
        className="relative py-40 px-6 overflow-hidden"
        style={{ background: sectionBackgrounds.cta }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/15 to-cyan-600/10" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at ${20 + i * 30}% ${
                  30 + i * 20
                }%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
                animation: `float-orb 20s ease-in-out infinite`,
                animationDelay: `${i * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Floating Decorations */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl animate-pulse" />
          <div
            className="absolute bottom-10 right-10 w-24 h-24 bg-teal-400/10 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-12 h-12 bg-cyan-400/10 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />

          {/* Main CTA Card */}
          <div className="relative backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl shadow-emerald-500/10">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-emerald-400/20 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-emerald-400/20 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-emerald-400/20 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-emerald-400/20 rounded-br-3xl" />

            {/* Content */}
            <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Ready for Healthcare
              <span className="block mt-4 font-light text-white">
                That Feels Right?
              </span>
            </h2>

            <p className="text-emerald-100 text-2xl mb-12 max-w-2xl mx-auto font-light">
              Join thousands experiencing healthcare that truly puts them first
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button className="group relative px-12 py-6 bg-gradient-to-r from-white to-gray-100 text-emerald-600 rounded-2xl text-lg font-medium tracking-wide overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/20">
                <span className="relative z-10 flex items-center gap-3">
                  Start Free Journey
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>

              <button className="group relative px-12 py-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-emerald-400/20 text-gray-300 font-medium transition-all duration-500 hover:bg-white/10 hover:text-white hover:border-emerald-400/40">
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Schedule a Talk
                </span>
              </button>
            </div>

            <p className="text-emerald-200 text-sm font-light">
              No commitment required • See how it works first • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative py-16 px-6 bg-gradient-to-t from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-xl font-light tracking-wide text-emerald-300">
                  PrioCare
                </span>
              </div>
              <p className="text-gray-500 text-sm font-light">
                Healthcare that understands what comes first in your life
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-light mb-6">Quick Links</h4>
              <div className="space-y-3">
                {[
                  'Book Visit',
                  'How It Works',
                  'Pre & Post Care',
                  'Emergency',
                  'Support',
                ].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-500 hover:text-emerald-400 text-sm font-light transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-light mb-6">Contact</h4>
              <div className="space-y-3 text-sm text-gray-500 font-light">
                <p>24/7 Support Available</p>
                <p>help@priocare.com</p>
                <p>1-800-PRIO-CARE</p>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-light mb-6">Stay Updated</h4>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 font-light">
                  Get healthcare tips and updates
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-sm text-white hover:opacity-90 transition-opacity">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-600 text-sm font-light">
              © {new Date().getFullYear()} PrioCare. All rights reserved.
            </p>
            <p className="text-gray-700 text-xs mt-2 font-light">
              PrioCare does not provide emergency services. In case of
              emergency, call 911 immediately.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Cursor */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-400/30 pointer-events-none z-50 transition-transform duration-100 ease-out mix-blend-difference"
        style={{
          transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)`,
          display: cursorVariant === 'default' ? 'block' : 'none',
        }}
      />
      <div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-emerald-400/50 pointer-events-none z-50 transition-transform duration-75 ease-out mix-blend-difference"
        style={{
          transform: `translate(${mousePos.x - 8}px, ${mousePos.y - 8}px)`,
        }}
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/50 z-40">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-300"
          style={{
            width: `${
              (scrollY / (document.body.scrollHeight - window.innerHeight)) *
              100
            }%`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float-particle {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, -20px) scale(1.3);
            opacity: 0.8;
          }
        }

        @keyframes float-3d {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotateX(0) rotateY(0);
          }
          33% {
            transform: translate3d(10px, -15px, 20px) rotateX(5deg)
              rotateY(5deg);
          }
          66% {
            transform: translate3d(-5px, 10px, -10px) rotateX(-3deg)
              rotateY(-3deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes emergency-pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes background-scroll {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 200px 200px;
          }
        }

        @keyframes float-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(50px, -30px) scale(1.1);
          }
          50% {
            transform: translate(30px, 40px) scale(0.9);
          }
          75% {
            transform: translate(-40px, -20px) scale(1.05);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-gpu {
          transform: translate3d(0, 0, 0);
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-emergency-pulse {
          animation: emergency-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-background-scroll {
          animation: background-scroll 20s linear infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #0d9488);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #34d399, #14b8a6);
        }

        /* Selection color */
        ::selection {
          background: rgba(16, 185, 129, 0.3);
          color: white;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default SmartHospitalLanding;
