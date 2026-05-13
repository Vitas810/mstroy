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
import { treeItems } from '@/store/treeItems'
import type { DemoTreeItem, TreeGridRow, TreeRowCategory } from '@/types/tree'
import {
  themeQuartz,
  type AutoGroupColumnDef,
  type ColDef,
  type GetDataPath,
  type ValueGetterParams,
} from 'ag-grid-community'

const store = new TreeStore<DemoTreeItem>(treeItems)

const rowData: TreeGridRow[] = store.getAll().map((item) => {
  const path = store
      .getAllParents(item.id)
      .reverse()
      .map(parentItem => parentItem.label)

  const category: TreeRowCategory = store.getChildren(item.id).length > 0
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
    valueGetter: (params: ValueGetterParams<TreeGridRow>) => {
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

const autoGroupColumnDef: AutoGroupColumnDef<TreeGridRow> = {
  headerName: 'Наименование',
  minWidth: 280,
}

const getDataPath: GetDataPath<TreeGridRow> = (data) => data.path

</script>

<style scoped>
  .grid {
    width: 100%;
    height: 600px;
  }
</style>
