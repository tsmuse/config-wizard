<template>
  <div class="path-choice">
    <h1 class="choice-title">{{choiceTitle}}</h1>
    <p class="choice-help">{{choiceHelpText}}</p>
    <radio-button-group 
      :options="choices" 
      :value="currentPath" 
      groupName="pathChoice"
      :callback="choiceSelected"
    />
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { RadioButtonGroup } from 'rsconnect_storybook';
  export default {
    components: {
      RadioButtonGroup,
    },
    props:{},
    computed:{
      currentPath(){
        return this.configPath[this.currentLocation];
      },
      currentLocation(){ 
        return this.$route.path.split('/')[1];
      },
       ...mapState({
        
        configPath: state => state.onboarding.configPath,
      })
    },
    methods:{
      choiceSelected( { value } ){
        // this.selectedChoice = value;
        
        let newConfigPath = { ...this.configPath };
        newConfigPath[this.currentLocation] = value;
        this.$store.commit('UPDATE_OB_CONFIG_PATH', { newConfigPath });
      },
      getPathChoices(){
        // this is where the app would call to the server for data. 
        let fakeResponse;
        let currentLocation = this.$route.path.split('/')[1];
        switch(currentLocation){
          case 'email':
            // some API call would go here instead of the following
            fakeResponse = {
              choiceTitle: 'RStudio Connect should send emails via',
              choiceHelpText: 'RStudio Connect can send you and your team updates and notifications via email. If you have sendmmail setup on this server there is nothing more to setup! If you use SMTP, you\'ll need to provide the address and port of the SMTP server, the type of connection security, and a user name and password (if you\'re server requires them, not all do.)',
              choices: [
                { 
                  label: 'Sendmail',
                  value: 'sendmail',
                },
                { 
                  label: 'SMTP',
                  value: 'smtp',
                },
              ],
            };
            break;
          case 'auth':
            fakeResponse = {
              // some API call would go here instead of the following
              choiceTitle: 'RStudio Connect should authenticate users via',
              choiceHelpText: 'You can use multiple ways to authenticate users in RStudio Connect. If you want to simple use passwords managed by Connect, there is nothing more to setup! Other authentication types require knowing the specifics of your existing authentication service.',
              choices: [
                { 
                  label: 'Password',
                  value: 'password',
                },
                { 
                  label: 'OAuth2',
                  value: 'oauth2',
                },
                { 
                  label: 'LDAP',
                  value: 'ldap',
                },
              ],
            };
            break;
          default:
            // some actual error handling needs to be built still
            fakeResponse = {
              choiceTitle: 'Something went wrong',
              choiceHelpText: 'Well, this is embarassing. We couldn\'t figure out which section of the config file you are working on.',
              choices: []
            };
            break;
        }

        this.choiceTitle = fakeResponse.choiceTitle;
        this.choiceHelpText = fakeResponse.choiceHelpText;
        this.choices = fakeResponse.choices;
        this.choiceSelected(fakeResponse.choices[0]);
      },
    },
    watch:{
      currentLocation (){
        this.getPathChoices();
      },
    },
    data(){
      return {
        choiceTitle: '',
        choiceHelpText: '',
        choices: [],
        selectedChoice: '',
      };
    },
    created(){
      // this is where we need to check and see if the state has been obliterated by the switch to 
      // https and ask the server if it has the data from the first form. If it does we go forward
      // from email, if it doesn't we go back to the beginning. 
      this.getPathChoices();
    },

  };
</script>
<style lang="scss">
</style>