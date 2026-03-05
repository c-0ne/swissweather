<template>
  <div class="flex flex-col gap-2" v-if="alerts.length">
    <div
      v-for="(alert, i) in alerts"
      :key="i"
      :class="['alert-item', `alert-${alert.type}`]"
    >
      {{ alert.message }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  alerts: { type: Array, required: true },
})
</script>

<style scoped>
.alert-item {
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.92rem;
}
.alert-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.alert-warning {
  background: rgba(234, 179, 8, 0.15);
  color: #ca8a04;
  border: 1px solid rgba(234, 179, 8, 0.3);
}
.alert-info {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
</style>
