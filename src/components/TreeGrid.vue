<template>
  <AgGridVue
      class="grid"
      :theme="themeQuartz"
      :rowData="rowData"
      :columnDefs="columnDefs"
  />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'

import {
  themeQuartz,
  type ColDef,
} from 'ag-grid-community'

const rowData = [
  {
    mission: 'Voyager 1',
    company: 'NASA',
    location: 'Cape Canaveral',
    date: '1977-09-05',
    price: 250,
    successful: true,
  },
  {
    mission: 'Apollo 11',
    company: 'NASA',
    location: 'Kennedy Space Center',
    date: '1969-07-16',
    price: 355,
    successful: true,
  },
  {
    mission: 'Falcon Heavy Test',
    company: 'SpaceX',
    location: 'Cape Canaveral',
    date: '2018-02-06',
    price: 90,
    successful: true,
  },
]

const columnDefs: ColDef[] = [
  {
    field: 'mission',
    headerName: 'Mission',
    flex: 1,
  },
  {
    field: 'company',
    headerName: 'Company',
    flex: 1,
  },
  {
    field: 'location',
    headerName: 'Location',
    flex: 1,
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1,
  },
  {
    field: 'successful',
    headerName: 'Successful',
    flex: 1,
  },
]
</script>

<style scoped>
  .grid {
    width: 100%;
    height: 600px;
  }
</style>