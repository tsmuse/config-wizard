<template>
  <div class="what-you-need">
    <!-- Current section info -->
    <h2 class="what-you-need-title">What you need to know</h2>
    <div class="info-section current-info">
      <ul class=" info-section-list section-help">
        <li 
          class="section-help-item" 
          v-for="(value,idx) in this.currentSectionHelp"
          :key="idx"
        >
          <h3 class="section-help-item-title">{{value.title}}</h3>
          <p class="section-help-item-text">{{value.help}}</p>
        </li>
      </ul>
    </div>
    <!-- Progress indicator -->
    <div class="info-section progress">
      <h3>What's left</h3>
      <ul class="info-section-list progress-list">
        <li 
          class="progress-list-item"
          v-for="(value, idx) in this.progressInfo"
          :key="idx"
        >
          <h4 :class="['progress-section', { complete: value.complete }]">
            {{value.section}}
          </h4>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      currentSectionHelp: {
        type: Array,
        required: true,
      },
      progressInfo: {
        type: Array,
        required: true,
      },
    },
  };
</script>
<style lang="scss">
  .what-you-need {

    &-title {
      margin-top: 0;
      margin-bottom: 1rem;
    }
  }
  .info-section {
    margin-bottom: 1rem;

    &-list {
      list-style: none;
      padding-left: 0.25rem;
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .section-help {

    &-item {
      margin-bottom: 0.5rem;

      &::last-of-type {
        margin-bottom: 0;
      }
    }
    &-item-title {
      margin-top: 0;
      margin-bottom: 0.25rem;
    }
    &-item-text {
      margin-top: 0;
      margin-bottom: 0;
      font-size: 0.9rem;
      letter-spacing: 1px;
    }
  }

  .progress {
  }
</style>