"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Send, Mail, MapPin, Phone, MessageCircle,
  Github, Instagram, Linkedin, CheckCircle2, AlertCircle,
  Building2, Clock, Globe
} from "lucide-react";

const ContactClient = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "ranadebsaha@coding-junction.in",
      href: "mailto:ranadebsaha@coding-junction.in",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "UIT Burdwan, Purba Bardhaman, West Bengal, India",
      href: "https://maps.google.com/?q=University+Institute+of+Technology+Burdwan",
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      icon: Globe,
      label: "Website",
      value: "coding-junction.in",
      href: "https://coding-junction.in",
      gradient: "from-violet-500 to-purple-400",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24–48 hours",
      gradient: "from-amber-500 to-orange-400",
    },
  ];

  const socials = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/Coding-Junction",
      hoverClass: "hover:bg-gray-900 hover:text-white hover:border-gray-900 dark:hover:bg-white dark:hover:text-black",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://www.instagram.com/codingjunction_uitbu/",
      hoverClass: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white hover:border-pink-500",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/company/coding-junction",
      hoverClass: "hover:bg-indigo-600 hover:text-white hover:border-indigo-600",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Hero */}
      <section className="relative w-full px-4 md:px-8 lg:px-16 xl:px-20 pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/8 dark:from-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <MessageCircle className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground dark:text-white tracking-tight mb-4">
            Contact{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Us
            </span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Have a question, collaboration idea, or just want to say hello?
            We&apos;d love to hear from you!
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards + Form */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-20 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Info + Socials */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div className="glass-card group">
                    <div className="glass-card-inner p-4 flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-foreground dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground dark:text-white">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="glass-card">
                <div className="glass-card-inner p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    Follow Us
                  </p>
                  <div className="flex gap-3">
                    {socials.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className={`w-10 h-10 rounded-xl border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center transition-all duration-300 ${social.hoverClass}`}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass-card">
              <div className="glass-card-inner p-6 md:p-8">
                <h2 className="text-lg font-bold text-foreground dark:text-white mb-1">
                  Send us a Message
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Fill out the form below and we&apos;ll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground dark:text-white mb-1.5 block">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground dark:text-white mb-1.5 block">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@email.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground dark:text-white mb-1.5 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="What's this about?"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground dark:text-white mb-1.5 block">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us more..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all resize-none"
                    />
                  </div>

                  {/* Status Messages */}
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      Message sent successfully! We&apos;ll get back to you soon.
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Failed to send. Please try again or email us directly.
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactClient;
