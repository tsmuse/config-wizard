<template>
  <expert-editor currentText="test string\ntest test"/>
</template>
<script>
  // import ExpertEditorToo  from 'rsconnect_storybook/src/components/ExpertEditorToo/ExpertEditorToo';
  import { ExpertEditor }  from 'rsconnect_storybook';

  export default {
    name: 'test',
    components: {
      ExpertEditor, 
    },
  }
</script>
