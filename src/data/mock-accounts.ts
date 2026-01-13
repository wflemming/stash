// Type interfaces for account data
export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: 'debit' | 'credit';
}

export interface CheckingAccount {
  balance: number;
  accountName: string;
  lastFourDigits: string;
  recentTransactions: Transaction[];
  routingNumber: string;
  accountType: 'checking';
}

export interface InvestmentAccount {
  balance: number;
  accountName: string;
  totalContributions: number;
  totalGrowth: number;
  projectedValue10Years: number;
  monthlyContribution: number;
  accountType: 'investment';
}

export interface TransferResult {
  success: boolean;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  newCheckingBalance: number;
  newInvestmentBalance: number;
  message: string;
}

// Legacy interfaces for backwards compatibility
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  accountNumber: string;
  institution: string;
}

export interface FutureYouAccount {
  id: string;
  name: string;
  balance: number;
  totalContributions: number;
  totalGrowth: number;
  createdAt: string;
  lastContribution: string;
  streakDays: number;
}

export interface SpendingInsight {
  dayOfWeek: string;
  averageSpending: number;
  topCategory: string;
  savedIfStayedIn: number;
  projectedIn10Years: number;
}

// Seeded random number generator for consistent results
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Realistic merchant data for checking account transactions
const checkingMerchants = [
  { name: "WHOLE FOODS MARKET", category: "groceries", min: 45, max: 120 },
  { name: "TRADER JOE'S", category: "groceries", min: 35, max: 85 },
  { name: "TARGET", category: "shopping", min: 25, max: 150 },
  { name: "AMAZON.COM", category: "shopping", min: 15, max: 200 },
  { name: "SHELL OIL", category: "gas", min: 35, max: 65 },
  { name: "CHEVRON", category: "gas", min: 40, max: 70 },
  { name: "STARBUCKS", category: "coffee", min: 5, max: 12 },
  { name: "CHIPOTLE", category: "dining", min: 12, max: 18 },
  { name: "SWEETGREEN", category: "dining", min: 14, max: 20 },
  { name: "DOORDASH", category: "delivery", min: 25, max: 55 },
  { name: "UBER EATS", category: "delivery", min: 22, max: 48 },
  { name: "CVS PHARMACY", category: "pharmacy", min: 15, max: 85 },
  { name: "WALGREENS", category: "pharmacy", min: 10, max: 60 },
  { name: "UBER", category: "transportation", min: 12, max: 45 },
  { name: "LYFT", category: "transportation", min: 10, max: 40 },
  { name: "SPOTIFY USA", category: "subscription", min: 10.99, max: 10.99 },
  { name: "NETFLIX.COM", category: "subscription", min: 15.99, max: 15.99 },
  { name: "APPLE.COM/BILL", category: "subscription", min: 9.99, max: 9.99 },
  { name: "AT&T WIRELESS", category: "utilities", min: 85, max: 85 },
  { name: "VERIZON WIRELESS", category: "utilities", min: 95, max: 95 },
  { name: "COMCAST CABLE", category: "utilities", min: 120, max: 120 },
  { name: "PG&E", category: "utilities", min: 95, max: 180 },
  { name: "THE TIPSY CROW", category: "nightlife", min: 45, max: 95 },
  { name: "MCSORLEYS ALE HOUSE", category: "nightlife", min: 35, max: 85 },
];

const incomeTransactions: Array<{ name: string; category: string; amount: number }> = [
  { name: "DIRECT DEPOSIT - PAYROLL", category: "income", amount: 3250 },
  { name: "VENMO PAYMENT", category: "transfer", amount: 85 },
  { name: "ZELLE TRANSFER", category: "transfer", amount: 100 },
];

/**
 * Generates a mock checking account with realistic transaction data
 * Uses a seeded random generator for consistent results across renders
 */
