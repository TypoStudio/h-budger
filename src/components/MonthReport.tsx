import { Printer, X } from 'lucide-react'
import type { Category, Entry, Kind, MonthStats } from '../types'
import { fmt } from '../lib/calc'

interface Props {
  categories: Category[]
  entries: Entry[]
  month: string
  stats: MonthStats
  onClose: () => void
}

interface Row {
  c: Category
  e: Entry
}

/** 원본 '당월' 시트처럼 인쇄/캡처용으로 깔끔하게 정리한 당월 요약 */
export default function MonthReport({ categories, entries, month, stats, onClose }: Props) {
  const [y, m] = month.split('-')
  const entryOf = new Map(entries.filter((e) => e.month === month).map((e) => [e.categoryId, e]))

  const rows = (kind: Kind, excluded: boolean): Row[] =>
    categories
      .filter((c) => c.kind === kind && c.excluded === excluded && entryOf.has(c.id))
      .sort((a, b) => a.order - b.order)
      .map((c) => ({ c, e: entryOf.get(c.id)! }))

  const refRows = [...rows('수입', true), ...rows('지출', true)]

  const table = (title: string, list: Row[], total?: number, cls = '') => (
    <table className={`report-table ${cls}`}>
      <thead>
        <tr>
          <th colSpan={3}>{title}</th>
        </tr>
      </thead>
      <tbody>
        {list.map(({ c, e }) => (
          <tr key={c.id}>
            <td className="name">{c.name}</td>
            <td className="memo">{e.memo ?? ''}</td>
            <td className="num">{fmt(e.amount)}</td>
          </tr>
        ))}
        {list.length === 0 && (
          <tr>
            <td colSpan={3} className="empty">
              기록 없음
            </td>
          </tr>
        )}
      </tbody>
      {total !== undefined && (
        <tfoot>
          <tr>
            <td colSpan={2}>{title}합계</td>
            <td className="num">{fmt(total)}</td>
          </tr>
        </tfoot>
      )}
    </table>
  )

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={() => window.print()}>
          <Printer size={15} /> 인쇄
        </button>
        <button onClick={onClose}>
          <X size={15} /> 닫기
        </button>
      </div>

      <div className="report">
        <h1 className="report-title">
          {y}년 {Number(m)}월 가계부
        </h1>

        {table('수입', rows('수입', false), stats.income, 'report-income')}
        {table('지출', rows('지출', false), stats.expense, 'report-expense')}

        <table className="report-table report-summary">
          <tbody>
            <tr>
              <td>이월잔고</td>
              <td className="num">{fmt(stats.carry)}</td>
            </tr>
            <tr>
              <td>수입합계</td>
              <td className="num">{fmt(stats.income)}</td>
            </tr>
            <tr>
              <td>지출합계</td>
              <td className="num">{fmt(stats.expense)}</td>
            </tr>
            <tr className="balance">
              <td>잔고</td>
              <td className="num">{fmt(stats.balance)}</td>
            </tr>
          </tbody>
        </table>

        {refRows.length > 0 && table('참고 (합산 제외)', refRows)}
      </div>
    </div>
  )
}
