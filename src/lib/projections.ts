// Calculate future value of a one-time investment
export function calculateFutureValue(
  principal: number,
  annualRate: number = 0.08,
  years: number = 10
): number {
  return principal * Math.pow(1 + annualRate, years);
}

// Calculate future value of recurring weekly contributions
export function calculateRecurringFutureValue(
  weeklyContribution: number,
  annualRate: number = 0.08,
  years: number = 10
): number {
  const weeklyRate = annualRate / 52;
  const totalWeeks = years * 52;
  return weeklyContribution * ((Math.pow(1 + weeklyRate, totalWeeks) - 1) / weeklyRate);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate projection data points for chart
export function generateProjectionData(
  initialAmount: number,
  weeklyContribution: number = 0,
  years: number = 10,
  annualRate: number = 0.08
) {
  const data = [];

  for (let year = 0; year <= years; year++) {
    const oneTimeValue = calculateFutureValue(initialAmount, annualRate, year);
    const recurringValue = weeklyContribution > 0
      ? calculateRecurringFutureValue(weeklyContribution, annualRate, year)
      : 0;

    data.push({
      year,
      value: Math.round(oneTimeValue + recurringValue),
      label: `Year ${year}`,
    });
  }

  return data;
}
