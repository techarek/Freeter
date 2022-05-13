<template>
    <v-app-bar app color="black" light>
        <FritterTitle/>

         <v-spacer></v-spacer>

         <SearchBar/>

         <v-spacer></v-spacer>

            <span v-if="isSignedIn" id='sign-out-button'>
                <v-container>
                    <v-row >
                        <v-col>
                            <Signout/>
                        </v-col>
                        <v-col>
                            <router-link :to="this.$cookie.get('user-auth')"  >
                                <v-icon
                                    dark
                                    large
                                >
                                    mdi-account-circle
                                </v-icon>
                            </router-link>
                        </v-col>
                    </v-row>
                </v-container>
                
            </span>

            <span v-else id='sign-in-buttons'>
                <Signin/>
            </span>
        
    </v-app-bar>
</template>

<script>
import FritterTitle from "../components/FritterTitle.vue";
import SearchBar from "../components/SearchBar.vue";
import Signin from "../components/Signin.vue"
import Signout from "../components/Signout.vue"
//import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "Navbar",
  components: {
       FritterTitle,
       SearchBar,
       Signin,
       Signout
  },

  data() {
    return {
        isSignedIn: false,
        messages: []
    }
  },


  created: function() {
      let authenticated = this.$cookie.get('user-auth');
      
      if (authenticated) {
        this.isSignedIn = true;
      }

      eventBus.$on("login-success", (userName) => {
        this.$cookie.set('user-auth', userName);
        this.isSignedIn = true;
        this.messages.push("You have been signed in!");
        this.clearMessages();
      });

      eventBus.$on("create-user-success", (userName) => {
        this.$cookie.set('user-auth', userName);
        this.isSignedIn = true;
        this.messages.push("You have been signed up!");
        this.clearMessages();
      });

      eventBus.$on("signout-success", () => {
        this.$cookie.set('user-auth', '');
        this.isSignedIn = false;
        this.messages.push("You have been signed out!");
        this.clearMessages();
      });
   },

  methods: {
      clearMessages: function() {
        setInterval(() => {
            this.messages = [];
        }, 5000);
    }
  }
};
</script>