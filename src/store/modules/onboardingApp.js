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
    
  },
  getters: {},
  mutations,
};