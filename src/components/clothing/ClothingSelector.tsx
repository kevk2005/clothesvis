import { useState } from 'react'
import type { ClothingItem } from '@/models/types'
import { ClothingCard } from './ClothingCard'
import styles from './ClothingSelector.module.css'

interface ClothingSelectorProps {
  catalogue: ClothingItem[]
}

const CATEGORIES: ClothingItem['category'][] = [
  'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories',
]

export function ClothingSelector({ catalogue }: ClothingSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<ClothingItem['category']>('tops')
  const [search, setSearch] = useState('')

  const filtered = catalogue.filter(
    (item) =>
      item.category === activeCategory &&
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
  )

  return (
    <aside className={styles.panel}>
      <input
        className={styles.search}
        placeholder="Search clothing…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <nav className={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </nav>

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No items found.</p>
        ) : (
          filtered.map((item) => <ClothingCard key={item.id} item={item} />)
        )}
      </div>
    </aside>
  )
}
