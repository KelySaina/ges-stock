<script setup>
import StockManager from '@/components/StockManager.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="h-screen p-4">
    <NavBar />

    <main class="p-6 flex justify-center">
      <!-- Stock Manager Component -->
      <StockManager :stockMovement="stockMovement" @updateStock="handleStockUpdate" class="mt-6" />
    </main>
  </div>
</template>