export function generateMockCheckingAccount(seed: number = 42): CheckingAccount {
  const random = seededRandom(seed);

  // Generate balance between $1,500 and $8,000
  const balance = Math.round((1500 + random() * 6500) * 100) / 100;

  // Generate random 4-digit account number
  const lastFourDigits = String(Math.floor(1000 + random() * 9000));

  // Generate 10 recent transactions
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i - Math.floor(random() * 2));

    // Occasionally add income transactions (paydays)
    if (i === 4 || i === 9) {
      const income = incomeTransactions[0];
      transactions.push({
        id: `chk-${seed}-inc-${i}`,
        date: date.toISOString().split('T')[0],
        merchant: income.name,
        amount: income.amount,
        category: income.category,
        type: 'credit',
      });
    } else {
      const merchant = checkingMerchants[Math.floor(random() * checkingMerchants.length)];
      const amount = merchant.min === merchant.max
        ? merchant.min
        : Math.round((merchant.min + random() * (merchant.max - merchant.min)) * 100) / 100;

      transactions.push({
        id: `chk-${seed}-${i}`,
        date: date.toISOString().split('T')[0],
        merchant: merchant.name,
        amount,
        category: merchant.category,
        type: 'debit',
      });
    }
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    balance,
    accountName: "Personal Checking",
    lastFourDigits,
    recentTransactions: transactions,
    routingNumber: "121000358",
    accountType: 'checking',
  };
}

/**
 * Generates a mock investment account (Future You Fund)
 * Represents the user's savings goal account for the Stash app
 */
export function generateMockInvestmentAccount(seed: number = 42): InvestmentAccount {
  const random = seededRandom(seed);

  // New accounts start with small amounts ($50-500) or $0
  // This represents a user just starting their savings journey
  const isNewAccount = random() > 0.3;
  const balance = isNewAccount
    ? Math.round((50 + random() * 450) * 100) / 100
    : 0;

  const totalContributions = isNewAccount
    ? Math.round((balance * 0.95) * 100) / 100  // Most of balance is contributions
    : 0;

  const totalGrowth = Math.round((balance - totalContributions) * 100) / 100;

  // Monthly contribution goal (what user plans to save)
  const monthlyContribution = isNewAccount
    ? Math.round((100 + random() * 200) * 100) / 100
    : 150; // Default suggestion

  // Project 10-year value assuming 7% annual return
  // Using compound interest formula: FV = PV(1+r)^n + PMT * (((1+r)^n - 1) / r)
  const annualRate = 0.07;
  const monthlyRate = annualRate / 12;
  const months = 120; // 10 years

  const futureValueOfCurrent = balance * Math.pow(1 + monthlyRate, months);
  const futureValueOfContributions = monthlyContribution *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  const projectedValue10Years = Math.round((futureValueOfCurrent + futureValueOfContributions) * 100) / 100;

  return {
    balance,
    accountName: random() > 0.5 ? "Future You Account" : "Future Me Fund",
    totalContributions,
    totalGrowth,
    projectedValue10Years,
    monthlyContribution,
    accountType: 'investment',
  };
}

// In-memory state for simulation (would be persisted in real app)
let simulatedCheckingBalance = 0;
let simulatedInvestmentBalance = 0;
let isInitialized = false;

/**
 * Simulates a transfer from checking to investment account
 * This conceptually moves money to help users save for their future
 */
export function simulateTransfer(
  amount: number,
  checkingAccount?: CheckingAccount,
  investmentAccount?: InvestmentAccount
): TransferResult {
  // Initialize balances if not already done
  if (!isInitialized) {
    const checking = checkingAccount || generateMockCheckingAccount();
    const investment = investmentAccount || generateMockInvestmentAccount();
    simulatedCheckingBalance = checking.balance;
    simulatedInvestmentBalance = investment.balance;
    isInitialized = true;
  }

  // Use provided accounts or simulated state
  const currentCheckingBalance = checkingAccount?.balance ?? simulatedCheckingBalance;
  const currentInvestmentBalance = investmentAccount?.balance ?? simulatedInvestmentBalance;

  // Validate transfer amount
  if (amount <= 0) {
    return {
      success: false,
      fromAccount: "Personal Checking",
      toAccount: "Future Me Fund",
      amount,
      timestamp: new Date().toISOString(),
      newCheckingBalance: currentCheckingBalance,
      newInvestmentBalance: currentInvestmentBalance,
      message: "Transfer amount must be greater than zero.",
    };
  }

  if (amount > currentCheckingBalance) {
    return {
      success: false,
      fromAccount: "Personal Checking",
      toAccount: "Future Me Fund",
      amount,
      timestamp: new Date().toISOString(),
      newCheckingBalance: currentCheckingBalance,
      newInvestmentBalance: currentInvestmentBalance,
      message: `Insufficient funds. Available balance: $${currentCheckingBalance.toFixed(2)}`,
    };
  }

  // Perform the transfer
  const newCheckingBalance = Math.round((currentCheckingBalance - amount) * 100) / 100;
  const newInvestmentBalance = Math.round((currentInvestmentBalance + amount) * 100) / 100;

  // Update simulated state
  simulatedCheckingBalance = newCheckingBalance;
  simulatedInvestmentBalance = newInvestmentBalance;

  return {
    success: true,
    fromAccount: "Personal Checking",
    toAccount: "Future Me Fund",
    amount,
    timestamp: new Date().toISOString(),
    newCheckingBalance,
    newInvestmentBalance,
    message: `Successfully transferred $${amount.toFixed(2)} to your Future Me Fund! Keep building that future.`,
  };
}

