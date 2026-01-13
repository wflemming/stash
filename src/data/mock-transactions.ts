export interface Transaction {
  id: string;
  date: string;
  dayOfWeek: string;
  time: string;
  merchant: string;
  amount: number;
  category: string;
}

// Generate realistic mock transactions for the past 90 days
export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();

  const saturdayNightMerchants = [
    { name: "THE TIPSY CROW", min: 45, max: 85 },
    { name: "UBER TRIP", min: 15, max: 35 },
    { name: "LYFT RIDE", min: 12, max: 28 },
    { name: "MCSORLEYS ALE HOUSE", min: 35, max: 75 },
    { name: "BARREL PROOF", min: 40, max: 90 },
    { name: "7-ELEVEN", min: 8, max: 20 },
    { name: "TACO BELL", min: 12, max: 25 },
  ];

  const diningMerchants = [
    { name: "CHIPOTLE", min: 12, max: 18 },
    { name: "SWEETGREEN", min: 14, max: 20 },
    { name: "DOORDASH", min: 25, max: 45 },
    { name: "UBER EATS", min: 22, max: 40 },
    { name: "GRUBHUB", min: 20, max: 38 },
  ];

  const subscriptions = [
    { name: "NETFLIX", amount: 15.99 },
    { name: "SPOTIFY", amount: 10.99 },
    { name: "HULU", amount: 17.99 },
  ];

  // Generate 90 days of transactions
  for (let i = 0; i < 90; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = date.toISOString().split('T')[0];

    // Saturday night spending (higher on Saturdays)
    if (dayOfWeek === 'Saturday') {
      // 2-4 transactions on Saturday nights
      const numTransactions = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < numTransactions; j++) {
        const merchant = saturdayNightMerchants[Math.floor(Math.random() * saturdayNightMerchants.length)];
        const amount = merchant.min + Math.random() * (merchant.max - merchant.min);
        const hour = 18 + Math.floor(Math.random() * 8); // 6 PM to 2 AM
        transactions.push({
          id: `sat-${i}-${j}`,
          date: dateStr,
          dayOfWeek,
          time: `${hour > 23 ? hour - 24 : hour}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${hour >= 12 && hour < 24 ? 'PM' : 'AM'}`,
          merchant: merchant.name,
          amount: Math.round(amount * 100) / 100,
          category: 'nightlife',
        });
      }
    }

    // Friday night (some spending)
    if (dayOfWeek === 'Friday' && Math.random() > 0.4) {
      const merchant = saturdayNightMerchants[Math.floor(Math.random() * saturdayNightMerchants.length)];
      const amount = merchant.min + Math.random() * (merchant.max - merchant.min);
      transactions.push({
        id: `fri-${i}`,
        date: dateStr,
        dayOfWeek,
        time: `${20 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`,
        merchant: merchant.name,
        amount: Math.round(amount * 100) / 100,
        category: 'nightlife',
      });
    }

    // Regular dining (weekdays)
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(dayOfWeek) && Math.random() > 0.5) {
      const merchant = diningMerchants[Math.floor(Math.random() * diningMerchants.length)];
      const amount = merchant.min + Math.random() * (merchant.max - merchant.min);
      transactions.push({
        id: `din-${i}`,
        date: dateStr,
        dayOfWeek,
        time: `${11 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`,
        merchant: merchant.name,
        amount: Math.round(amount * 100) / 100,
        category: 'dining',
      });
    }

    // Monthly subscriptions (1st of month)
    if (date.getDate() === 1) {
      subscriptions.forEach((sub, idx) => {
        transactions.push({
          id: `sub-${i}-${idx}`,
          date: dateStr,
          dayOfWeek,
          time: '12:00 AM',
          merchant: sub.name,
          amount: sub.amount,
          category: 'subscriptions',
        });
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Pre-analyzed spending patterns for demo
export const mockSpendingPatterns = [
  {
    id: 'saturday-night',
    name: 'Saturday Night Out',
    emoji: '🌙',
    averageAmount: 147,
    frequency: 'weekly',
    confidence: 0.92,
    topMerchants: ['THE TIPSY CROW', 'UBER TRIP', 'MCSORLEYS ALE HOUSE'],
    insight: 'You typically spend around $147 on Saturday nights between 8 PM and 2 AM.',
    pledgeSuggestion: 'Skip one Saturday night out and invest in Future You instead.',
  },
  {
    id: 'food-delivery',
    name: 'Food Delivery',
    emoji: '🍕',
    averageAmount: 89,
    frequency: 'weekly',
    confidence: 0.85,
    topMerchants: ['DOORDASH', 'UBER EATS', 'GRUBHUB'],
    insight: 'You order delivery about 3 times per week, averaging $30 per order.',
    pledgeSuggestion: 'Cook one meal instead of ordering and watch your savings grow.',
  },
  {
    id: 'subscriptions',
    name: 'Streaming Services',
    emoji: '📺',
    averageAmount: 45,
    frequency: 'monthly',
    confidence: 0.99,
    topMerchants: ['NETFLIX', 'SPOTIFY', 'HULU'],
    insight: 'Your streaming subscriptions total about $45 per month.',
    pledgeSuggestion: 'Cancel one service you rarely use.',
  },
];

export const mockTransactions = generateMockTransactions();
