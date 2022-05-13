<template>
    <v-dialog 
        id="sign-in"
        v-model="dialog"
        max-width="400px"
      >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                text
                dark
                v-bind="attrs"
                v-on="on"
          >
            Signup/Login
          </v-btn>
        </template>

        <v-card>
            <v-card-title>
                <span class="sign-headline">Signup/Login</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-form id="check-signin-form">
                    <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                            md="10"
                        >
                            <v-text-field
                                id="username"
                                v-model.trim='username'
                                label="Username"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                            md="10"
                        >
                        <v-text-field
                            id="password"
                            v-model.trim='password'
                            label="Password"
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    </v-form>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="blue"
                    dark
                    value="new-account" 
                    id="new-account"
                    form='check-signin-form'
                    v-on:click.native='signup' 
                    method='post'
                >
                Signup
                </v-btn>
                <v-btn
                    color="green"
                    dark
                    value="account" 
                    id="account"
                    form='check-signin-form'
                    v-on:click.native='login' 
                    method='post'
                >
                Login
                </v-btn>
            </v-card-actions>
            <div v-if='errors.length' class="error-message">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for='error in errors' v-bind:key='error.id'>{{ error }}</li>
                </ul>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
    name: "Signin",

    data() {
        return {
            errors:[],
            success: '',
            username: '',
            password: ''
        }
    },

    methods: {
        signup: function() {
            const bodyContent = { username: this.username, password: this.password };
            axios
                .post("api/users", bodyContent)
                .then(res => {
                    this.success = "User created successfully!";
                    eventBus.$emit("create-user-success", res.data.username);
                })
                .catch(err => {
                    this.errors.push(err.response.data.error);
                })
                .then(() => {
                    this.resetForm();
                    this.clearMessages();
                });
        },

        login: function() {
            const bodyContent = { username: this.username, password: this.password };
            axios
                .post("api/session", bodyContent)
                .then(res => {
                    this.success = "User created successfully!";
                    eventBus.$emit("login-success", res.data.username);
                })
                .catch(err => {
                    this.errors.push(err.response.data.error);
                })
                .then(() => {
                    this.resetForm();
                    this.clearMessages();
                });
        },

        resetForm: function() {
            this.username = "";
            this.password = "";
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