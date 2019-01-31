<template>
  <div class="form-container path-choice">
    <h1 class="form-title">{{choiceTitle}}</h1>
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
  .path-choice {
    text-align: center;
  }

  .radio-button-grid {
    justify-content: center;
  }
</style>