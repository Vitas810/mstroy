import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeGrid from '@/components/TreeGrid.vue'
import { treeItems } from '@/store/treeItems'
import type { TreeGridRow } from '@/types/tree'

describe('Компонент TreeGrid', () => {
  describe('Подготовка данных для грида', () => {
    it('передает в AgGridVue корректный rowData с category и path', () => {
      const wrapper = mount(TreeGrid, {
        global: {
          stubs: {
            AgGridVue: {
              name: 'AgGridVue',
              template: '<div class="ag-grid-stub" />',
              props: ['rowData', 'columnDefs', 'getDataPath'],
            },
          },
        },
      })

      const grid = wrapper.findComponent({ name: 'AgGridVue' })
      const rowData = grid.props('rowData') as TreeGridRow[]

      expect(rowData).toHaveLength(treeItems.length)

      const groupRow = rowData.find(item => item.id === 1)
      const leafRow = rowData.find(item => item.id === 8)
      const deepRow = rowData.find(item => item.id === 7)

      expect(groupRow?.category).toBe('Группа')
      expect(leafRow?.category).toBe('Элемент')
      expect(deepRow?.path).toEqual(['Айтем 1', 'Айтем 2', 'Айтем 4', 'Айтем 7'])
    })
  })

  describe('Колонки таблицы', () => {
    it('колонка № п/п считает rowIndex + 1 и возвращает пустую строку при отсутствии индекса', () => {
      const wrapper = mount(TreeGrid, {
        global: {
          stubs: {
            AgGridVue: {
              name: 'AgGridVue',
              template: '<div class="ag-grid-stub" />',
              props: ['rowData', 'columnDefs', 'getDataPath'],
            },
          },
        },
      })

      const grid = wrapper.findComponent({ name: 'AgGridVue' })
      const columnDefs = grid.props('columnDefs') as Array<{ headerName?: string; valueGetter?: (params: unknown) => unknown }>
      const numberColumn = columnDefs.find(col => col.headerName === '№ п/п')

      expect(numberColumn).toBeDefined()
      expect(numberColumn?.valueGetter?.({ node: { rowIndex: 0 } })).toBe(1)
      expect(numberColumn?.valueGetter?.({ node: { rowIndex: undefined } })).toBe('')
      expect(numberColumn?.valueGetter?.({ node: { rowIndex: null } })).toBe('')
    })
  })
})
