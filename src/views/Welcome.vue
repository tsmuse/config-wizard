<template>
  <div>
    <div class="form-container welcome-container">
      <h1 class="form-title">Welcome to RStudio Connect</h1>
      <p class="welcome-text">We will quickly guide you through the setup process to get RStudio Connect up and running, 
        including letting your know what information you need to have on-hand to complete the setup. 
        More copy that introduces the product could go here.
      </p>

      <h2>Basic Information</h2>
      <div class="form-group">
        <label class="form-label" for="serverAddress">Server Address</label>
        <input type="text" id="serverAddress" :value="serverAddress" @change="updateServerAddress"/>
        <p class="explainer-text">This is the URL your RStudio Conncect server will use</p>
      </div>
      <div class="form-group">
        <label class="form-label" for="senderEmail">Sender Email</label>
        <input type="email" id="senderEmail" :value="senderEmail" @change="updateSenderEmail" />
        <p class="explainer-text">
          This is the email address your RStudio Conncect server will use to send emails
        </p>
      </div>
    </div>
    <https-config />
  </div>
</template>
<script>
  import HttpsConfig from '../components/HttpsConfig';
  import { mapState } from 'vuex';

  export default {
    name: 'welcome-section',
    components: {
      HttpsConfig
    },
    props: {},
    methods: {
      updateServerAddress( evt ){
        this.$store.commit('UPDATE_SERVER_ADDRESS', { newServerAddress: evt.target.value })
      },
      updateSenderEmail( evt ) {
        this.$store.commit('UPDATE_SENDER_EMAIL', { newSenderEmail: evt.target.value })
      },
    },
    computed: {
      ...mapState({
        serverAddress: state => state.onboarding.config.server.address,
        senderEmail: state => state.onboarding.config.server.senderEmail,
        configPath: state => state.onboarding.configPath,
      })
    },
    created(){
      // This is where the app would ask the server for the state to repopulate this form, if that
      // state exists on the server. This is to handle when the connection is upgraded to https
      // upon completion of this step and the app is flushed of it's state. If the user never 
      // navigates back to this page, we never rehydrate this potion of the state and it's no big
      // deal because it's already saved on the server. 
    },
    data (){
      return {
        
        
      };
    },
  };
</script>
<style lang="scss">
  .welcome-text {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
</style>