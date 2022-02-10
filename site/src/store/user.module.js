// import { uniqBy } from 'lodash'
import UserService from '../services/user.service'
import ProfilesService from '@/services/profiles.service'
import { ITEMS_PER_PAGE, settleQuery } from './constants'
import { uniqBy } from 'lodash'

const initialState = {
    mode: JSON.parse(localStorage.getItem('modePreference')) === 'dark' ? 'dark' : 'light',
    colors: JSON.parse(localStorage.getItem('colorsPreference')) || {
        '--bg-0-light': '#fafafa',
        '--bg-0-dark': '#1a1a1a',
        '--bg-1-light': '#f5f5f5',
        '--bg-1-dark': '#1f1f1f',
        '--bg-2-light': '#ebebeb',
        '--bg-2-dark': '#2a2a2a',
        '--bg-3-light': '#e1e1e1',
        '--bg-3-dark': '#2f2f2f',
        '--bg-4-light': '#d6d6d6',
        '--bg-4-dark': '#343434',
        '--bg-5-light': '#ccc',
        '--bg-5-dark': '#333',
        '--bg-6-light': '#c2c2c2',
        '--bg-6-dark': '#3b3b3b',
        '--text-0-light': '#333',
        '--text-0-dark': '#fff',
        '--text-1-light': '#666',
        '--text-1-dark': '#f3f3f3',
        '--text-2-light': '#999',
        '--text-2-dark': '#e5e5e5',
        '--text-3-light': '#ccc',
        '--text-3-dark': '#d9d9d9',
        '--text-4-light': '#fff',
        '--text-4-dark': '#c3c3c3',
        '--text-5-light': '#fafafa',
        '--text-5-dark': '#b3b3b3',
        '--text-6-light': '#f5f5f5',
        '--text-6-dark': '#aaa',
    },

    enumClubs: [],
    enumSocials: [],
    clubs: [],
    clubsPage: 1,
    clubsLoaded: false,
    favorites: [],
    favoritesPage: 1,
    socialAccounts: [],
    socialAccountsPage: 1,
}

