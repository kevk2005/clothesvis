import type { ClothingItem } from '@/models/types'

export const MOCK_CATALOGUE: ClothingItem[] = [
  {
    id: 'top-001',
    name: 'Classic White Tee',
    brand: 'Basics Co.',
    category: 'tops',
    tags: ['casual', 'summer', 'cotton'],
    price: 24.99,
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#111111' },
      { name: 'Navy', hex: '#1a2a4a' },
    ],
    sizes: [
      { label: 'S', measurements: { chest: 88, length: 68 }, inStock: true },
      { label: 'M', measurements: { chest: 94, length: 70 }, inStock: true },
      { label: 'L', measurements: { chest: 100, length: 72 }, inStock: true },
      { label: 'XL', measurements: { chest: 106, length: 74 }, inStock: false },
    ],
    images: {
      flat: 'https://placehold.co/300x300/ffffff/aaaaaa?text=White+Tee',
      overlayMask: 'https://placehold.co/300x300/ffffff/aaaaaa?text=overlay',
    },
    fitData: {
      sizeChart: {},
      fitType: 'regular',
      stretch: false,
    },
  },
  {
    id: 'top-002',
    name: 'Striped Polo',
    brand: 'Prep Club',
    category: 'tops',
    tags: ['smart-casual', 'polo', 'summer'],
    price: 45.00,
    colors: [
      { name: 'Blue-White', hex: '#4a90d9' },
      { name: 'Red-White', hex: '#e74c3c' },
    ],
    sizes: [
      { label: 'S', measurements: { chest: 90, length: 69 }, inStock: true },
      { label: 'M', measurements: { chest: 96, length: 71 }, inStock: true },
      { label: 'L', measurements: { chest: 102, length: 73 }, inStock: true },
    ],
    images: {
      flat: 'https://placehold.co/300x300/4a90d9/ffffff?text=Striped+Polo',
      overlayMask: 'https://placehold.co/300x300/4a90d9/ffffff?text=overlay',
    },
    fitData: {
      sizeChart: {},
      fitType: 'regular',
      stretch: false,
    },
  },
  {
    id: 'btm-001',
    name: 'Slim Chinos',
    brand: 'Urban Thread',
    category: 'bottoms',
    tags: ['smart-casual', 'chinos', 'everyday'],
    price: 59.99,
    colors: [
      { name: 'Khaki', hex: '#c3a882' },
      { name: 'Olive', hex: '#6b6b3a' },
      { name: 'Navy', hex: '#1a2a4a' },
    ],
    sizes: [
      { label: '30x30', measurements: { waist: 76, inseam: 76 }, inStock: true },
      { label: '32x30', measurements: { waist: 81, inseam: 76 }, inStock: true },
      { label: '34x32', measurements: { waist: 86, inseam: 81 }, inStock: false },
    ],
    images: {
      flat: 'https://placehold.co/300x300/c3a882/ffffff?text=Slim+Chinos',
      overlayMask: 'https://placehold.co/300x300/c3a882/ffffff?text=overlay',
    },
    fitData: {
      sizeChart: {},
      fitType: 'slim',
      stretch: false,
    },
  },
  {
    id: 'btm-002',
    name: 'Classic Jeans',
    brand: 'Denim & Co.',
    category: 'bottoms',
    tags: ['casual', 'denim', 'everyday'],
    price: 79.99,
    colors: [
      { name: 'Indigo', hex: '#3b5ba5' },
      { name: 'Washed Black', hex: '#2c2c2c' },
    ],
    sizes: [
      { label: '30x30', measurements: { waist: 76, inseam: 76 }, inStock: true },
      { label: '32x32', measurements: { waist: 81, inseam: 81 }, inStock: true },
      { label: '34x30', measurements: { waist: 86, inseam: 76 }, inStock: true },
    ],
    images: {
      flat: 'https://placehold.co/300x300/3b5ba5/ffffff?text=Classic+Jeans',
      overlayMask: 'https://placehold.co/300x300/3b5ba5/ffffff?text=overlay',
    },
    fitData: {
      sizeChart: {},
      fitType: 'regular',
      stretch: true,
    },
  },
  {
    id: 'out-001',
    name: 'Bomber Jacket',
    brand: 'Street Edit',
    category: 'outerwear',
    tags: ['streetwear', 'jacket', 'fall'],
    price: 129.00,
    colors: [
      { name: 'Olive', hex: '#6b6b3a' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: [
      { label: 'S', measurements: { chest: 96, length: 62 }, inStock: true },
      { label: 'M', measurements: { chest: 102, length: 64 }, inStock: true },
      { label: 'L', measurements: { chest: 108, length: 66 }, inStock: true },
    ],
    images: {
      flat: 'https://placehold.co/300x300/6b6b3a/ffffff?text=Bomber+Jacket',
      overlayMask: 'https://placehold.co/300x300/6b6b3a/ffffff?text=overlay',
    },
    fitData: {
      sizeChart: {},
      fitType: 'regular',
      stretch: false,
    },
  },
  {
    id: 'dress-001',
    name: 'Floral Midi Dress',
    brand: 'Bloom Studio',
    category: 'dresses',
    tags: ['floral', 'midi', 'summer'],
    price: 89.00,
    colors: [
      { name: 'Rose', hex: '#e8a0b0' },
      { name: 'Sky', hex: '#87ceeb' },
    ],
    sizes: [
      { label: 'XS', measurements: { chest: 82, waist: 66, hips: 88, length: 110 }, inStock: true },
      { label: 'S', measurements: { chest: 86, waist: 70, hips: 92, length: 112 }, inStock: true },
      { label: 'M', measurements: { chest: 92, waist: 76, hips: 98, length: 114 }, inStock: true },
    ],
    images: {
      flat: 'https://placehold.co/300x300/e8a0b0/ffffff?text=Floral+Dress',
      overlayMask: 'https://placehold.co/300x300/e8a0b0/ffffff?text=overlay',
    },
    fitData: {
      sizeChart: {},
      fitType: 'regular',
      stretch: false,
    },
  },
]
