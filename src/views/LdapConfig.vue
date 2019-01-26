<template>
  <div class="ldap-container">
    <div class="ldap-header">
        <h1>LDAP Configuration</h1>
        <p> Some helpful text about LDAP settings here.</p>
      </div>
      <!-- Initial LDAP server settings -->
      <div :class="['ldap-form-group', {visible: ldapSectionToShow === 'serverSettings'}]">
        <div class="form-group">
          <label class="form-label" for="ldap-host">Host name</label>
          <input 
            type="text" 
            id="ldap-host" 
            v-model="ldapHost" 
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-port">Port</label>
          <input 
            type="number" 
            id="ldap-port" 
            v-model="ldapPort"
          />
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
          <label class="form-label" for="ldap-TLSCACertificate">Path to TLS Certificate</label>
          <input 
            type="text" 
            id="ldap-TLSCACertificate" 
            :value="currentLdapConfig.TLSCACertificate"
            @change="handleFieldChange"
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="anonymousBind"
            label="Login to server anoymnously"
            :value="currentLdapConfig.anonymousBind"
            :callback="updateLdapConfig"
          />
        </div>
        <div class="form-group" v-if="showBindDN">
          <label class="form-label" for="ldap-bindDN">Bind DN or User</label>
          <input 
            type="text" 
            id="ldap-bindDN" 
            :value="currentLdapConfig.bindDN"
            @change="handleFieldChange"
          />
        </div>
        <!-- 
          The password input fields are using the input event so they don't fire an update when the
          fields swap between password and file
         -->
        <div class="form-group" v-if="showBindPW">
          <label class="form-label" for="ldap-bindPassword">
            Password 
            <span class="small-text">
              <a href="#" @click.prevent="swapPWField">(Use password file instead)</a>
            </span>
          </label>
          <input 
            type="password" 
            id="ldap-bindPassword"
            :value="currentLdapConfig.bindPassword"  
            @input="handleFieldChange" 
          />
        </div>
        <div class="form-group" v-if="usingPWFile">
          <label class="form-label" for="ldap-bindPasswordFile">
            Password File
            <span class="small-text">
              <a href="#" @click.prevent="swapPWField">(Use password instead)</a>
            </span>
          </label>
          <input 
            type="text" 
            id="ldap-bindPasswordFile" 
            :value="currentLdapConfig.bindPasswordFile"
            @input="handleFieldChange"
          />
        </div>
        <button class="primary-button" @click="verifyLDAP">Verify LDAP connection</button>
      </div>

      <!-- Object Attribute confirmation -->
      <div 
        :class="[
          'ldap-form-group', 
          {visible: ldapSectionToShow === 'userGroupObjects' },
        ]"
      >
        <h2>Here's what we think your LDAP server looks like</h2>
        <table class="ldap-object-attributes">
          <thead>
            <th>Unique ID Attribute</th>
          </thead>
          <object-attribute-editor
            attributeName="uniqueIdAttribute"
            :attributeValue="currentLdapConfig.uniqueIdAttribute"
            :possibleValues="possibleAttributes"
            :callback="updateLdapConfig"
          />
        </table>
        <table class="ldap-object-attributes">
          <thead>
            <th>User Object</th>
          </thead>
          <object-attribute-editor
            attributeName="userObjectClass"
            :attributeValue="currentLdapConfig.userObjectClass"
            :possibleValues="possibleAttributes"
            :callback="updateLdapConfig"
          />
          <object-attribute-editor
            v-for="(value, key, idx) in currentLdapConfig.userObjectAttributes" 
            :key="idx"
            :attributeName="`userObjectAttributes.${key}`"
            :attributeValue="value"
            :possibleValues="possibleAttributes"
            :callback="updateLdapConfig"
          />
        </table>
        <table class="ldap-object-attributes">
          <thead>
            <th>Group Object</th>
          </thead>
          <object-attribute-editor
            attributeName="groupObjectClass"
            :attributeValue="currentLdapConfig.groupObjectClass"
            :possibleValues="possibleAttributes"
            :callback="updateLdapConfig"
          />
          <object-attribute-editor
            v-for="(value, key, idx) in currentLdapConfig.groupObjectAttributes" 
            :key="idx"
            :attributeName="`groupObjectAttributes.${key}`"
            :attributeValue="value"
            :possibleValues="possibleAttributes"
            :callback="updateLdapConfig"
          />
        </table>
        <button class="secondary-button" @click="resetLDAPObject">Cancel</button>
        <button class="primary-button" @click="confirmLDAPObject">Confirm</button>
        
      </div>

      
      <!-- User and Group selection -->
      <div :class="['ldap-form-group', {visible: ldapSectionToShow === 'userSelection'}]">
        <treeish-selector 
              id="ldap-user-group-selector" 
              class="ldap-tree-selector"
              :tree="fakeLDAPTree" 
              :selected-callback="handleUserGroupSelected" 
        />
        <div class="form-group">
          <label class="form-label" for="ldap-userSearchBaseDN">User Search Base DN</label>
          <input 
            id="ldap-userSearchBaseDN" 
            type="text" 
            :value="currentLdapConfig.userSearchBaseDN" 
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-groupSearchBaseDN">User Search Base DN</label>
          <input 
            id="ldap-groupSearchBaseDN" 
            type="text" 
            :value="currentLdapConfig.groupSearchBaseDN" 
          />
        </div>
        <button class="secondary-button" @click="resetLDAPObject">Cancel</button>
        <button class="primary-button" @click="confirmLDAPSearchStrings">Confirm</button>
      </div>

      <!-- Misc Settings == I'm not sure if these have a better spot somewhere else -->
      <div :class="['ldap-form-group', {visible: ldapSectionToShow === 'miscSettings'}]">
        <div class="form-group">
          <fancy-checkbox 
            name="webSudoMode"
            label="Use WebSudo Mode"
            :value="currentLdapConfig.webSudoMode"
            :callback="updateLdapConfig"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-groupSearchBaseDN">WebSudo Mode Duration (in seconds)</label>
          <input 
            id="ldap-webSudoDuration" 
            type="number" 
            :value="currentLdapConfig.webSudoDuration" 
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="registerOnFirstLogin"
            label="Allow users to Register on First Login"
            :value="currentLdapConfig.registerOnFirstLogin"
            :callback="updateLdapConfig"
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="logging"
            label="Enable logging"
            :value="currentLdapConfig.logging"
            :callback="updateLdapConfig"
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="serverTLSInsecure"
            label="Accept any certificate presented by the server and any host name in that certificate. Enabling this setting will make your server susceptible to man-in-the-middle attacks but is required in some circumstances, such as when using a self-signed certificate."
            :value="currentLdapConfig.serverTLSInsecure"
            :callback="updateLdapConfig"
          />
        </div>
      </div>
  </div>