export const user = {
    namespaced: true,
    state: initialState,
    getters: {
        getMode(state) {
            return state.mode
        },
        getColors(state) {
            return state.colors
        },
        getEnumSocials: (state) => state.enumSocials,
        getCurrentUser: (state) => state.currentUser,
    },
    actions: {
        switchMode({ state, commit }) {
            commit('setMode', state.mode === 'dark' ? 'light' : 'dark')
        },

        switchColors({ commit }, colors) {
            commit('setColors', colors)
        },

        getProfile: async ({ dispatch }) => {
            await Promise.all([
                dispatch('getEnumClubs'),
                dispatch('getEnumSocials'),
                dispatch('getClubs'),
                dispatch('getFavorites'),
                dispatch('getSocialAccounts'),
            ])
        },

        getEnumClubs: ({ commit }) =>
            settleQuery({ commit, mutation: 'getEnumClubsSuccess' }, UserService.getEnumClubs()),
        getEnumSocials: ({ commit }) =>
            settleQuery({ commit, mutation: 'getEnumSocialsSuccess' }, UserService.getEnumSocials()),

        updateUser: ({ commit }, newUser) =>
            settleQuery({ commit, mutation: 'auth/updateUserSuccess' }, UserService.updateUser(newUser)),

        getClubs: ({ commit, state, rootState }) =>
            settleQuery(
                { commit, mutation: 'getClubsSuccess' },
                ProfilesService.getUserClubs(rootState.auth.user.userId, {
                    page: state.clubsPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            ),

        getClubMembers: ({ commit, state }, clubId) =>
            settleQuery(
                { commit, mutation: 'getClubMembersSuccess' },
                UserService.getClubMembers(clubId, {
                    page: state.clubs.find((club) => club.clubId === clubId).membersPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            )
                ? state.clubs.find((club) => club.clubId === clubId)
                : null,

        addClubMember: ({ commit }, { clubId, userId }) =>
            settleQuery(
                { commit, mutation: 'addClubMemberSuccess' },
                UserService.addClubMember(clubId, userId),
            ),
        updateClubMember: ({ commit }, { clubId, userId, role }) =>
            settleQuery(
                { commit, mutation: 'updateClubMemberSuccess' },
                UserService.updateClubMember(clubId, userId, role),
            ),
        deleteClubMember: ({ commit }, { clubId, userId }) =>
            settleQuery(
                { commit, mutation: 'deleteClubMemberSuccess' },
                UserService.deleteClubMember({ clubId, userId }),
            ),

        getFavorites: ({ commit, state }) =>
            settleQuery(
                { commit, mutation: 'getFavoritesSuccess' },
                UserService.getFavorites({
                    page: state.favoritesPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            ),
        deleteFavorite: ({ commit }, favoriteId) =>
            settleQuery(
                { commit, mutation: 'deleteFavoriteSuccess' },
                UserService.deleteFavorite(favoriteId),
            ),

        getSocialAccounts: ({ commit, state, rootState }) =>
            settleQuery(
                { commit, mutation: 'getSocialAccountsSuccess' },
                ProfilesService.getUserSocials(rootState.auth.user.userId, {
                    page: state.socialAccountsPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            ),
        addSocialAccount: ({ commit }, { userId, socialId, pseudo, link }) =>
            settleQuery(
                { commit, mutation: 'addUserSocialSuccess' },
                UserService.addSocialAccount(userId, socialId, pseudo, link),
            ),
        updateSocialAccount: ({ commit }, { accountId, pseudo, link }) =>
            settleQuery(
                { commit, mutation: 'updateUserSocialSuccess' },
                UserService.updateSocialAccount(accountId, pseudo, link),
            ),
        deleteSocialAccount: ({ commit }, { accountId }) =>
            settleQuery(
                { commit, mutation: 'deleteUserSocialSuccess' },
                UserService.deleteSocialAccount(accountId),
            ),
    },
    mutations: {
        setMode(state, mode) {
            state.mode = mode
            localStorage.setItem('modePreference', JSON.stringify(mode))
        },

        setColors(state, colors) {
            for (const color in colors) {
                state.colors[color] = colors[color]
            }
            localStorage.setItem('colorsPreference', JSON.stringify(state.colors))
        },

        refreshClubs(state) {
            state.clubs = []
            state.clubsPage = 1
            state.clubsLoaded = false
        },
        getClubsSuccess(state, clubs) {
            state.clubsLoaded = true
            state.clubs = uniqBy(
                [
                    ...state.clubs,
                    ...clubs.map((club) => ({
                        ...club,
                        members: [],
                        membersPage: 1,
                    })),
                ],
                'clubId',
            )
            state.clubsPage++
        },

        getEnumClubsSuccess(state, clubs) {
            state.enumClubs = clubs
        },
        getEnumSocialsSuccess(state, socials) {
            state.enumSocials = socials
        },

        getFavoritesSuccess(state, favorites) {
            state.favorites = uniqBy([...state.favorites, ...favorites], 'favoriteId')
            state.favoritesPage++
        },
        deleteFavoriteSuccess(state, favoriteId) {
            state.favorites = state.favorites.filter((favorite) => favorite.favoriteId !== favoriteId)
        },

        addClubMemberSuccess(state, { clubId, user }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            club.members = uniqBy([...club.members, user], 'userId')
        },
        getClubMembersSuccess(state, { clubId, members }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            club.members = uniqBy([...club.members, ...members], 'userId')
            club.membersPage++
        },
        updateClubMemberSuccess(state, { clubId, user }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            const memberIndex = club.members.findIndex((member) => member.userId === user.userId)
            club.members[memberIndex] = user
        },
        deleteClubMemberSuccess(state, { clubId, userId }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            club.members = club.members.filter((member) => member.userId !== userId)
        },

        getSocialAccountsSuccess(state, socialAccounts) {
            state.socialAccounts = uniqBy([...state.socialAccounts, ...socialAccounts], 'socialId')
            state.socialAccountsPage++
        },
        addSocialAccountSuccess(state, socialAccount) {
            state.socialAccounts = uniqBy([...state.socialAccounts, socialAccount], 'socialId')
        },
        updateSocialAccountSuccess(state, socialAccount) {
            const socialAccountIndex = state.socialAccounts.findIndex(
                (social) => social.socialAccountId === socialAccount.socialAccountId,
            )
            if (socialAccountIndex !== -1) {
                state.socialAccounts[socialAccountIndex] = socialAccount
            }
        },
        deleteSocialAccountSuccess(state, socialAccountId) {
            state.socialAccounts = state.socialAccounts.filter(
                (socialAccount) => socialAccount.socialAccountId != socialAccountId,
            )
        },
    },
}
