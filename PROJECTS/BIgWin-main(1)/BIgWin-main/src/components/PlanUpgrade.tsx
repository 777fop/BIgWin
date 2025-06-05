
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plan, User } from '@/types';
import { StorageService } from '@/services/storageService';

interface PlanUpgradeProps {
  plans: Plan[];
  currentPlan: Plan;
  user: User;
  onUpgrade: (plan: Plan) => void;
  onClose: () => void;
}

const PlanUpgrade: React.FC<PlanUpgradeProps> = ({ plans, currentPlan, user, onUpgrade, onClose }) => {
  const walletAddress = "TBTUrLR2hnb3tTxXJBxsHwhb3GGQzUYBzY";
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [step, setStep] = useState<'select' | 'payment' | 'confirm'>('select');

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    if (plan.price > 0) {
      setStep('payment');
    } else {
      // Free downgrade
      onUpgrade(plan);
      onClose();
    }
  };

  const handlePaymentConfirm = () => {
    setStep('confirm');
  };

  const handleUpgradeSubmit = () => {
    if (!selectedPlan) return;
    
    if (selectedPlan.price > 0) {
      // Create upgrade request with transaction hash
      const request = StorageService.createUpgradeRequest(user, selectedPlan.id, selectedPlan.name, selectedPlan.price);
      
      // Update user with pending upgrade
      const updatedUser = {
        ...user,
        pendingUpgrade: {
          planId: selectedPlan.id,
          amount: selectedPlan.price,
          transactionHash: transactionHash,
          status: 'pending' as const,
          requestDate: new Date().toISOString()
        }
      };
      
      onUpgrade(selectedPlan);
      alert(`Upgrade request submitted for ${selectedPlan.name} plan! Your account will be upgraded once payment is verified.`);
    } else {
      onUpgrade(selectedPlan);
    }
    onClose();
  };

  if (step === 'payment' && selectedPlan) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="max-w-md w-full">
          <Card className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white border-0">
            <CardHeader className="text-center relative">
              <Button
                onClick={() => setStep('select')}
                className="absolute top-4 left-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 w-8 h-8 p-0 text-lg"
                size="sm"
              >
                ←
              </Button>
              <Button
                onClick={onClose}
                className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 w-8 h-8 p-0 text-lg"
                size="sm"
              >
                ×
              </Button>
              <CardTitle className="text-2xl font-bold text-white">
                💰 Payment Instructions
              </CardTitle>
              <p className="text-yellow-300">Upgrading to {selectedPlan.name} Plan</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {selectedPlan.price} USDT
                </div>
                <p className="text-white">Send exactly this amount</p>
              </div>

              <div className="bg-black/30 p-3 rounded border border-green-500/30">
                <div className="text-xs text-gray-400 mb-1">TRC20 USDT Address:</div>
                <div className="font-mono text-sm break-all text-green-400 bg-black/50 p-2 rounded">
                  {walletAddress}
                </div>
                <Button
                  onClick={() => navigator.clipboard.writeText(walletAddress)}
                  className="w-full mt-2 bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 text-sm"
                  size="sm"
                >
                  📋 COPY ADDRESS
                </Button>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded">
                <p className="text-yellow-200 text-sm">
                  ⚠️ Only send USDT (TRC20) to this address. Other tokens will be lost!
                </p>
              </div>

              <Button
                onClick={handlePaymentConfirm}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 hover:scale-105 transition-transform"
              >
                I HAVE SENT THE PAYMENT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'confirm' && selectedPlan) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="max-w-md w-full">
          <Card className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white border-0">
            <CardHeader className="text-center relative">
              <Button
                onClick={() => setStep('payment')}
                className="absolute top-4 left-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 w-8 h-8 p-0 text-lg"
                size="sm"
              >
                ←
              </Button>
              <Button
                onClick={onClose}
                className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 w-8 h-8 p-0 text-lg"
                size="sm"
              >
                ×
              </Button>
              <CardTitle className="text-2xl font-bold text-white">
                📝 Confirm Upgrade
              </CardTitle>
              <p className="text-blue-300">Enter transaction details</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-white mb-2">Upgrading to: <strong>{selectedPlan.name}</strong></p>
                <p className="text-green-400 font-bold">Amount: {selectedPlan.price} USDT</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Transaction Hash</label>
                <Input
                  type="text"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  placeholder="Enter transaction hash"
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
              </div>

              <div className="text-xs text-gray-400">
                Your upgrade will be processed within 24 hours after verification.
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('payment')}
                  variant="outline"
                  className="flex-1 border-gray-400 text-gray-200 hover:bg-gray-700"
                >
                  BACK
                </Button>
                <Button
                  onClick={handleUpgradeSubmit}
                  disabled={!transactionHash.trim()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50"
                >
                  SUBMIT UPGRADE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white border-0">
          <CardHeader className="text-center relative">
            <Button
              onClick={onClose}
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 w-8 h-8 p-0 text-lg"
              size="sm"
            >
              ×
            </Button>
            <CardTitle className="text-3xl font-bold text-white">
              ⬆️ Upgrade Your Plan
            </CardTitle>
            <p className="text-yellow-300">Choose your new plan and unlock higher daily earnings!</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`${plan.color} text-white border-0 ${
                    currentPlan.id === plan.id 
                      ? 'ring-4 ring-yellow-400' 
                      : 'hover:scale-105 transition-transform cursor-pointer'
                  }`}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                    {currentPlan.id === plan.id && (
                      <div className="text-yellow-400 font-bold">CURRENT PLAN</div>
                    )}
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-4xl font-bold text-yellow-400">
                      ${plan.dailyClaim}
                    </div>
                    <div className="text-lg text-white">Daily Claims</div>
                    
                    <div className="text-lg text-white">
                      Min Withdrawal: <span className="font-bold text-green-400">${plan.withdrawalMinimum}</span>
                    </div>
                    
                    {plan.price > 0 && (
                      <div className="text-2xl font-bold text-green-400">
                        Upgrade: ${plan.price}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="text-sm text-white">✓ {feature}</div>
                      ))}
                    </div>
                    
                    {currentPlan.id !== plan.id && (
                      <Button 
                        onClick={() => handleSelectPlan(plan)}
                        disabled={!!user.pendingUpgrade}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold mt-4 hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        {plan.price === 0 ? 'DOWNGRADE' : user.pendingUpgrade ? 'UPGRADE PENDING' : '💰 SELECT PLAN'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Payment Instructions */}
            <Card className="bg-yellow-600/20 border-yellow-600/30 text-white mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-400">💳 How Upgrade Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-white">
                  <p className="mb-2">To upgrade your plan:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Select your desired plan above</li>
                    <li>Send the exact amount in USDT (TRC20 network only)</li>
                    <li>Enter your transaction hash as proof of payment</li>
                    <li>Your account will be upgraded within 24 hours after verification</li>
                    <li>Start earning higher daily rewards!</li>
                  </ol>
                </div>
                
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded">
                  <p className="text-green-300 text-sm font-bold">
                    🔥 TRC20 USDT Address: {walletAddress}
                  </p>
                  <p className="text-green-200 text-xs mt-1">
                    This address will be shown during the upgrade process
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
