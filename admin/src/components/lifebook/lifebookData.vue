<template>
    <div>
        <h1>Lifebook Data</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            lifebookData: []
        }
    },
    methods: {
        getLifebookData() {
            this.$http.get('admin/lifeBookList')
                .then((response) => {
                    this.lifebookData = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    },
    mounted() {
        this.getLifebookData();
    }
}
</script>

<style></style>