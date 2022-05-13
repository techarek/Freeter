<template>
    <div id="sign-out">
        <v-btn 
            text
            dark 
            @click="signout">
            Signout
        </v-btn>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
    name: "Signout",

    methods: {
        signout: function() {
            axios.delete('api/session')
                .then(() => {
                    eventBus.$emit('signout-success', true);
                })
                .catch(() => {
                    eventBus.$emit('signout-success', true);
                })
        }
    }


}
</script>