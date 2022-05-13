<template>
    <div class='freet-container'>
        <v-card outlined>
            <v-list-item>
                <v-list-item-avatar
                    tile
                    color="grey"
                    width="100px"
                    height="100px"
                ></v-list-item-avatar>
                <v-list-item-content>
                    <div class="h4">
                        {{author}}
                    </div>
                    <v-card-text class="headline">
                        {{ content }}
                    </v-card-text>
                </v-list-item-content>
            </v-list-item>
            <v-card-actions>
                <v-btn v-if="liked"
                    icon
                    color="pink"
                    @click="likeFreet"
                >
                <v-icon>mdi-heart</v-icon>
                    {{ likes }}
                </v-btn>
                <v-btn v-else
                    icon
                    color="gray"
                    @click="likeFreet"
                >
                <v-icon>mdi-heart</v-icon>
                    {{ likes }}
                </v-btn> 
                <v-btn
                    icon
                    color="gray"
                    @click="refreetFreet"
                >
                    <v-icon>mdi-cached</v-icon>

                    {{ refreets }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-form @submit.prevent="updateFreet" method='post' style="padding-top:50px">
                    <v-row>
                        <v-col>
                            <v-text-field
                                id='new_content'
                                v-model.trim="new_content"
                                outlined
                                placeholder="Edit freet"
                                solo
                            >
                            </v-text-field>
                        </v-col>
                        <v-col lg="4">
                            <v-btn 
                                text
                                @click="updateFreet"
                                color="primary"
                            >
                                Update
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                    
                <v-btn 
                    text 
                    @click="deleteFreet" 
                    color="error"
                    >
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
    name: "Freet",

    props: {
        freet: Object
    },

    data() {
        return {
            new_content: "",
        }
    },

    computed: {
        author: function () {
            return this.freet.author;
        },
        content: function () {
            return this.freet.content;
        },
        id: function() {
            return this.freet.id;
        },
        likes: function() {
            return this.freet.usersLikingFreet.length;
        },
        refreets: function() {
            return this.freet.freetsRefreetingThisFreet.length;
        },
        liked: function() {
            return this.freet.usersLikingFreet.includes(this.$cookie.get('user-auth'));
        },
    },

    methods: {
        updateFreet: function() {         
            const body = { content: this.new_content, username: this.freet.author };
            axios
                .put(`/api/freets/${this.freet.id}`, body)
                .then((res) => {
                // handle success
                    eventBus.$emit("update-freet-success", res);
                })
                .catch(err => {
                // handle error
                    eventBus.$emit("update-freet-error", err);
                })
                .then(() => (this.new_content = ""));
        },

        deleteFreet: function() {
            axios
                .delete(`/api/freets/${this.freet.id}`, {})
                .then(() => {
                    eventBus.$emit("delete-freet-success", this.freet);
                })
                .catch(err => {
                    eventBus.$emit("delete-freet-error", err);
                })
        },

        likeFreet: function() {
            axios
                .patch(`/api/freets/${this.freet.id}/likes`, {})
                .then(() => {
                    eventBus.$emit("like-freet-success", this.freet);
                })
                .catch(err => {
                    eventBus.$emit("like-freet-error", err);
                })
        },

        refreetFreet: function() {
            axios
                .post(`/api/users/freets/${this.freet.id}/refreet`, {})
                .then(() => {
                    eventBus.$emit("refreet-freet-success", this.freet);
                })
                .catch(err => {
                    eventBus.$emit("refreet-freet-error", err);
                })
        }

    }
}
</script>