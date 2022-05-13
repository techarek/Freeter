<template>
    <div class="all-freets">
        <div class="freets-header">
            <h2>@{{this.$route.params['username']}}'s Freets</h2>
        </div>
        <div>
            <div class="freets-container" style="justify-content: center">  
                <div v-if="freets.length">
                    <Freet
                        v-for="freet in freets"
                        v-bind:key="freet.id"
                        v-bind:freet="freet"
                    />
                </div>
                <div v-else>
                    <p style="text-align: center;">There are no freets to display.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Freet from "../components/Freet.vue";

import { eventBus } from "../main";

export default {
    name: "UserFreetsList",
    components: { Freet },
    data() {
        return {
            error: "",
            success: "",
            freets: []
        }
    },

    created: function() {
        eventBus.$on("create-freet-success", res => {
            // this.freets.push(res);
            res;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("update-freet-success", res => {
            this.success = `Freet name ${res.id} now resolves to ${
                res.data.content
                }`;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("delete-freet-success", res => {
            this.success = `Freet name ${res.id} has been deleted`;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("update-freet-error", res => {
            this.error = `Error updating freet ${res.id}`;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("delete-freet-error", res => {
            this.error = `Error deleting freet ${res.id}`;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("like-freet-success", res => {
            this.success = `Freet ${res.id} has been liked`;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("like-freet-error", res => {
            this.error = `Error liking Freet ${res.id}`;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("refreet-freet-success", res => {
            this.success = `Freet ${res.id} has been refreeted`;
            this.clearMessages();
            this.loadShorts();
        });

        eventBus.$on("refreet-freet-error", res => {
            this.error = `Error refreeting Freet ${res.id}`;
            this.clearMessages();
            this.loadShorts();
        });

    },

    mounted: function() {
        this.loadShorts();
    },

    methods: {
        loadShorts: function() {
            axios.get(`/api/freets/${this.$route.params['username']}`).then(response => {
            this.freets = response.data;
            });
        },

        clearMessages: function() {
            setInterval(() => {
                this.success = "";
                this.error = "";
            }, 5000);
        }
    },
} 

</script>