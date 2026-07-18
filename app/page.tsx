"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Code, Cpu, BarChart3, Lock, Zap as ZapIcon, Activity, ChevronDown } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";

// Animated Counter Component
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Typewriter Effect Component
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= delay) {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}

// Floating Code Panel Component
function CodeShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative max-w-2xl mx-auto mt-16 p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-xl shadow-2xl"
      style={{
        boxShadow: "0 0 40px rgba(255, 90, 0, 0.15), inset 0 0 40px rgba(255, 90, 0, 0.05)",
      }}
    >
      {/* IDE Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary/20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-muted-foreground font-mono ml-auto">fleksa-api.ts</span>
      </div>

      {/* Code Content */}
      <div className="text-sm font-mono">
        <div className="space-y-2">
          <div className="text-muted-foreground">
            <span className="text-primary">1</span> <span className="ml-4 text-blue-400">const</span>{" "}
            <span className="text-cyan-400">createOrder</span> <span className="text-primary">=</span> <span className="text-purple-400">async</span> () <span className="text-primary">=&gt;</span> {"{"}
          </div>
          <div className="text-muted-foreground">
            <span className="text-primary">2</span> <span className="ml-8">const order</span> <span className="text-primary">=</span> <span className="text-yellow-600">await</span> <span className="text-cyan-400">fetch</span>(<span className="text-green-400">"/api/orders"</span>)
          </div>
          <div className="text-muted-foreground">
            <span className="text-primary">3</span> <span className="ml-8 text-blue-400">return</span> {"{"}id: order.id, total: order.total{"}"}
          </div>
          <div className="text-muted-foreground">
            <span className="text-primary">4</span> {"}"}
          </div>
        </div>
      </div>

      {/* Glow Animation */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur-2xl -z-10 opacity-50" />
    </motion.div>
  );
}

