<template>
   <div class="app-footer d-custom-flex justify-space-between align-items-center">
      <ul class="list-inline footer-menu mb-0">
         <li>
            <v-btn flat href="javascript:void(0)">{{$t('message.blog')}}</v-btn>
         </li>
         <li>
            <v-btn flat href="javascript:void(0)">{{$t('message.pricing')}}</v-btn>
         </li>
         <li>
            <v-btn flat href="javascript:void(0)">{{$t('message.gallery')}}</v-btn>
         </li>
         <li>
            <v-btn flat href="javascript:void(0)">{{$t('message.inbox')}}</v-btn>
         </li>
         <li>
            <v-btn flat href="javascript:void(0)">{{$t('message.shop')}}</v-btn>
         </li>
      </ul>
      <h6 class="mb-0 fw-normal">{{copyrightText}}</h6>
   </div>
</template>

<script>
import AppConfig from "Constants/AppConfig";
import { getCurrentAppLayout } from "Helpers/helpers";

export default {
  data() {
    return {
      copyrightText: AppConfig.copyrightText
    };
  },
  methods: {
	  getCurrentAppLayoutHandler() {
		  return getCurrentAppLayout(this.$router);
		}
  }
};
</script>
