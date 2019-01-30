<template>
  <div class="ldap-container">
    <div class="ldap-header">
        <h1>LDAP Configuration</h1>
        <p> Some helpful text about LDAP settings here.</p>
      </div>
      <!-- Initial LDAP server settings -->
      <div class="ldap-form-group" v-if="currentSection === 'server'">
        <div class="form-group">
          <label class="form-label" for="ldap-host">Host name</label>
          <input 
            type="text" 
            id="ldap-host" 
            v-model="ldapHost"
            @change="updateServerAddress" 
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-port">Port</label>
          <input 
            type="number" 
            id="ldap-port" 
            v-model="ldapPort"
            @change="updateServerAddress"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="smtp-connection">Connection security</label>
          <select 
            id="smtp-connection" 
            @change="updateConnectionSec"
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
            :value="currentLdapConfig.server.TLSCACertificate"
            @change="handleFieldChange"
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="anonymousBind"
            label="Login to server anoymnously"
            :value="currentLdapConfig.server.anonymousBind"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </div>
        <div class="form-group" v-if="showBindDN">
          <label class="form-label" for="ldap-bindDN">Bind DN or User</label>
          <input 
            type="text" 
            id="ldap-bindDN" 
            :value="currentLdapConfig.server.bindDN"
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
            :value="currentLdapConfig.server.bindPassword"  
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
            :value="currentLdapConfig.server.bindPasswordFile"
            @input="handleFieldChange"
          />
        </div>
        <button class="primary-button" @click="verifyLDAP">Verify LDAP connection</button>
      </div>

      <!-- Object Attribute confirmation -->
      <div class="ldap-form-group" v-if="currentSection === 'ldapObjects'">
        <h2>Here's what we think your LDAP server looks like</h2>
        <table class="ldap-object-attributes">
          <thead>
            <th>Unique ID Attribute</th>
          </thead>
          <object-attribute-editor
            attributeName="uniqueIdAttribute"
            :attributeValue="currentLdapConfig.ldapObjects.uniqueIdAttribute"
            :possibleValues="possibleAttributes"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </table>
        <table class="ldap-object-attributes">
          <thead>
            <th>User Object</th>
          </thead>
          <object-attribute-editor
            attributeName="userObjectClass"
            :attributeValue="currentLdapConfig.ldapObjects.userObjectClass"
            :possibleValues="possibleAttributes"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
          <object-attribute-editor
            v-for="(value, key, idx) in currentLdapConfig.ldapObjects.userObjectAttributes" 
            :key="idx"
            :attributeName="`userObjectAttributes.${key}`"
            :attributeValue="value"
            :possibleValues="possibleAttributes"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </table>
        <table class="ldap-object-attributes">
          <thead>
            <th>Group Object</th>
          </thead>
          <object-attribute-editor
            attributeName="groupObjectClass"
            :attributeValue="currentLdapConfig.ldapObjects.groupObjectClass"
            :possibleValues="possibleAttributes"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
          <object-attribute-editor
            v-for="(value, key, idx) in currentLdapConfig.ldapObjects.groupObjectAttributes" 
            :key="idx"
            :attributeName="`groupObjectAttributes.${key}`"
            :attributeValue="value"
            :possibleValues="possibleAttributes"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </table>
        <button class="secondary-button" @click="resetLDAPObject">Cancel</button>
        <button class="primary-button" @click="confirmLDAPObject">Confirm</button>
        
      </div>

      
      <!-- User and Group selection -->
      <div class="ldap-form-group" v-if="currentSection === 'searchBase'">
        <tabbar-selector 
          :options="searchStringOptions" 
          :selection="selectedSearchStringSection" 
          :callback="changeSearchStringSection" 
        />
        <div class="search-string-section" v-if="selectedSearchStringSection.value === 'users'">
          <treeish-selector 
            id="ldap-user-group-selector" 
            class="ldap-tree-selector"
            :tree="ldapUserTree"
            :on-item-clicked="node => (handleTreeClick(node, 'user'))" 
            :on-item-expand="handleTreeExpand"
          />
          <div class="form-group">
            <label class="form-label" for="ldap-userSearchBaseDN">User Search Base DN</label>
            <input 
              id="ldap-userSearchBaseDN" 
              type="text" 
              :value="currentLdapConfig.searchBase.userSearchBaseDN" 
            />
          </div>
        </div>
        <div class="search-string-section" v-if="selectedSearchStringSection.value === 'groups'">
          <treeish-selector 
            id="ldap-user-group-selector" 
            class="ldap-tree-selector"
            :tree="ldapGroupTree" 
            :on-item-clicked="node => (handleTreeClick(node, 'group'))"
            :on-item-expand="handleTreeExpand"    
          />
          <div class="form-group">
            <label class="form-label" for="ldap-groupSearchBaseDN">Group Search Base DN</label>
            <input 
              id="ldap-groupSearchBaseDN" 
              type="text" 
              :value="currentLdapConfig.searchBase.groupSearchBaseDN" 
            />
          </div>
        </div>
        <button class="secondary-button" @click="resetLDAPObject">Cancel</button>
        <button class="primary-button" @click="confirmLDAPSearchStrings">Confirm</button>
      </div>

      <!-- Misc Settings == I'm not sure if these have a better spot somewhere else -->
      <div class="ldap-form-group" v-if="currentSection === 'misc'">
        <div class="form-group">
          <fancy-checkbox 
            name="webSudoMode"
            label="Use WebSudo Mode"
            :value="currentLdapConfig.misc.webSudoMode"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="ldap-groupSearchBaseDN">WebSudo Mode Duration (in seconds)</label>
          <input 
            id="ldap-webSudoDuration" 
            type="number" 
            :value="currentLdapConfig.misc.webSudoDuration" 
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="registerOnFirstLogin"
            label="Allow users to Register on First Login"
            :value="currentLdapConfig.misc.registerOnFirstLogin"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="logging"
            label="Enable logging"
            :value="currentLdapConfig.misc.logging"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </div>
        <div class="form-group">
          <fancy-checkbox 
            name="serverTLSInsecure"
            label="Accept any certificate presented by the server and any host name in that certificate. Enabling this setting will make your server susceptible to man-in-the-middle attacks but is required in some circumstances, such as when using a self-signed certificate."
            :value="currentLdapConfig.misc.serverTLSInsecure"
            :callback="update => (this.updateLdapConfig(update, this.currentSection))"
          />
        </div>
         <button class="secondary-button" @click="resetLDAPObject">Cancel</button>
        <button class="primary-button" @click="finalVerifyLdapConfig">
          Confirm
        </button>
      </div>
      <div class="ldap-form-group" v-if="currentSection === 'summary'">
        
        <button class="secondary-button" @click="resetLDAPObject">Cancel</button>
          <table class="summary-table">
            <thead>
              
            </thead>
          </table>
      </div>
  </div>
