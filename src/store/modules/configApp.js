import * as types from '../mutation-types';

export const mutations = {
  [types.UPDATE_CURRENT_SECTION](state, payload) {
    state.currentSection = payload.newSection;
  },
  [types.UPDATE_CONFIG_ITEM](state, payload) {
    let { propToUpdate, newValue, currentSection, currentOption, configSection } = payload;
    state.config[currentSection].options[currentOption].configSections[configSection][propToUpdate].userValue = newValue;
  },
};

export default {
  state: {
    // currentSection is used to keep track of where along the progress bar we are. It MUST be 
    // a valid key for config. Should be set by the progress bar?
    // currentSection: 'basics', 
    // currentOption is used to keep track of the selected option in the current section. It MUST be
    // a valid key for config[currentSection]. Should be set by the option controller?
    // currentOption: 'basics',
    // config comes from ??? some service somewhere? A file on the local disk?
    // these are the basic "sections" i could come up with. Subject to change.
    config: { 
      basics: {
        label: 'Basics',
        options: {
          basics: {
            label: 'Basics',
            headingText: ';Basic server information\n',
            noMatch: 'The basic settings you need for your RStudio Connect server. Welcome to square one!',
           configSections: {
             Server: { 
                SenderEmail: {
                  helpText: 'An email address this RStudio Connect server will send emails from.',
                  userValue: ''
                },
                Address: {
                  helpText: 'A public URL for this RStudio Connect server (e.g. https://connect.company.com)',
                  userValue: ''
                },
              },
            },
          }
        }
      },
      email: {
        label: 'Email',
        options: {
          sendmail: {
            label: 'Sendmail',
            headingText: ';Email settings using SendMail\n',
            noMatch: 'The settings you need for your RStudio Connect server to send email via sendMail!',
            configSections: {
              Mail: {
                Provider: {
                  helpText: 'Hey, nothing to change here!',
                  userValue: 'sendmail',
                },
              },
            },
          },
          smtp: {
            label: 'Smtp',
            headingText: ';Email settings using SMTP\n',
            noMatch: 'The settings you need for your RStudio Connect server to send email via SMTP!',
            configSections: {
              Mail: {
                Provider: {
                  helpText: 'Hey, nothing to change here!',
                  userValue: 'smtp',
                },
                Server: {
                  helpText: 'Help!',
                  userValue: '',
                },
                Port: {
                  helpText: 'Help!',
                  userValue: '',
                },
              },
            },
          },
        },
      },
      http: {
        label: 'HTTP/S',
        options: {
          http: {
            label: 'HTTP',
            headingText: ';HTTP settings using HTTP\n',
            noMatch: 'The settings you need for your RStudio Connect server to be available via HTTP',
            configSections: {
              HTTP: {
                Listen: {
                  helpText: 'The port your RStudio Connect server will listen on. The default port for HTTP is 80',
                  userValue: ':80',
                },
              },
            },
          },
          https: {
            label: 'HTTPS',
            headingText: ';HTTP settings using HTTPS\n',
            noMatch: 'The settings you need for your RStudio Connect server to be available via HTTPS',
            configSections: {
              HTTPS: {
                Listen: {
                  helpText: 'The port your RStudio Connect server will listen on. The default port for HTTPS is 443',
                  userValue: ':443',
                },
                Certificate: {
                  helpText: 'The path to the TLS certificate file you would like RStudio connect to use. If the certificate is signed by a certificate authority, the certificate file should be the concatenation of the server’s certificate followed by the CA’s certificate',
                  userValue: '',
                },
                Key: {
                  helpText: 'The path to the private key for the certificate. It must be the key that corresponds to the Certificate you have specified/',
                  userValue: '',
                },
              },
            },
          },
          extHttps: {
            label: 'External HTTPS',
            headingText: ';HTTP settings using HTTPS on a secure proxy (e.g. a load balancer)\n',
            noMatch: 'The settings you need for your RStudio Connect server to be available via HTTPS behind a secure proxy',
            configSections: {
              HTTP: {
                Listen: {
                  helpText: 'The port your RStudio Connect server will listen on. The default port for HTTP is 80',
                  userValue: ':80',
                },
                ForceSecure: {
                  helpText: 'RStudio Connect will mark cookies secure on its unsecured connection. This option should be used when RStudio Connect is behind a secure proxy',
                  userValue: 'true',
                },
              },
            },
          },
        },
      },
      authentication: {
        label: 'Authentication',
        options: {
          password: {
            label: 'Password',
            headingText: ';Authentication settings using password authentication\n',
            noMatch: 'The settings you need for your RStudio Connect server to use password authentication.',
            configSections: {
              Authentication: {
                Provider: {
                  helpText: 'The type of authentication you want your RStudio Connect server to use',
                  userValue: 'password',
                },
              },
            },
          },
          oauth2: {
            label: 'OAuth2',
            headingText: ';Authentication settings using OAuth2\n',
            noMatch: 'The settings you need for your RStudio Connect server to use OAuth2.',
            configSections: {
              Authentication: {
                Provider: {
                  helpText: 'The type of authentication you want your RStudio Connect server to use',
                  userValue: 'oauth2',
                },
              },
              OAuth2: {
                ClientId: {
                  helpText: 'The identifier for OAuth2 client. ',
                  userValue: '',
                },
                ClientSecret: {
                  helpText: 'Client secret for the configured client ID. You must provide either a ClientSecret or a ClientSecretFile.',
                  userValue: '',
                },
                ClientSecretFile: {
                  helpText: 'Path to file containing the client secret for the configured client ID. You must provide either a ClientSecret or a ClientSecretFile.',
                  userValue: '',
                },
              }
            },
          },
          ldap: {
            label: 'LDAP',
            headingText: ';Authentication settings using LDAP\n',
            noMatch: 'The settings you need for your RStudio Connect server to use LDAP.',
            configSections: {
              Authentication: {
                Provider: {
                  helpText: 'The type of authentication you want your RStudio Connect server to use',
                  userValue: 'ldap',
                },
              },

            },
          },
        },
      },
    },
  },
  getters: {
    // currentSection: (state) => state.currentSection,
    // currentOption: (state) => state.currentOption,
    currentConfig: (state) => (id) => {
      return state.config[id];
    }
  },
  mutations,
};