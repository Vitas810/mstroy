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
import {TreeStore} from "@/store/TreeStore";
import {
  themeQuartz,
  type ColDef,
} from 'ag-grid-community'

const rowData = [
  {
    id: 1,
    parent: null,
    label: 'Айтем 1',
    category: 'Группа',
    path: ['Айтем 1'],
  },
  {
    id: '91064cee',
    parent: 1,
    label: 'Айтем 2',
    category: 'Группа',
    path: ['Айтем 1', 'Айтем 2'],
  },
  {
    id: 3,
    parent: 1,
    label: 'Айтем 3',
    category: 'Элемент',
    path: ['Айтем 1', 'Айтем 3'],
  },
  {
    id: 4,
    parent: '91064cee',
    label: 'Айтем 4',
    category: 'Группа',
    path: ['Айтем 1', 'Айтем 2', 'Айтем 4'],
  },
  {
    id: 5,
    parent: '91064cee',
    label: 'Айтем 5',
    category: 'Элемент',
    path: ['Айтем 1', 'Айтем 2', 'Айтем 5'],
  },
  {
    id: 6,
    parent: '91064cee',
    label: 'Айтем 6',
    category: 'Элемент',
    path: ['Айтем 1', 'Айтем 2', 'Айтем 6'],
  },
  {
    id: 7,
    parent: 4,
    label: 'Айтем 7',
    category: 'Элемент',
    path: ['Айтем 1', 'Айтем 2', 'Айтем 4', 'Айтем 7'],
  },
  {
    id: 8,
    parent: 4,
    label: 'Айтем 8',
    category: 'Элемент',
    path: ['Айтем 1', 'Айтем 2', 'Айтем 4', 'Айтем 8'],
  },
]

const columnDefs: ColDef[] = [
  {
    field: 'id',
    headerName: '№',
    width: 90,
  },
  {
    field: 'category',
    headerName: 'Категория',
    flex: 1,
  },
  {
    field: 'label',
    headerName: 'Наименование',
    flex: 2,
  },
]


const store = new TreeStore(rowData)

store.updateItem(  {
  id: 6,
  parent: '91064cee',
  label: 'Айтем 69',
})

store.removeItem(4)
console.log(store.getAllChildren(1))

</script>

<style scoped>
  .grid {
    width: 100%;
    height: 600px;
  }
</style>