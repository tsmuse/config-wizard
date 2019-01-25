<template>
  <div class="http-container">
    <h2>Web Server</h2>
    <p>
      RStudio Connect will serve a variety of web pages, including this configuration tool. We 
      recommend you serve all these pages over HTTPS. To setup HTTPS provide the port you would like
      to serve on (the default is 443), the path to your TLS certificate, and your private SSH key.
      If you're RStudio Connect Server will be behind other infrastructure that will be serving https,
      simply select https provided by an external source and provide the port.
    </p>
    <p>
      <em>While it is possible to server RStudio Connect via http, <strong>We do not recommend it.</strong></em>
    </p>
    
    <div class="form-group">
      <label class="form-label" for="http-port">Port</label>
      <input 
        type="number" 
        id="http-port" 
        ref="httpPort" 
        min="0" 
        :value="currentHttpConfig.port"
        @change="handleFieldChange"
        required 
      />
    </div>
    <div class="form-group" v-if="showCertKey">
      <label class="form-label" for="http-cert">Path to TLS Certificate</label>
      <input 
        type="text" 
        id="http-cert" 
        ref="httpCert" 
        minlength="1" 
        :value="currentHttpConfig.cert"
        @change="handleFieldChange"
        required 
      />
    </div>

    <div class="form-group" v-if="showCertKey">
      <label class="form-label" for="http-key">Path to Private Key</label>
      <input 
        type="text" 
        id="http-key" 
        ref="httpKey" 
        minlength="1" 
        :value="currentHttpConfig.key"
        @change="handleFieldChange"
        required  
      />
    </div>
    <div class="form-group">
      <fancy-checkbox 
        name="forceSecure"
        label="Use https provided by an external source (e.g. a load balancer)"
        :value="currentHttpConfig.forceSecure"
        :callback="updateHttpConfig"
      />
      <!-- <input 
        type="checkbox" 
        id="http-forceSecure" 
        :selected="currentHttpConfig.forceSecure" 
        @change="handleFieldChange" 
      />
      <label class="form-label" for="http-ext">
        Use https provided by an external source (e.g. a load balancer)
      </label> -->
    </div>
    <div class="form-group">
      <fancy-checkbox 
        name="insecure"
        label="I want to serve RStudio Connect over HTTP. I understand that HTTP connections are 
        insecure and that all my data might get hacked by l33t hax0rs, then I will be forever p0wned."
        :value="insecure"
        :callback="updateAgreement"
      />
    </div>
    <button class="secondary-button" @click="verifyHTTP">
      Verify {{transportType}} settings
    </button>
    
    <p class="status-block warning-block" v-if="showInsecureBlock">
      You're about to set up this server to serve insecure webpages!
    </p>
    
    <p class="status-block success-block" v-if="showReadyBlock">
      It's all good! Let's go to HTTPS!!!
    </p>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { FancyCheckbox } from 'rsconnect_storybook';
  export default {
    name: 'https-config',
    components: {
      FancyCheckbox,
    },
    props: {},
    methods: {
      clearNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: true });
      },
      blockNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: false });
      },

      checkHttps(){
        // this will be some kind of call to the server to validate that the https details are valid
        // for now it just always returns true
        return true;
      },
      verifyHTTP(){
        let portValid = this.$refs.httpPort.checkValidity();
        // this logic feels really sloppy
        if( portValid ){
          if( this.insecure ){
            this.showInsecureBlock = true;
          }
          else if ( this.currentHttpConfig.forceSecure ){
            // this will be a async function call...assuming I can use Async/Await in this environment 
            this.showReadyBlock = this.checkHttps();
          }
          // Not sure if we can validate the external https or not...We should be able to?
          else {
            let keyValid = this.$refs.httpKey.checkValidity();
            let certValid = this.$refs.httpCert.checkValidity();
            // this will be a async function call...assuming I can use Async/Await in this environment 
            if( keyValid && certValid ){
              this.showReadyBlock = this.checkHttps();
            }
          }
          if ( this.showInsecureBlock || this.showReadyBlock ){
            this.clearNext();
          } 
        }
      },
      handleFieldChange( evt ){
        let id = evt.target.id.split('-')[1],
          value = evt.target.value;
        this.updateHttpConfig( { id, value });
      },
      updateHttpConfig( update ){
        let newHttpConfig = { ...this.currentHttpConfig },
          { id, value } = update;
        
        newHttpConfig[id] = value;
        this.$store.commit('UPDATE_HTTP_CONFIG',{ newHttpConfig });
      },
      // updateExt(){
      //   this.http.ext = !this.http.ext;
      //   if(this.http.ext){
      //     this.http.port = 443;
      //   }
      // },
      updateAgreement( update ){
        this.insecure = update.value;
        if ( this.insecure ){
          this.updateHttpConfig({ key: 'port', value: '80' });
          this.updateHttpConfig({ key: 'forceSecure', value: false });
          // this.http.ext = this.http.ext ? !this.http.ext : this.http.ext;
          // this.http.port = '80';
        }
        else {
          // this.http.port = '443';
          this.updateHttpConfig({ key: 'port', value: '443' });
        }
        
      },
    },
    computed: {
      transportType(){
        if( this.insecure ){
          return 'HTTP';
        }
        return 'HTTPS';
      },
      showCertKey(){
        if( this.insecure || this.currentHttpConfig.forceSecure ){
          return false;
        }
        return true;
      },
      ...mapState({
        currentHttpConfig: state => state.onboarding.config.http,
      })
    },
    data(){
      return {
        insecure: false,
        showReadyBlock: false,
        showInsecureBlock: false,
      };
    },
  };
</script>
<style lang="scss">
</style>