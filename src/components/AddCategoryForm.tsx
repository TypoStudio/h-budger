import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Kind } from '../types'

export default function AddCategoryForm({
  kind,
  onAdd,
}: {
  kind: Kind
  onAdd: (kind: Kind, name: string, excluded: boolean) => void
}) {
  const [name, setName] = useState('')
  const [excluded, setExcluded] = useState(false)
  const submit = () => {
    const n = name.trim()
    if (!n) return
    onAdd(kind, n, excluded)
    setName('')
    setExcluded(false)
  }
  return (
    <div className="add-form">
      <input
        value={name}
        placeholder={`새 ${kind} 항목 이름`}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <label className="chk">
        <input type="checkbox" checked={excluded} onChange={(e) => setExcluded(e.target.checked)} /> 합산제외
      </label>
      <button onClick={submit}>
        <Plus size={15} /> 추가
      </button>
    </div>
  )
}
