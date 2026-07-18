export interface SplitBillRequest {
  totalAmount: string
  numberOfWays: number
  perPersonTip?: string
}

export interface SplitBillResult {
  perPerson: string
  remainder: string
  splits: string[]
}

export const splitBill = (
  totalAmount: string,
  numberOfWays: number,
  perPersonTip: string = '0.00'
): SplitBillResult => {
  const total = parseFloat(totalAmount)
  const tip = parseFloat(perPersonTip)
  const combined = total + (tip * numberOfWays)

  const perPerson = (combined / numberOfWays).toFixed(2)
  const remainder = (combined - parseFloat(perPerson) * numberOfWays).toFixed(2)

  const splits = Array(numberOfWays).fill(null).map(() => perPerson)

  return {
    perPerson,
    remainder,
    splits
  }
}

export const verifySplitSum = (splits: string[]): boolean => {
  const sum = splits.reduce((acc, amount) => acc + parseFloat(amount), 0)
  return Math.abs(sum - Math.round(sum * 100) / 100) < 0.01
}
