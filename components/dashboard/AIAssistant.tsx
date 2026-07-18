"use client";

import { useState } from "react";
import { Send, Loader } from "lucide-react";

const suggestedPrompts = [
  "What are today's top-selling items?",
  "Which inventory items need restocking?",
  "Predict tonight's order volume",
  "Generate a sales summary",
];

export function AIAssistant() {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content: "Hello! I'm your FLEKSA AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on today's data, Biryani is the top seller with 245 orders, followed by Burger with 189 orders.",
        "Your current inventory shows low stock on: Basmati Rice (15%), Chicken (20%), and Paneer (25%).",
        "Prediction: You'll likely see a 15-20% increase in orders tonight based on current trends.",
        "Daily Summary: Revenue ₹1,24,580 | Orders 342 | Satisfaction 92% | Peak hour: 8-9 PM",
      ];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setLoading(true);

    setTimeout(() => {
      const responses = [
        "Based on today's data, Biryani is the top seller with 245 orders, followed by Burger with 189 orders.",
        "Your current inventory shows low stock on: Basmati Rice (15%), Chicken (20%), and Paneer (25%).",
        "Prediction: You'll likely see a 15-20% increase in orders tonight based on current trends.",
        "Daily Summary: Revenue ₹1,24,580 | Orders 342 | Satisfaction 92% | Peak hour: 8-9 PM",
      ];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chat Panel */}
      <div className="enterprise-panel flex flex-col h-full min-h-96">
        <h3 className="text-lg font-bold text-foreground font-mono mb-4">
          AI Restaurant Assistant
        </h3>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg font-mono text-sm ${
                  msg.role === "user"
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-card border border-primary/20 text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-primary/20 px-4 py-2 rounded-lg">
                <Loader className="w-4 h-4 text-primary animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-card/50 border border-primary/20 rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Suggested Prompts */}
      <div className="enterprise-panel flex flex-col">
        <h3 className="text-lg font-bold text-foreground font-mono mb-4">
          Suggested Queries
        </h3>

        <div className="space-y-3 flex-1">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedPrompt(prompt)}
              className="w-full text-left p-3 rounded-lg border border-primary/20 bg-card/50 hover:bg-primary/10 hover:border-primary/50 transition-all text-sm text-foreground font-mono"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Real-time Stats */}
        <div className="mt-6 pt-6 border-t border-primary/20 space-y-3">
          <h4 className="text-sm font-bold text-foreground font-mono">
            Real-time Monitoring
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card/50 p-3 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground font-mono">
                Active Orders
              </p>
              <p className="text-2xl font-bold text-primary font-mono">7</p>
            </div>
            <div className="bg-card/50 p-3 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground font-mono">
                Avg Prep Time
              </p>
              <p className="text-2xl font-bold text-primary font-mono">14m</p>
            </div>
            <div className="bg-card/50 p-3 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground font-mono">
                Orders/min
              </p>
              <p className="text-2xl font-bold text-primary font-mono">3.2</p>
            </div>
            <div className="bg-card/50 p-3 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground font-mono">
                System Load
              </p>
              <p className="text-2xl font-bold text-success font-mono">42%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
