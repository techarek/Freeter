<template>
  <v-app>
    <Navbar/>
    <v-content>  
      <v-container style="padding-top:70px; padding-bottom:110px">
        <v-layout>
          <v-flex class="text-xs-center">
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer fixed height="110px">
          <CreateFreetForm/>
    </v-footer>
  </v-app>
</template>

<script>
import CreateFreetForm from "../src/components/CreateFreetForm.vue"
import Navbar from "../src/components/Navbar.vue";
export default {
  name: 'App',
  components: {
    CreateFreetForm,
    Navbar
  }
};
</script>
