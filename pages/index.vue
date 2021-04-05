<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Welcome
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="users"
            :items-per-page="5"
            :loading="loading"
            item-key="id"
            :search="search"
            style="cursor: pointer"
            @click:row="navToCustomer"

          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:pa>

            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data()
    {
      return {
        search: '',
        users: [],
        loading: false,
      }
    },
  async mounted () {
    this.loading = true
    let { data } = await this.$axios.get(`/api/customers`)
    this.users = data
    this.loading = false
  },
  computed: {
    headers () {
      return [
        {
          text: 'Id',
          align: 'start',
          value: 'id',
        },
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'Surname', align: 'start', value: 'surname' },
        { text: 'Email', align: 'start', value: 'email' },
      ]
    },
  },
  methods: {
    navToCustomer(row) {
      this.$router.push({ path: 'customer/', query: {'id': row.id} })
    }
  }
}
</script>

