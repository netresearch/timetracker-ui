<template>
  <div class="container month">
    <div class="row">
      <div class="col-8">
        <h4>Month report</h4>
      </div>
      <div
        v-if="date"
        class="col-4"
      >
        <nav class="d-flex justify-content-center">
          <ul class="pagination pagination-sm">
            <li class="page-item">
              <router-link
                class="page-link"
                :to="previous"
              >
                &laquo;
              </router-link>
            </li>
            <li class="page-item disabled">
              <span class="page-link">{{ formatDate(date, 'MMMM YYYY') }}</span>
            </li>
            <li
              class="page-item"
              :class="{disabled: !next}"
            >
              <router-link
                v-if="next"
                class="page-link"
                :to="next"
              >
                &raquo;
              </router-link>
              <span
                v-else
                class="page-link"
              >&raquo;</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <table
          v-if="days"
          class="table table-sm"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th
                width="1%"
                class="text-end"
              >
                Worked
              </th>
              <th
                width="1%"
                class="text-end"
              >
                Due
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(day, i) in days"
              :key="i"
              :class="day.holiday ? 'text-muted' : ''"
            >
              <td v-if="!day.holiday">
                {{ formatDate(day.date, 'll') }}
              </td>
              <td v-else>
                {{ day.holiday }}
              </td>
              <td class="text-end">
                {{ formatMinutes(day.worked) }}
              </td>
              <td
                class="text-end"
                :class="day.class"
              >
                {{ formatMinutes(day.diff, true) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-4">
        <table
          v-if="sum"
          class="table table-sm"
        >
          <thead>
            <tr>
              <th>Summary</th>
              <th width="1%" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Expected</th>
              <td class="text-end">
                {{ formatMinutes(sum.expected) }}
              </td>
            </tr>
            <tr>
              <th>Worked</th>
              <td class="text-end">
                {{ formatMinutes(sum.worked) }}
              </td>
            </tr>
            <tr>
              <th>Due until today</th>
              <td
                class="text-end"
                :class="sum.worked - sum.expectedUntilToday < 0 ? 'alert-danger' : 'alert-success'"
              >
                {{ formatMinutes(sum.worked - sum.expectedUntilToday, true) }}
              </td>
            </tr>
            <tr>
              <th>Due until end of month</th>
              <td
                class="text-end"
                :class="sum.diffUntilToday < 0 ? 'alert-danger' : 'alert-success'"
              >
                {{ formatMinutes(sum.diff, true) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from '../composables/useDayjs'
import { pad } from '../plugins/format'
import { useSettingsStore } from '../stores/settings'
import { useHolidaysStore } from '../stores/holidays'
import { useInterpretationStore } from '../stores/interpretation'

const route = useRoute()
const settingsStore = useSettingsStore()
const holidaysStore = useHolidaysStore()
const interpretationStore = useInterpretationStore()

const days = ref(undefined)
const sum = ref(undefined)
const date = ref(undefined)
const previous = ref(undefined)
const next = ref(undefined)
const today = ref(new Date())

// Format helpers
function formatDate(date, format) {
  return dayjs(date).format(format)
}

function formatMinutes(minutes, showSign = false) {
  const time = Math.abs(parseInt(minutes))
  const hours = Math.floor(time / 60)
  const mins = time - (hours * 60)
  const sign = minutes < 0 ? '-' : (showSign && minutes > 0 ? '+' : '')
  return `${sign}${pad(hours, 2)}:${pad(mins, 2)}`
}

function getDayClass(day) {
  if (day.holiday || day.isFuture) {
    return ''
  }
  if (day.worked >= day.expected * 1 && day.worked <= day.expected * 1.12) {
    return 'alert-success'
  } else if (day.worked > day.expected * 0.5 && day.worked < day.expected * 1) {
    return 'alert-warning'
  } else {
    return 'alert-danger'
  }
}

async function analyze() {
  const year = date.value.getFullYear()
  const month = date.value.getMonth() + 1
  const getHoursPerDay = settingsStore.getHoursPerDay

  const [holidays, entries] = await Promise.all([
    holidaysStore.load({ year }),
    interpretationStore.loadTimes({ year, month })
  ])

  const minutesByDay = {}
  const sumData = { worked: 0, diff: 0, expected: 0, expectedUntilToday: 0, diffUntilToday: 0 }
  const daysData = []

  entries.forEach(entry => {
    if (!Object.prototype.hasOwnProperty.call(minutesByDay, entry.name)) {
      minutesByDay[entry.name] = 0
    }
    const minutes = Math.round(entry.hours * 60)
    minutesByDay[entry.name] += minutes
    sumData.worked += minutes
  })

  const d = new Date(Date.UTC(year, month - 1, 1))
  while (d.getMonth() === month - 1 && d.getFullYear() === year) {
    const dateStr = dayjs(d).format('YY-MM-DD')
    const holiday = d.getDay() === 0 ? 'Sunday' : (d.getDay() === 6 ? 'Saturday' : holidays.getHoliday(d))
    const expected = holiday ? 0 : getHoursPerDay(d.getDay()) * 60
    const worked = minutesByDay[dateStr] || 0
    const diff = worked - expected
    sumData.diff += diff
    const isFuture = dayjs(d).isAfter(today.value, 'day')

    if (!isFuture) {
      sumData.diffUntilToday += diff
    }
    if (!holiday) {
      sumData.expected += expected
      if (!isFuture) {
        sumData.expectedUntilToday += expected
      }
    }

    const day = {
      date: new Date(d.getTime()),
      worked,
      diff,
      holiday,
      expected,
      isFuture,
      class: ''
    }
    day.class = getDayClass(day)
    daysData.push(day)
    d.setDate(d.getDate() + 1)
  }

  days.value = daysData
  sum.value = sumData
}

// Watch route changes
watch(
  () => route.query,
  () => {
    today.value = new Date()
    const newDate = new Date()

    if (route.query.year) {
      newDate.setFullYear(route.query.year)
    }
    if (route.query.month) {
      newDate.setMonth(route.query.month - 1)
    }

    date.value = newDate

    // Calculate next/previous links
    if (newDate.getFullYear() < today.value.getFullYear() ||
        (newDate.getFullYear() === today.value.getFullYear() && newDate.getMonth() < today.value.getMonth())) {
      const nextDate = new Date(newDate.getTime())
      nextDate.setMonth(newDate.getMonth() + 1)
      next.value = {
        path: route.path,
        query: { year: nextDate.getFullYear(), month: nextDate.getMonth() + 1 }
      }
    } else {
      next.value = undefined
    }

    const previousDate = new Date(newDate.getTime())
    previousDate.setMonth(newDate.getMonth() - 1)
    previous.value = {
      path: route.path,
      query: { year: previousDate.getFullYear(), month: previousDate.getMonth() + 1 }
    }

    analyze()
  },
  { immediate: true }
)
</script>
