<template>
  <div class="welcome-container">
    <h1>Welcome to RStudio Connect</h1>
    <p>We will quickly guide you through the setup process to get RStudio Connect up and running, 
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
    <https-config />
    <!-- <h2>Send email via</h2>
    <radio-button-group 
      label="Select an email service for Connect to use"
      :options="pathOptions.emailOptions"
      :value="configPathEmail"
      :callback="updateConfigPath"
      group-name="email"
    />    
    <h2>Authenticate users via</h2>
    <radio-button-group
      label="Select a method to authentica the users of your Connect server"
      :options="pathOptions.authOptions"
      :value="configPathAuth"
      :callback="updateConfigPath"
      group-name="auth"
    /> -->
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
      updateConfigPath( update ){
        let newPath = { ...this.configPath };
        let { id, value } = update;
        newPath[id] = value;
        this.$store.commit('UPDATE_OB_CONFIG_PATH', { newConfigPath: newPath });
      },
      updateServerAddress( evt ){
        console.debug(evt.target.value);
        // this.$store.commit('UPDATE_SERVER_ADDRESS', { newServerAddress:  })
      },
      updateSenderEmail( evt) {
        console.debug(evt.target.value);
        // this.$store.commit('UPDATE_SENDER_EMAIL', { newSenderEmail:  })
      },
    },
    computed: {
      ...mapState({
        serverAddress: state => state.onboarding.config.server.address,
        senderEmail: state => state.onboarding.config.server.senderEmail,
        configPath: state => state.onboarding.configPath,
        configPathWeb: state => state.onboarding.configPath.web,
        configPathEmail: state => state.onboarding.configPath.email,
        configPathAuth: state => state.onboarding.configPath.auth,
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
        // pathOptions would be populated by asking the server for them on Created
        pathOptions: {
          emailOptions: [
            {
              label: 'Sendmail',
              value: 'sendmail',
              explainer: 'Use Sendmail for this Rstudio Connect Server. This requires no additional configurations inside RStudio Connect',
            },
            {
              label: 'SMTP',
              value: 'smtp',
              explainer: 'Use SMTP for this Rstudio Connect Server. This requires your provide a server address, port, type of security used (SSL, FastTSL, or none), and possibly a user name and password.',
            },
          ],
          httpOptions: [
            {
              label: 'HTTP',
              value: 'http',
              explainer: 'Serve pages over HTTP. WARNING: Serving pages this way is insecure, security warning here!',
            },
            {
              label: 'HTTPS',
              value: 'https',
              explainer: 'Serve pages over HTTPS. This requires your provide a security certifical file, an SSL key, a port to broadcast on, or an external HTTPS provider (e.g. a load-balancer)',
            },
          ],
          authOptions: [
            {
              label: 'Password',
              value: 'password',
              explainer: 'Users will log in with a username and password they establish with this RStudio connect server',
            },
            {
              label: 'OAuth2',
              value: 'oauth2',
              explainer: 'Users will be able to log in with a supported OAuth2 account (e.g. a Google Account.) This requires you provide a clientID and a clientSecret.',
            },
            {
              label: 'LDAP',
              value: 'ldap',
              explainer: 'Users will be able to log in with their existing LDAP credentials. This requires you to provide an LDAP server address including a port to use, LDAP User Schema, Distingused Names for users and groups that will have access to this RStudio Connect server.',
            },
          ],
        },
      };
    },
  };
</script>
<style lang="scss">
</style>