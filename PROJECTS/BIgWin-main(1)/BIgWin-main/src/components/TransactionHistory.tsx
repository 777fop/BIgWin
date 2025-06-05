
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClose: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'withdrawal': return '💸';
      case 'referral': return '👥';
      case 'claim': return '🎁';
      default: return '📊';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="crypto-card text-white border-0 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl">📊 Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(transaction.type)}</span>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-400">{transaction.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                    {transaction.type === 'withdrawal' ? '-' : '+'}
                    {transaction.amount.toFixed(2)} USDT
                  </div>
                  <div className={`text-sm ${getStatusColor(transaction.status)}`}>
                    {transaction.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No transactions yet. Start by claiming your daily bonus!
              </div>
            )}
          </div>
          
          {/* Fake successful withdrawals for credibility */}
          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="text-lg font-bold text-green-400 mb-3">✅ Recent Successful Withdrawals</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>User: crypto_trader_2024</span>
                <span className="text-green-400">+450 USDT</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>User: bitcoin_hodler</span>
                <span className="text-green-400">+750 USDT</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>User: defi_master</span>
                <span className="text-green-400">+320 USDT</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>User: nft_collector</span>
                <span className="text-green-400">+680 USDT</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
