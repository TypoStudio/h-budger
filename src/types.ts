export type Kind = '수입' | '지출'

export interface Category {
  id: string
  kind: Kind
  name: string
  /** true면 표시만 하고 수입/지출 합계에 포함하지 않음 */
  excluded: boolean
  /** true면 월별 뷰에서 숨김(해당 월에 기록이 있으면 표시). 합계에는 계속 반영 */
  hidden: boolean
  order: number
}

export interface Entry {
  /** YYYY-MM */
  month: string
  categoryId: string
  amount: number
  memo?: string
  /** 산술 수식 원본 (예: "15000-5000"). amount는 계산 결과 */
  formula?: string
}

export interface MonthStats {
  income: number
  expense: number
  carry: number
  balance: number
  carryOverridden: boolean
}
