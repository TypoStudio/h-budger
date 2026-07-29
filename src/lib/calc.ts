import type { Category, Entry, MonthStats } from '../types'
import { CARRYOVER_ID } from './sheetStore'

/** 기록이 있는 모든 월의 통계를 시간순으로 누적 계산한다. 이월잔고 = 전월 잔고(수동 입력 시 그 값). */
export function computeAllMonths(categories: Category[], entries: Entry[]): Map<string, MonthStats> {
  const catById = new Map(categories.map((c) => [c.id, c]))
  const months = [...new Set(entries.map((e) => e.month))].sort()
  const map = new Map<string, MonthStats>()
  let prevBalance: number | null = null
  for (const m of months) {
    let income = 0
    let expense = 0
    let override: number | null = null
    for (const e of entries) {
      if (e.month !== m) continue
      if (e.categoryId === CARRYOVER_ID) {
        override = e.amount
        continue
      }
      const c = catById.get(e.categoryId)
      if (!c || c.excluded) continue
      if (c.kind === '수입') income += e.amount
      else expense += e.amount
    }
    const carry: number = override ?? prevBalance ?? 0
    const balance: number = carry + income - expense
    map.set(m, { income, expense, carry, balance, carryOverridden: override !== null })
    prevBalance = balance
  }
  return map
}

/** 특정 월의 통계. 기록이 없는 월이면 직전 월의 잔고를 이월잔고로 사용한 빈 통계를 돌려준다. */
export function statsFor(all: Map<string, MonthStats>, month: string): MonthStats {
  const exact = all.get(month)
  if (exact) return exact
  let carry = 0
  for (const [m, s] of all) {
    if (m < month) carry = s.balance
    else break
  }
  return { income: 0, expense: 0, carry, balance: carry, carryOverridden: false }
}

export function fmt(n: number): string {
  return n.toLocaleString('ko-KR')
}

export interface ParsedAmount {
  amount: number | null
  /** 사칙연산 수식으로 입력한 경우 원본 수식 */
  formula?: string
}

/** "1,234원" 같은 금액 또는 "15000-5000" 같은 사칙연산 수식을 해석한다 */
export function parseAmount(s: string): ParsedAmount {
  const t = s.replace(/[,\s원=]/g, '')
  if (t === '' || t === '-') return { amount: null }
  if (/^-?\d+(\.\d+)?$/.test(t)) return { amount: Number(t) }
  if (/^[0-9+\-*/().]+$/.test(t)) {
    try {
      const v = new Function(`return (${t})`)() as unknown
      if (typeof v === 'number' && Number.isFinite(v)) return { amount: v, formula: t }
    } catch {
      /* 해석 불가 */
    }
  }
  return { amount: null }
}

export function currentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
