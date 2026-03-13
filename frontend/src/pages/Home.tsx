import { useState, useEffect } from 'react';
import { Users, Video, Globe, Gamepad2, Sparkles, ArrowRight, Play, Check, Star, Trophy, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MetaverseLanding() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate()

  const navigateToSignup = ()=>{
    navigate("/auth",{state:{signup:true}})
  }
  const navigateToLogin = ()=>{
    navigate("/auth",{state:{signup:false}})
  }

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Users className="w-6 h-6" />, title: "Virtual Spaces", desc: "Create custom offices, hangout spots, and event venues", color: "from-blue-500 to-cyan-500" },
    { icon: <Video className="w-6 h-6" />, title: "Video & Voice", desc: "Proximity-based communication that feels natural", color: "from-purple-500 to-pink-500" },
    { icon: <Gamepad2 className="w-6 h-6" />, title: "Interactive Games", desc: "Built-in games and activities for team bonding", color: "from-green-500 to-emerald-500" },
    { icon: <Palette className="w-6 h-6" />, title: "Customizable", desc: "Design your avatar and spaces exactly how you want", color: "from-orange-500 to-red-500" }
  ];

  const useCases = [
    { title: "Remote Teams", desc: "Bring your distributed team together in one virtual space", icon: <Users className="w-8 h-8" /> },
    { title: "Virtual Events", desc: "Host conferences, workshops, and social gatherings", icon: <Sparkles className="w-8 h-8" /> },
    { title: "Gaming Communities", desc: "Hang out with friends in custom game worlds", icon: <Gamepad2 className="w-8 h-8" /> },
    { title: "Education", desc: "Interactive classrooms and collaborative learning spaces", icon: <Globe className="w-8 h-8" /> },
  ];

  const pricing = [
    { name: "Free", price: "$0", features: ["Up to 25 users", "5 custom spaces", "Basic avatars", "Community support"], popular: false },
    { name: "Team", price: "$12", features: ["Up to 100 users", "Unlimited spaces", "Custom avatars", "Priority support", "Advanced analytics"], popular: true },
    { name: "Enterprise", price: "Custom", features: ["Unlimited users", "Dedicated server", "Custom branding", "24/7 support", "Custom integrations"], popular: false }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden font-sans">
      {/* Animated stars/particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Interactive cursor glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 800px at ${cursorPos.x}px ${cursorPos.y}px, rgba(139, 92, 246, 0.3), transparent)`
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-out">
              <Globe className="w-6 h-6 text-white group-hover:animate-spin" />
            </div>
            <span className="text-2xl font-bold text-white">
              SimpleCity
            </span>
          </div>
          <div className="hidden md:flex space-x-8 text-white/90">
            {['Features', 'Use Cases', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-cyan-400 transition-colors duration-300 relative group">
                <span>{item}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 ease-out"></span>
              </a>
            ))}
          </div>
          <div className="flex space-x-4">
            <button onClick={navigateToLogin} className="px-4 py-2 text-white hover:text-cyan-400 transition-colors duration-300 relative group overflow-hidden rounded-lg">
              <span className="relative z-10">Sign In</span>
              <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
            </button>
            
            {/* FIXED: Removed duplicate text and added transform-gpu for smooth scaling */}
            <button onClick={navigateToSignup} className="px-6 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/50 transform transform-gpu hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden group">
              <span className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              <span className="relative z-10">Get Started</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative z-10 container mx-auto px-6 pt-20 pb-32 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:border-cyan-400/50 transition-colors duration-300">
            <span className="text-cyan-400 font-semibold flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>The Future of Virtual Collaboration</span>
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight">
            Your Own
            <span className="block bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent pb-2">
              Virtual Universe
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto">
            Create interactive 2D worlds where your team can meet, collaborate, and have fun together. 
            Just like being in the same room, but from anywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {/* FIXED: Added transform-gpu and corrected z-index stacking */}
            <button className="px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transform transform-gpu hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out flex items-center space-x-2 group relative overflow-hidden">
              <span className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
              <span className="relative z-10 flex items-center gap-2">
                Start For Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
            
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 hover:border-white/50 hover:shadow-xl hover:shadow-white/20 transform transform-gpu hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out flex items-center space-x-2 group">
              <Play className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Interactive Game Preview */}
          <div className="relative mt-16">
            <div className="bg-linear-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
              {/* Fake game window */}
              <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl overflow-hidden aspect-video relative shadow-inner">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }} />
                
                {/* Avatars floating around */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-linear-to-br from-pink-400 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-linear-to-br from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                <div className="absolute bottom-1/4 left-1/2 w-12 h-12 bg-linear-to-br from-green-400 to-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
                <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }} />
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center bg-black/20 backdrop-blur-sm p-6 rounded-2xl">
                    <Gamepad2 className="w-16 h-16 text-white/80 mx-auto mb-4 animate-pulse" />
                    <p className="text-white/90 text-lg font-semibold">Interactive 2D World</p>
                  </div>
                </div>
              </div>
              
              {/* User count badge */}
              <div className="absolute -top-4 -right-4 bg-linear-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-bounce" style={{ animationDuration: '3s' }}>
                <Users className="w-5 h-5" />
                <span className="font-bold">1,000+ Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-black/30 backdrop-blur-md py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Everything You Need
          </h2>
          <p className="text-xl text-white/70 text-center mb-16 max-w-2xl mx-auto">
            Powerful features that make virtual collaboration feel natural and fun
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveFeature(idx)}
                className={`bg-white/5 backdrop-blur-md rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer ${
                  activeFeature === idx 
                    ? 'border-cyan-400 shadow-xl shadow-cyan-500/20 transform scale-105' 
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className={`bg-linear-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 transform transition-transform duration-300 ${
                  activeFeature === idx ? 'scale-110 rotate-6' : ''
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="usecases" className="relative z-10 py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Built For Everyone
          </h2>
          <p className="text-xl text-white/70 text-center mb-16 max-w-2xl mx-auto">
            Whether you're working, learning, or playing - we've got you covered
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="bg-linear-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{useCase.title}</h3>
                <p className="text-white/70">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-6">
          <div className="bg-linear-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-yellow-400 mr-2" />
                  <div className="text-5xl font-bold text-white">10k+</div>
                </div>
                <p className="text-white/70">Active Spaces</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-cyan-400 mr-2" />
                  <div className="text-5xl font-bold text-white">50k+</div>
                </div>
                <p className="text-white/70">Daily Users</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-pink-400 mr-2" />
                  <div className="text-5xl font-bold text-white">4.9</div>
                </div>
                <p className="text-white/70">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Choose Your Plan
          </h2>
          <p className="text-xl text-white/70 text-center mb-16">
            Start free and scale as you grow
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white/5 backdrop-blur-md rounded-3xl p-8 border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                  plan.popular 
                    ? 'border-cyan-400 shadow-2xl shadow-cyan-500/30 relative' 
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-6 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-white/70">/month</span>}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-3 text-white/90">
                      <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={navigateToSignup} className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                  plan.popular 
                    ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transform transform-gpu' 
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-cyan-400'
                }`}>
                  {plan.popular && (
                    <span className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                  )}
                  <span className="relative z-10">Get Started</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your World?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already collaborating in their virtual spaces
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/50 transform transform-gpu hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out relative overflow-hidden group">
                <span className="absolute inset-0 bg-linear-to-r from-cyan-100 to-blue-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center ease-out"></span>
                <span className="relative z-10">Start Free Trial</span>
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/50 text-white rounded-xl font-semibold hover:bg-white/30 hover:border-white hover:shadow-xl hover:shadow-white/30 transform transform-gpu hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-2 rounded-xl">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SimpleCity</span>
            </div>
            <div className="text-white/60">
              © 2024 SimpleCity. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}