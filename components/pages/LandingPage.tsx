'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

interface LandingPageProps {
  onNavigate: (page: string) => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0)

  const faqs = [
    {
      question: 'What is FLEKSA?',
      answer:
        'FLEKSA is a modern, cloud-based Restaurant POS Management System designed to streamline operations, improve customer experience, and maximize revenue with real-time analytics and QR code ordering.',
    },
    {
      question: 'How does the QR code ordering system work?',
      answer:
        'Customers can scan a QR code at their table to view the menu, place orders, and make payments directly from their mobile device. Orders are instantly sent to the kitchen and tracked in real-time.',
    },
    {
      question: 'What are the key features included?',
      answer:
        'Key features include real-time dashboards, QR code ordering, dynamic menu management, order tracking, revenue analytics, customer insights, staff management, and comprehensive reporting.',
    },
    {
      question: 'Can I integrate FLEKSA with my existing systems?',
      answer:
        'Yes! FLEKSA offers seamless integration with popular payment gateways, kitchen display systems, and third-party delivery platforms. Our API is flexible and well-documented.',
    },
    {
      question: 'Is FLEKSA secure for handling payments?',
      answer:
        'Absolutely. FLEKSA uses industry-standard encryption, PCI DSS compliance, and secure payment gateways to ensure all transactions are safe and protected.',
    },
      {
        question: 'How can I get started with FLEKSA?',
        answer:
          'Sign up for a free trial on our website, set up your restaurant profile, add your menu items, and configure your QR codes. Our onboarding team will guide you through the entire process.',
      },
      {
        question: 'What support and training do you provide?',
        answer:
          'We offer comprehensive 24/7 customer support via email, phone, and live chat. Additionally, we provide video tutorials, documentation, and on-site training to ensure your team is fully equipped to use FLEKSA effectively.',
      },
    ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation Header */}
      <nav className="flex justify-between items-center p-6 bg-black/40 backdrop-blur">
        <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
          🍱 FLEKSA
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('menu')}
            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            Menu
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Orders
          </button>
          <button
            onClick={() => onNavigate('split')}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Split Bill
          </button>
          <button
            onClick={() => onNavigate('report')}
            className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
          >
            Reports
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 gap-8">
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Restaurant with <span className="text-yellow-500">FLEKSA</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Modern POS system with QR code ordering, real-time analytics, and seamless kitchen management.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 bg-yellow-500 text-black font-bold text-lg rounded-lg hover:bg-yellow-400 transition"
          >
            Get Started Now
          </button>
        </div>
        <div className="flex-1">
          <div className="bg-gray-700 rounded-xl p-6 aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-300">QR Code Ordering System</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-16 bg-gray-800/50">
        <h2 className="text-4xl font-bold mb-12 text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '📊',
              title: 'Real-Time Analytics',
              desc: 'Monitor sales, revenue, and customer behavior in real-time',
            },
            {
              icon: '🍽️',
              title: 'QR Code Ordering',
              desc: 'Customers order directly from tables via QR codes',
            },
            {
              icon: '👨‍🍳',
              title: 'Kitchen Management',
              desc: 'Display and track orders in the kitchen instantly',
            },
            {
              icon: '💳',
              title: 'Smart Payments',
              desc: 'Multiple payment options with secure processing',
            },
            {
              icon: '📈',
              title: 'Growth Analytics',
              desc: 'Detailed insights to grow your business',
            },
            {
              icon: '⚙️',
              title: 'Easy Integration',
              desc: 'Connect with your existing systems seamlessly',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-yellow-500 transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-600/50 transition"
              >
                <span className="text-lg font-semibold text-left">{faq.question}</span>
                {expandedFAQ === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedFAQ === index && (
                <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-600 text-gray-300">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 border-t border-gray-700 px-6 py-8 text-center text-gray-400">
        <p>&copy; 2024 FLEKSA. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
