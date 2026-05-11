import { create } from 'zustand'
import type { BodyScan, ClothingItem, Outfit } from '@/models/types'

interface SelectedClothingEntry {
  item: ClothingItem
  colorId: string
  sizeLabel: string
}

interface VisualizerStore {
  // Body scan
  activeScan: BodyScan | null
  setActiveScan: (scan: BodyScan | null) => void

  // Selected clothing per category
  selectedItems: Map<ClothingItem['category'], SelectedClothingEntry>
  selectItem: (entry: SelectedClothingEntry) => void
  removeItem: (category: ClothingItem['category']) => void
  clearItems: () => void

  // Saved outfits
  outfits: Outfit[]
  saveOutfit: (name: string, userId: string) => void

  // Active outfit
  activeOutfit: Outfit | null
  loadOutfit: (outfit: Outfit, catalogue: ClothingItem[]) => void
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  activeScan: null,
  setActiveScan: (scan) => set({ activeScan: scan }),

  selectedItems: new Map(),
  selectItem: (entry) =>
    set((state) => {
      const next = new Map(state.selectedItems)
      next.set(entry.item.category, entry)
      return { selectedItems: next }
    }),
  removeItem: (category) =>
    set((state) => {
      const next = new Map(state.selectedItems)
      next.delete(category)
      return { selectedItems: next }
    }),
  clearItems: () => set({ selectedItems: new Map() }),

  outfits: [],
  saveOutfit: (name, userId) => {
    const { selectedItems } = get()
    const outfit: Outfit = {
      id: crypto.randomUUID(),
      userId,
      name,
      items: Array.from(selectedItems.values()).map(
        ({ item, colorId, sizeLabel }: SelectedClothingEntry) => ({
          itemId: item.id,
          colorId,
          sizeLabel,
        })
      ),
      createdAt: new Date(),
    }
    set((state) => ({ outfits: [...state.outfits, outfit], activeOutfit: outfit }))
  },

  activeOutfit: null,
  loadOutfit: (outfit, catalogue) => {
    const next = new Map<ClothingItem['category'], SelectedClothingEntry>()
    for (const { itemId, colorId, sizeLabel } of outfit.items) {
      const item = catalogue.find((c) => c.id === itemId)
      if (item) next.set(item.category, { item, colorId, sizeLabel })
    }
    set({ activeOutfit: outfit, selectedItems: next })
  },
}))
