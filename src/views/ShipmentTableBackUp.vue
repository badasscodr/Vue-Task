<template>
    <v-data-table
        mobile-breakpoint="769"
        :headers="headers"
        :items="shipments"
        :page.sync="page"
        :items-per-page="!isMobile ? itemsPerPage : 15"
        :search="search"
        class="elevation-1"
        hide-default-footer
        style="box-shadow: none !important"
        @page-count="pageCount = $event"
        @click:row="handleClick">

        <template>
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>

        <template v-slot:no-data>
        <!-- <v-btn color="primary" @click="initialize"> Reset </v-btn> -->
            <v-progress-circular
                :size="40"
                color="#0171a1"
                indeterminate
                v-if="getShipmentLoadingStatus">
            </v-progress-circular>
        </template>

        <template v-slot:[`item.Status`]="{ item }">
            <div class="status" v-if="!isMobile">
                <v-chip>
                    {{ item.Status }}
                </v-chip>

                <!-- <p
                class="icon-wrapper"
                style="color: #f93131"
                v-if="item.Status == 'In Transit'"
                >
                <img src="../assets/images/alert.svg" alt="" class="icon-img" />
                Action Needed
                </p>

                <p
                class="icon-wrapper"
                style="color: #039ddc"
                v-else-if="item.Status == 'Discharged'"
                >
                <img src="../assets/images/message.svg" alt="" class="icon-img" />
                Message
                </p>

                <p
                class="icon-wrapper"
                style="color: #f99e18"
                v-else-if="item.Status == 'Awaiting Departure'"
                >
                <img src="../assets/images/update.svg" alt="" class="icon-img" />
                Update
                </p>

                <p
                class="icon-wrapper"
                style="color: #f99e18"
                v-else-if="item.Status == 'Pending'"
                >
                <img src="../assets/images/alert.svg" alt="" class="icon-img" />
                <img src="../assets/images/update.svg" alt="" class="icon-img" />
                <img src="../assets/images/message.svg" alt="" class="icon-img" />
                </p> -->
            </div>
        </template>

        <template v-slot:[`item.Arrival`]="{ item }">
            <div v-if="!isMobile" class="arrival-wrapper">
                <div style="width: 35px;">
                    <img v-if="item.mode == 'Ocean'" src="../assets/images/ship.svg">
                    <img v-if="item.mode == 'Air'" src="../assets/images/airplane.svg">
                </div>

                <div>
                    <div class="flag-wrapper">
                    <p style="margin-bottom: 0px">
                            {{ item.Arrival.location }}
                        </p>
                    </div>
                    <p style="color: #039ddc">
                        {{ item.Arrival.eta }}
                    </p>
                </div>
                
            </div>

            <div v-if="isMobile">
                <div class="mobile-pos">
                    <p>PO #{{ item.PO }}</p>
                </div>
            </div>
        </template>

        <template v-slot:[`item.Departure`]="{ item }">
            <div v-if="!isMobile">
                <div class="flag-wrapper">
                <!-- <img
                    src="../assets/images/flags/cn.png"
                    alt=""
                    width="15"
                    height="15"/> -->

                    <p style="margin-bottom: 0px">
                        {{ item.Departure.location }}
                    </p>
                </div>

                <div>
                    <p style="color: #039ddc">
                        {{ item.Departure.etd }}
                    </p>
                </div>
            </div>

            <div class="mobile-dep-arr" v-if="isMobile">
                <div>
                    <p style="margin-bottom: 0px">
                        {{ item.Departure.location }}
                    </p>

                    <p style="color: #039ddc">
                        {{ item.Departure.etd }}
                    </p>
                </div>

                <div v-if="item.mode !== ''">
                    <img v-if="item.mode == 'Ocean'" src="../assets/images/ship.svg" width="25px">
                    <img v-if="item.mode == 'Air'" src="../assets/images/airplane.svg" width="25px">
                </div>

                <div>
                    <div>
                        <p style="margin-bottom: 0px">
                            {{ item.Arrival.location }}
                        </p>

                        <p style="color: #039ddc">
                            {{ item.Arrival.eta }}
                        </p>
                    </div>
                </div>
            </div>
        </template>            

        <!-- customize if isMobile -->
        <template class="po-mobile" v-slot:[`item.PO`]="{ item }">
            <div :class="isMobile ? 'status' : 'po-content'">
                <v-chip>
                    <!-- <span v-for="(items, index) in item.po_list" :key="index">
                        <span v-if="index !== 0">, </span><span>{{ items }}</span>
                    </span>
                    <span v-if="item.po_list == null">
                        Not specified
                    </span> -->
                    {{ item.PO }}
                </v-chip>
            </div>
        </template>

        <template 
            v-if="isMobile"
            v-slot:[`item.ReferencceID`]="{ item }">

            <div class="mobile-reference">
                <div class="mobile-reference-content">
                    {{ item.ReferencceID }} 
                </div>

                <div class="status">
                    <v-chip style="font-size: 11px !important;">
                        {{ item.Status }}
                    </v-chip>
                </div>
            </div>
        </template>
    </v-data-table>
</template>