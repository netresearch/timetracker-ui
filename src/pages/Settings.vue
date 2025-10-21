<template>
  <div class="container settings">
    <h4>Settings</h4>
    <hr>
    <h5>Hours per day</h5>
    <div class="w-50">
      <div
        v-for="(label, d) in days"
        :key="d"
        class="row mb-3"
      >
        <label
          :for="'hoursPerDay_' + d"
          class="col-sm-3 col-form-label"
        >{{ label }}</label>
        <div class="col-sm-9">
          <select
            :id="'hoursPerDay_' + d"
            v-model="values[d]"
            class="form-select"
            @change="updateSettings"
          >
            <option
              v-for="n in 11"
              :key="d + '_' + n"
              :value="n - 1"
            >
              {{ n - 1 }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()

const days = {
  d_1: 'Monday',
  d_2: 'Tuesday',
  d_3: 'Wednesday',
  d_4: 'Thursday',
  d_5: 'Friday'
}

const values = ref({})

// Watch for changes in store
watch(
  () => settingsStore.hoursPerDayAll,
  (newValues) => {
    values.value = { ...newValues }
  },
  { immediate: true }
)

function updateSettings() {
  settingsStore.setHoursPerDay(values.value)
}
</script>
