<template>
  <div class="menu-card-horizontal" :class="{ 'out-of-stock': item.status === 'habis' }">
    <div class="image-wrapper">
      <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="menu-img-circle" />
      <div v-else class="image-placeholder-circle">
        <span class="placeholder-emoji">{{ getCategoryEmoji(item.category) }}</span>
      </div>
      <span v-if="item.status === 'habis'" class="stock-badge">Habis</span>
    </div>
    
    <div class="card-body">
      <div class="header-row">
        <h3 class="menu-name">{{ item.name }}</h3>
        <span class="menu-price">{{ formatPrice(item.price) }}</span>
      </div>
      <p class="menu-desc">{{ item.description || 'Mie lezat buatan Tuyem dengan resep otentik.' }}</p>
      
      <div class="action-row">
        <span class="category-badge">{{ item.category }}</span>
        
        <div v-if="item.status !== 'habis'" class="order-controls">
          <div v-if="quantityInCart > 0" class="qty-selector">
            <button @click="$emit('decrease', item)" class="qty-btn" aria-label="Kurangi">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <span class="qty-text">{{ quantityInCart }}</span>
            <button @click="$emit('increase', item)" class="qty-btn" aria-label="Tambah">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
          <button v-else @click="$emit('increase', item)" class="buy-btn">
            Beli
          </button>
        </div>
        <div v-else class="out-of-stock-text">
          Habis
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  quantityInCart: {
    type: Number,
    default: 0
  }
});

defineEmits(['increase', 'decrease']);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const getCategoryEmoji = (category) => {
  switch (category) {
    case 'makanan': return '🍜';
    case 'minuman': return '🍹';
    case 'ekstra': return '🥚';
    default: return '🍴';
  }
};
</script>

<style scoped>
.menu-card-horizontal {
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.menu-card-horizontal:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.menu-card-horizontal.out-of-stock {
  opacity: 0.6;
}

.image-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 90px;
  height: 90px;
}

.menu-img-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
}

.image-placeholder-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border);
}

.placeholder-emoji {
  font-size: 2rem;
}

.stock-badge {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent);
  color: var(--text-light);
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; /* allows text truncation/wrapping inside flex */
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.menu-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-price {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--primary-hover);
  white-space: nowrap;
}

.menu-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.category-badge {
  background-color: #f5f5f4;
  color: var(--text-muted);
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

.buy-btn {
  background-color: #f97316; /* Orange button as requested */
  color: white;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.85rem;
  transition: var(--transition);
}

.buy-btn:hover {
  background-color: #ea580c;
  transform: scale(1.05);
}

.qty-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: var(--radius-full);
  padding: 2px 4px;
}

.qty-btn {
  background-color: #f97316;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  background-color: #ea580c;
}

.qty-text {
  font-weight: 700;
  font-size: 0.9rem;
  color: #ea580c;
  min-width: 14px;
  text-align: center;
}

.out-of-stock-text {
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.85rem;
}

@media (max-width: 480px) {
  .menu-card-horizontal {
    padding: 12px;
    gap: 12px;
  }
  .image-wrapper {
    width: 70px;
    height: 70px;
  }
  .placeholder-emoji {
    font-size: 1.5rem;
  }
}
</style>
