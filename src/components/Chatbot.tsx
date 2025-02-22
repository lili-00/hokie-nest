import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Property } from '../types/supabase';

type Message = {
  type: 'user' | 'bot';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: 'Hi! I can help you find housing. What are you looking for?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserInput = async (userInput: string) => {
    const lowercaseInput = userInput.toLowerCase();
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userInput }]);
    setIsTyping(true);

    try {
      let response = '';
      
      // Check for specific budget range
      const budgetMatch = lowercaseInput.match(/\$?(\d+)(?:\s*-\s*\$?(\d+))?/);
      if (budgetMatch && (lowercaseInput.includes('budget') || lowercaseInput.includes('price') || lowercaseInput.includes('cost'))) {
        const minBudget = parseInt(budgetMatch[1]);
        const maxBudget = budgetMatch[2] ? parseInt(budgetMatch[2]) : minBudget + 500;

        const { data: properties } = await supabase
          .from('properties')
          .select('*')
          .gte('price', minBudget)
          .lte('price', maxBudget)
          .order('price');

        if (properties && properties.length > 0) {
          response = `I found ${properties.length} properties within your budget range ($${minBudget}-$${maxBudget}):\n\n`;
          properties.forEach(property => {
            response += `- ${property.title}: $${property.price}/month, ${property.bedrooms} bed, ${property.bathrooms} bath\n`;
          });
          response += '\nWould you like to know more about any of these properties?';
        } else {
          response = `I couldn't find any properties between $${minBudget} and $${maxBudget}. Would you like to try a different budget range?`;
        }
      }
      // Check for general price-related queries
      else if (lowercaseInput.includes('price') || lowercaseInput.includes('cost') || lowercaseInput.includes('budget')) {
        const { data: properties } = await supabase
          .from('properties')
          .select('price')
          .order('price');
        
        if (properties && properties.length > 0) {
          const minPrice = properties[0].price;
          const maxPrice = properties[properties.length - 1].price;
          response = `Available properties range from $${minPrice} to $${maxPrice} per month. You can tell me your budget range (e.g., "$800-1200") and I'll find matching properties.`;
        }
      }
      // Check for location-related queries
      else if (lowercaseInput.includes('location') || lowercaseInput.includes('where') || lowercaseInput.includes('area')) {
        const { data: properties } = await supabase
          .from('properties')
          .select('address')
          .limit(3);
        
        if (properties && properties.length > 0) {
          response = `We have properties in several locations, including:\n${properties.map(p => `- ${p.address}`).join('\n')}\n\nWould you like to know more about any of these areas?`;
        }
      }
      // Check for bedroom-related queries
      else if (lowercaseInput.includes('bedroom') || lowercaseInput.includes('bed')) {
        const { data: properties } = await supabase
          .from('properties')
          .select('bedrooms')
          .order('bedrooms');
        
        if (properties && properties.length > 0) {
          const bedrooms = [...new Set(properties.map(p => p.bedrooms))];
          response = `We have properties with ${bedrooms.join(', ')} bedrooms. How many bedrooms are you looking for?`;
        }
      }
      // Check for amenities-related queries
      else if (lowercaseInput.includes('amenities') || lowercaseInput.includes('features')) {
        const { data: properties } = await supabase
          .from('properties')
          .select('amenities')
          .limit(5);
        
        if (properties && properties.length > 0) {
          const allAmenities = new Set(properties.flatMap(p => p.amenities));
          response = `Common amenities in our properties include:\n${Array.from(allAmenities).slice(0, 5).map(a => `- ${a}`).join('\n')}\n\nWould you like to know about specific amenities?`;
        }
      }
      // Default response
      else {
        response = "I can help you find housing based on your budget, location, number of bedrooms, or amenities. For example, you can tell me 'Show properties between $800-1200' or ask about specific locations.";
      }

      // Add bot response after a small delay to simulate typing
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: response }]);
        setIsTyping(false);
      }, 500);

    } catch (error) {
      console.error('Error processing query:', error);
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    processUserInput(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-hover transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Housing Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary-hover transition-colors"
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}