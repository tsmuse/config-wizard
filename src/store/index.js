/*global process */
import Vue from 'vue'
import Vuex from 'vuex'
// import appFrame from './modules/appFrame'
// import version from './modules/version'
// import expertEditor from './modules/expertEditor';
import { 
  ExpertEditorState, 
  SectionOptionsSelectorState,
  ProgressBarState,
} from 'rsconnect_storybook';
import configApp from './modules/configApp';
// import HTTP from '../api/http-common'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    // version: version.module(HTTP),
    // appFrame,
    configApp,
    expertEditor: ExpertEditorState,
    sectionOptionsSelector: SectionOptionsSelectorState,
    progressBar: ProgressBarState,
  },
  strict: debug,
})
