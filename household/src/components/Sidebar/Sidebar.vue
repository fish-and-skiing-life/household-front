<!-- Side Structure -->
<template>
  	<div class="sidebar" :class="sidebarSelectedFilter.class">
    	<vue-perfect-scrollbar class="scroll-area" :settings="settings">
        <v-toolbar flat class="transparent scroll-area navigation">
          <v-list>
				<template v-for="(category, key) in menus">
					<div :key="key">
						<div class="sidebar-title px-3">
							<span>{{$t(key)}}</span>
						</div>
						<template v-for="item in category">
							<template v-if="item.items != null">
								<v-list-group
									:key="item.title"
									prepend-icon="arrow_right"
									append-icon=""
									no-action
									v-model="item.active"
								>
									<v-list-tile slot="activator">
										<v-list-tile-content>
											<v-list-tile-title  v-if="item.items!= null">
												<i class="mr-3 zmdi" :class="item.action"></i>
												<span >{{ textTruncate($t(item.title)) }}</span>
											</v-list-tile-title>
											
										</v-list-tile-content>
									</v-list-tile>
									<v-list-tile
										v-for="subItem in item.items"
										v-bind:key="subItem.title"
										v-if="subItem !== null"
										:to="!subItem.exact ? `/${getCurrentAppLayoutHandler() + subItem.path}` : subItem.path"
									>
										<v-list-tile-content>
											<v-list-tile-title>{{ textTruncate($t(subItem.title)) }}</v-list-tile-title>
										</v-list-tile-content>
									</v-list-tile>
								</v-list-group>
							</template>	
							<template v-else>
								<v-list-group
									class="not-submenu"
									:key="item.title"
									prepend-icon="arrow_right"
									append-icon=""
									no-action
									v-model="item.active"
								>
									<v-list-tile slot="activator">
										<v-list-tile-content>
											<v-list-tile-title>
												<router-link :to="!item.exact ? `/${getCurrentAppLayoutHandler() + item.path}` :item.path">
													<i class="mr-3 zmdi" :class="item.action"></i>
													<span>{{ textTruncate($t(item.title)) }}</span>
												</router-link>
											</v-list-tile-title>
										</v-list-tile-content>
									</v-list-tile>
									
								</v-list-group>
							</template>	
						</template>
					</div>
				</template>
          </v-list>
        </v-toolbar>
    	</vue-perfect-scrollbar>
  	</div>
</template>

<script>
import { textTruncate, getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      settings: {
        maxScrollbarLength: 160
      }
      
    };
  },
  computed: {
    ...mapGetters(["sidebarSelectedFilter", "menus"])
  },
  methods: {
    textTruncate(text) {
      return textTruncate(text, 18);
    },
    getCurrentAppLayoutHandler() {
      return getCurrentAppLayout(this.$router);
    }
  }
};
</script>
