<template>
  <AgGridVue
      class="grid"
      :theme="gridTheme"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :treeData="true"
      :getDataPath="getDataPath"
      :groupDefaultExpanded="-1"
      domLayout="autoHeight"
      treeDataDisplayType="custom"
  />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { TreeStore } from '@/store/TreeStore'
import { treeItems } from '@/store/treeItems'
import type { DemoTreeItem, TreeGridRow } from '@/types/tree'
import { buildTreeGridRows } from '@/utils/buildTreeGridRows'
import {
  themeQuartz,
  type ColDef,
  type GetDataPath,
  type ValueGetterParams,
} from 'ag-grid-community'

const store = new TreeStore<DemoTreeItem>(treeItems)
const items = store.getAll()

const gridTheme = themeQuartz.withParams({
  headerColumnBorder: {
    color: '#c9c9c9',
  },
  headerColumnBorderHeight: '100%',
  headerColumnResizeHandleWidth: '0px',
  headerColumnResizeHandleColor: 'transparent',
  wrapperBorderRadius: '8px',
})

const rowData: TreeGridRow[] = buildTreeGridRows(items)

const columnDefs: ColDef<TreeGridRow>[] = [
  {
    headerName: '№ п\\п',
    width: 100,
    valueGetter: (params: ValueGetterParams<TreeGridRow>) => {
      if (params.node?.rowIndex === null || params.node?.rowIndex === undefined) {
        return ''
      }

      return params.node.rowIndex + 1
    },
  },
  {
    headerName: 'Категория',
    field: 'category',
    showRowGroup: true,
    minWidth: 220,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true,
    },
  },
  {
    field: 'label',
    headerName: 'Наименование',
    flex: 1,
  },
]

const defaultColDef: ColDef<TreeGridRow> = {
  resizable: false,
  suppressHeaderMenuButton: true,
}

const getDataPath: GetDataPath<TreeGridRow> = (data) => data.path

</script>

<style scoped>
.grid {
  width: 100%;
}
</style>

<style>
.grid .ag-center-cols-viewport {
  min-height: unset !important;
}
</style>
