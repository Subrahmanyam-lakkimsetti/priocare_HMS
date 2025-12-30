import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Calendar,
  UserCheck,
  ClipboardList,
  Bell,
  Shield,
  CreditCard,
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
  Eye,
  FileText,
  Home,
  Brain,
  RefreshCw,
  TrendingUp,
  DoorOpen,
  ArrowRight,
} from 'lucide-react';

const SmartHospitalLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleSections, setVisibleSections] = useState(new Set());
  const heroRef = useRef(null);
  const sectionRefs = useRef({
    precare: null,
    postcare: null,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setVisibleSections((prev) => new Set([...prev, section.id]));
        }
      });
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

  // Particle system for hero
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  // Helper function to render background elements
  const renderBackgroundElements = (sectionKey) => {
    // Define section-specific elements
    const sectionElements = {
      hero: [
        {
          type: 'blob',
          color: 'emerald',
          position: 'top-1/4 left-1/4',
          size: 'w-96 h-96',
          opacity: 0.1,
        },
        {
          type: 'blob',
          color: 'teal',
          position: 'bottom-1/4 right-1/4',
          size: 'w-96 h-96',
          opacity: 0.1,
        },
      ],
      why: [
        {
          type: 'gradient',
          direction: 'conic',
          from: 'emerald',
          to: 'transparent',
          opacity: 0.05,
        },
      ],
      journey: [
        { type: 'grid', opacity: 0.03 },
        { type: 'particles', count: 20 },
      ],
      precare: [
        { type: 'perspective-grid', opacity: 0.05 },
        { type: 'beam', position: 'center' },
      ],
      postcare: [{ type: 'conic', from: 'teal', to: 'emerald', opacity: 0.06 }],
      for: [
        {
          type: 'blob',
          color: 'emerald',
          position: 'top-0 left-1/4',
          size: 'w-64 h-64',
          opacity: 0.05,
        },
        {
          type: 'blob',
          color: 'teal',
          position: 'bottom-0 right-1/4',
          size: 'w-64 h-64',
          opacity: 0.05,
        },
      ],
      emergency: [{ type: 'pulse', color: 'red', count: 2 }],
      trust: [{ type: 'pattern', repeat: 'linear', angle: 45, opacity: 0.02 }],
      cta: [{ type: 'radial', color: 'emerald', size: '70%', opacity: 0.1 }],
    };

    const elements = sectionElements[sectionKey] || [];

    return (
      <>
        {/* Base Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Subtle Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Primary Glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
          }}
        />

        {/* Secondary Glow */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.05) 0%, transparent 50%)',
          }}
        />

        {/* Section-specific elements */}
        {elements.map((element, index) => {
          switch (element.type) {
            case 'blob':
              return (
                <div
                  key={index}
                  className={`absolute ${element.position} ${element.size} bg-${element.color}-500/10 rounded-full blur-3xl`}
                  style={{ opacity: element.opacity }}
                />
              );

            case 'gradient':
              if (element.direction === 'conic') {
                return (
                  <div
                    key={index}
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, ${element.opacity}) 0%, transparent 25%, rgba(20, 184, 166, ${element.opacity}) 50%, transparent 75%, rgba(16, 185, 129, ${element.opacity}) 100%)`,
                    }}
                  />
                );
              }
              break;

            case 'grid':
              return (
                <svg
                  key={index}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ opacity: element.opacity }}
                >
                  <defs>
                    <pattern
                      id={`grid-${sectionKey}`}
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 0 40 L 40 0"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#grid-${sectionKey})`}
                  />
                </svg>
              );

            case 'particles':
              return (
                <div key={index} className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: element.count }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-[2px] h-[2px] bg-emerald-400/20 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                      }}
                    />
                  ))}
                </div>
              );

            case 'perspective-grid':
              return (
                <svg
                  key={index}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ opacity: element.opacity }}
                >
                  <defs>
                    <pattern
                      id={`perspective-grid-${sectionKey}`}
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 0 40 L 40 0"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#perspective-grid-${sectionKey})`}
                  />
                </svg>
              );

            case 'beam':
              return (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-emerald-400/0 via-emerald-400/10 to-emerald-400/0"
                />
              );

            case 'conic':
              return (
                <div
                  key={index}
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `conic-gradient(from 180deg at 50% 50%, rgba(20, 184, 166, ${element.opacity}) 0%, transparent 30%, rgba(16, 185, 129, ${element.opacity}) 60%, transparent 90%)`,
                  }}
                />
              );

            case 'pulse':
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
                >
                  {Array.from({ length: element.count }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 border-2 border-red-400/10 rounded-full animate-emergency-pulse"
                      style={{
                        animationDelay: `${i * 0.8}s`,
                        transform: `scale(${1 + i * 0.2})`,
                      }}
                    />
                  ))}
                </div>
              );

            case 'pattern':
              return (
                <div
                  key={index}
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `repeating-linear-gradient(${element.angle}deg, transparent, transparent 2px, rgba(16, 185, 129, ${element.opacity}) 2px, rgba(16, 185, 129, ${element.opacity}) 4px)`,
                  }}
                />
              );

            case 'radial':
              return (
                <div
                  key={index}
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, ${
                      element.opacity
                    }) 0%, rgba(20, 184, 166, ${
                      element.opacity * 0.75
                    }) 30%, transparent ${element.size || '70%'})`,
                  }}
                />
              );

            default:
              return null;
          }
        })}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-light tracking-wide text-emerald-400">
            PrioCare
          </span>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-light">
            <a href="#why" className="hover:text-white transition-colors">
              Why PrioCare
            </a>
            <a href="#journey" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#emergency" className="hover:text-white transition-colors">
              Emergency
            </a>
            <button className="hover:text-white flex items-center gap-2 transition-colors">
              <Phone className="w-4 h-4" /> Support
            </button>
          </div>

          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-light hover:opacity-90 transition-opacity">
            Book Visit
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Unified Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('hero')}

          {/* Interactive Glow */}
          <div
            className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
            style={{
              left: `${mousePos.x - 128}px`,
              top: `${mousePos.y - 128}px`,
            }}
          />
        </div>

        {/* Animated Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float-particle ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { icon: Heart, top: '15%', left: '10%', delay: 0 },
            { icon: Calendar, top: '25%', right: '15%', delay: 1 },
            { icon: Activity, bottom: '20%', left: '12%', delay: 2 },
            { icon: Bell, bottom: '30%', right: '18%', delay: 1.5 },
          ].map((item, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                ...item,
                animation: `float-gentle 8s ease-in-out infinite`,
                animationDelay: `${item.delay}s`,
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-50" />
                <div className="relative w-16 h-16 backdrop-blur-sm bg-emerald-500/10 rounded-2xl border border-emerald-400/20 flex items-center justify-center">
                  <item.icon
                    className="w-8 h-8 text-emerald-400"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-8">
            {/* Glowing Tag */}
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 backdrop-blur-lg rounded-full border border-emerald-400/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-light tracking-wide">
                PRIORITY-BASED CARE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-light leading-tight animate-fade-in-up">
              <span className="block mb-4">Healthcare,</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                That Knows What Comes First.
              </span>
            </h1>

            {/* Divider */}
            <div className="flex justify-center gap-3 my-8 animate-fade-in">
              <div className="w-4 h-4 rounded-full bg-emerald-400/50" />
              <div className="w-4 h-4 rounded-full bg-teal-400/50" />
              <div className="w-4 h-4 rounded-full bg-emerald-400/50" />
            </div>

            {/* Description */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Experience healthcare that puts your needs first. Book visits
                based on urgency, get clear guidance every step, and focus on
                what matters most – your health.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-12 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
                <span className="flex items-center gap-3">
                  Begin Your Journey
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button className="group px-8 py-4 bg-white/5 backdrop-blur-lg rounded-full border border-emerald-400/20 text-gray-300 font-light transition-all duration-300 hover:bg-white/10 hover:text-white">
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Talk to Someone
                </span>
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-emerald-400/30 flex justify-center p-2">
              <div className="w-1 h-3 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Why PrioCare Section */}
      <section id="why" className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('why')}
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 backdrop-blur-lg rounded-full border border-emerald-400/20 mb-6">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-light tracking-wide">
                WHY CHOOSE PRIOCARE
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light mb-8">
              Healthcare That{' '}
              <span className="text-emerald-400">Actually Works</span> For You
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
              We've redesigned the healthcare experience around what truly
              matters to patients
            </p>
          </div>

          {/* Circular Feature Grid */}
          <div className="relative">
            {/* Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-4xl h-64 border-2 border-emerald-400/10 rounded-full" />
            </div>

            {/* Features in Circular Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  icon: Clock,
                  title: 'Less Waiting',
                  description:
                    'Priority-based scheduling means you get care when you need it',
                },
                {
                  icon: MessageCircle,
                  title: 'Clear Guidance',
                  description:
                    'Every step explained in simple terms, no confusion',
                },
                {
                  icon: Target,
                  title: 'Priority Care',
                  description: 'Urgent needs get immediate attention, always',
                },
                {
                  icon: Shield,
                  title: 'One Place',
                  description:
                    'Everything you need in a single, secure platform',
                },
              ].map((benefit, i) => (
                <div key={i} className="group relative">
                  {/* Animated Border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Circular Card */}
                  <div className="relative aspect-square rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:border-emerald-400/40">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <benefit.icon
                        className="w-10 h-10 text-emerald-400"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-light text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('journey')}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header - Compact */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-400/10 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                Your Care Pathway
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-light mb-5">
              A Clear Path to
              <span className="block text-emerald-400 mt-2">Better Health</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base">
              Follow a guided journey where each step naturally leads to the
              next
            </p>
          </div>

          {/* Spiral Timeline Layout */}
          <div className="relative">
            {/* Central Progress Indicator */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 border-2 border-emerald-400/10 rounded-full animate-spin-slow" />
                <div className="absolute inset-8 border-2 border-emerald-400/5 rounded-full animate-spin-slow-reverse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-emerald-400 font-light mb-2">
                      4
                    </div>
                    <div className="text-sm text-gray-400 font-light">
                      Connected Steps
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spiral Steps */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
              {[
                {
                  step: '01',
                  icon: Calendar,
                  title: 'Smart Scheduling',
                  description:
                    'AI-powered booking that prioritizes your needs and availability',
                  highlights: [
                    'Same-day options',
                    'Priority matching',
                    'Flexible timing',
                  ],
                  color: 'emerald',
                },
                {
                  step: '02',
                  icon: UserCheck,
                  title: 'Team Introduction',
                  description:
                    'Meet your dedicated care team with matched expertise',
                  highlights: [
                    'Expert matching',
                    'Clear roles',
                    'Direct contact',
                  ],
                  color: 'teal',
                },
                {
                  step: '03',
                  icon: Heart,
                  title: 'Personalized Care',
                  description:
                    'Tailored treatment with continuous communication',
                  highlights: [
                    'Custom plans',
                    'Clear explanations',
                    'Active involvement',
                  ],
                  color: 'cyan',
                },
                {
                  step: '04',
                  icon: Bell,
                  title: 'Ongoing Support',
                  description: 'Continuous follow-up and progress monitoring',
                  highlights: [
                    'Regular check-ins',
                    'Progress tracking',
                    '24/7 support',
                  ],
                  color: 'blue',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative group ${
                    index % 2 === 0 ? 'lg:mt-12' : 'lg:mb-12'
                  }`}
                >
                  {/* Connection Arc (Visible on desktop) */}
                  <div
                    className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-24 h-24 border-2 border-emerald-400/10 rounded-full -z-10"
                    style={{
                      left: index % 2 === 0 ? 'calc(100% + 20px)' : 'auto',
                      right: index % 2 === 1 ? 'calc(100% + 20px)' : 'auto',
                      borderTopColor:
                        index % 2 === 0 ? 'transparent' : undefined,
                      borderRightColor:
                        index % 2 === 0 ? 'transparent' : undefined,
                      borderBottomColor:
                        index % 2 === 1 ? 'transparent' : undefined,
                      borderLeftColor:
                        index % 2 === 1 ? 'transparent' : undefined,
                    }}
                  />

                  {/* Step Card */}
                  <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/30 rounded-2xl p-8 group-hover:border-emerald-400/20 transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                    {/* Background Glow */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${item.color}-500/5 to-transparent rounded-full blur-xl`}
                    />

                    {/* Step Number */}
                    <div className="absolute top-6 left-6">
                      <div
                        className={`text-4xl font-light text-${item.color}-400/20`}
                      >
                        {item.step}
                      </div>
                    </div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                          >
                            <item.icon
                              className={`w-7 h-7 text-${item.color}-400`}
                              strokeWidth={1.5}
                            />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 font-light tracking-wider uppercase mb-1">
                              Step {item.step.slice(1)}
                            </div>
                            <h3 className="text-2xl font-light text-white">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 mb-8 font-light leading-relaxed">
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-3">
                        {item.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-${item.color}-400`}
                            />
                            <span className="text-sm text-gray-400 font-light">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Progress Indicator */}
                      <div className="mt-10 pt-6 border-t border-gray-800/30">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 font-light">
                            Progress
                          </span>
                          <span className={`text-${item.color}-400 font-light`}>
                            {index === 3
                              ? 'Complete'
                              : `Step ${parseInt(item.step)}/4`}
                          </span>
                        </div>
                        <div className="h-1 bg-gray-800/50 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full transition-all duration-1000`}
                            style={{
                              width: `${(parseInt(item.step) / 4) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-emerald-400/20 rounded-tl-2xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-emerald-400/20 rounded-br-2xl" />
                  </div>

                  {/* Floating Indicator */}
                  <div
                    className={`absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center shadow-lg`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Connection Lines */}
            <div className="lg:hidden relative h-12 mx-auto max-w-md">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-cyan-400/10" />
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-emerald-400/30 rounded-full animate-pulse"
                    style={{
                      left: `${(i + 1) * 25}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Journey Summary */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="bg-gradient-to-b from-emerald-500/5 to-transparent backdrop-blur-sm border border-emerald-400/10 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-light text-white mb-3">
                    Ready to Begin Your Journey?
                  </h4>
                  <p className="text-gray-400 text-sm font-light">
                    Each step builds upon the last, creating a seamless
                    continuum of care
                  </p>
                </div>
                <button className="group relative px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-light hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden">
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
        </div>
      </section>

      {/* Pre-Care Section */}
      <section
        ref={(el) => (sectionRefs.current.precare = el)}
        id="precare"
        className="relative py-40 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('precare')}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-32">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 mb-12 transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10">
              <Eye className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                BEFORE YOUR VISIT
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-light mb-10 leading-tight">
              Preparing You For
              <span className="block mt-6">
                <span className="relative inline-block">
                  <span className="text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text animate-gradient">
                    Better Care
                  </span>
                  <span className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400/50 to-emerald-400/0" />
                </span>
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Everything you need to feel prepared, informed, and confident
              before your visit
            </p>
          </div>

          {/* Gateway Steps - Doorway Perspective */}
          <div className="relative">
            {/* Central Doorway */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none">
              {/* Door Frame */}
              <div className="absolute inset-0 border-4 border-emerald-400/20 rounded-2xl" />

              {/* Door Opening */}
              <div className="absolute inset-8 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 backdrop-blur-sm rounded-lg border-2 border-emerald-400/30" />

              {/* Door Handle */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-12 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full shadow-lg" />
              </div>
            </div>

            {/* Preparation Steps in Perspective */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  icon: FileText,
                  title: 'Clear Instructions',
                  description:
                    'Simple, step-by-step guidance on what to expect and how to prepare',
                  position: 'md:col-start-1 md:row-start-1',
                  perspective:
                    'perspective-1000 transform-gpu rotate-y-[-20deg]',
                  color: 'emerald',
                  step: '01',
                },
                {
                  icon: Home,
                  title: 'Home Preparation',
                  description:
                    'Tips to get your home ready for recovery and ongoing care',
                  position: 'md:col-start-2 md:row-start-1 md:mt-24',
                  perspective: 'perspective-1000 transform-gpu',
                  color: 'teal',
                  step: '02',
                },
                {
                  icon: Brain,
                  title: 'Peace of Mind',
                  description:
                    'Know exactly what will happen, reducing anxiety and uncertainty',
                  position: 'md:col-start-3 md:row-start-1',
                  perspective:
                    'perspective-1000 transform-gpu rotate-y-[20deg]',
                  color: 'cyan',
                  step: '03',
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`${step.position} ${step.perspective} group`}
                >
                  {/* Step Pathway Line */}
                  <div className="hidden md:block absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-emerald-400/20 to-transparent origin-left rotate-[60deg]" />

                  {/* Step Container */}
                  <div className="relative">
                    {/* Step Badge on Pathway */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 border-2 border-${step.color}-400/30 flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-white text-xs font-medium">
                          {step.step}
                        </span>
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 transform-gpu transition-all duration-700 group-hover:scale-110 group-hover:border-emerald-400/40 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 overflow-hidden">
                      {/* Animated Glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Icon Container */}
                      <div className="relative w-16 h-16 mx-auto mb-6">
                        {/* Icon Background */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-${step.color}-500/20 to-${step.color}-600/20 rounded-xl border border-${step.color}-400/20`}
                        />

                        {/* Icon */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          <step.icon
                            className={`w-10 h-10 text-${step.color}-400 group-hover:scale-110 transition-transform duration-500`}
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative text-center space-y-4">
                        <h3 className="text-2xl font-light text-white">
                          {step.title}
                        </h3>
                        <p className="text-gray-300 font-light leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Pathway Indicator */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((dot) => (
                            <div
                              key={dot}
                              className={`w-1.5 h-1.5 bg-${step.color}-400/30 rounded-full group-hover:bg-${step.color}-400 transition-colors duration-300`}
                              style={{ animationDelay: `${dot * 0.1}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Direction Arrow */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Entry Pathway */}
            <div className="mt-24 text-center">
              <div className="inline-flex items-center gap-6">
                {/* Preparation Start */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-light">
                      Start
                    </span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-light">
                    Preparation
                  </div>
                </div>

                {/* Pathway Line */}
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full" />

                {/* Care Doorway */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border-2 border-emerald-400/30 flex items-center justify-center shadow-lg">
                    <DoorOpen className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-emerald-400 font-light">
                    Care Access
                  </div>
                </div>
              </div>

              {/* Pathway Description */}
              <p className="mt-12 text-gray-500 text-sm font-light max-w-2xl mx-auto">
                Each preparation step guides you toward the door of better care,
                ensuring you're fully ready for your healthcare journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Care Section */}
      <section
        ref={(el) => (sectionRefs.current.postcare = el)}
        id="postcare"
        className="relative py-32 px-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('postcare')}
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
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

      {/* Who It's For - Interactive Cards */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('for')}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/5 backdrop-blur-sm rounded-full border border-emerald-400/10 mb-8">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider">
                DESIGNED FOR YOU
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-light mb-6">
              For Everyone Who
              <span className="block mt-4 text-emerald-400">
                Cares About Health
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
              Whether you're managing chronic conditions or seeking occasional
              care
            </p>
          </div>

          {/* Accordion Stack Layout - Performance Optimized */}
          <div className="relative">
            {/* Stacking lines indicator */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400/20 via-transparent to-emerald-400/20" />

            {/* Card Stack Container */}
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {[
                {
                  title: 'Patients',
                  description:
                    'Get care that adapts to your urgency and schedule',
                  icon: Heart,
                  features: [
                    'Priority scheduling',
                    'Clear instructions',
                    'Follow-up support',
                  ],
                  color: 'emerald',
                },
                {
                  title: 'Families',
                  description:
                    "Stay informed and connected with loved ones' care",
                  icon: Users,
                  features: [
                    'Shared updates',
                    'Care coordination',
                    'Peace of mind',
                  ],
                  color: 'teal',
                },
                {
                  title: 'Care Teams',
                  description:
                    'Deliver better care with streamlined coordination',
                  icon: UserCheck,
                  features: [
                    'Patient insights',
                    'Team coordination',
                    'Efficient workflows',
                  ],
                  color: 'cyan',
                },
              ].map((role, i) => (
                <div key={i} className="group">
                  {/* Stack Card */}
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 transition-all duration-300 hover:border-emerald-400/30 hover:translate-y-[-4px]">
                    {/* Stack layer indicators */}
                    <div className="absolute -top-2 left-6 right-6 h-2 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-transparent rounded-t-lg" />
                    <div className="absolute -bottom-2 left-6 right-6 h-2 bg-gradient-to-r from-transparent via-teal-400/10 to-emerald-400/10 rounded-b-lg" />

                    {/* Number indicator */}
                    <div className="absolute -left-3 top-8 w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-light shadow-lg">
                      {i + 1}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${role.color}-500/10 to-${role.color}-600/10 border border-${role.color}-400/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                      >
                        <role.icon
                          className={`w-10 h-10 text-${role.color}-400`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-2xl font-light text-white mb-4">
                        {role.title}
                      </h3>
                      <p className="text-gray-300 mb-6 font-light leading-relaxed">
                        {role.description}
                      </p>

                      {/* Feature List */}
                      <div className="space-y-3">
                        {role.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-gray-400"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-${role.color}-400`}
                            />
                            <span className="font-light text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Desktop connection lines */}
                  {i < 2 && (
                    <div className="hidden lg:block absolute top-1/2 right-[-32px] w-8 h-0.5 bg-gradient-to-r from-emerald-400/20 to-transparent" />
                  )}
                </div>
              ))}
            </div>

            {/* Stack visualization for desktop */}
            <div className="hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4rem)] h-[calc(100%+4rem)]">
                {/* Stack shadow effects */}
                <div className="absolute top-[-20px] left-[-20px] right-[-20px] bottom-[-20px] bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </div>
            </div>
          </div>

          {/* Unifying description */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-emerald-500/5 backdrop-blur-sm rounded-full border border-emerald-400/10">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full" />
                <div className="w-1.5 h-1.5 bg-emerald-400/40 rounded-full" />
              </div>
              <span className="text-gray-400 text-sm font-light">
                Each role plays a vital part in the healthcare journey
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Response System */}
      <section id="emergency" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('emergency')}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="relative">
              <div
                className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-ping"
                style={{ animationDuration: '1.5s' }}
              />
              <div className="relative w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
            </div>

            <span className="text-red-400 text-sm font-light tracking-widest uppercase">
              PRIORITY EMERGENCY CARE
            </span>

            <div className="relative">
              <div
                className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-ping"
                style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}
              />
              <div className="relative w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-light leading-tight">
                When Every Second
                <span className="block text-red-400 mt-2">Matters</span>
              </h2>

              <p className="text-xl text-gray-300 font-light leading-relaxed">
                Our system ensures urgent cases get immediate attention while
                keeping you informed every step of the way.
              </p>

              <div className="space-y-6 mt-12">
                {[
                  {
                    icon: Activity,
                    title: 'Immediate Response',
                    description:
                      'Urgent cases get priority attention instantly',
                  },
                  {
                    icon: MessageCircle,
                    title: 'Clear Communication',
                    description: 'Real-time updates about your care status',
                  },
                  {
                    icon: Users,
                    title: 'Family Notified',
                    description: 'Loved ones stay informed automatically',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-red-500/5 to-transparent border border-red-400/10 hover:border-red-400/30 transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-light text-white mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400 font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative mx-auto w-64 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative w-32 h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center border-4 border-red-400/40">
                      <Heart
                        className="w-16 h-16 text-white"
                        fill="white"
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <button className="group relative px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-white font-light tracking-wide overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center justify-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                Emergency Assistance
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>

            <p className="text-gray-500 text-sm mt-6 font-light">
              For immediate medical emergencies, call 911 first
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('trust')}
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 backdrop-blur-lg rounded-full border border-emerald-400/20 mb-6">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-light tracking-wide">
                YOUR TRUST, OUR PRIORITY
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-light mb-8">
              Built on{' '}
              <span className="text-emerald-400">Trust & Security</span>
            </h2>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: 'Your Privacy First',
                description:
                  'Industry-leading encryption keeps your health data secure and private',
                stats: '256-bit Encryption',
              },
              {
                title: 'Clear Communication',
                description:
                  'No surprises. Always know what to expect and when',
                stats: 'Real-time Updates',
              },
              {
                title: 'Proven Reliability',
                description: 'Built on healthcare standards with 99.9% uptime',
                stats: '24/7 Monitoring',
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative p-8 border border-gray-800/50 rounded-3xl backdrop-blur-sm transition-all duration-500 group-hover:border-emerald-400/30">
                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-6">
                    {i === 0 && <Lock className="w-4 h-4 text-emerald-400" />}
                    {i === 1 && <Bell className="w-4 h-4 text-emerald-400" />}
                    {i === 2 && <Zap className="w-4 h-4 text-emerald-400" />}
                    <span className="text-emerald-400 text-sm font-light">
                      {item.stats}
                    </span>
                  </div>

                  <h3 className="text-2xl font-light text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {[
              { icon: Lock, label: 'HIPAA Compliant' },
              { icon: Shield, label: 'Data Protected' },
              { icon: Zap, label: 'Always Available' },
              { icon: Check, label: 'Audited Regularly' },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <badge.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <span className="text-gray-500 text-sm font-light group-hover:text-emerald-400 transition-colors">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950">
          {renderBackgroundElements('cta')}
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-8 h-8 bg-emerald-400/20 rounded-full blur-sm" />
          <div className="absolute bottom-10 right-10 w-12 h-12 bg-teal-400/20 rounded-full blur-sm" />
          <div className="absolute top-20 right-20 w-6 h-6 bg-blue-400/20 rounded-full blur-sm" />

          {/* Content */}
          <div className="relative backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
            <h2 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
              Ready for Healthcare
              <span className="block mt-4 font-light text-white">
                That Puts You First?
              </span>
            </h2>

            <p className="text-emerald-100 text-xl mb-12 max-w-2xl mx-auto font-light">
              Join thousands who experience healthcare differently
            </p>

            <button className="group relative px-12 py-6 bg-gradient-to-r from-white to-gray-100 text-emerald-600 rounded-full text-lg font-light tracking-wide overflow-hidden transition-all duration-500 hover:scale-105 mb-8">
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

            <p className="text-emerald-200 text-sm font-light">
              No commitment required. See how it works first.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
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

      <style jsx>{`
        @keyframes float-particle {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(10px, -10px) scale(1.2);
            opacity: 0.6;
          }
        }

        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-emergency-pulse {
          animation: emergency-pulse 3.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-y-[-20deg] {
          transform: rotateY(-20deg);
        }

        .rotate-y-[20deg] {
          transform: rotateY(20deg);
        }

        .transform-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default SmartHospitalLanding;
