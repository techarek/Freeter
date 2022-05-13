<template>
    <v-form id="search-user" v-on:submit.prevent='searchFreet' method='get' >
            <v-text-field
                style="padding-top:12%"
                prepend-inner-icon="mdi-account-search"
                v-model.trim='user'
                flat
                rounded
                solo
                placeholder="Search User"
            ></v-text-field>
         </v-form>
</template>

<script>
import axios from "axios";

export default {
    name: "SearchBar",
    data() {
        return {
            errors: [],
            user:''
        }
    },
    methods: {
        searchFreet: function() {
            this.errors = [];
            const bodyContent = { user: this.user };
            axios
            .get("/api/freets/" + bodyContent.user, bodyContent)
            .then(() => {
                this.success = "User found";
                this.$router.push('/' + bodyContent.user);
            })
            .catch(err => {
                // handle error
                this.errors.push(err.response.data.error);
            })
            .then(() => {
                // always executed
                this.resetForm();
                this.clearMessages();
            });
      },

      resetForm: function() {
        this.user = "";
      },

      clearMessages: function() {
        setInterval(() => {
            this.errors = [];
            this.success = "";
        }, 5000);
      }

    }
}
</script>