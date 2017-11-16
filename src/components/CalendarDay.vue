<template>
    <div class="day" :class="computedClasses" @click="captureClick">
        {{ day.format('D') }}
        <ul class="event-list">
            <li v-for="event in events">{{ event.description }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                refs: null,
            }
        },
        props: ['day'],
        computed: {
            computedClasses(){
                let today = this.day.isSame(this.$moment(), 'day');
                let active = this.day.isSame(this.$store.state.eventFormDate, 'day') && this.$store.state.eventFormActive;
                let month = this.day.isSame(this.$moment(`${this.$store.state.currentYear}-${this.$store.state.currentMonth}-1`, 'YYYY-M-D'), 'month');
                return {
                    today,
                    past: this.day.isBefore(this.$moment(), 'day'),
                    'not-current-month': !month,
                    active,
                }
            },
            events() {

                return this.$store.state.events.filter( event => this.day.isSame(event.date, 'day') );
            }
        },
        methods: {
            captureClick(event) {
                let position = {
                    x: event.target.offsetLeft + (event.target.offsetWidth/2),
                    y: event.target.offsetTop + (event.target.offsetHeight/2),
                };
                this.$store.commit('eventFormPos', position);
                this.$store.commit('eventFormDate', this.day);
                this.$store.commit('eventFormActive', true);
            }
        }
    }
</script>

<style>

</style>