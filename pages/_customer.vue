<template>
  <div>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :color="snackbarColor"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-row>
      <v-col class="text-center">
        <img
          src="/v.png"
          alt="Vuetify.js"
          class="mb-5"
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form>
          <v-text-field
            v-model="user.name"
            :rules="nameRules"
            :counter="100"
            label="Name:"
            class="mx-4"
            required
          />
          <v-text-field
            v-model="user.surname"
            :rules="nameRules"
            :counter="100"
            class="mx-4"
            label="Surname:"
            required
          />
          <v-menu
            ref="menu"
            v-model="datePicker"
            :close-on-content-click="false"
            :return-value.sync="user.birthday"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="user.birthday | formatDate"
                readonly
                label="Date of birth"
                class="mx-4"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="user.birthday"
              no-title
              scrollable
              :min="this.getMinAge()"
              :max="this.getMaxAge()"
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="datePicker = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(user.birthday)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-radio-group
            label="Gender:"
            v-model="user.gender"
            row
            class="mx-4"
          >
              <v-radio
                label="Male"
                :value="true"
              />
              <v-radio
                label="Female"
                :value="false"
              />
          </v-radio-group>
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="E-mail:"
            class="mx-4"
            required
          />
          <v-text-field
            v-model="user.address"
            :counter="200"
            class="mx-4"
            label="Address:"
          />


          <v-btn
            class="mx-4"
            @click="submit"
            color="green"
          >
            submit
          </v-btn>
        </form>

      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        id: 0,
        'name': '',
        'surname': '',
        'birthday': '',
        'gender': true,
        'email': '',
        'address': '',
      },
      datePicker: false,
      snackbar: false,
      snackbarTimeout: 2000,
      snackbarText: '',
      snackbarColor: 'green',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],

    }
  },
  async asyncData({ query }) {
    const userId = query.id
    return { userId }
  },
  mounted() {
    this.fetchCustomer()
  },

  methods: {
    async fetchCustomer(){
      let { data } = await this.$axios.get(`/api/customers/${this.userId}`)
      this.user = data
    },
    async submit() {
      const post = { ...this.user }
      post.birthday = this.$moment(post.birthday).toISOString()
      try{
        await this.$axios.post(`/api/customers/update`, post)
        this.snackbarColor = 'green'
        this.snackbarText = 'Customer updated'
        this.snackbar = true

      } catch(e){
        this.snackbarColor = 'red'
        this.snackbarText = `Error updating customer: ${e.message}`
        this.snackbar = true
      }

    },
    getMinAge() {
      return this.$moment().subtract(60, 'years').format('YYYY-MM-DD')
    },
    getMaxAge() {
      return this.$moment().subtract(18, 'years').format('YYYY-MM-DD')
    },
  }
}
</script>
