<template>
    <div>
        <div id="header">
            <div>
                <img src="../assets/logo.png" alt="Vue.js Calendar">
                <h1>Vue.js Calendar</h1>
            </div>
            <div>
                <current-month></current-month>
            </div>
        </div>
        <div id="day-bar">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
        </div>
        <div id="calendar">
            <div v-for="week in weeks" class="calendar-week">
                <calendar-day v-for="day in week" :day="day"></calendar-day>
            </div>
            <transition name="fade">
                <keep-alive>
                    <event-form v-if="formActive"></event-form>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
    import CalendarDay from './CalendarDay.vue';
    import CurrentMonth from './CurrentMonth.vue';
    import EventForm from './EventForm.vue';

    export default {
        methods: {
            changeMonth() {}
        },
        computed: {
            month() {
                return this.$store.state.currentMonth;
            },
            year() {
                return this.$store.state.currentYear;
            },
            days() {
                //generating all days in current month
                let days = [];
                let currentDay = this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D');
                while ((currentDay.month() + 1 ) === this.month) {
                    days.push(currentDay);
                    currentDay = this.$moment(currentDay).add(1, 'days');
                }

                //Add previous days to start
                currentDay = this.$moment(days[0]);

                const SUNDAY = 0;
                const MONDAY = 1;

                while(currentDay.day() !== MONDAY) {
                    currentDay = this.$moment(currentDay).subtract(1, 'days');
                    days.unshift(currentDay);
                }

                currentDay = this.$moment(days.slice(-1)[0]);
                while(currentDay.day() !== SUNDAY) {
                    currentDay = this.$moment(currentDay).add(1, 'days');
                    days.push(currentDay);
                }

                return days;
            },
            weeks() {
                let weeks = [];
                let week = [];
                for(let day of this.days) {
                    week.push(day);
                    if(week.length === 7){
                        weeks.push(week);
                        week = [];
                    }
                }
                return weeks;
            },
            formActive() {
                return this.$store.state.eventFormActive;
            }
        },
        components: {
            CalendarDay,
            CurrentMonth,
            EventForm
        }
    }
</script>

<style>

</style>