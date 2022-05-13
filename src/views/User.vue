<template>
    <div id='user-page'>
        <Navbar/>
        <div class="flex-container">
            <div style="flex-wrap:wrap; flex-grow:1; padding-left: 20px; padding-right: 5px;">
                <b-card>
        <b-card-text style="align-items: center" class="flex-container">
                <b-avatar size="6rem"></b-avatar>
                <div style="left-padding:20px;">

                    <h2>@{{ this.$route.params['username'] }}</h2>

                    <b-button variant='primary' @click="followAccount">Follow</b-button>
                </div>
        </b-card-text>
        <div v-if="this.$route.params['username'] === this.$cookie.get('user-auth')"> 
            <v-form @submit.prevent="updateUsername" method='put'>
                    <v-row>
                        <v-col>
                            <v-text-field
                                id='username'
                                v-model.trim="new_username"
                                outlined
                                placeholder="Change Username"
                                solo
                            >
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn 
                                text
                                @click="updateUsername"
                                color="primary"
                            >
                                Update Username
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>

                <v-form @submit.prevent="updateFreet" method='put'>
                    <v-row>
                        <v-col>
                            <v-text-field
                                id='password'
                                v-model.trim="new_password"
                                outlined
                                placeholder="Change Password"
                                solo
                            >
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn 
                                text
                                @click="updatePassword"
                                color="primary"
                            >
                                Update Password
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <b-button variant='danger' @click="deleteAccount">Delete Account</b-button>
        </div>
      </b-card>
            </div>
            <div style="flex-grow:6; padding-right: 20px; padding-left: 5px;">
                    <b-card no-body>
                        <b-tabs card fill pills>
                        <b-tab title="Freets" active>
                            <b-card-text>
                                <UserFreetsList/>
                            </b-card-text>
                        </b-tab>
                        <b-tab title="Followers" v-if="this.$route.params['username'] === this.$cookie.get('user-auth')">
                            <b-card-text><Followers/></b-card-text>
                        </b-tab>
                        <b-tab title="Following" v-if="this.$route.params['username'] === this.$cookie.get('user-auth')">
                            <b-card-text><Following/></b-card-text>
                        </b-tab>
                        </b-tabs>
                    </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import Navbar from "../components/Navbar.vue";
import UserFreetsList from "../components/UserFreetsList.vue";
import Followers from "../components/Followers.vue";
import Following from "../components/Following.vue";

export default {
    name: 'User',
    data() {
    return {
        new_username: "",
        new_password: ""
        }
    },
    computed: {

    },
    components: {
        Navbar,
        UserFreetsList,
        Followers,
        Following
    },
    methods: {
        updateUsername: function () {
            const body = { username: this.new_username };
            axios
                .put(`/api/users/${this.$cookie.get('user-auth')}/username`, body)
                .then((res) => {
                // handle success
                    eventBus.$emit("update-username-success", res);
                    this.$forceUpdate();
                })
                .catch(err => {
                // handle error
                    eventBus.$emit("update-username-error", err);
                })
                .then(() => (this.new_username = ""));
        },

        updatePassword: function() {
            const body = { password: this.new_password };
            axios
                .put(`/api/users/${this.$cookie.get('user-auth')}/password`, body)
                .then((res) => {
                // handle success
                    eventBus.$emit("update-pass-success", res);
                })
                .catch(err => {
                // handle error
                    eventBus.$emit("update-pass-error", err);
                })
                .then(() => (this.new_password = ""));
        },
        deleteAccount: function() {
            axios
                .delete(`/api/users/${this.$cookie.get('user-auth')}`, {})
                .then((res) => {
                // handle success
                    eventBus.$emit("delete-user-success", res);
                    this.$forceUpdate();
                })
                .catch(err => {
                // handle error
                    eventBus.$emit("delete-user-error", err);
                })
                .then(() => {});
        },
        followAccount: function () {
             axios
                .patch(`/api/users/${this.$route.params['username']}/following`, {})
                .then((res) => {
                // handle success
                    eventBus.$emit("follow-user-success", res);
                })
                .catch(err => {
                // handle error
                    eventBus.$emit("follow-user-error", err);
                })
                .then(() => {});
        }
    }
}
</script>

<style scoped>
.flex-container {
    display: flex;
}
</style>