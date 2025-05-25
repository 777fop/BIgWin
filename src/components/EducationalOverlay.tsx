
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EducationalOverlay = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const educationalSlides = [
    {
      title: "🥳 This is an Amazing Opportunity",
      content: "Follow the rules and Win BIG! With Big Win!🥳!",
      warning: "If it sounds too good to be true, it probably is!"
    },
    {
      title: "Red Flag #1: Unrealistic Returns",
      content: "Daily returns of 0.5-6 USDT with no real business model or product. Real investments don't guarantee daily profits.",
      warning: "If it sounds too good to be true, it probably is!"
    },
    {
      title: "Red Flag #2: Upgrade Fees",
      content: "Asking for money upfront to 'upgrade' and earn more. Legitimate platforms don't require upgrade payments.",
      warning: "Never pay money to make money on unknown platforms!"
    },
    {
      title: "Red Flag #3: High Minimum Withdrawals",
      content: "300 USDT minimum withdrawal is designed to trap your money. Most legitimate platforms have low or no minimums.",
      warning: "This prevents you from testing small withdrawals first!"
    },
    {
      title: "Red Flag #4: Fake Social Proof",
      content: "The 'successful withdrawals' shown are completely fabricated to create false confidence.",
      warning: "Screenshots and testimonials can be easily faked!"
    },
    {
      title: "Red Flag #5: Pressure Tactics",
      content: "Urgent bonuses, limited time offers, and referral pressure are designed to make you act without thinking.",
      warning: "Take time to research any investment opportunity!"
    },
    {
      title: "How to Protect Yourself",
      content: "1. Research thoroughly\n2. Start with small amounts\n3. Verify company registration\n4. Check reviews from multiple sources\n5. Be skeptical of guaranteed returns",
      warning: "If someone contacts you about 'easy money', it's likely a scam!"
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl scam-warning border-4 border-red-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            {educationalSlides[currentSlide].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white space-y-4">
          <div className="text-lg leading-relaxed whitespace-pre-line">
            {educationalSlides[currentSlide].content}
          </div>
          
          <div className="bg-red-600/30 border border-red-500 p-4 rounded-lg">
            <p className="font-bold text-yellow-300">
              ⚠️ {educationalSlides[currentSlide].warning}
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <Button 
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Previous
            </Button>
            
            <div className="text-white">
              {currentSlide + 1} of {educationalSlides.length}
            </div>
            
            {currentSlide < educationalSlides.length - 1 ? (
              <Button 
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={() => setIsVisible(false)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                I Understand - Continue Demo
              </Button>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-300 mt-4">
            This educational tool was created to help people recognize and avoid cryptocurrency scams.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalOverlay;
