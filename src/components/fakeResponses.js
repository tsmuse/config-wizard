// I'm not sure all of this data is required yet in the response
export const FAKE_LDAP_USER_RESPONSE = [
  {
    root: true,
    id: '001',
    label: 'Some Server(dc=some,dc=server)',
    state: {
      selected: false,
      expanded: true,
    },
    dn: 'dc=some,dc=server',
    attributes: [
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
        dn: 'ou=groups,dc=some,dc=server',
        attributes: [
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
            dn: 'cn=admins,ou=groups,dc=some,dc=server',
            attributes: [
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
            dn: 'cn=datascience,ou=groups,dc=some,dc=server',
            attributes: [
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
            dn: 'cn=supersecret,ou=groups,dc=some,dc=server',
            attributes: [
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
        dn: 'ou=users,dc=some,dc=server',
        attributes: [
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
            dn: 'cn=Bob Ross,ou=users,dc=some,dc=server',
            attributes: [
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
            dn: 'cn=Rob Boss,ou=users,dc=some,dc=server',
            attributes: [
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
            dn: 'cn=Sob Bors,ou=users,dc=some,dc=server',
            attributes: [
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
            dn: 'cn=Bob Sors,ou=users,dc=some,dc=server',
            attributes: [
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
];

export const FAKE_LDAP_GROUP_RESPONSE = [
  {
    root: true,
    id: '001',
    label: 'Some Server(dc=some,dc=server)',
    state: {
      selected: false,
      expanded: true,
    },
    dn: 'dc=some,dc=server',
    attributes: [
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
        dn: 'ou=groups,dc=some,dc=server',
        attributes: [
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
            dn: 'cn=admins,ou=groups,dc=some,dc=server',
            attributes: [
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
            dn: 'cn=datascience,ou=groups,dc=some,dc=server',
            attributes: [
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
            dn: 'cn=supersecret,ou=groups,dc=some,dc=server',
            attributes: [
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
    ],
  },
];

export const FAKE_LDAP_OBJECTS_DETAILS = {

  userFilterBase: 'objectClass={UserObjectClass}',
  groupFilterBase: 'objectClass={GroupObjectClass}',
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
};

export const FAKE_LDAP_ATTRS_LIST = [
  'DN',
  'posixAccount',
  'top',
  'cn',
  'guId',
  'memberNumber',
  'firstName',
  'memberGuId',
];