"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Coding Junction?",
    answer:
      "Coding Junction is the official tech community of University Institute of Technology (UIT), Burdwan. We are a student-driven club dedicated to fostering a culture of learning, building, and innovating through hackathons, workshops, open-source projects, and collaborative coding sessions.",
  },
  {
    question: "How can I join Coding Junction?",
    answer:
      "Joining is completely free! Simply sign up on our website using your email or Google account, verify your college ID through our dashboard, and you're in. We welcome students from all years and all departments — you don't need to be a CS major.",
  },
  {
    question: "Do I need coding experience to join?",
    answer:
      "Absolutely not! We welcome beginners, intermediates, and advanced coders alike. Our workshops and resources are designed to help you grow from wherever you are. Many of our most active members joined with zero programming experience.",
  },
  {
    question: "What kind of events do you organize?",
    answer:
      "We host a variety of events including hackathons, coding competitions, technical workshops (Web Dev, App Dev, AI/ML, DSA), guest speaker sessions, project showcases, and collaborative open-source sprints. Check our Events page for upcoming ones!",
  },
  {
    question: "How do I get event certificates?",
    answer:
      "After attending an event, certificates are automatically generated and available in your Dashboard under the 'Certificates' tab. You'll need to have registered for the event and checked in using your digital event pass.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Yes! We have a Coding Junction mobile app available for Android. You can set up your app login credentials from the Dashboard settings. The app syncs with your web account for event passes, certificates, and notifications.",
  },
  {
    question: "How can I contribute to Coding Junction projects?",
    answer:
      "Head over to our GitHub organization (github.com/Coding-Junction) to explore open-source projects. You can also propose new project ideas through our community discussions. Active contributors earn recognition badges on their profiles!",
  },
  {
    question: "Can other colleges partner with Coding Junction?",
    answer:
      "Absolutely! We actively collaborate with tech communities from other institutions. Visit our Community Partners page or reach out to us via the Contact page to discuss partnership opportunities for events and projects.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-full px-4 md:px-8 lg:px-16 xl:px-20 py-16 md:py-24 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-center mb-12 md:mb-16"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
          Got Questions?
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
          Frequently Asked{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
            Questions
          </span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Everything you need to know about Coding Junction. Can&apos;t find what
          you&apos;re looking for? Reach out to us!
        </p>
      </motion.div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              <div
                className={`glass-card transition-all duration-300 ${
                  isOpen
                    ? "border-indigo-500/30 dark:border-indigo-500/30"
                    : ""
                }`}
              >
                <div className="glass-card-inner">
                  {/* Question */}
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20"
                            : "bg-black/[0.04] dark:bg-white/[0.06]"
                        }`}
                      >
                        <HelpCircle
                          className={`w-4 h-4 transition-colors duration-300 ${
                            isOpen
                              ? "text-white"
                              : "text-muted-foreground group-hover:text-indigo-500"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm md:text-base font-semibold transition-colors duration-200 ${
                          isOpen
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-foreground dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-colors duration-200 ${
                          isOpen
                            ? "text-indigo-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] },
                          opacity: { duration: 0.25, delay: 0.1 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                          <div className="pl-11 border-l-2 border-indigo-500/20 ml-[1px]">
                            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
