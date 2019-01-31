<template>
  <div class="form-container smtp-container">
    <h1 class="form-title">SMTP Configuration</h1>
      <!-- <p> Some helpful text about SMTP settings here.</p> -->
      <div class="form-group">
        <label class="form-label" for="smtp-connection">Connection security</label>
        <select 
          id="smtp-connection" 
          :value="currentEmailConfig.connection" 
          @change="handleFieldChange"
        >
          <option value="ssl">Use SSL/TLS for all connections</option>
          <option value="startAlways">Use StartTLS for all connections</option>
          <option value="startAvail">Use StartTLS for connections when available</option>
          <option value="none">Use unencrypted connections</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="smtp-server">Server Address</label>
        <input 
          type="text" 
          id="smtp-server" 
          ref="server"
          minlength="1" 
          :value="currentEmailConfig.server" 
          @change="handleFieldChange"
          required 
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="smtp-port">Port</label>
        <input 
          type="number" 
          id="smtp-port" 
          ref="port"
          min="0" 
          :value="currentEmailConfig.port"
          @change="handleFieldChange"  
          required
        />
      </div>
      
      <p class="form-explainer">Your server may not require a username and password to connect</p>
      <div class="form-group">
        <label class="form-label" for="smtp-username">Username</label>
        <input 
          type="text" 
          id="smtp-username" 
          :value="currentEmailConfig.username"
          @change="handleFieldChange"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="smtp-password">Password</label>
        <input 
          type="password" 
          id="smtp-password" 
          :value="currentEmailConfig.password"
          @change="handleFieldChange"
        />
      </div>
      <button class="secondary-button" @click="verifySMTP">
      Verify SMTP settings
    </button>
    <p class="status-block success-block" v-if="showReadyBlock">
      It's all good!
    </p>
  </div>
</template>
<script>
  import { mapState } from 'vuex';

  export default {
    name: 'smtp-config',
    components: {},
    props: {},
    methods: {
      clearNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: true });
      },
      blockNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: false });
      },
      checkSMTP(){
        // this is where the async call would go to verify that the smtp settings work.
        return true;
      },
      verifySMTP(){
        let serverValid = this.$refs.server.checkValidity(),
          portValid = this.$refs.port.checkValidity();
        if( serverValid && portValid ){
          if( this.checkSMTP() ){
            this.showReadyBlock = true;
            this.clearNext();
          }
        }
      },
      updateEmailConfig( update ){
        let newEmailConfig = { ...this.currentEmailConfig },
          { id, value } = update;
        newEmailConfig[id] = value;
        this.$store.commit('UPDATE_EMAIL_CONFIG', { newEmailConfig });
      },
      handleFieldChange( evt ){
        let id = evt.target.id.split('-')[1],
          value = evt.target.value;
        this.updateEmailConfig( { id, value });
      },
    },
    computed: {
      ...mapState({
        currentEmailConfig: state => state.onboarding.config.email,
      })
    },
    created(){
      this.blockNext();
    },
    data(){
      return {
        showReadyBlock: false,
      };
    },
  };
</script>
<style lang="scss">
</style>