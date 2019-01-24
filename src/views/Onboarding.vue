<template>
  <!-- This is super hacky and quick, will need to be broken down into real components later -->
  <div class="onboarding">
    <section :class="['welcome', 'protoSection', {visible: showWelcome}]">
      <div class="welcome-container">
        <h1>Welcome to RStudio Connect</h1>
        <p>We will quickly guide you through the setup process to get RStudio Connect up and running, including letting your know what information you need to have on-hand to complete the setup. More copy that introduces the product could go here.</p>
        
          <h2>Basic Information</h2>
          <div class="form-group">
            <label class="form-label" for="serverAddress">Server Address</label>
            <input type="text" id="serverAddress" v-model="config.server.address"/>
            <p class="explainer-text">This is the URL your RStudio Conncect server will use</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="senderEmail">Sender Email</label>
            <input type="email" id="senderEmail" v-model="config.server.senderEmail" />
            <p class="explainer-text">This is the email address your RStudio Conncect server will use to send emails</p>
          </div>
          <h2>Send email via</h2>
          <radio-button-group 
            label="Select an email service for Connect to use"
            :options="emailOptions"
            :value="config.email.provider"
            :callback="updateEmailChoice"
          />
          <h2>Serve via</h2>
          <radio-button-group 
            label="Select a protocol for Connect to use"
            :options="httpOptions"
            :value="httpChoice"
            :callback="updateHTTPChoice"
          />
          
          <h2>Authenticate users via</h2>
          <radio-button-group
            label="Select a method to authentica the users of your Connect server"
            :options="authOptions"
            :value="config.authentication.provider"
            :callback="updateAuthChoice"
          />
      </div>
    </section>
    <section :class="['smtp', 'protoSection', {visible: showSMTP}]">
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
    </section>
    <section :class="['http', 'protoSection', {visible: showHTTP}]">
      <h1>HTTP Configuration</h1>
      <p> Some helpful text about HTTP settings here.</p>
      <div class="form-group">
        <label class="form-label" for="http-port">Port</label>
        <input type="number" id="http-port" v-model="config.http.port" />
      </div>
    </section>
    <section :class="['https', 'protoSection', {visible: showHTTPS}]">
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
    </section>
    <section :class="['ldap', 'protoSection', {visible: showLDAP}]">
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
      config: {
        server: {
          senderEmail: '',
          address: '',
        },
        email: {
          provider: 'sendmail',
          server: '',
          port: 465,
          connection: 'ssl',
          username: '',
          password: '',
        },
        http: {
          port: 80,
          forceSecure: false,
        },
        https: {
          port: 443,
          key: '',
          cert: '',
        },
        authentication: {
          provider: 'password',
        },
        ldap: {
          serverAddress: '',
          tls: true,
          startTLS: false,
          TLSCACertificate: '',
          bindDN: '',
          bindPassword: '',
          userObjectAttributes: {},
          groupObjectAttributes: {},
        },
      },
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
      emailOptions: [
        { 
          label: 'Sendmail',
          value: 'sendmail',
          explainer: 'Use Sendmail for this Rstudio Connect Server. This requires no additional configurations inside RStudio Connect',
        },
        { 
          label: 'SMTP',
          value: 'smtp',
          explainer: 'Use SMTP for this Rstudio Connect Server. This requires your provide a server address, port, type of security used (SSL, FastTSL, or none), and possibly a user name and password.',
        },
      ],
      httpOptions: [
        { 
          label: 'HTTP',
          value: 'http',
          explainer: 'Serve pages over HTTP. WARNING: Serving pages this way is insecure, security warning here!',
        },
        { 
          label: 'HTTPS',
          value: 'https',
          explainer: 'Serve pages over HTTPS. This requires your provide a security certifical file, an SSL key, a port to broadcast on, or an external HTTPS provider (e.g. a load-balancer)',
        },
      ],
      authOptions: [
        { 
          label: 'Password',
          value: 'password',
          explainer: 'Users will log in with a username and password they establish with this RStudio connect server',
        },
        { 
          label: 'OAuth2',
          value: 'oauth2',
          explainer: 'Users will be able to log in with a supported OAuth2 account (e.g. a Google Account.) This requires you provide a clientID and a clientSecret.',
        },
         { 
          label: 'LDAP',
          value: 'ldap',
          explainer: 'Users will be able to log in with their existing LDAP credentials. This requires you to provide an LDAP server address including a port to use, LDAP User Schema, Distingused Names for users and groups that will have access to this RStudio Connect server.',
        },
      ],
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