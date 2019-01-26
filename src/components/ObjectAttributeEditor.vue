<template>
  <tr class="ldap-object-attribute" >
    <!-- component -->
    <td>{{attributeName}}</td>
    <td v-if="!editing">{{attributeValue}}</td>
    <td v-if="!editing">
      <button @click="editObjectAttribute()">change</button>
    </td>
    <td v-if="editing">
      <select :name="attributeName" :value="attributeValue" @change="updateAttribute">
        <option v-for="(attr, idx) in possibleValues" :key="idx" :value="attr">
          {{attr}}
        </option>
      </select>
    </td>
  </tr>
</template>
<script>
  export default {
    props: {
      attributeName: String,
      attributeValue: String,
      possibleValues: Array,
      callback: Function,
    },
    methods: {
      editObjectAttribute(){
        this.editing = true;
      },
      updateAttribute( evt ){
        let id = evt.target.name,
          value = evt.target.value;
        this.callback({ id, value });
        this.editing = false;
      },
    },
    data(){
      return {
        editing: false,
      };
    },
  };
</script>
<style lang="scss">
</style>