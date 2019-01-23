<template>
  <div class="http-container">
    <h1>HTTP Configuration</h1>
    <p> Some helpful text about HTTP settings here.</p>
    <div class="form-group">
      <label class="form-label" for="http-port">Port</label>
      <input type="number" id="http-port" v-model="config.http.port" />
    </div>
  </div>
</template>
<script>
  

  export default {
    name: 'http-config',
    components: {},
    props: {},
    methods: {},
    computed: {},
  };
</script>
<style lang="scss">
</style>