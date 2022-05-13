<template>
    <div id='homepage'>
        <AllFreetsList/>
    </div>
</template>

<script>
import AllFreetsList from "../components/AllFreetsList.vue"
// import { eventBus } from "../main";

export default {
  name: 'Home',
  components: {
    AllFreetsList
  }
}
</script>
