<template>
  <div class="smtp-container">
    <h1>SMTP Configuration</h1>
      <p> Some helpful text about SMTP settings here.</p>
      <div class="form-group">
        <label class="form-label" for="smtp-connection">Connection security</label>
        <select 
          id="smtp-connection" 
          v-model="config.email.connection" 
          @change="changeSMTPConnection"
        >
          <option value="ssl">Use SSL/TLS for all connections</option>
          <option value="startAlways">Use StartTLS for all connections</option>
          <option value="startAvail">Use StartTLS for connections when available</option>
          <option value="none">Use unencrypted connections</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="smtp-server">Server Address</label>
        <input type="text" id="smtp-server" v-model="config.email.server"/>
      </div>
      <div class="form-group">
        <label class="form-label" for="smtp-port">Port</label>
        <input type="number" id="smtp-=port" v-model="config.email.port" />
      </div>
      
      <p class="form-explainer">Your server may not require a username and password to connect</p>
      <div class="form-group">
        <label class="form-label" for="smtp-user">Username</label>
        <input type="text" id="smtp-user" v-model="config.email.username" />
      </div>
      <div class="form-group">
        <label class="form-label" for="smtp-pw">Password</label>
        <input type="password" id="smtp-pw" v-model="config.email.password" />
      </div>
  </div>
</template>
<script>
  

  export default {
    name: 'smtp-config',
    components: {},
    props: {},
    methods: {},
    computed: {},
  };
</script>
<style lang="scss">
</style>