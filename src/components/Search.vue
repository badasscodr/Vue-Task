<template>
    <div class="search-component-wrapper">
        <v-text-field
            height="40px"
            color="#002F44"
            width="400px"
            dense
            class="search"
            :class="className"
            :placeholder="placeholder"
            outlined
            prepend-inner-icon="mdi-magnify"
            v-model="cData"
            @input="$emit('update:inputData', cData)">
        </v-text-field>
    </div>
</template>

<script>
export default {
    props: ['inputData', 'placeholder', 'className'],
    data: () => ({
        cData: ''
    }),
    mounted() {
        this.cData = this.inputData
    }
}
</script>

<style>
.search-component-wrapper {
    height: 40px;
}

.search-component-wrapper .search .v-input__slot {
    height: 40px !important;
    width: 400px;
}

.search-component-wrapper .search .v-input__slot .v-input__prepend-inner {
    margin-top: 8px !important;
}

.search-component-wrapper .search.custom-search .v-input__slot {
    width: 240px !important;
    background-color: #fff;
}

.search-component-wrapper .search .v-input__slot input {
    font-size: 14px;
}

.search-component-wrapper .search .v-input__slot .v-input__icon.v-input__icon--prepend-inner i {
	color: #4A4A4A !important;
    font-size: 21px;
}

.search-component-wrapper .search fieldset {
    border: 1px solid #B3CFE0;
    font-size: 14px;
}

.search-component-wrapper .search fieldset:focus {
    border: 1px solid #B3CFE0 !important;
    outline: 0;
}

.search-component-wrapper .v-text-field__slot input::placeholder {
    color:#B4CFE0 !important;
}

@media screen and (max-width: 768px) {
    .search-component-wrapper {
		height: 40px;
        padding: 0;
        border-bottom: 2px solid #F1F6FA;
        width: 100%;
        background-color: #fff;
	}

    .search-component-wrapper .v-input__control,
    .search-component-wrapper .v-input__control .v-input__slot,
    .search-component-wrapper .v-input__control .v-input__slot fieldset,
    .search-component-wrapper .v-input__control .v-input__slot .v-text-field__slot input {
        width: 100%;
    }
}
</style>
