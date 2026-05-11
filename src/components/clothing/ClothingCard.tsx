import { useState } from 'react'
import type { ClothingItem, Size } from '@/models/types'
import { useVisualizerStore } from '@/store/useVisualizerStore'
import styles from './ClothingCard.module.css'

interface ClothingCardProps {
  item: ClothingItem
}

export function ClothingCard({ item }: ClothingCardProps) {
  const [selectedColor, setSelectedColor] = useState(item.colors[0]?.name ?? '')
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const selectItem = useVisualizerStore((s) => s.selectItem)
  const removeItem = useVisualizerStore((s) => s.removeItem)
  const selectedItems = useVisualizerStore((s) => s.selectedItems)

  const isActive = selectedItems.get(item.category)?.item.id === item.id

  function handleToggle() {
    if (isActive) {
      removeItem(item.category)
    } else {
      selectItem({ item, colorId: selectedColor, sizeLabel: selectedSize?.label ?? '' })
    }
  }

  function handleColorChange(colorName: string) {
    setSelectedColor(colorName)
    if (isActive) {
      selectItem({ item, colorId: colorName, sizeLabel: selectedSize?.label ?? '' })
    }
  }

  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
      <img src={item.images.flat} alt={item.name} className={styles.image} />
      <div className={styles.info}>
        <p className={styles.brand}>{item.brand}</p>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.price}>${item.price.toFixed(2)}</p>

        {/* Color picker */}
        <div className={styles.colors}>
          {item.colors.map((c) => (
            <button
              key={c.name}
              title={c.name}
              className={`${styles.colorSwatch} ${selectedColor === c.name ? styles.colorActive : ''}`}
              style={{ background: c.hex }}
              onClick={() => handleColorChange(c.name)}
            />
          ))}
        </div>

        {/* Size selector */}
        <div className={styles.sizes}>
          {item.sizes.map((s) => (
            <button
              key={s.label}
              disabled={!s.inStock}
              className={`${styles.sizeBtn} ${selectedSize?.label === s.label ? styles.sizeActive : ''}`}
              onClick={() => setSelectedSize(s)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button className={`${styles.tryBtn} ${isActive ? styles.tryActive : ''}`} onClick={handleToggle}>
          {isActive ? 'Remove' : 'Try On'}
        </button>
      </div>
    </div>
  )
}
