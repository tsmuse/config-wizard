<template>
  <div class="http-container">
   <h1>HTTPS Configuration</h1>
      <p> Some helpful text about HTTPS settings here.</p>
      <radio-button-group
        label=""
        :options="extHTTPSOptions"
        :value="extHTTPS"
        :callback="updateForceSecure"
      />
      <div :class="['external-https-form', 'tab-pane', {visible: config.http.forceSecure}]">
        <div class="form-group">
          <label class="form-label" for="ext-https-port">Port</label>
          <input type="number" id="ext-https-port" v-model="config.http.port" />
        </div>
      </div>
      <div :class="['std-https-form', 'tab-pane', {visible: !config.http.forceSecure}]">
        <div class="form-group">
          <label class="form-label" for="https-port">Port</label>
          <input type="number" id="https-port" v-model="config.https.port" />
        </div>
        <div class="form-group">
          <label class="form-label" for="https-cert">Path to TLS Certificate</label>
          <input type="text" id="https-cert" v-model="config.https.cert" />
        </div>
        <div class="form-group">
          <label class="form-label" for="https-cert">Path to Private Key</label>
          <input type="text" id="https-cert" v-model="config.https.key"/>
        </div>
      </div>
  </div>
</template>
<script>
  import { RadioButtonGroup } from 'rsconnect_storybook';

  export default {
    name: 'https-config',
    components: {
      RadioButtonGroup,
    },
    props: {},
    methods: {},
    computed: {},
  };
</script>
<style lang="scss">
</style>