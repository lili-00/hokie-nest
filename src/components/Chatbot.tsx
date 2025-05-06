import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I'm your housing assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What's the average rent?",
    "Are utilities included?",
    "Is parking available?",
    "What amenities are included?",
    "How far is it from campus?"
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string = input.trim()) => {
    if (!text) return;

    // Add user message
    setMessages(prev => [...prev, { text, isUser: true }]);
    setInput('');

    // Simulate bot response
    const response = generateResponse(text);
    setMessages(prev => [...prev, { text: response, isUser: false }]);
  };

  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('average') || input.includes('typical') || input.includes('price') || input.includes('cost') || input.includes('rent')) {
      return "Studio apartments typically range from $1,200 to $1,800 per month, while apartments range from $1,500 to $3,000+ depending on the number of bedrooms. Many properties include utilities in the rent.";
    }

    if (input.includes('utilities') || input.includes('water') || input.includes('electric')) {
      return "Utility inclusion varies by property. Most properties include water and trash service, while some also include electricity and internet. You can find specific utility details on each property listing.";
    }

    if (input.includes('parking') || input.includes('car') || input.includes('garage')) {
      return "Most properties offer parking options. This can range from free street parking to dedicated spots or garage parking. Some properties include parking in the rent, while others charge an additional fee.";
    }

    if (input.includes('amenities') || input.includes('features')) {
      return "Common amenities include: high-speed internet, central air conditioning, in-unit or on-site laundry, secure building access, package receiving, bike storage, and study spaces. Some properties also offer gym facilities and community rooms.";
    }

    if (input.includes('far') || input.includes('distance') || input.includes('campus')) {
      return "All our properties are strategically located near Virginia Tech's Innovation Campus. Most are within a 15-minute walk or a short metro ride. Each property listing includes specific transportation details.";
    }

    return "I can help you find housing near Virginia Tech's Innovation Campus. Feel free to ask about prices, locations, amenities, or the application process! You can also click on any of the suggested questions above.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col h-[600px]">
          <div className="bg-primary p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center text-white">
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="font-medium">Housing Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Suggested Questions - Fixed at the top */}
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <p className="text-sm text-gray-500 mb-2">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question)}
                  className="text-sm bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.isUser
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Container - Fixed at the bottom */}
          <div className="border-t p-4 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="bg-primary text-white p-2 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover transition-colors"
          aria-label="chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}