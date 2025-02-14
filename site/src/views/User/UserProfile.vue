<template>
    <div v-if="user === undefined || user === null">
        <AppLoader />
    </div>
    <div v-else>
        <div class="pb-2 mx-auto text-1">
            <div class="p-0 pb-6 rounded-b-none card">
                <div class="relative w-full h-48">
                    <div class="w-full h-full banner" />
                    <UserAvatar :img-src="user.avatar" :username="user.username" />
                </div>
                <div class="px-4 mt-20 w-full">
                    <div class="flex flex-col pr-8 mb-4 space-y-4">
                        <div>
                            <div class="flex">
                                <div class="text-2xl">
                                    {{ user.fullname }} {{ user.fullname.toUpperCase() }}
                                </div>
                                <div class="my-auto ml-2 text-gray-500">
                                    {{ 'M2-F' }}
                                </div>
                                <router-link
                                    v-if="connected.userId == user.userId"
                                    to="/me/profile"
                                    class="my-auto ml-8"
                                >
                                    <div
                                        class="flex items-center py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark rounded"
                                    >
                                        <font-awesome-icon icon="pen-alt" />
                                    </div>
                                </router-link>
                            </div>
                            <div>{{ user.description }}</div>
                        </div>
                        <div v-if="userClubs != 0">
                            <div class="text-lg">Associations</div>
                            <div class="flex flex-wrap mt-2">
                                <div v-for="club in userClubs" :key="club" class="flex mr-4 mb-4 h-16">
                                    <p class="my-auto w-16 h-16">
                                        <img
                                            :src="clubs.find((a) => a.clubId === club.club.clubId).icon"
                                            :alt="`${
                                                clubs.find((a) => a.clubId === club.club.clubId).name
                                            } Logo`"
                                            class="rounded-full shadow-inner"
                                        />
                                    </p>
                                    <div class="ml-2 w-32">
                                        <div class="-mb-1 text-lg font-bold truncate last:text-clip">
                                            {{ club.club.name }}
                                        </div>
                                        <div class="-mb-1">
                                            {{ Object.keys(roles).find((role) => roles[role] === club.role) }}
                                        </div>
                                        <div class="text-sm truncate text-5">
                                            {{ club.roleLabel }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row">
            <div class="order-2 mt-0 mb-4 space-y-4 md:order-1 md:mr-4 md:ml-2 md:w-1/2 lg:w-2/3">
                <div class="flex flex-col grow space-y-4 card">
                    <div class="text-xl">Activité</div>
                    <ThreadPreviewCard
                        v-for="activity in activities"
                        :key="activity.index"
                        :post="activity"
                    />
                </div>
            </div>
            <div class="flex flex-col order-1 mb-4 space-y-2 md:order-2 md:w-1/2 lg:w-1/3">
                <div class="card">
                    Comptes
                    <div class="flex flex-col mt-2 space-y-2">
                        <div v-if="user.email" class="flex space-x-2">
                            <font-awesome-icon icon="envelope" />
                            <div>{{ user.email }}</div>
                        </div>
                        <div v-if="socialsAccounts === undefined || socialsAccounts === null">
                            Problème dans les comptes des réseaux sociaux
                        </div>
                        <div v-for="social in socialsAccounts" v-else :key="social">
                            <div class="flex space-x-2">
                                <font-awesome-icon
                                    :icon="
                                        socials.filter((a) => a.socialId === social.social.socialId)[0].icon
                                    "
                                />
                                <a :href="social.link">{{ social.pseudo }}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ThreadPreviewCard from '@/components/App/Card/ThreadPreviewCard.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import { posts } from '@/fake/posts'

    export default {
        components: {
            ThreadPreviewCard,
            UserAvatar,
            AppLoader,
        },
        data() {
            return {
                activities: posts,
                roles: {
                    'Président': 'president',
                    'Vice-Président': 'vice-president',
                    'Secretaire': 'secretary',
                    'Trésorier': 'treasurer',
                    'Manager': 'manager',
                    'Membre': 'member',
                },
            }
        },
        computed: {
            user() {
                return this.$store.state.profiles.currentUser.user
            },
            connected() {
                return this.$store.state.auth.user
            },
            socialsAccounts() {
                return this.$store.state.profiles.currentUser.socialsAccounts
            },
            socials() {
                return this.$store.state.profiles.currentUser.socials
            },
            clubs() {
                return this.$store.state.profiles.currentUser.clubs
            },
            userClubs() {
                return this.$store.state.profiles.currentUser.userClubs
            },
        },
        mounted() {
            if (this.$route.params.userId) {
                this.$store.dispatch('profiles/getCurrentUserProfile', this.$route.params.userId)
            } else {
                this.$router.push('/')
            }
        },
    }
</script>

<style lang="scss">
    .banner {
        background-color: #771250;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2335313c' fill-opacity='0.44'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-12 0 6 6 0 0 0-6-6 6 6 0 0 1-6-6V10a6 6 0 1 1 12 0 6 6 0 0 0 12 0zm24 78a6 6 0 0 1-6-6 6 6 0 0 0-6-6 6 6 0 0 1-6-6V58a6 6 0 1 1 12 0 6 6 0 0 0 6 6v24zM0 88V64a6 6 0 0 0 6-6 6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>
