import React from "react";
import { useNeuro } from "./context/NeuroProvider";
import { useNeuroTracker } from "./hooks/useNeuroTracker";
import { motion } from "framer-motion";
import { AdaptiveText, AdaptiveGrid, DensityWrapper } from "./components/AdaptiveUI";
import { AdminPanel } from "./components/AdminPanel";
import AdminAnalytics from "./components/AdminAnalytics";
import SecurityOverlay from "./components/SecurityOverlay";
import { DemoShowcase } from "./components/DemoShowcase";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";

/**
 * Navbar Component
 */
function Navbar() {
  const { uiDensity, isConnected, suspicionScore } = useNeuro();
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-neuro-bg via-neuro-surface to-neuro-bg border-b border-neuro-border shadow-xl">
      <div className={`max-w-7xl mx-auto px-4 flex justify-between items-center ${
        uiDensity === "SIMPLE"
          ? "py-6"
          : uiDensity === "EXPERT"
            ? "py-2"
            : "py-4"
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className={`bg-gradient-to-br from-neuro-primary to-neuro-primary-dark rounded-lg flex items-center justify-center ${
            uiDensity === "SIMPLE"
              ? "w-12 h-12"
              : uiDensity === "EXPERT"
                ? "w-7 h-7"
                : "w-10 h-10"
          }`}>
            <span className={`font-bold text-neuro-text-primary ${
              uiDensity === "SIMPLE"
                ? "text-xl"
                : uiDensity === "EXPERT"
                  ? "text-xs"
                  : "text-lg"
            }`}>Ⓝ</span>
          </div>
          <span className={`font-bold text-neuro-text-primary ${
            uiDensity === "SIMPLE"
              ? "text-3xl"
              : uiDensity === "EXPERT"
                ? "text-base"
                : "text-2xl"
          }`}>NeuroUX</span>
          <span
            className={`rounded-full font-semibold transition-all ${
              uiDensity === "SIMPLE"
                ? "px-4 py-2 text-sm"
                : uiDensity === "EXPERT"
                  ? "px-2 py-1 text-xs"
                  : "px-3 py-1 text-sm"
            } ${
              isConnected
                ? "bg-green-900/30 text-green-400 border border-green-700/50"
                : "bg-neuro-primary/30 text-neuro-primary border border-neuro-primary/50"
            }`}
          >
            {isConnected ? "● Connected" : "● Disconnected"}
          </span>
        </motion.div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4">
            <div className={`text-neuro-text-secondary ${
              uiDensity === "SIMPLE"
                ? "text-sm"
                : uiDensity === "EXPERT"
                  ? "text-xs"
                  : "text-sm"
            }`}>
              <span>Density: </span>
              <span className="font-bold text-neuro-text-primary">{uiDensity}</span>
            </div>
            <div className={`bg-neuro-border ${
              uiDensity === "SIMPLE"
                ? "w-1 h-8"
                : uiDensity === "EXPERT"
                  ? "w-px h-4"
                  : "w-px h-6"
            }`} />
            <div className={`text-neuro-text-secondary ${
              uiDensity === "SIMPLE"
                ? "text-sm"
                : uiDensity === "EXPERT"
                  ? "text-xs"
                  : "text-sm"
            }`}>
              <span>Risk: </span>
              <span
                className={`font-bold transition-colors ${
                  suspicionScore > 0.7
                    ? "text-neuro-primary"
                    : suspicionScore > 0.3
                      ? "text-yellow-400"
                      : "text-green-400"
                }`}
              >
                {(suspicionScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className={`flex items-center ${
            uiDensity === "SIMPLE"
              ? "gap-3"
              : uiDensity === "EXPERT"
                ? "gap-1"
                : "gap-2"
          }`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/demo")}
              className={`bg-neuro-accent/20 hover:bg-neuro-accent/30 text-neuro-accent border border-neuro-accent/50 rounded-lg font-semibold transition-all duration-200 ${
                uiDensity === "SIMPLE"
                  ? "px-5 py-3 text-sm"
                  : uiDensity === "EXPERT"
                    ? "px-2 py-1 text-xs"
                    : "px-4 py-2 text-sm"
              }`}
              title="Open Interactive Demo"
            >
              🎮 Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin")}
              className={`bg-neuro-primary/20 hover:bg-neuro-primary/30 text-neuro-primary border border-neuro-primary/50 rounded-lg font-semibold transition-all duration-200 ${
                uiDensity === "SIMPLE"
                  ? "px-5 py-3 text-sm"
                  : uiDensity === "EXPERT"
                    ? "px-2 py-1 text-xs"
                    : "px-4 py-2 text-sm"
              }`}
              title="Open Admin Dashboard"
            >
              🧠 Admin
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/analytics")}
              className={`bg-neuro-accent-alt/20 hover:bg-neuro-accent-alt/30 text-neuro-accent-alt border border-neuro-accent-alt/50 rounded-lg font-semibold transition-all duration-200 ${
                uiDensity === "SIMPLE"
                  ? "px-5 py-3 text-sm"
                  : uiDensity === "EXPERT"
                    ? "px-2 py-1 text-xs"
                    : "px-4 py-2 text-sm"
              }`}
              title="Open Analytics"
            >
              📊 Analytics
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Hero Section Component
 */
function HeroSection() {
  const { uiDensity } = useNeuro();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const orbVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-neuro-bg via-neuro-surface to-neuro-bg overflow-hidden py-20">
      {/* Animated Background Gradient Orbs */}
      <motion.div
        variants={orbVariants}
        animate="animate"
        className="absolute top-20 left-10 w-72 h-72 bg-neuro-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        variants={orbVariants}
        animate="animate"
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-neuro-accent/10 rounded-full blur-3xl"
      />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center pt-12"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neuro-primary/50 bg-neuro-primary/10 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-2 h-2 bg-neuro-primary rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-semibold text-neuro-primary">🚀 Phase 1 MVP</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={textVariants}
            className={`font-bold text-neuro-text-primary mb-6 leading-tight ${
              uiDensity === "SIMPLE"
                ? "text-7xl md:text-8xl lg:text-9xl"
                : uiDensity === "EXPERT"
                  ? "text-3xl md:text-4xl lg:text-5xl"
                  : "text-5xl md:text-6xl lg:text-7xl"
            }`}
          >
            Self-Adapting{" "}
            <motion.span
              className="bg-gradient-to-r from-neuro-primary via-neuro-primary-dark to-neuro-primary bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Intelligent Interface
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className={`text-neuro-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed ${
              uiDensity === "SIMPLE"
                ? "text-2xl md:text-3xl"
                : uiDensity === "EXPERT"
                  ? "text-xs md:text-sm"
                  : "text-lg md:text-xl"
            }`}
          >
            Experience UI that learns your behavior, detects threats, and adapts in real-time. Built for security and adaptability.
          </motion.p>

          {/* Key Features Pills */}
          <motion.div
            variants={itemVariants}
            className={`flex flex-wrap justify-center mb-12 ${
              uiDensity === "SIMPLE"
                ? "gap-4"
                : uiDensity === "EXPERT"
                  ? "gap-2"
                  : "gap-3"
            }`}
          >
            {[
              "🧠 AI-Powered",
              "🛡️ Fraud Detection",
              "⚡ Real-time",
              "🎯 Adaptive UI",
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-lg bg-neuro-card border border-neuro-border hover:border-neuro-primary/50 transition-all text-neuro-text-secondary cursor-pointer ${
                  uiDensity === "SIMPLE"
                    ? "px-6 py-3 text-base"
                    : uiDensity === "EXPERT"
                      ? "px-3 py-1 text-xs"
                      : "px-4 py-2 text-sm"
                }`}
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 30px rgba(230, 57, 70, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              id="hero-cta-button"
              onClick={() => navigate("/demo")}
              className={`px-8 py-4 rounded-lg font-bold text-white bg-gradient-to-r from-neuro-primary to-neuro-primary-dark hover:shadow-xl transition-all duration-300 ${
                uiDensity === "SIMPLE"
                  ? "px-10 py-5 text-xl"
                  : uiDensity === "EXPERT"
                    ? "px-6 py-2 text-sm"
                    : "px-8 py-4 text-lg"
              }`}
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Explore Demo →
              </motion.span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(58, 134, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin")}
              className={`rounded-lg font-bold text-neuro-accent border-2 border-neuro-accent/50 hover:border-neuro-accent hover:bg-neuro-accent/10 transition-all duration-300 ${
                uiDensity === "SIMPLE"
                  ? "px-10 py-5 text-xl"
                  : uiDensity === "EXPERT"
                    ? "px-6 py-2 text-sm"
                    : "px-8 py-4 text-lg"
              }`}
            >
              Go to Dashboard
            </motion.button>
          </motion.div>

          {/* Metrics Row */}
          <motion.div
            variants={itemVariants}
            className={`grid grid-cols-3 max-w-3xl mx-auto ${
              uiDensity === "SIMPLE"
                ? "gap-6 mt-20"
                : uiDensity === "EXPERT"
                  ? "gap-2 mt-8"
                  : "gap-4 mt-16"
            }`}
          >
            {[
              { icon: "🚀", label: "Sub-100ms", value: "Latency" },
              { icon: "🎯", label: "4 Threat", value: "Detection Types" },
              { icon: "📊", label: "Real-time", value: "Analytics" },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-lg bg-neuro-card border border-neuro-border/50 hover:border-neuro-primary/30 transition-all cursor-pointer ${
                  uiDensity === "SIMPLE"
                    ? "p-6"
                    : uiDensity === "EXPERT"
                      ? "p-2"
                      : "p-4"
                }`}
              >
                <motion.div
                  className={`mb-2 ${
                    uiDensity === "SIMPLE"
                      ? "text-5xl"
                      : uiDensity === "EXPERT"
                        ? "text-lg"
                        : "text-3xl"
                  }`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                >
                  {metric.icon}
                </motion.div>
                <div
                  className={`text-neuro-primary font-bold ${
                    uiDensity === "SIMPLE"
                      ? "text-2xl"
                      : uiDensity === "EXPERT"
                        ? "text-xs"
                        : "text-lg"
                  }`}
                >
                  {metric.label}
                </div>
                <div
                  className={`text-neuro-text-muted ${
                    uiDensity === "SIMPLE"
                      ? "text-sm"
                      : uiDensity === "EXPERT"
                        ? "text-[10px]"
                        : "text-xs"
                  }`}
                >
                  {metric.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Product Card Component
 */
function ProductCard({ title, description, id, icon }) {
  const { uiDensity } = useNeuro();

  // Density-based styling
  const getDensityPadding = () => {
    switch (uiDensity) {
      case "SIMPLE": return "p-8";
      case "EXPERT": return "p-3";
      default: return "p-6";
    }
  };

  const getDensityGap = () => {
    switch (uiDensity) {
      case "SIMPLE": return "gap-4";
      case "EXPERT": return "gap-1";
      default: return "gap-3";
    }
  };

  const getDensityBorder = () => {
    switch (uiDensity) {
      case "SIMPLE": return "border-2";
      case "EXPERT": return "border";
      default: return "border";
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ 
        y: -12, 
        boxShadow: "0 0 40px rgba(230, 57, 70, 0.3)",
      }}
      whileTap={{ scale: 0.98 }}
      id={`product-card-${id}`}
      className={`group relative ${getDensityPadding()} rounded-xl bg-neuro-card ${getDensityBorder()} border-neuro-border hover:border-neuro-primary/50 transition-all duration-300 overflow-hidden cursor-pointer`}
    >
      {/* Animated Gradient Background on Hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-neuro-primary/5 to-neuro-accent/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className={`relative z-10 ${getDensityGap()} flex flex-col`}>
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.2, rotate: 5 }}
          className={`${
            uiDensity === "SIMPLE"
              ? "w-16 h-16"
              : uiDensity === "EXPERT"
                ? "w-8 h-8"
                : "w-12 h-12"
          } rounded-lg bg-gradient-to-br from-neuro-primary/20 to-neuro-primary-dark/20 flex items-center justify-center transition-transform duration-300`}
        >
          <span className={`${
            uiDensity === "SIMPLE"
              ? "text-4xl"
              : uiDensity === "EXPERT"
                ? "text-lg"
                : "text-2xl"
          }`}>{icon}</span>
        </motion.div>

        {/* Title */}
        <motion.h3 
          className={`font-bold text-neuro-text-primary transition-colors group-hover:text-neuro-primary ${
            uiDensity === "SIMPLE"
              ? "text-3xl"
              : uiDensity === "EXPERT"
                ? "text-xs"
                : "text-lg"
          }`}
          animate={{ color: "inherit" }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <p
          className={`text-neuro-text-secondary ${
            uiDensity === "SIMPLE"
              ? "text-lg"
              : uiDensity === "EXPERT"
                ? "text-xs"
                : "text-sm"
          }`}
        >
          {description}
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          id={`product-button-${id}`}
          onClick={() => console.log(`Viewing details for ${title}...`)}
          className={`font-semibold text-neuro-primary hover:text-neuro-primary border-b border-neuro-primary/50 hover:border-neuro-primary transition-all inline-flex items-center gap-2 w-fit ${
            uiDensity === "SIMPLE"
              ? "text-xl"
              : uiDensity === "EXPERT"
                ? "text-xs"
                : "text-sm"
          }`}
        >
          Learn More
          <motion.span
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </div>

      {/* Border Glow on Hover */}
      <motion.div 
        className="absolute inset-0 rounded-xl border border-neuro-primary/0 pointer-events-none"
        whileHover={{ borderColor: "rgba(230, 57, 70, 0.5)" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/**
 * Product Grid Section
 */
function ProductSection() {
  const { uiDensity } = useNeuro();
  const products = [
    {
      id: "prod1",
      icon: "📍",
      title: "Smart Tracking",
      description: "Real-time behavior analysis with 1-second micro-batching",
    },
    {
      id: "prod2",
      icon: "🛡️",
      title: "Fraud Detection",
      description: "Impossible path identification via DAG validation",
    },
    {
      id: "prod3",
      icon: "🎯",
      title: "UI Adaptation",
      description: "Context-aware interface density changes (EXPERT/STANDARD/SIMPLE)",
    },
    {
      id: "prod4",
      icon: "📊",
      title: "Session Analytics",
      description: "Deep user insights with real-time dashboards",
    },
    {
      id: "prod5",
      icon: "⚡",
      title: "Risk Scoring",
      description: "Real-time anomaly detection with ML algorithms",
    },
    {
      id: "prod6",
      icon: "🧠",
      title: "Flow Validation",
      description: "DAG-based path checking with bot detection",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-neuro-bg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center ${
            uiDensity === "SIMPLE"
              ? "mb-20"
              : uiDensity === "EXPERT"
                ? "mb-8"
                : "mb-16"
          }`}
        >
          <motion.h2 
            className={`font-bold text-neuro-text-primary ${
              uiDensity === "SIMPLE"
                ? "text-6xl md:text-7xl mb-6"
                : uiDensity === "EXPERT"
                  ? "text-2xl md:text-3xl mb-2"
                  : "text-4xl md:text-5xl mb-4"
            }`}
            animate={{ backgroundPosition: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Powerful <span className="text-neuro-primary">Features</span>
          </motion.h2>
          <motion.p 
            className={`text-neuro-text-secondary ${
              uiDensity === "SIMPLE"
                ? "text-xl max-w-3xl mx-auto"
                : uiDensity === "EXPERT"
                  ? "text-xs max-w-lg mx-auto"
                  : "text-lg max-w-2xl mx-auto"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Explore the core capabilities that make NeuroUX the leading adaptive intelligence platform
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
            uiDensity === "SIMPLE"
              ? "gap-8"
              : uiDensity === "EXPERT"
                ? "gap-2"
                : "gap-6"
          }`}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
            >
              <ProductCard
                id={product.id}
                icon={product.icon}
                title={product.title}
                description={product.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Footer Component
 */
function Footer() {
  const { uiDensity } = useNeuro();
  
  const footerSections = [
    {
      title: "Brand",
      content: (
        <>
          <div className="flex items-center gap-2 mb-4">
            <div className={`bg-gradient-to-br from-neuro-primary to-neuro-primary-dark rounded-lg flex items-center justify-center ${
              uiDensity === "SIMPLE"
                ? "w-12 h-12"
                : uiDensity === "EXPERT"
                  ? "w-5 h-5"
                  : "w-8 h-8"
            }`}>
              <span className={`font-bold text-neuro-text-primary ${
                uiDensity === "SIMPLE"
                  ? "text-lg"
                  : uiDensity === "EXPERT"
                    ? "text-xs"
                    : "text-sm"
              }`}>Ⓝ</span>
            </div>
            <span className={`font-bold text-neuro-text-primary ${
              uiDensity === "SIMPLE"
                ? "text-2xl"
                : uiDensity === "EXPERT"
                  ? "text-sm"
                  : "text-lg"
            }`}>NeuroUX</span>
          </div>
          <p className={`text-neuro-text-secondary ${
            uiDensity === "SIMPLE"
              ? "text-base"
              : uiDensity === "EXPERT"
                ? "text-xs"
                : "text-sm"
          }`}>
            Self-adapting intelligent web interfaces powered by AI
          </p>
        </>
      ),
    },
    {
      title: "Product",
      links: ["Features", "Security", "Pricing", "Roadmap"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
    {
      title: "Follow",
      links: ["GitHub", "Twitter", "LinkedIn", "Discord"],
    },
  ];

  return (
    <footer className={`bg-gradient-to-b from-neuro-surface to-neuro-bg border-t border-neuro-border ${
      uiDensity === "SIMPLE"
        ? "py-16 mt-20"
        : uiDensity === "EXPERT"
          ? "py-6 mt-8"
          : "py-12 mt-16"
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Footer Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-4 mb-8 ${
          uiDensity === "SIMPLE"
            ? "gap-12"
            : uiDensity === "EXPERT"
              ? "gap-2"
              : "gap-8"
        }`}>
          {footerSections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className={`font-bold text-neuro-text-primary ${
                uiDensity === "SIMPLE"
                  ? "text-xl mb-6"
                  : uiDensity === "EXPERT"
                    ? "text-xs mb-2"
                    : "text-lg mb-4"
              }`}>{section.title}</h4>
              {section.content ? (
                section.content
              ) : (
                <ul className={`${
                  uiDensity === "SIMPLE"
                    ? "space-y-3"
                    : uiDensity === "EXPERT"
                      ? "space-y-1"
                      : "space-y-2"
                }`}>
                  {section.links?.map((link) => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href="#"
                        className={`text-neuro-text-secondary hover:text-neuro-primary transition-colors ${
                          uiDensity === "SIMPLE"
                            ? "text-base"
                            : uiDensity === "EXPERT"
                              ? "text-xs"
                              : "text-sm"
                        }`}
                      >
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div 
          className={`border-t border-neuro-border ${
            uiDensity === "SIMPLE"
              ? "my-12"
              : uiDensity === "EXPERT"
                ? "my-3"
                : "my-8"
          }`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ originX: 0 }}
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <p className={`text-neuro-text-muted text-center md:text-left ${
            uiDensity === "SIMPLE"
              ? "text-base"
              : uiDensity === "EXPERT"
                ? "text-xs"
                : "text-sm"
          }`}>
            🧠 NeuroUX Phase 1 - The Foundation | Hackathon 2026 | Built with 💙 by the team
          </p>
          <motion.div className={`flex items-center gap-6 mt-4 md:mt-0 ${
            uiDensity === "SIMPLE"
              ? "gap-8"
              : uiDensity === "EXPERT"
                ? "gap-3"
                : "gap-6"
          }`}>
            {["Privacy", "Terms", "Status"].map((item) => (
              <motion.a
                key={item}
                href="#"
                className={`text-neuro-text-secondary hover:text-neuro-primary transition-colors ${
                  uiDensity === "SIMPLE"
                    ? "text-base"
                    : uiDensity === "EXPERT"
                      ? "text-xs"
                      : "text-sm"
                }`}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

/**
 * Main App Component
 */
export default function App() {
  // Initialize behavior tracking
  useNeuroTracker();

  return (
    <Routes>
      {/* Demo Showcase Route */}
      <Route path="/demo" element={<DemoShowcase />} />

      {/* Admin Dashboard Route */}
      <Route path="/admin" element={<AdminPanel />} />
      
      {/* Admin Analytics Route (Phase 3) */}
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-neuro-bg">
            <Navbar />
            <HeroSection />
            <ProductSection />
            <SecurityOverlay />
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
