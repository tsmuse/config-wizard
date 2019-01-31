import * as types from '../mutation-types';

export const mutations = {
  [types.UPDATE_CURRENT_OB_SECTION](state, payload) {
    state.currentSection = payload.newSection;
  },
  [types.UPDATE_OB_CONFIG_PATH](state, payload) {
    state.configPath = payload.newConfigPath;
  },
  [types.UPDATE_SENDER_EMAIL](state, payload) {
    state.config.server.senderEmail = payload.newSenderEmail;
  },
  [types.UPDATE_SERVER_ADDRESS](state, payload) {
    state.config.server.address = payload.newServerAddress;
  },
  [types.UPDATE_OB_CAN_GO_NEXT](state, payload) {
    state.canGoNext = payload.newCanGoNext;
  },
  [types.UPDATE_EMAIL_CONFIG](state, payload) {
    state.config.email = payload.newEmailConfig;
  },
  [types.UPDATE_HTTP_CONFIG](state, payload) {
    state.config.http = payload.newHttpConfig;
  },
  [types.UPDATE_LDAP_CONFIG](state, payload) {
    state.config.ldap[payload.section] = payload.newLdapConfig;
  },
};

export default {
  // Most of these values would be pulled in on beforeMount or mount
  // currently hand written only to speed up initial mockup process
  state: {
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
        port: 443,
        key: '',
        cert: '',
        forceSecure: false,
      },
      authentication: {
        provider: 'password',
      },
      ldap: {
        server: {
          serverAddress: '',
          tls: true,
          startTLS: false,
          TLSCACertificate: '',
          serverTLSInsecure: false,
          bindDN: '',
          bindPassword: '',
          bindPasswordFile: '',
          anonymousBind: false,
        },
        ldapObjects: {
          userObjectAttributes: {
            userFirstNameAttribute: '',
            userLastNameAttribute: '',
            userEmailAttribute: '',
            usernameAttribute: '',
          },
          groupObjectAttributes: {
            groupNameAttribute: '',
            groupUniqueIdAttribute: 'DN',
          },
          userObjectClass: '',
          userFilterBase: 'objectClass={UserObjectClass}',
          groupObjectClass: '',
          groupFilterBase: 'objectClass={GroupObjectClass}',
          uniqueIdAttribute: 'DN',
        },
        searchBase: {
          userSearchBaseDN: '',
          groupSearchBaseDN: '',
        },
        misc: {
          permittedLoginGroup: '',
          logging: false,
          webSudoMode: true,
          webSudoDuration: '300',
          registerOnFirstLogin: false,
        }
      },
    },
    configPath: {
      email: '',
      auth: '',
    },
    canGoNext: false,
    progressInfo: [
      {
        section: 'Basics',
        complete: false,
      },
      {
        section: 'Email',
        complete: false,
      },
      {
        section: 'Authentication',
        complete: false,
      },
    ],
    allHelp:{
      basics: {
        basics: [
          {
            title: 'Web Server',
            help: `RStudio Connect will serve a variety of web pages, including this configuration tool. We recommend you serve all these pages over HTTPS. To setup HTTPS provide the port you would like to serve on (the default is 443), the path to your TLS certificate, and your private SSH key. If you're RStudio Connect Server will be behind other infrastructure that will be serving https, simply select https provided by an external source and provide the port. While it is possible to server RStudio Connect via http, We do not recommend it.`,
          },
        ],
      },
      email: {
        path: [
          {
            help: `RStudio Connect can send you and your team updates and notifications via email. If you have sendmmail setup on this server there is nothing more to setup! If you use SMTP, you'll need to provide the address and port of the SMTP server, the type of connection security, and a user name and password (if you're server requires them, not all do.)`,
          },
        ],
        smtp: [
          {
            help: `Some helpful summary about SMTP settings`
          },
          {
            title: 'Connection Security',
            help: `This is the encyption method used when communicating with your SMTP server...`,
          },
          {
            title: 'Username & Password',
            help: `Your server may not require a user name and password to connect. If it doesn't simply leave these fields blank.`,
          },
        ],
      },
      auth: {
        path: [
          {
            help: `You can use multiple ways to authenticate users in RStudio Connect. If you want to simple use passwords managed by Connect, there is nothing more to setup! Other authentication types require knowing the specifics of your existing authentication service.`,
          },
          {
            title: 'OAuth2',
            help: `Currently OAuth2 isn't part of this prototype. Selecting it as an option will skip the auth section`
          },
          {
            title: 'LDAP/Active Directory',
            help: `Our multi-part form will help you configure RStudio Connect to use your LDAP server for authentication. You will need to know your server's hostname anb port and will have to have a user or bindDN and password with permissions to start this process.`,
          },
        ],
        oauth: [],
        ldap: [
          {
            help: `Some helpful ldap summary`,
          },
          {
            title: 'Connection Security',
            help: `We reccomend that you use SSL or StartTLS for all your connections.`,
          },
          {
            title: 'Server connection',
            help: `It's important to make sure you have a BindDN/username with the appropriate permissions for your ldap server.`,
          },
        ],
      },
    },
    
  },
  getters: {},
  mutations,
};