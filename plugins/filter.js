import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', val => moment(val).format('YYYY-MM-DD'))
