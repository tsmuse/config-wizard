<template>
  <div id="app">
    <div class="onboarding">
      <!-- router-view changes the form that is displayed only -->
      <router-view/>
      <!-- <button class="primary-button" @click="updatePage" :disabled="nextBtnDisabled">Next: {{nextSectionLabel}} </button> -->
      <button class="primary-button" @click="moveToNext" :disabled="!canGoNext">Next: {{nextSectionLabel}} </button>

    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      nextSectionLabel() {
        return 'this is a test label';
      },
      nextTarget() {
        switch(this.currentSection){
          case 'welcome': 
            return 'email';
          case 'email':
            return 'auth';
          // other sections would go here as they get decided/added
          default:
            return 'summary';
        }
      },
      ...mapState({
        currentSection: state => state.onboarding.currentSection,
        canGoNext: state => state.onboarding.canGoNext,
      })
    },
    methods: {
      moveToNext() {
        // some form validation checking goes here. The forms should be able to report it so this 
        // should only be asking the form component if it's valid then moving on iff true
        let target = this.nextTarget;
        this.$store.commit('UPDATE_CURRENT_OB_SECTION', { newSection: target });
        this.$router.push({ path: target });
        
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
    background: darkgray;
    height: 100%;
    min-height:100vh;
  }
  .onboarding {
    min-height:100vh;
    height:100%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 50px;
    padding-right: 50px;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: white;
  }
  .explainer-text {
    font-style: italic;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    margin-top: 0.25rem;
    margin-bottom: 0;
  }
  .ldap-form-group.visible {
  }
  .form-group {
    margin-bottom: 0.5rem;
    .form-label {
      display:block;
    }
    input {
      display: block;
    }
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
