<template>
  <div class="container month">
    <div class="row">
      <div class="col-8">
        <h4>Month report</h4>
      </div>
      <div class="col-4" v-if="date">
        <nav class="d-flex justify-content-center">
          <ul class="pagination pagination-sm">
            <li class="page-item"><b-link class="page-link" :to="previous">&laquo;</b-link></li>
            <li class="page-item disabled"><span class="page-link">{{date | moment('MMMM Y')}}</span></li>
            <li class="page-item" :class="{disabled: !next}"><b-link class="page-link" :to="next || ''" :disabled="!next">&raquo;</b-link></li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <table class="table  table-sm" v-if="days">
          <thead>
            <tr>
              <th>Date</th>
              <th width="1%" class="text-right">Worked</th>
              <th width="1%" class="text-right">Due</th>
            </tr>
          </thead>
          <tr v-for="(day, i) in days" :key="i" :class="day.holiday ? 'text-muted' : ''">
            <td v-if="!day.holiday">{{day.date | moment('ll')}}</td>
            <td v-else>{{day.holiday}}</td>
            <td class="text-right">{{day.worked | minutes}}</td>
            <td class="text-right" :class="day.class">
              {{day.diff | minutes(true)}}
            </td>
          </tr>
        </table>
      </div>
      <div class="col-4">
        <table class="table table-sm" v-if="sum">
          <thead>
            <tr>
              <th>Summary</th>
              <th width="1%"></th>
            </tr>
          </thead>
          <tr>
            <th>Expected</th>
            <td class="text-right">{{sum.expected | minutes}}</td>
          </tr>
          <tr>
            <th>Worked</th>
            <td class="text-right">{{sum.worked | minutes}}</td>
          </tr>
          <tr>
            <th>Due until today</th>
            <td class="text-right" :class="sum.worked - sum.expectedUntilToday < 0 ? 'alert-danger' : 'alert-success'">{{sum.worked - sum.expectedUntilToday | minutes(true)}}</td>
          </tr>
          <tr>
            <th>Due</th>
            <td class="text-right" :class="sum.diffUntilToday < 0 ? 'alert-danger' : 'alert-success'">{{sum.diff | minutes(true)}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {Request},
  data () {
    return {
      days: undefined,
      sum: undefined,
      date: undefined,
      previous: undefined,
      next: undefined,
      today: undefined
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler ($route) {
        const today = this.today = new Date()
        const date = this.date = new Date()
        if ($route.query.year) {
          date.setFullYear($route.query.year)
        }
        if ($route.query.month) {
          date.setMonth($route.query.month - 1)
        }
        if (date.getFullYear() < today.getFullYear() || date.getMonth() < today.getMonth()) {
          const nextDate = new Date(date.getTime())
          nextDate.setMonth(date.getMonth() + 1)
          this.next = {
            path: $route.path,
            query: {year: nextDate.getFullYear(), month: nextDate.getMonth() + 1}
          }
        } else {
          this.next = undefined
        }
        const previousDate = new Date(date.getTime())
        previousDate.setMonth(date.getMonth() - 1)
        this.previous = {
          path: $route.path,
          query: {year: previousDate.getFullYear(), month: previousDate.getMonth() + 1}
        }

        this.analyze()
      }
    }
  },
  methods: {
    analyze () {
      const year = this.date.getFullYear()
      const month = this.date.getMonth() + 1
      const getHoursPerDay = this.$store.getters['settings/getHoursPerDay']

      Promise.all([
        this.$store.dispatch('holidays/load', {year}),
        this.$store.dispatch('interpretation/loadTimes', {year, month})
      ])
        .then(([holidays, entries]) => {
          const minutesByDay = {}
          const sum = {worked: 0, diff: 0, expected: 0, expectedUntilToday: 0, diffUntilToday: 0}
          const days = []
          entries.forEach(entry => {
            if (!minutesByDay.hasOwnProperty(entry.date)) {
              minutesByDay[entry.name] = 0
            }
            const minutes = entry.hours * 60
            minutesByDay[entry.name] += minutes
            sum.worked += minutes
          })
          const date = new Date(Date.UTC(year, month - 1, 1))
          while (date.getMonth() === month - 1 && date.getFullYear() === year) {
            const d = this.$moment(date).format('YY-MM-DD')
            const holiday = date.getDay() === 0 ? 'Sunday' : (date.getDay() === 6 ? 'Saturday' : holidays.getHoliday(date))
            const expected = holiday ? 0 : getHoursPerDay(date.getDay()) * 60
            const worked = minutesByDay[d] || 0
            const diff = worked - expected
            sum.diff += diff
            const isFuture = this.$moment(date).isAfter(this.today, 'day')
            if (!isFuture) {
              sum.diffUntilToday += diff
            }
            if (!holiday) {
              sum.expected += expected
              if (!isFuture) {
                sum.expectedUntilToday += expected
              }
            }
            const day = {date: new Date(date.getTime()), worked, diff, holiday, expected, isFuture}
            day.class = this.getDayClass(day)
            days.push(day)
            date.setDate(date.getDate() + 1)
          }

          this.days = days
          this.sum = sum
        })
    },
    getDayClass (day) {
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
  }
}
</script>
