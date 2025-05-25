
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plan } from '@/types';

interface PlanUpgradeProps {
  plans: Plan[];
  currentPlan: Plan;
  onUpgrade: (plan: Plan) => void;
  onClose: () => void;
}

const PlanUpgrade: React.FC<PlanUpgradeProps> = ({ plans, currentPlan, onUpgrade, onClose }) => {
  const walletAddress = "TBTUrLR2hnb3tTxXJBxsHwhb3GGQzUYBzY"; // TRC20 USDT address

  const handleUpgrade = (plan: Plan) => {
    if (plan.price > 0) {
      // Show payment instruction
      alert(`To upgrade to ${plan.name} plan:\n\nSend exactly ${plan.price} USDT (TRC20) to:\n${walletAddress}\n\nAfter payment, submit the upgrade request and your account will be upgraded!`);
    }
    onUpgrade(plan);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="crypto-card text-white border-0">
          <CardHeader className="text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold bg-black/30 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ×
            </button>
            <CardTitle className="text-3xl font-bold neon-text">
              ⬆️ Upgrade Your Plan
            </CardTitle>
            <p className="text-yellow-300">Unlock higher daily earnings!</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`${plan.color} text-white border-0 ${currentPlan.id === plan.id ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {currentPlan.id === plan.id && (
                      <div className="text-yellow-400 font-bold">CURRENT PLAN</div>
                    )}
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-4xl font-bold text-yellow-400">
                      {plan.dailyClaim} USDT
                    </div>
                    <div className="text-lg">per day</div>
                    
                    {plan.price > 0 && (
                      <div className="text-2xl font-bold text-green-400">
                        Upgrade: {plan.price} USDT
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="text-sm">✓ {feature}</div>
                      ))}
                    </div>
                    
                    {currentPlan.id !== plan.id && (
                      <Button 
                        onClick={() => handleUpgrade(plan)}
                        className="w-full gold-gradient text-black font-bold mt-4 hover:scale-105 transition-transform"
                      >
                        {plan.price === 0 ? 'DOWNGRADE' : '💰 REQUEST UPGRADE'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Payment Instructions */}
            <Card className="bg-yellow-600/20 border-yellow-600/30 text-white mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-400">💳 Payment & Upgrade Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="mb-2">To upgrade your plan:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Send the exact upgrade amount in USDT (TRC20 network only)</li>
                    <li>Use this wallet address: <code className="bg-black/30 px-2 py-1 rounded text-yellow-400 break-all">{walletAddress}</code></li>
                    <li>Click "Request Upgrade" to submit your upgrade request</li>
                    <li>Your account will be upgraded once payment is confirmed (usually within 24 hours)</li>
                    <li>Start earning higher daily rewards after confirmation!</li>
                  </ol>
                </div>
                
                <div className="bg-red-500/20 border border-red-500/30 p-3 rounded">
                  <p className="text-red-300 text-sm">
                    ⚠️ IMPORTANT: Payment is required BEFORE clicking upgrade. Your upgrade will be processed once payment is verified!
                  </p>
                </div>
                
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded">
                  <p className="text-green-300 text-sm font-bold">
                    🔥 TRC20 USDT Address: {walletAddress}
                  </p>
                  <p className="text-green-200 text-xs mt-1">
                    Copy this address exactly - double check before sending!
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-4">
              <Button 
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanUpgrade;
