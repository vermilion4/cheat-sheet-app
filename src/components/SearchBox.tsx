import { useState } from 'react'

export function SearchBox({ onChange, placeholder }: { onChange: (q: string) => void; placeholder?: string }) {
  const [value, setValue] = useState('')
  return (
    <input
      className="search"
      type="search"
      value={value}
      placeholder={placeholder ?? 'Search…'}
      aria-label={placeholder ?? 'Search'}
      onChange={(e) => { setValue(e.target.value); onChange(e.target.value) }}
    />
  )
}
