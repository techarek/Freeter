<template>
      <v-container fluid>
        <v-form id="create-freet" v-on:submit.prevent='createFreet' method='post'>
          <v-row>
            <v-col lg="10">
              <v-textarea 
                id='freet-content' 
                v-model.trim='content' 
                name='freet' 
                placeholder="Freet something today!"
                solo
                flat
                height="10vh"
                full-width
              ></v-textarea>
            </v-col>
            <v-col>
              <v-btn 
                type='submit'
                value="Freet" 
                id="submitFreet"
                rounded
                elevation="2"
                color="cyan"
                dark
              >
                Freet
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <div v-if='success' class="success-message">
              {{success}}
          </div>
          <div v-if='errors.length' class="error-message">
              <b>Please correct the following error(s):</b>
              <ul>
                  <li v-for='error in errors' v-bind:key='error.id'>{{ error }}</li>
              </ul>
          </div>
        </v-row>
      </v-container>
</template>


<script>
import axios from "axios";
import { eventBus } from "../main";


export default {
  name: "CreateFreetForm",

  data() {
    return {
      errors: [],
      success: "",
      content: "",
    };
  },

  methods: {
    createFreet: function() {
      this.errors = [];

      const bodyContent = { content: this.content };
      axios
        .post("/api/freets", bodyContent)
        .then(freet => {
          // handle success
          this.success = "Freet created successfully!";
          eventBus.$emit("create-freet-success", freet);
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
      this.content = "";
    },

    clearMessages: function() {
      setInterval(() => {
        this.errors = [];
        this.success = "";
      }, 5000);
    }
  }
};
</script>