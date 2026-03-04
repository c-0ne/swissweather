<template>
  <div class="outdoor-score card">
    <h3>Should I go out today?</h3>
    <div class="score-ring-wrapper">
      <svg class="score-ring" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle class="ring-bg" cx="60" cy="60" r="50" />
        <circle
          class="ring-fill"
          cx="60" cy="60" r="50"
          :style="{ strokeDashoffset: dashOffset, stroke: scoreColor }"
        />
        <text x="60" y="65" text-anchor="middle" class="score-text">{{ score.score }}</text>
      </svg>
      <span class="score-label" :style="{ color: scoreColor }">{{ scoreLabel }}</span>
    </div>

    <div class="recommendations">
      <div :class="['rec', score.umbrella ? 'active' : 'inactive']">
        <span>☂️</span>
        <span>{{ score.umbrella ? 'Bring umbrella' : 'No umbrella needed' }}</span>
      </div>
      <div :class="['rec', score.sunscreen ? 'active' : 'inactive']">
        <span>🧴</span>
        <span>{{ score.sunscreen ? 'Wear sunscreen' : 'No sunscreen needed' }}</span>
      </div>
      <div :class="['rec', score.jacket ? 'active' : 'inactive']">
        <span>🧥</span>
        <span>{{ score.jacket ? 'Bring a jacket' : 'No jacket needed' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Object, required: true },
})

const CIRCUMFERENCE = 2 * Math.PI * 50

const dashOffset = computed(() => {
  return CIRCUMFERENCE - (props.score.score / 100) * CIRCUMFERENCE
})

const scoreColor = computed(() => {
  const s = props.score.score
  if (s >= 75) return '#22c55e'
  if (s >= 50) return '#eab308'
  if (s >= 25) return '#f97316'
  return '#ef4444'
})

const scoreLabel = computed(() => {
  const s = props.score.score
  if (s >= 75) return 'Great day to go out!'
  if (s >= 50) return 'Decent, bring gear'
  if (s >= 25) return 'Not ideal outside'
  return 'Stay indoors!'
})
</script>

<style scoped>
.outdoor-score { padding: 24px; text-align: center; }
.outdoor-score h3 { margin: 0 0 20px; font-size: 1.1rem; }

.score-ring-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.score-ring {
  width: 130px;
  height: 130px;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--border);
  stroke-width: 10;
}

.ring-fill {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 314.159;
  transition: stroke-dashoffset 0.6s ease, stroke 0.6s ease;
}

.score-text {
  font-size: 26px;
  font-weight: 700;
  fill: var(--text);
  transform: rotate(90deg);
  transform-origin: 60px 60px;
}

.score-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.rec {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.rec.active {
  background: var(--accent-soft);
  color: var(--accent);
}

.rec.inactive {
  background: var(--bg);
  color: var(--text-muted);
  opacity: 0.6;
}
</style>
