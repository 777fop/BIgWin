
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { StorageService } from '@/services/storageService';

interface DepositFormProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({ user, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [step, setStep] = useState<'amount' | 'address' | 'confirm' | 'sent'>('amount');
  const [loading, setLoading] = useState(false);

  const walletAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"; // Demo USDT wallet address

  const handleAmountSubmit = () => {
    if (parseFloat(amount) >= 1) {
      setStep('address');
    }
  };

  const handleSentConfirmation = async () => {
    if (!transactionHash.trim()) {
      alert('Please enter transaction hash');
      return;
    }

    setLoading(true);
    try {
      StorageService.createDepositRequest(
        user,
        parseFloat(amount),
        walletAddress,
        transactionHash
      );
      setStep('sent');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      alert('Error submitting deposit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <Card className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white border-0 w-full max-w-sm sm:max-w-md shadow-2xl">
        <CardHeader className="text-center pb-2 px-3 sm:px-4">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent flex-1 text-center">
              💰 DEPOSIT USDT
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white border-0 w-8 h-8 p-0 text-sm font-bold rounded-full ml-2"
              size="sm"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-4 space-y-4">
          {step === 'amount' && (
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-green-400 mb-2">Enter Deposit Amount</h3>
                <p className="text-sm text-gray-300">Minimum deposit: 1 USDT</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USDT)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 text-center text-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 50, 100].map(preset => (
                  <Button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 text-sm py-2"
                    size="sm"
                  >
                    {preset}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) < 1}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 hover:scale-105 transition-transform disabled:opacity-50"
              >
                CONTINUE
              </Button>
            </>
          )}

          {step === 'address' && (
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-green-400 mb-2">Send USDT to this address</h3>
                <p className="text-sm text-gray-300">Amount: {amount} USDT</p>
              </div>
              
              <div className="bg-black/30 p-3 rounded border border-green-500/30">
                <div className="text-xs text-gray-400 mb-1">USDT (TRC20) Address:</div>
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
                onClick={() => setStep('confirm')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 hover:scale-105 transition-transform"
              >
                I HAVE SENT THE USDT
              </Button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Confirm Transaction</h3>
                <p className="text-sm text-gray-300">Enter your transaction hash to complete</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Transaction Hash</label>
                <Input
                  type="text"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  placeholder="Enter transaction hash"
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 text-sm"
                />
              </div>

              <div className="text-xs text-gray-400">
                Your deposit will be processed by an admin within 24 hours.
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('address')}
                  variant="outline"
                  className="flex-1 border-gray-400 text-gray-200 hover:bg-gray-700"
                >
                  BACK
                </Button>
                <Button
                  onClick={handleSentConfirmation}
                  disabled={loading || !transactionHash.trim()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </div>
            </>
          )}

          {step === 'sent' && (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Request Submitted!</h3>
              <p className="text-sm text-gray-300">
                Your deposit request is now pending admin approval. You'll receive the funds once confirmed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositForm;
