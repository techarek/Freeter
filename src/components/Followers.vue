<template>
        <div style="justify-content: center; overflow-y:auto">
            <div class="freets-container">  
                <ul class="list-group">
                    <li class="list-group-item" v-for="f in followers" :key="f-{$index}"> {{ f }} </li>
                </ul>
            </div>
        </div>
</template>

<script>
import axios from "axios";

import { eventBus } from "../main";

export default {
    name: "AllFreetsList",
    data() {
        return {
            error: "",
            success: "",
            followers: []
        }
    },
    created: function() {
        eventBus.$on("follow-user-success", res => {
            res;
            this.clearMessages();
            this.loadShorts();
        });
    },
    mounted: function() {
        this.loadShorts();
    },

    methods: {
        loadShorts: function() {
            axios.get(`/api/users/${this.$route.params['username']}/followers`).then(response => {
            this.followers = response.data;
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