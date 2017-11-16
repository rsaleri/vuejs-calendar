<template>
    <div id="event-form":style="computedPos">
        <h4>Add Event</h4>
        <p>{{ date }}</p>
        <div class="text">
            <input type="text" v-model="description" ref="eventDescription" :class="{ error }" @keyup.enter="create" placeholder="Netflix'n'chill" v-focus>
        </div>
        <div class="buttons">
            <button @click="create">Create</button>
        </div>
        <button id="close-button" @click="close">&#10005;</button>
    </div>
</template>

<script>
    export default {
        data() {
          return {
              description : "",
              error: false
          }
        },
        methods: {
            close() {
                this.$store.commit('eventFormActive', false);
            },
            create() {
                if(this.description.length) {
                    this.$store.dispatch('addEvent', { description: this.description }).then(
                        () => {
                            this.description = "";
                            this.$store.commit('eventFormActive', false);
                            this.error = false;
                        },
                        (response) => {
                            console.log(response);
                        }
                        );
                } else {
                    this.error = true;
                }
            },
            focus() {
                this.$refs.eventDescription.$el.focus();
            }
        },
        computed: {
            computedPos(){
                return {
                    top: `${this.$store.state.eventFormPosY}px`,
                    left: `${this.$store.state.eventFormPosX}px`,
                }
            },
            date() {
                return this.$moment(this.$store.state.eventFormDate).locale("it").format("dddd, ll");
            }
        },
        directives: {
            focus: {
                update(el) {
                    el.focus();
                },
                inserted(el) {
                    el.focus();
                }
            }
        }
    }
</script>

<style>

</style>