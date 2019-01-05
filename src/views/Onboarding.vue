<template>
  <!-- This is super hacky and quick, will need to be broken down into real components later -->
  <div class="onboarding">
    <section :class="['welcome', {visible: showWelcome}]">
      <div class="welcome-container">
        <h1>Welcome to RStudio Connect</h1>
        <p>We will quickly guide you through the setup process to get RStudio Connect up and running. More copy that introduces the product could go here.</p>
        <!-- <form class="basic-info-form"> -->
          <h2>Basic Information</h2>
          <div class="form-group">
            <label class="form-label" for="serverAddress">Server Address</label>
            <input type="text" id="serverAddress" />
            <p class="explainer-text">This is the URL your RStudio Conncect server will use</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="senderEmail">Sender Email</label>
            <input type="email" id="senderEmail" />
            <p class="explainer-text">This is the email address your RStudio Conncect server will use to send emails</p>
          </div>
          <h2>Send email via</h2>
          <radio-button-group 
            label="Select an email service for Connect to use"
            :options="emailOptions"
            :value="emailChoice"
            :callback="updateEmailChoice"
          />
          <!-- <p class="explainer-text">{{emailExplainer}}</p>
          <div class="radio-button-group">
            <label class="form-label">Select an email protocol for Connect to use </label>
            <ul class="radio-button-grid">
              <li class="radio-button-grid-item" v-for="option in emailOptions" :key="option.label">
                <button :class="['radio-button', {selected: option.selected}]">
                  {{option.label}}
                </button>
              </li>
            </ul>
          </div> -->
          <!-- <h2>Serve via</h2>
          <p class="explainer-text">{{httpExplainer}}</p>
          <div class="radio-button-group">
            <label class="form-label">Select a protocol for Connect to use </label>
            <ul class="radio-button-grid">
              <li class="radio-button-grid-item" v-for="option in httpOptions" :key="option.label">
                <button :class="['radio-button', {selected: option.selected}]">
                  {{option.label}}
                </button>
              </li>
            </ul>
          </div>
          <h2>Authenticate users via</h2>
          <p class="explainer-text">{{authExplainer}}</p>
          <div class="radio-button-group">
            <label class="form-label">Select a method for Connect to use </label>
            <ul class="radio-button-grid">
              <li class="radio-button-grid-item" v-for="option in authOptions" :key="option.label">
                <button :class="['radio-button', {selected: option.selected}]">
                  {{option.label}}
                </button>
              </li>
            </ul>
          </div> -->
        <!-- </form> -->
        <button class="primary-button">Next: </button>
      </div>
    </section>
    <section :class="['smtp', {visible: showSMTP}]">

    </section>
    <section :class="['ldap', {visible: showLDAP}]">
    </section>
  </div>
</template>
<script>
import { RadioButtonGroup } from 'rsconnect_storybook';
export default {
  name: 'onboarding',
  components: {
    RadioButtonGroup,
  },
  methods: {
    updateEmailChoice( val ){
      this.emailChoice = val;
    }
  },
  computed: {},
  props:{},
  data: function (){
    return {
      emailChoice: 'sendmail',
      showWelcome: true,
      showSMTP: false,
      showLDAP: false,
      emailOptions: [
        { 
          label: 'Sendmail',
          value: 'sendmail',
          explainer: 'Use Sendmail for this Rstudio Connect Server. This requires no additional configurations inside RStudio Connect',
        },
        { 
          label: 'SMTP',
          value: 'smtp',
          explainer: 'Use SMTP for this Rstudio Connect Server. This requires a server address, port, type of security used (SSL, FastTSL, or none), and possibly a user name and password.',
        },
      ],
      httpOptions: [
        { 
          label: 'HTTP',
          selected: true,
        },
        { 
          label: 'HTTPS',
          selected: false,
        },
      ],
      authOptions: [
        { 
          label: 'Password',
          selected: true,
        },
        { 
          label: 'OAuth2',
          selected: false,
        },
        { 
          label: 'LDAP',
          selected: false,
        },
      ],
    }
  },
}
</script>
<style lang="scss">

</style>