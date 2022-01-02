<template>
    <div class="map-wrapper">
        <div class="map-content">
            <h2>Map</h2>

            <a :href="this.getDetails.ais_link" target="_blank" class="btn btn-view-vessel">View Live Vessel Location</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Map',
    props: ['getDetails'],
    mounted() {
        
    },
}
</script>

<style>
.map-wrapper {
    width: 100%;
}

.map-wrapper .map-content {
    background-color: #fff;
    min-height: 70px;
    border: 1px solid #E1ECF0;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map-wrapper .map-content h2 {
    color: #4A4A4A;
}

.map-wrapper .map-content .btn-view-vessel {
    background-color: #0171A1;
    font-family: 'Inter-Regular', sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: #fff;
    text-decoration: none !important;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>