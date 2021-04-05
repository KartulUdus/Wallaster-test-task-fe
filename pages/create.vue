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
        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
        >
          <v-text-field
            v-model="user.name"
            :rules="nameRules"
            :counter="100"
            class="mx-4"
            label="Name:"
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
                class="mx-4"
                label="Date of birth:"
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
            label="Gender"
            v-model="user.gender"
            class="mx-4"
            row
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
            class="mx-4"
            label="E-mail:"
            required
          />
          <v-text-field
            v-model="user.address"
            :rules="nameRules"
            class="mx-4"
            :counter="200"
            label="Address:"
          />


          <v-btn
            class="mx-4"
            @click="submit"
            color="green"
          >
            Create
          </v-btn>
        </v-form>

      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        'name': '',
        'surname': '',
        'birthday': '',
        'gender': true,
        'email': '',
        'address': '',
      },
      datePicker: false,
      snackbar: false,
      formValid: false,
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
    this.user.birthday = this.getMaxAge()
  },

  methods: {
    async submit() {
      const post = { ...this.user }
      if (!this.$refs.form.validate()) {
        this.snackbarColor = 'error'
        this.snackbarText = 'Please check required fields'
        this.snackbar = true
      }
      else {

        try{
          post.birthday = this.$moment(post.birthday).toISOString()
          await this.$axios.post(`/api/customers`, post)
          this.snackbarColor = 'green'
          this.snackbarText = 'Customer created'
          this.snackbar = true
        } catch(e) {
          this.snackbarColor = 'red'
          this.snackbarText = `Error updating customer: ${e.message}`
          this.snackbar = true
        }
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
