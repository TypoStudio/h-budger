import { useEffect, useState } from 'react'
import { fmt, parseAmount } from '../lib/calc'

interface Props {
  value: number | null
  /** 수식으로 입력된 값이면 포커스 시 수식을 보여준다 */
  formula?: string
  onCommit: (n: number | null, formula?: string) => void
  placeholder?: string
}

/** 포커스 중에는 자유 입력(수식 가능), 벗어나면 콤마 포맷 금액으로 표시하는 입력 */
export default function AmountInput({ value, formula, onCommit, placeholder }: Props) {
  const [text, setText] = useState(value == null ? '' : fmt(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setText(value == null ? '' : fmt(value))
  }, [value, focused])

  const commit = () => {
    setFocused(false)
    const p = parseAmount(text)
    if (p.amount !== value || p.formula !== formula) onCommit(p.amount, p.formula)
    setText(p.amount == null ? '' : fmt(p.amount))
  }

  return (
    <input
      className="amount"
      value={text}
      title={formula ? `= ${formula}` : undefined}
      placeholder={placeholder ?? '0'}
      onFocus={() => {
        setFocused(true)
        if (formula) setText(formula)
      }}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
      }}
    />
  )
}
