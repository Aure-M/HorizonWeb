<template>
    <AppModal :show="showReport">
        <template #default="{ close }">
            <Transition name="fade" as="template">
                <div class="flex flex-col gap-2 card">
                    <div class="text-xl">Signaler ce contenu</div>
                    <div class="label-title">Raison</div>
                    <TipTapEditor
                        v-model="state.reason"
                        :char-count="{ limit: 1000, showAt: 900 }"
                        placeholder="Décris la raison de ton signalement..."
                        @input="v$.reason.$touch"
                    >
                        <template #error>
                            <AppError
                                v-if="v$.reason.$error"
                                error="La raison de ton signalement doit faire entre 10 et 1000 caractères."
                            />
                        </template>
                    </TipTapEditor>
                    <button
                        class="font-bold text-blue-500"
                        @click="
                            () => {
                                submit()
                                close()
                            }
                        "
                    >
                        Signaler
                    </button>
                </div>
            </Transition>
        </template>
    </AppModal>
</template>

<script>
    import useVuelidate from '@vuelidate/core'
    import { reactive } from 'vue'
    import AppModal from '@/components/App/AppModal.vue'
    import AppError from '../App/AppError.vue'
    import TipTapEditor from '../TipTap/TipTapEditor.vue'

    export default {
        components: {
            AppModal,
            AppError,
            TipTapEditor,
        },
        props: {
            content: {
                type: Object,
                default: () => {},
            },
            showReport: {
                type: Boolean,
                default: false,
            },
        },
        setup() {
            const state = reactive({ reason: '' })
            const rules = {
                reason: {
                    required: true,
                    minlength: 20,
                    maxlength: 1000,
                },
            }

            return {
                state,
                v$: useVuelidate(rules, state),
            }
        },
        methods: {
            submit() {
                if (this.v$.$invalid) {
                    return
                }

                this.$store.dispatch('reports/addReport', {
                    userId: this.content.author.userId,
                    contentId: this.content.contentId,
                    reason: this.state.reason,
                })
            },
        },
    }
</script>
