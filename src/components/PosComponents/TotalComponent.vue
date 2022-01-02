<template>
    <div class="total-wrapper">
        <div class="view-total">
            <div class="view-prices subtotal">
                <p>Subtotal</p>
                <slot name="sub_total"></slot>
            </div>

            <div class="view-prices tax">
                <p>Tax</p>
                <slot name="tax"></slot>
            </div>

            <div class="view-prices shipping">
                <p>Shipping</p>
                <slot name="shipping"></slot>
            </div>

            <div class="view-prices discount">
                <p>Discount</p>
                <slot name="discount"></slot>
            </div>

            <div class="view-prices total">
                <p>Total</p>
                <slot name="total"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TotalComponent',
    props: ['items'],
    components: {},
    data: () => ({ }),
    mounted() {},
    methods: {},
    computed: {},
    watch: {}
}
</script>
