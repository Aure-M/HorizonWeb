<template>
    <aside
        :class="[
            showUncollapsed ? 'w-sidebar-lg' : !smallScreen ? 'w-sidebar-sm' : '',
            collapsing ? 'transition-spacing' : '',
            smallScreen ? 'fixed h-screen' : 'after-topbar sticky h-content sidebar-shadow',
            smallScreen && showUncollapsed ? 'sidebar-shadow' : smallScreen ? 'hidden-sidebar-sm' : '',
            smallScreen && collapsing && uncollapsed ? 'hidden-sidebar-lg' : '',
        ]"
        class="flex z-30 flex-col shrink-0 border-r w-sidebar-sm bg-navbar border-navbar"
    >
        <div v-if="smallScreen && showUncollapsed" class="flex shrink-0 items-center bg-navbar h-topbar">
            <button aria-label="Open Menu" class="w-sidebar-sm" @click="$emit('toggle-side-bar')">
                <font-awesome-icon icon="times" class="text-2xl text-0" />
            </button>
            <AppLogo />
        </div>

        <div
            :class="[
                showUncollapsed ? 'divide-y-0' : 'divide-y dark:divide-gray-700',
                collapsing ? 'overflow-y-hidden' : 'overflow-y-auto scrollbar-none',
            ]"
        >
            <ul v-for="(section, i) in sections" :key="i">
                <p
                    class="py-0.5 pl-4 mt-3 text-sm uppercase text-0"
                    :class="[showUncollapsed ? 'block' : 'hidden']"
                >
                    {{ section.name }}
                </p>
                <template v-for="link of section.links" :key="link">
                    <li>
                        <router-link
                            :to="link.to"
                            class="flex items-center py-2 my-1 mx-auto w-11/12 opacity-80 tab text-0"
                            :class="{ active: link.regActive.test($route.path) }"
                        >
                            <div
                                class="flex items-center w-full"
                                :class="[showUncollapsed ? 'flex-row ml-3 gap-4' : 'flex-col mb-1']"
                            >
                                <font-awesome-icon :icon="link.icon" class="shrink-0 text-xl" />
                                <span v-if="showUncollapsed" class="text-base tracking-normal">{{
                                    link.textLarge
                                }}</span>
                                <span v-else class="text-xs tracking-tight">{{ link.textSmall }}</span>
                            </div>
                        </router-link>
                    </li>
                </template>
            </ul>

            <div class="flex gap-4 justify-center items-center p-4">
                <p class="text-1 text-bold" :class="{ 'hidden': !showUncollapsed }">Mode Sombre</p>
                <SwitchInput v-model="theme" @click="$store.dispatch('user/switchTheme')" />
            </div>
        </div>
    </aside>
</template>

<script>
    import SwitchInput from '@/components/Input/SwitchInput.vue'
    import AppLogo from '../App/AppLogo.vue'
    export default {
        components: { SwitchInput, AppLogo },
        props: {
            uncollapsed: {
                type: Boolean,
                default: true,
            },
            collapsing: {
                type: Boolean,
                default: true,
            },
            smallScreen: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['toggle-side-bar'],
        computed: {
            showUncollapsed() {
                return this.uncollapsed || (this.collapsing && !this.uncollapsed)
            },
            theme() {
                return this.$store.state.user.theme === 'dark'
            },
            loggedIn() {
                return this.$store.state.auth.loggedIn ?? false
            },
            sections() {
                return [
                    ...(import.meta.env.DEV
                        ? [
                              {
                                  name: 'Dév',
                                  links: [
                                      {
                                          to: '/test',
                                          regActive: /^\/test/,
                                          textSmall: 'Page test',
                                          textLarge: 'Page de test',
                                          icon: 'vial',
                                      },
                                  ],
                              },
                          ]
                        : []),
                    {
                        name: 'Admin',
                        links: [
                            {
                                to: '/admin/users',
                                regActive: /^\/admin/,
                                textSmall: 'Admin',
                                textLarge: 'Modération',
                                icon: 'columns',
                            },
                        ],
                    },
                    {
                        name: 'Forum',
                        links: [
                            {
                                to: '/posts',
                                regActive: /^\/posts(?!\/new)/,
                                textSmall: 'Forum',
                                textLarge: 'Efrei Forum',
                                icon: 'comments',
                            },
                            {
                                to: '/posts/new',
                                regActive: /^\/posts\/new$/,
                                textSmall: 'Poster',
                                textLarge: 'Créer un post',
                                icon: 'question-circle',
                            },
                        ],
                    },
                    {
                        name: 'Horizon Cloud',
                        links: [
                            {
                                to: '/docs',
                                regActive: /^\/docs(?!\/new)/,
                                textSmall: 'Documents',
                                textLarge: 'Tous les documents',
                                icon: 'folder',
                            },
                            {
                                to: '/docs/new',
                                regActive: /^\/docs\/new$/,
                                textSmall: 'Uploader',
                                textLarge: 'Ajouter un fichier',
                                icon: 'upload',
                            },
                        ],
                    },
                    {
                        name: 'Pause Café',
                        links: [
                            {
                                to: '/articles',
                                regActive: /^\/articles(?!\/new)/,
                                textSmall: 'News',
                                textLarge: 'News & Blog',
                                icon: 'newspaper',
                            },
                            {
                                to: '/articles/new',
                                regActive: /^\/articles\/new$/,
                                textSmall: 'Publier',
                                textLarge: 'Écrire un article',
                                icon: 'pen-alt',
                            },
                        ],
                    },
                    {
                        name: 'Communauté',
                        links: [
                            {
                                to: '/users/',
                                regActive: /^\/users/,
                                textSmall: 'Utilisateurs',
                                textLarge: 'Utilisateurs',
                                icon: 'users',
                            },
                            ...(this.loggedIn
                                ? [
                                      {
                                          to: '/me/profile',
                                          regActive: /^\/me\/profile/,
                                          textSmall: 'Compte',
                                          textLarge: 'Mon compte',
                                          icon: 'user-cog',
                                      },
                                      {
                                          to: '/me/favorites',
                                          regActive: /^\/me\/favorites/,
                                          textSmall: 'Mes favoris',
                                          textLarge: 'Mes favoris',
                                          icon: 'crown',
                                      },
                                  ]
                                : []),
                        ],
                    },
                ]
            },
        },
    }
</script>

<style lang="scss">
    .sidebar-shadow {
        clip-path: inset(0 -30px 0 0);
        box-shadow: 0 0 15px 3px rgb(0 0 0 / 5%);

        :root.dark & {
            box-shadow: 0 0 20px 5px rgb(0 0 0 / 40%);
        }
    }

    .transition-spacing {
        transition: margin-left 300ms;
    }
</style>
