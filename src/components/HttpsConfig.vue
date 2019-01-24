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
      <label class="form-label" for="https-port">Port</label>
      <input type="number" id="https-port" ref="httpPort" min="0" required v-model="http.port"/>
    </div>
    <div class="form-group" v-if="showCertKey">
      <label class="form-label" for="https-cert">Path to TLS Certificate</label>
      <input type="text" id="https-cert" ref="httpCert" minlength="1" required v-model="http.pathToCert"/>
    </div>

    <div class="form-group" v-if="showCertKey">
      <label class="form-label" for="https-key">Path to Private Key</label>
      <input type="text" id="https-key" ref="httpKey" minlength="1" required  v-model="http.pathToKey"/>
    </div>
    <div class="form-group">
      <input type="checkbox" id="ext-https" :selected="http.ext" @change="updateExt" />
      <label class="form-label" for="ext-https">Use https provided by an external source (e.g. a load balancer)</label>
    </div>
    <div class="form-group">
      <input type="checkbox" id="http-insecure" :selected="http.insecure" @change="updateAgreement" />
      <label class="form-label" for="ext-insecure">
        I want to serve RStudio Connect over HTTP. I understand that HTTP connections are insecure 
        and that all my data might get hacked by l33t hax0rs, then I will be forever p0wned.
      </label>
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
  export default {
    name: 'https-config',
    props: {},
    methods: {
      clearNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: true });
      },
      blockNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: false });
      },
      checkHttps( details ){
        // this will be some kind of call to the server to validate that the https details are valid
        // for now it just always returns true
        details; // this is to get ESLint to stop yelling
        return true;
      },
      verifyHTTP(){
        let portValid = this.$refs.httpPort.checkValidity();
        let { ext, insecure } = this.http;
        
        // this logic feels really sloppy
        if( portValid ){
          if( insecure ){
            this.showInsecureBlock = true;
          }
          else if ( ext ){
            // this will be a async function call...assuming I can use Async/Await in this environment 
            this.showReadyBlock = this.checkHttps( this.http );
          }
          // Not sure if we can validate the external https or not...We should be able to?
          else {
            let keyValid = this.$refs.httpKey.checkValidity();
            let certValid = this.$refs.httpCert.checkValidity();
            // this will be a async function call...assuming I can use Async/Await in this environment 
            if( keyValid && certValid ){
              this.showReadyBlock = this.checkHttps( this.http );
            }
          }
          if ( this.showInsecureBlock || this.showReadyBlock ){
            this.clearNext();
          } 
        }
      },
      updateExt(){
        this.http.ext = !this.http.ext;
        if(this.http.ext){
          this.http.port = 443;
        }
      },
      updateAgreement(){
        this.http.insecure = !this.http.insecure;
        if (this.http.insecure ){
          this.http.ext = this.http.ext ? !this.http.ext : this.http.ext;
          this.http.port = '80';
        }
        else {
          this.http.port = '443';
        }
        
      },
    },
    computed: {
      transportType(){
        if( this.http.insecure ){
          return 'HTTP';
        }
        return 'HTTPS';
      },
      showCertKey(){
        if( this.http.insecure || this.http.ext ){
          return false;
        }
        return true;
      },
    },
    data(){
      return {
        http: {
          port: '443',
          ext: false,
          pathToCert: '',
          pathToKey: '',
          insecure: false,
        },
        showReadyBlock: false,
        showInsecureBlock: false,
      };
    },
  };
</script>
<style lang="scss">
</style>