<template>
  <!-- This is super hacky and quick, will need to be broken down into real components later -->
  <div class="onboarding">
    <section :class="['welcome', 'protoSection', {visible: showWelcome}]">
      <welcome-section />
    </section>
    <section :class="['smtp', 'protoSection', {visible: showSMTP}]">
      <smtp-section />
    </section>
    <section :class="['http', 'protoSection', {visible: showHTTP}]">
      <http-config />
    </section>
    <section :class="['https', 'protoSection', {visible: showHTTPS}]">
      <https-config />
    </section>
    <section :class="['ldap', 'protoSection', {visible: showLDAP}]">
      <ldap-config />
    </section>
    <button class="primary-button" @click="updatePage" :disabled="nextBtnDisabled">Next: {{nextSectionLabel}} </button>
  </div>
</template>
<script>
import { RadioButtonGroup, TreeishSelector } from 'rsconnect_storybook';
export default {
  name: 'onboarding',
  components: {
    RadioButtonGroup,
    TreeishSelector,
  },
  methods: {
    resetLDAPObject(){
      this.ldapFormPosition--;
    },
    confirmLDAPObject() {
      let saveTarget = this.ldapSectionToShow === 'userAttributes' 
        ? this.config.ldap.userObjectAttributes
        : this.config.ldap.groupObjectAttributes;
      
      for( let key in this.pendingLDAPObjectAttribs ){
          saveTarget[key] = this.pendingLDAPObjectAttribs[key];
      }
      this.pendingLDAPObjectAttribs = {};
      this.ldapFormPosition++;
    },
    cancelEditUserAttribute(){
      this.ldapFormState.userObjectSelected = false;
      this.currentLDAPSelected = '';
    },
    updateLDAPAttribute(){
      this.pendingLDAPObjectAttribs[this.attributeEditing] = this.correctedAttribute;
      this.ldapFormPosition = this.ldapFormLastPos;
    },
    cancelEditAttribute(){
      this.attributeEditing = '';
      this.ldapFormPosition = this.ldapFormLastPos;
    },
    editLDAPObjectAttribute( key ){
      this.attributeEditing = key;
      this.ldapFormLastPos = this.ldapFormPosition;
      this.ldapFormPosition = 0;
    },
    selectLDAPObject () {
      this.selectedLDAPObject = this.currentLDAPSelected;
      // this is where some network call would go to let the server figure out what it thinks the
      // correct attributes are. The response is currently faked in fakeDivinedUserAttributes and
      // fakeDivinedGroupAttributes
      let response;
      if(this.ldapSectionToShow === 'userObject'){
        response = this.fakeDivinedUserAttributes;
      }
      else {
        response = this.fakeDivinedGroupAttributes;
      }
      for( let key in response){
          this.pendingLDAPObjectAttribs[key] = response[key];
      }
      this.ldapFormPosition++;
    },
    verifyLDAP(){
      // some actual verification would take place in the real world
      this.ldapFormPosition++;
    },
    handleUserGroupSelected ( node ){
      this.currentLDAPSelected = node;
    },
    updateLDAPConnectionSec( evt ) {
      // console.debug(evt.target.value);
      switch( evt.target.value ){
        case 'ssl':
          this.config.ldap.tls = true;
          this.config.ldap.startTLS = false;
          break;
        case 'startAlways':
          this.config.ldap.tls = false;
          this.config.ldap.startTLS = true;
          break;
        default: 
          this.config.ldap.tls = false;
          this.config.ldap.startTLS = false;
      }
    },
    ldapServerAddress() {
      // console.debug(`${this.ldapHost}:${this.ldapPort}`);
      this.config.ldap.serverAddress =  `${this.ldapHost}:${this.ldapPort}`;
    },
    updateForceSecure( val ){ 
      this.extHTTPS = val;
      if(val === 'std'){
        this.config.http.forceSecure = false;
      }
      else {
        this.config.http.forceSecure = true;
      }
    },
    changeSMTPConnection( evt ){
      if( evt.target.value === 'ssl') {
        this.config.email.port = 465;
      } 
      else {
        this.config.email.port = 587;
      }
    },
    updateEmailChoice( val ){
      this.config.email.provider = val;
    },
    updateHTTPChoice( val ){
      this.httpChoice = val;
    },
    updateAuthChoice( val ){
      this.config.authentication.provider = val;
    },
    updatePage() {
      switch ( this.nextForm ){
        case 'smtp':
          this.showWelcome = false;
          this.showSMTP = true;
          this.showHTTP = false;
          this.showHTTPS = false;
          this.showLDAP = false;
          break;
        case 'http':
          this.showWelcome = false;
          this.showSMTP = false;
          this.showHTTP = true;
          this.showHTTPS = false;
          this.showLDAP = false;
          break;
        case 'https':
          this.showWelcome = false;
          this.showSMTP = false;
          this.showHTTP = false;
          this.showHTTPS = true;
          this.showLDAP = false;
          break;
        case 'oauth':
          console.debug('OAuth is not currently part of this prototype, sorry');
          break;
        case 'ldap':
          this.showWelcome = false;
          this.showSMTP = false;
          this.showHTTP = false;
          this.showHTTPS = false;
          this.showLDAP = true;
          break;
      }
    },
  },
  computed: {
    nextBtnDisabled(){
      return false; // obviously this will be something more complicated based on form validators
    },
    fakeDivinedUserAttributes (){
      let fakeResponse = {};
      
      fakeResponse.userObjectClass = 'posixAccount';
      fakeResponse.usernameAttribute = 'uid';
      fakeResponse.emailAttribute = 'mail';
      fakeResponse.userFirstNameAttribute = 'givenName';
      fakeResponse.userLastNameAttribute = 'sn';

      return fakeResponse;
    },
    fakeDivinedGroupAttributes (){
      let fakeResponse = {};
      
      fakeResponse.groupObjectClass = 'posixGroup';
      fakeResponse.nameAttribute = 'cn';

      return fakeResponse;
    },
    ldapSectionToShow() {
      return this.ldapFormState[this.ldapFormPosition];
    },
    nextForm() {
      // this is convoluted, to actually be solved by the router that I am just ignoring for
      // speed right now
      if( this.showWelcome ){
        if( this.config.email.provider !== 'sendmail' ){
          return this.config.email.provider;
        }
        return this.httpChoice;
      }
      else if( this.showSMTP ){
        return this.httpChoice;
      }
      else if( this.showHTTP || this.showHTTPS ){
        // this is only the end of this chain because we're ignoring other options that could be
        // managed by this app
        if( this.config.authentication.provider === 'password'){
          return 'summary';
        }
        return this.config.authentication.provider;
      }
      return '';
    },
    nextSectionLabel() {
      switch (this.nextForm){
        case 'smtp': 
          return 'SMTP Email Settings';
        case 'http':
          return 'HTTP Server Settings';
        case 'https':
          return 'HTTPS Server Settings';
        case 'oauth2':
          return 'OAuth2 Authentication Settings';
        case 'ldap':
          return 'LDAP Authentication Settings';
        case 'summary':
          return 'Final review';
        default:
          return ''; 
      }
    },
  },
  props:{},
  data: function (){
    return {
      
      ldapFormPosition: 1,
      ldapFormLastPos: 0,
      ldapFormState: [
        'editAttribute',
        'serverSettings',
        'userObject',
        'userAttributes',
        'groupObject',
        'groupAttributes',
        'userSelection',
      ],
      attributeEditing: '',
      currentLDAPSelected: '',
      correctedAttribute: '',
      selectedLDAPObject: {},
      pendingLDAPObjectAttribs: {},
      httpChoice: 'http', // the http/https sections of the config file don't have a provider, so...
      extHTTPS: 'std',
      ldapHost: '',
      ldapPort: '',
      showWelcome: true,
      showSMTP: false,
      showLDAP: false,
      showHTTP: false,
      showHTTPS: false,
      
      extHTTPSOptions: [
        { 
          label: 'HTTPS',
          value: 'std',
          explainer: 'Serve RStudio Connect connections over a standard HTTPS connection',
        },
        { 
          label: 'External HTTPS',
          value: 'ext',
          explainer: 'Use an external Load Balancer to serve RStudio Connect connections over an HTTPS connection',
        },
      ],
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
      }
    }
  },
}
</script>
<style lang="scss">
  #app {
    background: darkgray;
    height: 100%;
    min-height:100vh;
  }
  .protoSection,
  .tab-pane,
  .ldap-form-group {
    display: none;
  }
  
  .visible {
    display: block;
  }
  
  .onboarding {
    min-height:100vh;
    height:100%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 50px;
    padding-right: 50px;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: white;
  }
  .explainer-text {
    font-style: italic;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    margin-top: 0.25rem;
    margin-bottom: 0;
  }
  .ldap-form-group.visible {
  }
  .form-group {
    margin-bottom: 0.5rem;
    .form-label {
      display:block;
    }
    input {
      display: block;
    }
  }

  .connection-summary-bar {
    display: flex;
    list-style: none;
    padding: 0.5rem;
    background-color:lightblue;

    .connection-summary-item {
      flex: 0 0 auto;
      margin-right: 0.5rem;
    } 
  }

  .flex-group {
    display: flex;
  }
  .ldap-tree-selector,
  .ldap-selected-preview {
    flex: 1;
  }

  
</style>