// How It Works Section
function HowItWorks() {
  const steps = [
    { title: "Input", description: "Submit order details and items" },
    { title: "Processing", description: "AI engine processes and validates" },
    { title: "Validation", description: "System confirms availability" },
    { title: "Output", description: "Real-time dashboard updates" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
        >
          How <span className="text-primary">FLEKSA</span> Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-md hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center font-bold text-white mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-12 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section Component
function FAQSection() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)
  
  const faqs = [
    {
      q: "How does FLEKSA improve restaurant operations?",
      a: "FLEKSA automates billing, inventory tracking, and table management, reducing manual errors by 95% and increasing order processing speed by 300%. Our AI engine continuously optimizes operations based on real-time data."
    },
    {
      q: "What payment methods are supported?",
      a: "FLEKSA supports all major payment methods including credit/debit cards, digital wallets, QR code payments, and cash. Integration with popular payment gateways ensures secure transactions."
    },
    {
      q: "Can FLEKSA handle high-volume restaurants?",
      a: "Yes, our scalable infrastructure supports restaurants from 5 to 500+ tables with sub-second response times. We process over 12,480+ orders daily with 99.99% uptime."
    },
    {
      q: "How long does implementation take?",
      a: "Typical implementation takes 3-5 days. We provide dedicated onboarding support, staff training, and 24/7 technical assistance to ensure smooth transition."
    },
    {
      q: "What security measures are in place?",
      a: "Enterprise-grade encryption, PCI DSS compliance, role-based access control, and automatic data backups. Your data is protected with military-grade security standards."
    },
    {
      q: "What support and training do you provide?",
      a: "We offer 24/7 customer support via email, phone, and live chat. Comprehensive video tutorials, documentation, and on-site training ensure your team is fully equipped to use FLEKSA effectively."
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
        >
          Frequently Asked <span className="text-primary">Questions</span>
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="border border-primary/30 rounded-xl overflow-hidden bg-card/50 backdrop-blur-md hover:border-primary/60 transition-all"
            >
              <button
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors"
              >
                <h3 className="text-lg font-bold text-left text-foreground">{faq.q}</h3>
                <motion.div
                  animate={{ rotate: expandedIdx === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-primary" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: expandedIdx === idx ? "auto" : 0, opacity: expandedIdx === idx ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-primary/20"
              >
                <p className="p-6 text-muted-foreground">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Features Section with Hover Effects
function FeaturesSection() {
  const features = [
    { icon: Cpu, title: "Smart Billing", desc: "Precision-calculated fees with AI optimization" },
    { icon: BarChart3, title: "AI-Powered Insights", desc: "Real-time analytics and recommendations" },
    { icon: Activity, title: "Real-time Processing", desc: "Instant order processing and updates" },
    { icon: Lock, title: "Secure Architecture", desc: "Enterprise-grade security and encryption" },
    { icon: ZapIcon, title: "Scalable Backend", desc: "Built to handle millions of transactions" },
    { icon: Code, title: "Modern API", desc: "RESTful and intuitive developer experience" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
        >
          Enterprise <span className="text-primary">Features</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-6 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-md hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:from-primary/40 group-hover:to-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Mouse Following Light Component
function MouseFollowingLight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none w-96 h-96 rounded-full blur-3xl opacity-20"
      style={{
        background: "radial-gradient(circle, rgba(255, 90, 0, 0.3) 0%, transparent 70%)",
        x: useMotionTemplate`calc(${mouseX}px - 192px)`,
        y: useMotionTemplate`calc(${mouseY}px - 192px)`,
      }}
    />
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Mouse Following Light */}
      <MouseFollowingLight />

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 90, 0, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 90, 0, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Animated Nebula Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl"
        >
          <div className="absolute top-40 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Particles */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />

        {/* Orbiting Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/40 rounded-full" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-6 py-4 border-b border-primary/20 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary font-mono">FLEKSA</h1>
          </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-mono text-sm font-bold transition duration-300 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #ff5a00 0%, #ff7a1a 100%)",
                color: "white",
                boxShadow: "0 0 30px rgba(255, 90, 0, 0.3)",
              }}
            >
              Sign In & Start
              <ArrowRight className="w-5 h-5" />
            </Link>
        </motion.nav>

        {/* Hero Section */}
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-8 w-full">
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <div className="px-4 py-2 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-md">
                <p className="text-sm font-mono text-primary">
                  <TypewriterText text="● SYSTEM_OPERATIONAL" />
                </p>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground font-mono leading-tight">
                <TypewriterText text="FLEKSA" delay={500} />
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-primary">
                  ENTERPRISE POS
                </span>
              </h1>

              <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
                AI-Powered Restaurant Billing & Operations Platform
              </p>
            </motion.div>

            {/* Stats with Animated Counters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            >
              {[
                { value: 24, label: "Restaurants", suffix: "+" },
                { value: 12480, label: "Orders Processed", suffix: "+" },
                { value: 99, label: "Uptime", suffix: "%" },
                { value: 8, label: "Millions in Revenue", suffix: "+" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                  className="p-4 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-md hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-primary font-mono">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-mono font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all"
                >
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/split"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-mono font-bold text-lg hover:shadow-2xl hover:shadow-green-600/50 transition-all"
                >
                  Split Bill
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/report"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-mono font-bold text-lg hover:shadow-2xl hover:shadow-orange-600/50 transition-all"
                >
                  Reports
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Code Showcase */}
            <CodeShowcase />

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[
                "Smart Billing",
                "AI Sales Insights",
                "Inventory Tracking",
                "Table Management",
                "Kitchen Queue",
                "Customer Analytics",
              ].map((feature, idx) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-md hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  <p className="text-sm font-mono text-foreground">{feature}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Features Section */}
        <FeaturesSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Footer */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-muted-foreground text-lg mb-8">Join 24+ restaurants already using FLEKSA for streamlined operations.</p>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-mono font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
