<template>
  <div class="config-frame">
    <div class="app-controls">
      <h3>App controls go here</h3>
    </div>
    <expert-help-bar 
      class="help" 
      :currentVariable="currentHelp.title" 
      :currentHelp="currentHelp.help" 
    />
    <section-options-selector 
      class="options" 
      :options="currentSectionOptions" 
      :sectionTitle="currentSection" 
    />
    <expert-editor 
      class="editor" 
      :currentText="currentEditor" 
      :currentConfig="currentConfigSections" 
      :updateProp="updateConfigItem" 
    />
    <progress-bar class="progress-bar" :sections="possibleSections" />
  </div>
</template>
<script>
  import { 
    ExpertEditor, 
    ExpertHelpBar,
    SectionOptionsSelector,
    ProgressBar, 
  }  from 'rsconnect_storybook';

  export default {
    name: 'config',
    components: {
      ExpertEditor,
      ExpertHelpBar,
      SectionOptionsSelector,
      ProgressBar
    },
    props: {},
    methods: {
      updateConfigItem ( payload ) {
        let { propToUpdate, newValue } = payload;
        let currentSection = this.currentSection;
        let currentOption = this.currentOption;
        let configSection = this.currentConfigSection;

        this.$store.commit(
          'UPDATE_CONFIG_ITEM', 
          { propToUpdate, newValue, currentSection, currentOption, configSection}
        );
      },
    },
    computed: {
      currentSection () {
        return this.$store.getters.currentSection;
      },
      currentOption () { 
        let configKeys = Object.keys(this.currentSectionConfigObject.options);
        let option = this.$store.getters.currentOption;

        // check to see if the section has changed and reset the value if it has
        if( !configKeys.includes(option) ){ 
          option = configKeys[0];
          this.$store.commit('UPDATE_CURRENT_OPTION', { newOption: option } );
         }
        return option;
      },
      currentConfigSection () {
        let section = this.$store.getters.currentConfigSection;
        let currentConfigSections = Object.keys(this.currentConfigSections);

        // check to see if we have changed editor sections and need to reset the config section in
        // the store
        if( !currentConfigSections.includes(section) ){
          section = '';
          this.$store.commit('UPDATE_CURRENT_CONFIG_SECTION', { newSection: section });
        }
        return section;
      },
      currentConfigSections () {
        return this.currentConfig.configSections;
      },
      currentSectionConfigObject () {
        let sectionKey = this.currentSection;
        return this.$store.getters.currentConfig(sectionKey);
      },
      currentSectionOptions () {
        let configOptions = this.currentSectionConfigObject.options;
        let options = [];
        for (let key in configOptions){
          options.push({ label: configOptions[key].label, value: key });
        }        

        return options;
      },
      possibleSections () {
        let config = this.$store.state.configApp.config; // this probably needs to be a getter?
        return Object.keys(config);
      },
      currentConfig () {
        let optionKey = this.currentOption; 
        return this.currentSectionConfigObject.options[optionKey];
      },
      currentEditor () {
        let config = this.currentConfig.configSections;
        let editorContent = this.currentConfig.headingText;

        for ( let configSection in config ) {
          // console.log(`configSection: ${configSection}`);
          editorContent += `\n[${configSection}]\n`;
          for ( let prop in config[configSection] ) {
            // console.log(`prop: ${prop}`);
            editorContent += `${prop} = ${config[configSection][prop].userValue}\n`;
          }
        }
        return editorContent;
      },
      currentPossibleProperties () {
        let currentConfigSection = this.currentConfigSection;
        // console.debug(`currentPossibleProps: currentConfigSection: ${currentConfigSection}`);
        // console.debug('currentPossibleProps:currentConfig[currentConfigSection]');
        // console.log(this.currentConfig);
        let props = currentConfigSection === '' 
          ? []
          : Object.keys(this.currentConfig.configSections[currentConfigSection]);
        // console.debug('props:');
        // console.debug(props);
        return props;
      },
      currentHelp () {
        // console.log('hi: in currentHelp');
        let currentProperty = this.$store.getters.currentProperty;
        // console.log(`help:currentProperty: ${currentProperty}`);
        let currentConfigSection = this.$store.getters.currentConfigSection;
        // console.log(`help:currentConfigSection: ${currentConfigSection}`);
        let possibleProperties = this.currentPossibleProperties;
        // console.log(`help:possibleProperties:`);
        // console.log(possibleProperties);
        let title, help; 
        
        
        
        if( possibleProperties.includes(currentProperty) ) {
          title = currentProperty;
          help = this.currentConfig.configSections[currentConfigSection][currentProperty].helpText;
        }
        else {
          title = this.$store.currentOption;
          help = this.currentConfig.noMatch;
        }

        return { title, help };
        
      },

    },
  }
</script>
<style lang="scss">
  .config-frame {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    grid-template-rows: 75px 60px 1fr;
    height:100vh;
  }

  .editor {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }

  .help {
    grid-column: 1 / 2;
    grid-row: 2 / 4;
  }

  .options {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }

  .progress-bar {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
  .app-controls {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    padding: 1rem;
  }
</style>