<template>
  <AgGridVue
      class="grid"
      :theme="themeQuartz"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :treeData="true"
      :getDataPath="getDataPath"
      :autoGroupColumnDef="autoGroupColumnDef"
      :groupDefaultExpanded="-1"
  />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { TreeStore } from '@/store/TreeStore'
import { treeItems, type DemoTreeItem } from '@/store/treeItems'
import {
  themeQuartz,
  type AutoGroupColumnDef,
  type ColDef,
  type GetDataPath,
  type ValueGetterParams,
} from 'ag-grid-community'

type GridRow = DemoTreeItem & {
  path: string[]
  category: 'Группа' | 'Элемент'
}

const store = new TreeStore<DemoTreeItem>(treeItems)

const rowData: GridRow[] = store.getAll().map((item) => {
  const path = store
      .getAllParents(item.id)
      .reverse()
      .map(parentItem => parentItem.label)

  const category = store.getChildren(item.id).length > 0
      ? 'Группа'
      : 'Элемент'

  return {
    ...item,
    path,
    category,
  }
})

const columnDefs: ColDef[] = [
  {
    headerName: '№ п/п',
    width: 90,
    valueGetter: (params: ValueGetterParams<GridRow>) => {
      if (params.node?.rowIndex === null || params.node?.rowIndex === undefined) {
        return ''
      }

      return params.node.rowIndex + 1
    },
  },
  {
    field: 'category',
    headerName: 'Категория',
    flex: 1,
  },
]

const autoGroupColumnDef: AutoGroupColumnDef<GridRow> = {
  headerName: 'Наименование',
  minWidth: 280,
}

const getDataPath: GetDataPath<GridRow> = (data) => data.path

</script>

<style scoped>
  .grid {
    width: 100%;
    height: 600px;
  }
</style>
