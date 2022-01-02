<template>
    <div class="total-wrapper">
        <div class="view-total">
            <div class="view-prices subtotal">
                <p>Subtotal</p>
                <p> {{ subTotal }} </p>
            </div>

            <div class="view-prices tax">
                <p>Tax</p>
                <p> {{ tax }} </p>
            </div>

            <div class="view-prices shipping">
                <p>Shipping</p>
                <p>{{ shipping }}</p>
            </div>

            <div class="view-prices discount">
                <p>Discount</p>
                <p>{{ discount }}</p>
            </div>

            <div class="view-prices total">
                <p>Total</p>
                <p>{{ total }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PoTotalComponent',
    props: ['items', 'subTotal', 'tax', 'shipping', 'discount', 'total']
}
</script>
