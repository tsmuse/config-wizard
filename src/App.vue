<template>
  <div id="app">
    <div class="onboarding">
      <!-- router-view changes the form that is displayed only -->
      <div class="main-container">
        <router-view/>
      </div>
      <div class="help-container">
        <what-you-need-to-know :currentSectionHelp="currentHelp" :progressInfo="progressInfo" />
      </div>
      <div class="controls-container">
      <!-- <button class="primary-button" @click="updatePage" :disabled="nextBtnDisabled">Next: {{nextSectionLabel}} </button> -->
        <button class="primary-button" @click="moveToNext" :disabled="!canGoNext">Next: {{nextSectionLabel}} </button>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import WhatYouNeedToKnow from './components/WhatYouNeedToKnow';
  export default {
    components: {
      WhatYouNeedToKnow,
    },
    computed: {
      nextSectionLabel() {
        return 'this is a test label';
      },
      nextSection() {
        let splitRoute = this.currentRoute.split('/');
        let path = this.configPath;
        switch(splitRoute[1]){
          case '':
            return '/email';
          case 'email':
            if (splitRoute.length > 2){
              return '/auth';
            }
            else {
              return `/email/${path.email}`;
            }
          case 'auth':
            if(splitRoute.length > 2){
              return '/summary';
            } 
            else{
              return `/auth/${path.auth}`;
            }
          default:
            return '/';
        }
      },
      // this is for debugging, delete me
      currentRoute(){
        return this.$route.path;
      },
      currentHelp(){
        let helpArr = [];
        switch(this.currentRoute){
          case '/':
            helpArr = this.allHelp.basics.basics;
            break;
          case '/email':
            helpArr = this.allHelp.email.path;
            break;
          case '/email/smtp':
            helpArr = this.allHelp.email.smtp;
            break;
          case '/auth':
            helpArr = this.allHelp.auth.path;
            break;
          case '/auth/ldap':
            helpArr = this.allHelp.auth.ldap;
        }
        return helpArr;
      },
      ...mapState({
        canGoNext: state => state.onboarding.canGoNext,
        configPath: state => state.onboarding.configPath,
        progressInfo: state => state.onboarding.progressInfo,
        allHelp: state => state.onboarding.allHelp,
      })
    },
    methods: {
      moveToNext() {
        
        this.$router.push({ path: this.nextSection });
      },
    },
  };
</script>
<style lang="scss">
  @import '~normalize.css/normalize.css';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background: linear-gradient(-45deg, #585858, #a0a0a0 90%);
    height: 100%;
    min-height:100vh;
  }
  .onboarding {
    min-height:100vh;
    height:100%;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    // padding-left: 50px;
    // padding-right: 50px;
    // padding-top: 1rem;
    // padding-bottom: 1rem;
    background: white;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto 75px;

    .main-container {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      padding-right: 0.25rem;
      padding-left: 1.5rem;
    }

    .help-container {
      grid-column: 2 / 3;
      grid-row: 1 / 3;
      padding-left: 0.25rem;
      padding-right: 1.5rem;
      
    }

    .controls-container {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      padding-right: 1.5rem;
      padding-left: 1.5rem;
    }

    .main-container,
    .help-container {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }
  .explainer-text {
    font-style: italic;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    margin-top: 0.25rem;
    margin-bottom: 0;
  }
  .form-group {
    flex: 0 0 auto;
    margin-bottom: 0.5rem;
    .form-label {
      display:block;
    }
  }

  .form-title {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .connection-summary-bar {
    display: flex;
    list-style: none;
    padding: 0.5rem;
    background-color:lightblue;

    .connection-summary-item {
      flex: 0 0 auto;
      margin-right: 0.5rem;
    } 
  }

  .flex-group {
    display: flex;
  }
  .ldap-tree-selector,
  .ldap-selected-preview {
    flex: 1;
  }

</style>
