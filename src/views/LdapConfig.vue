<template>
  <div class="ldap-container">
    <div class="ldap-header">
        <h1>LDAP Configuration</h1>
        <p> Some helpful text about LDAP settings here.</p>
      </div>
      <!-- this needs to have it's visibility set to a variable -->
      <ul class="connection-summary-bar">
        <li class="connection-summary-item">Server: {{config.ldap.serverAddress}}</li>
        <li class="connection-summary-item">Connection Security: TBD</li>
        <li class="connection-summary-item">Bind DN: {{config.ldap.bindDN}}</li>
      </ul>
      <!-- Initial LDAP server settings -->
      <div :class="['ldap-form-group', {visible: ldapSectionToShow === 'serverSettings'}]">
        <div class="form-group">
          <label class="form-label" for="ldap-host">Host name</label>
          <input type="text" id="ldap-host" v-model="ldapHost" @input="ldapServerAddress" />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-port">Port</label>
          <input type="number" id="ldap-port" v-model="ldapPort" @input="ldapServerAddress" />
        </div>
        <div class="form-group">
          <label class="form-label" for="smtp-connection">Connection security</label>
          <select 
            id="smtp-connection" 
            @change="updateLDAPConnectionSec"
          >
            <option value="ssl">Use SSL/TLS for all connections</option>
            <option value="startAlways">Use StartTLS for all connections</option>
            <option value="none">Use unencrypted connections</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-cert">Path to TLS Certificate</label>
          <input type="text" id="ldap-cert" v-model="config.ldap.TLSCACertificate" />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-bindDN">Bind DN or User</label>
          <input type="text" id="ldap-bindDN" vmodel="config.ldap.bindDN" />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-bindPW">Password</label>
          <input type="password" id="ldap-bindPW" vmodel="config.ldap.bindPassword" />
        </div>
        <button class="primary-button" @click="verifyLDAP">Verify LDAP connection</button>
      </div>
      <!-- Object selection for attribute extraction -->
      <div 
        :class="[
          'ldap-form-group', 
          {visible: ldapSectionToShow === 'userObject' || ldapSectionToShow === 'groupObject'},
        ]"
      >
        <div class="form-group">
          <label class="form-label" for="ldap-user-group-selector">
            Select a {{ldapSectionToShow === 'userObject' ? 'user' : 'group'}}. We will use it 
            to verify RStudio Connect can find all the info it needs
          </label>
          <div class="flex-group">
            <treeish-selector 
              id="ldap-user-group-selector" 
              class="ldap-tree-selector"
              :tree="fakeLDAPTree" 
              :selected-callback="handleUserGroupSelected" 
            />
            <table class="ldap-selected-preview">
              <tr 
                class="ldap-object-attribute" 
                v-for="( value, idx ) in currentLDAPSelected.metadata"
                :key="idx"
              >
                <td>{{value.attribute}}</td>
                <td>{{value.value}} </td>
              </tr>
            </table>
          </div>
          <button class="primary-button" @click="selectLDAPObject">
            Select {{currentLDAPSelected.label}}
          </button>
        </div>
      </div>
      <!-- Object Attribute confirmation -->
      <div 
        :class="[
          'ldap-form-group', 
          {visible: ldapSectionToShow === 'userAttributes' || ldapSectionToShow === 'groupAttributes'},
        ]"
      >
        <table class="ldap-object-attributes">
          <tr 
            class="ldap-object-attribute" 
            v-for="(value, key, idx) in pendingLDAPObjectAttribs" 
            :key="idx"
          >
            <td>{{key}}</td>
            <td>{{value}} </td>
            <td><button @click="editLDAPObjectAttribute(key)">change</button></td>
          </tr>
        </table>
        <button class="primary-button" @click="confirmLDAPObject">Confirm</button>
        <button class="secondary-button" @click="resetLDAPObject">Cancel</button>
      </div>
      <!-- Object Attribute editing -->
      <div :class="['ldap-form-group', {visible: ldapSectionToShow === 'editAttribute' }]">
        <div class="flex-group">
          <div class="form-group">
            <label class="form-label">Select the correct value for {{attributeEditing}}</label>
            <select size="7" v-model="correctedAttribute">
              <option 
                v-for="(value, idx) of currentLDAPSelected.metadata" 
                :key="idx" 
                :value="value.attribute"
              >
                {{value.attribute}}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">
              {{ ldapFormState.groupObjectSelected ? 'Group' : 'User' }} Object you selected
            </label>
            <table class="ldap-selected-preview">
              <tr 
                class="ldap-user-attribute" 
                v-for="( value, idx ) in currentLDAPSelected.metadata"
                :key="idx"
              >
                <td>{{value.attribute}}</td>
                <td>{{value.value}} </td>
              </tr>
            </table>
          </div>
        </div>
        <button class="primary-button" @click="updateLDAPAttribute">Select</button>
        <button class="secondary-button" @click="cancelEditAttribute">Cancel</button>
      </div>
      <!-- User and Group selection -->
      <div :class="['ldap-form-group', {visible: ldapSectionToShow === 'userSelection'}]">
        <div class="form-group">
          <label class="form-label">
            Select users and groups that will have access to this RStudio Connect server
          </label>
          <select size="7" multiple v-model="ldapObjectsGranted">
            <optgroup label="Groups">
              <option v-for="(group, idx) in fakeDivinedGroups" :key="idx" :value="group.value">
                {{group.label}}
              </option>
            </optgroup>
            <optgroup label="Users">
              <option v-for="(user, idx) in fakeDivinedUsers" :key="idx" :value="user.value">
                {{user.label}}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
  </div>
</template>
<script>
  import { TreeishSelector } from 'rsconnect_storybook';

  export default {
    name: 'ldap-config',
    components: {
      TreeishSelector,
    },
    props: {},
    methods: {},
    computed: {},
  };
</script>
<style lang="scss">
</style>