<template>
    <div class="py-4 px-8 text-2" :style="colors">
        <h2 class="text-xl">Paramètres d'Accessibilité</h2>
        <p class="mb-6 text-sm">Améliorer votre accessibilité en fonction de vos préférences</p>
        <div class="flex flex-col gap-2">
            <div v-for="(_, colorName, i) in colors" :key="i" class="flex gap-4">
                <label :for="colorName">{{ colorName }}</label>
                <input
                    v-model="colors[colorName]"
                    :name="colorName"
                    type="color"
                    @change="$store.dispatch('user/switchColors', { colorName: $event })"
                />
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                root: document.querySelector(':root'),
                colors: this.$store.getters['user/getColors'],
            }
        },
    }
</script>