</template>
<script>
  import { TreeishSelector, FancyCheckbox } from 'rsconnect_storybook';
  import ObjectAttributeEditor from '../components/ObjectAttributeEditor';
  import { mapState } from 'vuex';

  export default {
    name: 'ldap-config',
    components: {
      TreeishSelector,
      FancyCheckbox,
      ObjectAttributeEditor,
    },
    props: {},
    methods: {
      clearNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: true });
      },
      blockNext(){
        this.$store.commit('UPDATE_OB_CAN_GO_NEXT', { newCanGoNext: false });
      },
      verifyLDAP(){
        // Some call to the server to verify the ldap settings provided are good and get info about
        // the objects and attributes for the next step goes here.
        // The assunption is that the server will always return every required field, and if we 
        // can't derive the value we just send back '???' which we can display to the user
        let fakeresponse = {
          ldapConfig: {
            userObjectClass: 'posixAccount',
            userObjectAttributes: {
              usernameAttribute: 'uid',
              userEmailAttribute: '???',
              userFirstNameAttribute: 'givenName',
              userLastNameAttribute: '???',
            },
            groupObjectClass: 'posixGroup',
            groupObjectAttributes: {
                groupNameAttribute: '???',
                groupUniqueIdAttribute: '???',
            },
            uniqueIdAttribute: 'DN',
          },
          // no idea if this is too simple or not
          objAttributeList: [
            'DN',
            'posixAccount',
            'top',
            'cn',
            'guId',
            'memberNumber',
            'firstName',
            'memberGuId',
          ],

        };
        
        if( !fakeresponse.error ){
          let newLdapConfig = { ...this.currentLdapConfig };
          // newLdapConfig = { ...fakeresponse.ldapConfig };
          let responseConfig = fakeresponse.ldapConfig;
          for( let key in fakeresponse.ldapConfig ){
            newLdapConfig[key] = responseConfig[key];
          }
          this.$store.commit('UPDATE_LDAP_CONFIG',{ newLdapConfig });
          this.ldapFormPosition++;
          this.possibleAttributes = fakeresponse.objAttributeList;
        }
      },
      updateLDAPConnectionSec( evt ){
        switch( evt.target.value ){
          case 'ssl':
            this.updateLdapConfig( { id: 'tls', value: true });
            this.updateLdapConfig( { id: 'startTLS', value: false });
            break;
          case 'startAlways':
            this.updateLdapConfig( { id: 'tls', value: false });
            this.updateLdapConfig( { id: 'startTLS', value: true });
            break;
          default: 
            this.updateLdapConfig( { id: 'tls', value: false });
            this.updateLdapConfig( { id: 'startTLS', value: false });
        }
      },
      swapPWField(){
        // clear the password data just to make sure we don't leak anything
        this.updateLdapConfig( { id: 'bindPassword', value: '' });
        this.updateLdapConfig( { id: 'bindPasswordFile', value: '' });
        this.usingPWFile = !this.usingPWFile; 
      },
      updateAttribute( evt ){
        let id = evt.target.name,
          value = evt.target.value;
        this.updateLdapConfig({ id, value });
        this.editingAttribute = '';
      },
      handleUserGroupSelected(){},
      selectLDAPObject(){},
      editLDAPObjectAttribute( id ){
        this.editingAttribute = id;
      },
      confirmLDAPObject(){
        // some kind of verification happens here and then the server sends the tree?
        this.ldapFormPosition++;
      },
      confirmLDAPSearchStrings(){
        // some kind of verification happens here and blocks the forward momentum if it fails
        this.ldapFormPosition++;
      },
      resetLDAPObject(){},
      updateLDAPAttribute(){},
      cancelEditAttribute(){},
      updateLdapConfig( update ){
        let newLdapConfig = { ...this.currentLdapConfig },
          { id, value } = update,
          attrTest = id.split('.');

        if( attrTest.length > 1 ){
          newLdapConfig[attrTest[0]][attrTest[1]] = value;
        }
        else{
          newLdapConfig[id] = value;
        }
        this.$store.commit('UPDATE_LDAP_CONFIG',{ newLdapConfig });
      },
      handleFieldChange( evt ){
        let id = evt.target.id.split('-')[1],
          value = evt.target.value;
        this.updateLdapConfig({ id, value });
      },
    },
    computed: {
      ldapServerAddress(){
        return `${this.ldapHost}:${this.ldapPort}`;
      },
      showBindDN(){
        return !this.currentLdapConfig.anonymousBind;
      },
      showBindPW(){
        if( this.showBindDN && !this.usingPWFile ){
          return true;
        }
        return false;
      },
      ldapSectionToShow(){
        return this.ldapFormState[this.ldapFormPosition];
      },
      ...mapState({
        currentLdapConfig: state => state.onboarding.config.ldap,
      })
    },
    watch: {
      ldapServerAddress(){
        this.updateLdapConfig({ id: 'serverAddress', value: this.ldapServerAddress });
      },
    },
    data(){
      return {
        usingPWFile: false,
        ldapHost: '',
        ldapPort: '', 
        ldapFormPosition: 0,
        ldapFormState: [
          'serverSettings',
          'userGroupObjects',
          'userSelection',
          'miscSettings',
        ],
        editingAttribute: '',
        possibleAttributes: [],
        currentLDAPSelected: '',
        correctedAttribute: '',
        selectedLDAPObject: {},
        pendingLDAPObjectAttribs: {},
        fakeLDAPTree: {
          root: true,
          id: '001',
          label: 'Some Server(dc=some,dc=server)',
          state: {
            selected: false,
            expanded: true,
          },
          metadata: [
            { attribute: 'objectclass', value: 'dcObject (auxilliary)' },
            { attribute: 'objectclass', value: 'organization (structural)' },
            { attribute: 'objectclass', value: 'top (abstract)' },
            { attribute: 'dc', value: 'some' },
            { attribute: 'o', value: 'some server' },
          ],
          children: [
            {
              id: '002',
              label: 'Groups (ou=groups)',
              state: {
                selected: false,
                expanded: false,
              },
              metadata: [
                { attribute: 'objectclass', value: 'organizationalUnit (structural)' },
                { attribute: 'objectclass', value: 'top (abstract)' },
                { attribute: 'ou', value: 'groups' },
              ],
              children: [
                {
                  id: '003',
                  label: 'Admins (cn=admins)',
                  state: {
                    selected: false,
                    expanded: false,
                  },
                  metadata: [
                    { attribute: 'objectclass', value: 'posixGroup (structural)' },
                    { attribute: 'objectclass', value: 'top (abstract)' },
                    { attribute: 'cn', value: 'admins' },
                    { attribute: 'gidNumber', value: '500' },
                    { attribute: 'memberUid', value: 'bRoss' },
                  ],
                  children: [],
                },
                {
                  id: '004',
                  label: 'Datascience (cn=datascience)',
                  state: {
                    selected: false,
                    expanded: false,
                  },
                  metadata: [
                    { attribute: 'objectclass', value: 'posixGroup (structural)' },
                    { attribute: 'objectclass', value: 'top (abstract)' },
                    { attribute: 'cn', value: 'datascience' },
                    { attribute: 'gidNumber', value: '501' },
                    { attribute: 'memberUid', value: 'rBoss' },
                    { attribute: 'memberUid', value: 'bSors' }
                  ],
                  children: [],
                }, 
                {
                  id: '005',
                  label: 'Supersecret (cn=supersecret)',
                  state: {
                    selected: false,
                    expanded: false,
                  },
                  metadata: [
                    { attribute: 'objectclass', value: 'posixGroup (structural)' },
                    { attribute: 'objectclass', value: 'top (abstract)' },
                    { attribute: 'cn', value: 'supersecret' },
                    { attribute: 'gidNumber', value: '502' },
                    { attribute: 'memberUid', value: 'sBors' },
                    { attribute: 'memberUid', value: 'bRoss' },
                    { attribute: 'memberUid', value: 'bSors' },
                  ],
                  children: [],
                }, 
              ],
            },
            {
              id: '003',
              label: 'Users (ou=users)',
              state: {
                selected: false,
                expanded: false,
              },
              metadata: [
                { attribute: 'objectclass', value: 'organizationalUnit (structural)' },
                { attribute: 'objectclass', value: 'top (abstract)' },
                { attribute: 'ou', value: 'users' },
              ],
              children: [
                {
                  id: '006',
                  label: 'Bob Ross (cn=Bob Ross)',
                  state: {
                    selected: false,
                    expanded: false,
                  },
                  metadata: [
                    { attribute: 'objectclass', value: 'inetOrgPerson (structural)' },
                    { attribute: 'objectclass', value: 'posixAccount (auxillary)' },
                    { attribute: 'objectclass', value: 'top (abstract)' },
                    { attribute: 'cn', value: 'Bob Ross' },
                    { attribute: 'gidNumber', value: '502' },
                    { attribute: 'homeDirectory', value: '/home/users/bRoss' },
                    { attribute: 'sn', value: 'Ross' },
                    { attribute: 'uid', value: 'bRoss' },
                    { attribute: 'uidNumber', value: '1001' },
                    { attribute: 'givenName', value: 'Bob' },
                    { attribute: 'loginShell', value: '/bin/sh' },
                    { attribute: 'userPassword', value: 'MD5 hashed password' },
                    { attribute: 'mail', value: 'bRoss@some.server' },
                  ],
                  children: [],
                },
                {
                  id: '007',
                  label: 'Rob Boss (cn=Rob Boss)',
                  state: {
                    selected: false,
                    expanded: false,
                  },
                  metadata: [
                    { attribute: 'objectclass', value: 'inetOrgPerson (structural)' },
                    { attribute: 'objectclass', value: 'posixAccount (auxillary)' },
                    { attribute: 'objectclass', value: 'top (abstract)' },
                    { attribute: 'cn', value: 'Rob Boss' },
                    { attribute: 'gidNumber', value: '502' },
                    { attribute: 'homeDirectory', value: '/home/users/rBoss' },
                    { attribute: 'sn', value: 'Boss' },
                    { attribute: 'uid', value: 'rBoss' },
                    { attribute: 'uidNumber', value: '1002' },
                    { attribute: 'givenName', value: 'Rob' },
                    { attribute: 'loginShell', value: '/bin/sh' },
                    { attribute: 'userPassword', value: 'MD5 hashed password' },
                    { attribute: 'mail', value: 'rBoss@some.server' },
                  ],
                  children: [],
                },
                {
                  id: '008',
                  label: 'Sob Bors (cn=Sob Bors)',
                  state: {
                    selected: false,
                    expanded: false,
                  },
                  metadata: [
                    { attribute: 'objectclass', value: 'inetOrgPerson (structural)' },
                    { attribute: 'objectclass', value: 'posixAccount (auxillary)' },
                    { attribute: 'objectclass', value: 'top (abstract)' },
                    { attribute: 'cn', value: 'Sob Bors' },
                    { attribute: 'gidNumber', value: '502' },
                    { attribute: 'homeDirectory', value: '/home/users/sBors' },
                    { attribute: 'sn', value: 'Bors' },
                    { attribute: 'uid', value: 'sBors' },
                    { attribute: 'uidNumber', value: '1003' },
                    { attribute: 'givenName', value: 'Sob' },
                    { attribute: 'loginShell', value: '/bin/sh' },
                    { attribute: 'userPassword', value: 'MD5 hashed password' },
                    { attribute: 'mail', value: 'sBors@some.server' },
                  ],
                  children: [],
                },
                {
                  id: '009',
                  label: 'Bob Sors (cn=Bob Sors)',
                  state: {
                    selected: false,
                    expanded: false,
                  },
                  metadata: [
                    { attribute: 'objectclass', value: 'inetOrgPerson (structural)' },
                    { attribute: 'objectclass', value: 'posixAccount (auxillary)' },
                    { attribute: 'objectclass', value: 'top (abstract)' },
                    { attribute: 'cn', value: 'Bob Sors' },
                    { attribute: 'gidNumber', value: '502' },
                    { attribute: 'homeDirectory', value: '/home/users/bSors' },
                    { attribute: 'sn', value: 'Sors' },
                    { attribute: 'uid', value: 'bSors' },
                    { attribute: 'uidNumber', value: '1003' },
                    { attribute: 'givenName', value: 'Bob' },
                    { attribute: 'loginShell', value: '/bin/sh' },
                    { attribute: 'userPassword', value: 'MD5 hashed password' },
                    { attribute: 'mail', value: 'bSors@some.server' },
                  ],
                  children: [],
                },
              ],
            },
          ],
      },
        
      };
    },
    created(){
      this.blockNext();
    },
  };
</script>
<style lang="scss">
  .ldap-form-group {
    display: none;

    &.visible {
      display: block;
    }
  }
</style>