</template>
<script>
  import { TreeishSelector, FancyCheckbox, TabbarSelector } from 'rsconnect_storybook';
  import ObjectAttributeEditor from '../components/ObjectAttributeEditor';
  import { mapState } from 'vuex';
  // this is just for prototyping purposed
  import { 
    FAKE_LDAP_USER_RESPONSE, 
    FAKE_LDAP_GROUP_RESPONSE,
    FAKE_LDAP_OBJECTS_DETAILS,
    FAKE_LDAP_ATTRS_LIST,
  } from '../components/fakeResponses';

  export default {
    name: 'ldap-config',
    components: {
      TreeishSelector,
      FancyCheckbox,
      TabbarSelector,
      ObjectAttributeEditor,
    },
    props: {},
    data(){
      return {
        usingPWFile: false,
        ldapHost: '',
        ldapPort: '', 
        ldapFormPosition: 0,
        ldapFormState: [
          'server',
          'ldapObjects',
          'searchBase',
          'misc',
          'summary',
        ],
        editingAttribute: '',
        possibleAttributes: [],
        currentLDAPSelected: '',
        correctedAttribute: '',
        selectedLDAPObject: {},
        pendingLDAPObjectAttribs: {},
        ldapUserTree: {},
        ldapGroupTree: {},
        searchStringOptions: [
          { label: 'Users', value: 'users' }, 
          { label: 'Groups', value: 'groups' }
        ],
        selectedSearchStringSection: { label: 'Users', value: 'users' },
      };
    },
    methods: {
      finalVerifyLdapConfig(){
        // not sure that any verification is needed here other than the user to confirm choices or
        // go back and change something. Everything should be machine checked along the way
        this.ldapFormPosition++;
        this.clearNext();
      },
      handleTreeExpand( node ){
        node.state.expanded = !node.state.expanded;
      },
      handleTreeClick( node, type ){
        let alreadySelected = node.state.selected,
          treeInUse = type === 'user' ? this.ldapUserTree : this.ldapGroupTree;
        this.forEachNode(treeInUse, node => (node.state.selected = false));
        node.state.selected = alreadySelected == null ? true : !alreadySelected;
        this.updateLdapConfig( {id: `${type}SearchBaseDN`, value: node.dn }, this.currentSection );
      },
      changeSearchStringSection( update ){
        this.selectedSearchStringSection = update;
      },
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
        let response = {
          ldapConfig: FAKE_LDAP_OBJECTS_DETAILS,
          // no idea if this is too simple or not
          objAttributeList: FAKE_LDAP_ATTRS_LIST,
        };
        
        if( !response.error ){
          let newLdapConfig = response.ldapConfig;
          this.ldapFormPosition++;
          this.$store.commit('UPDATE_LDAP_CONFIG',{ newLdapConfig, section: this.currentSection} );
          this.possibleAttributes = response.objAttributeList;
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
      handleUserGroupSelected( val ){
        console.debug(val);
      },
      editLDAPObjectAttribute( id ){
        this.editingAttribute = id;
      },
      confirmLDAPObject(){
        // some kind of verification happens here and then the server sends the tree?
        this.ldapFormPosition++;
        let fakeresponse = {
          userTree : FAKE_LDAP_USER_RESPONSE,
          groupTree: FAKE_LDAP_GROUP_RESPONSE,  
        };

        if( !fakeresponse.error ){
          this.ldapUserTree = fakeresponse.userTree;
          this.ldapGroupTree = fakeresponse.groupTree;
        }
      },
      confirmLDAPSearchStrings(){
        // some kind of verification happens here and blocks the forward momentum if it fails
        this.ldapFormPosition++;
      },
      updateLdapConfig( update, section ){
        let newLdapConfig = { ...this.currentLdapConfig[section] },
          { id, value } = update,
          attrTest = id.split('.');

        if( attrTest.length > 2 ){
          newLdapConfig[attrTest[1]][attrTest[2]] = value;
        }
        else{
          newLdapConfig[id] = value;
        }
        this.$store.commit('UPDATE_LDAP_CONFIG',{ newLdapConfig, section });
      },
      handleFieldChange( evt ){
        let id = evt.target.id.split('-')[1],
          value = evt.target.value;
        this.updateLdapConfig( { id, value }, this.currentSection );
      },
      forEachNode(nodesArray, cb) {
        if (nodesArray == null) {
          return;
        }

        for (let node of nodesArray) {
          cb(node);
          this.forEachNode(node.children, cb);
        }
      },
      updateServerAddress(){
        this.updateLdapConfig( 
          { id: 'serverAddress', value: this.serverAddress }, this.currentSection
        );
      },
      updateConnectionSec( evt ){
        switch( evt.target.value ){
          case 'ssl':
            this.updateLdapConfig( { id: 'tls', value: true }, this.currentSection );
            this.updateLdapConfig( { id: 'startTLS', value: false }, this.currentSection );
            break;
          case 'startAlways':
            this.updateLdapConfig( { id: 'tls', value: false }, this.currentSection );
            this.updateLdapConfig( { id: 'startTLS', value: true }, this.currentSection );
            break;
          default: 
            this.updateLdapConfig( { id: 'tls', value: false });
            this.updateLdapConfig( { id: 'startTLS', value: false }, this.currentSection );
        }
      },
      resetLDAPObject(){
        
      },
    },
    computed: {
      serverAddress(){
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
      currentSection(){
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
    created(){
      this.blockNext();
    },
  };
</script>
<style lang="scss">
 
</style>