
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/types';

interface WithdrawalFormProps {
  user: User;
  onClose: () => void;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ user, onClose }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  // Different minimum withdrawal based on plan
  const getMinimumWithdraw = (plan: string) => {
    switch (plan) {
      case 'premium':
      case 'vip':
        return 5;
      case 'basic':
      default:
        return 100;
    }
  };

  const minimumWithdraw = getMinimumWithdraw(user.plan);
  const processingFee = 5;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < minimumWithdraw) {
      alert(`Minimum withdrawal amount for ${user.plan} plan is ${minimumWithdraw} USDT`);
      return;
    }
    
    if (withdrawAmount > user.balance) {
      alert('Insufficient balance');
      return;
    }
    
    if (!address) {
      alert('Please enter your wallet address');
      return;
    }
    
    alert(`Withdrawal request submitted!\n\nAmount: ${withdrawAmount} USDT\nFee: ${processingFee} USDT\nNet Amount: ${withdrawAmount - processingFee} USDT\n\nProcessing time: 24-48 hours\nYou will receive a confirmation email shortly.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="crypto-card text-white border-0 w-full max-w-xs sm:max-w-sm md:max-w-md">
        <CardHeader className="text-center px-3 sm:px-4 md:px-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold neon-text">
            💸 Withdraw USDT
          </CardTitle>
          <p className="text-gray-300 text-sm sm:text-base">Available: {user.balance.toFixed(2)} USDT</p>
          <p className="text-yellow-300 text-xs sm:text-sm">Plan: {user.plan.toUpperCase()}</p>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 md:px-6">
          <form onSubmit={handleWithdraw} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-gray-300 mb-2">
                Withdrawal Amount (Min: {minimumWithdraw} USDT for {user.plan} plan)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min={minimumWithdraw}
                max={user.balance}
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/60 text-sm sm:text-base h-10 sm:h-12"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm text-gray-300 mb-2">
                USDT Wallet Address (TRC20)
              </label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your TRC20 wallet address"
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/60 text-sm sm:text-base h-10 sm:h-12"
              />
            </div>
            
            {/* Fee Information */}
            <div className="bg-blue-500/20 border border-blue-500/30 p-2 sm:p-3 rounded">
              <div className="text-xs sm:text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Withdrawal Amount:</span>
                  <span>{amount || '0'} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>{processingFee} USDT</span>
                </div>
                <hr className="border-blue-500/30" />
                <div className="flex justify-between font-bold">
                  <span>You'll Receive:</span>
                  <span>{(parseFloat(amount || '0') - processingFee).toFixed(2)} USDT</span>
                </div>
              </div>
            </div>
            
            {/* Warning */}
            <div className="bg-red-500/20 border border-red-500/30 p-2 sm:p-3 rounded">
              <p className="text-red-300 text-xs sm:text-sm">
                ⚠️ Processing time: 24-48 hours. Make sure your wallet address is correct - we cannot reverse transactions!
              </p>
            </div>
            
            {parseFloat(amount || '0') < minimumWithdraw && amount && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 p-2 sm:p-3 rounded">
                <p className="text-yellow-300 text-xs sm:text-sm">
                  ⚠️ Minimum withdrawal amount for {user.plan} plan is {minimumWithdraw} USDT
                </p>
              </div>
            )}
            
            <div className="flex gap-2 sm:gap-4">
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm py-2 sm:py-3"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={parseFloat(amount || '0') < minimumWithdraw || !amount || !address}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm py-2 sm:py-3"
              >
                💸 WITHDRAW
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalForm;