/**
 * Resets the simulated account state (useful for testing)
 */
export function resetSimulatedAccounts(): void {
  simulatedCheckingBalance = 0;
  simulatedInvestmentBalance = 0;
  isInitialized = false;
}

/**
 * Calculates how much a single skipped expense could grow over time
 * Useful for showing users the opportunity cost of discretionary spending
 */
export function calculateOpportunityCost(
  amount: number,
  years: number = 10,
  annualReturn: number = 0.07
): { futureValue: number; totalGrowth: number } {
  const futureValue = Math.round(amount * Math.pow(1 + annualReturn, years) * 100) / 100;
  const totalGrowth = Math.round((futureValue - amount) * 100) / 100;

  return { futureValue, totalGrowth };
}

// Pre-generated accounts for consistent demo experience
export const mockCheckingAccount = generateMockCheckingAccount();
export const mockInvestmentAccount = generateMockInvestmentAccount();

// Legacy exports for backwards compatibility
export const mockAccounts: Account[] = [
  {
    id: 'checking-1',
    name: 'Primary Checking',
    type: 'checking',
    balance: mockCheckingAccount.balance,
    accountNumber: `****${mockCheckingAccount.lastFourDigits}`,
    institution: 'Chase Bank',
  },
  {
    id: 'savings-1',
    name: 'Emergency Fund',
    type: 'savings',
    balance: 12500.00,
    accountNumber: '****8832',
    institution: 'Chase Bank',
  },
  {
    id: 'investment-1',
    name: mockInvestmentAccount.accountName,
    type: 'investment',
    balance: mockInvestmentAccount.balance,
    accountNumber: '****7291',
    institution: 'JOFO Investments',
  },
];

export const mockFutureYouAccount: FutureYouAccount = {
  id: 'future-you-001',
  name: 'My Future You Fund',
  balance: mockInvestmentAccount.balance,
  totalContributions: mockInvestmentAccount.totalContributions,
  totalGrowth: mockInvestmentAccount.totalGrowth,
  createdAt: '2024-06-15',
  lastContribution: new Date().toISOString().split('T')[0],
  streakDays: 8,
};

export const mockSpendingInsights: Record<string, SpendingInsight> = {
  saturday: {
    dayOfWeek: 'Saturday',
    averageSpending: 147,
    topCategory: 'nightlife',
    savedIfStayedIn: 127,
    projectedIn10Years: 274,
  },
  friday: {
    dayOfWeek: 'Friday',
    averageSpending: 89,
    topCategory: 'dining',
    savedIfStayedIn: 72,
    projectedIn10Years: 155,
  },
  sunday: {
    dayOfWeek: 'Sunday',
    averageSpending: 45,
    topCategory: 'dining',
    savedIfStayedIn: 35,
    projectedIn10Years: 75,
  },
};

export function getCheckingAccount(): Account | undefined {
  return mockAccounts.find(acc => acc.type === 'checking');
}

export function getInvestmentAccount(): Account | undefined {
  return mockAccounts.find(acc => acc.type === 'investment');
}

export function getTodaysInsight(): SpendingInsight {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  return mockSpendingInsights[today] || mockSpendingInsights.saturday;
}

export function getCurrentDayOfWeek(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}
