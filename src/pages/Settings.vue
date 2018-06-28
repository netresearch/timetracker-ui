<template>
  <div class="container settings">
    <h4>Settings</h4>
    <hr>
    <h5>Hours per day</h5>
    <div class="w-50">
      <b-form-group
        v-for="(label, d) in days"
        :key="d"
        horizontal
        :label="label"
        :label-cols="3"
        :label-for="'hoursPerDay_' + d"
      >
        <b-form-select :id="'hoursPerDay_' + d" v-model="values[d]" @change="$nextTick(() => $store.commit('settings/hoursPerDay', values))">
          <option v-for="n in 11" :key="d + '_' + n" :value="n - 1">{{n - 1}}</option>
        </b-form-select>
      </b-form-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      days: {
        d_1: 'Monday',
        d_2: 'Tuesday',
        d_3: 'Wednesday',
        d_4: 'Thursday',
        d_5: 'Friday'
      },
      values: {}
    }
  },
  watch: {
    '$store.state.settings.hoursPerDay': {
      immediate: true,
      handler () {
        this.values = this.$store.getters['settings/hoursPerDay']
      }
    }
  }
}
</script>
