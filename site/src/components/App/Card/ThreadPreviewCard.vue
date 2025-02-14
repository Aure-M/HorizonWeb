<template>
    <div v-if="thread" class="w-full xs:rounded-xl bg-content">
        <div class="py-2 px-4 w-full md:py-3 md:px-5">
            <span
                class="flex overflow-hidden flex-wrap gap-5 items-center h-8 font-light whitespace-nowrap text-3"
            >
                <AppTag
                    :icon="postTypesEnum[thread.type]?.icon"
                    :tag-color="postTypesEnum[thread.type]?.color"
                    :tag-name="postTypesEnum[thread.type][$i18n.locale]"
                />
                <div :class="[thread.solved ? 'text-green-600' : 'text-red-500']">
                    {{ thread.solved ? 'Résolu' : 'Non-Résolu' }}
                </div>
                <div class="flex gap-2 items-center pl-1">
                    <font-awesome-icon icon="calendar" />
                    <div>{{ timeAgo(thread.createdAt) }}</div>
                </div>
                <div
                    v-if="thread.createdAt !== thread.post.contentLastUpdatedAt"
                    class="flex gap-2 items-center pl-1"
                >
                    <font-awesome-icon icon="history" />
                    <div>{{ timeAgo(thread.post.contentLastUpdatedAt) }}</div>
                </div>
            </span>

            <div class="mt-2">
                <router-link
                    :to="`/posts/${thread.contentMasterId}`"
                    class="text-xl font-semibold hover:underline line-clamp-1 text-0"
                >
                    {{ thread.title }}
                </router-link>

                <p class="mt-1 text-justify line-clamp-2 text-2">
                    {{ extractTextFromTipTapJSON(JSON.parse(thread.post.body)) }}
                </p>
            </div>

            <div class="flex items-center mt-2 mr-4 space-x-2 h-12">
                <a href="#" class="flex shrink-0 items-center mr-4">
                    <UserPreview :user="thread.post.author" />
                </a>

                <TagsList class="w-full" :tags="thread.tags" />
            </div>
        </div>
    </div>
    <div v-else class="flex py-3 px-5 space-x-2 font-semibold rounded-lg">
        <p class="text-lg text-0">Erreur: Ce post est vide.</p>

        <!-- TODO: Bug report pages -->
        <router-link :to="`/report-bug/posts`" class="text-lg font-semibold line-clamp-1 link-blue">
            Signalez ce bug !
        </router-link>
    </div>
</template>

<script>
    import TagsList from '@/components/List/TagList.vue'
    import UserPreview from '@/components/User/UserPreview.vue'
    import postTypesEnum from '@/shared/types/post-types.enum'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import { timeAgo } from '@/utils/timeAgo'
    import { extractTextFromTipTapJSON } from '@/utils/tiptap'
    import AppTag from '../AppTag.vue'

    export default {
        components: {
            UserPreview,
            TagsList,
            AppTag,
        },
        props: {
            thread: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return { postTypesEnum }
        },
        methods: {
            abbrNumbers,
            timeAgo,
            extractTextFromTipTapJSON,
        },
    }
</script>
