import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeGrid from '@/components/TreeGrid.vue'
import { treeItems } from '@/store/treeItems'
import type { TreeGridRow } from '@/types/tree'
import { buildTreeGridRows } from '@/utils/buildTreeGridRows'

describe('Компонент TreeGrid', () => {
  describe('Подготовка данных для грида', () => {
    it('передает в AgGridVue корректный rowData с category и pathIds', () => {
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

      const groupRow = rowData.find((item) => item.id === 1)
      const leafRow = rowData.find((item) => item.id === 8)
      const deepRow = rowData.find((item) => item.id === 7)

      expect(groupRow?.category).toBe('Группа')
      expect(leafRow?.category).toBe('Элемент')
      expect(deepRow?.pathIds).toEqual(['1', '91064cee', '4', '7'])
    })

    it('строит уникальные pathIds для элементов с одинаковыми label', () => {
      const rows = buildTreeGridRows([
        { id: 1, parent: null, label: 'Корень' },
        { id: 2, parent: 1, label: 'Повтор' },
        { id: 3, parent: 1, label: 'Повтор' },
      ])

      const first = rows.find((item) => item.id === 2)
      const second = rows.find((item) => item.id === 3)

      expect(first?.pathIds).toEqual(['1', '2'])
      expect(second?.pathIds).toEqual(['1', '3'])
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
      const columnDefs = grid.props('columnDefs') as Array<{
        headerName?: string
        valueGetter?: (params: unknown) => unknown
      }>
      const numberColumn = columnDefs.find((col) => col.headerName === '№ п\\п')

      expect(numberColumn).toBeDefined()
      expect(numberColumn?.valueGetter?.({ node: { rowIndex: 0 } })).toBe(1)
      expect(
        numberColumn?.valueGetter?.({ node: { rowIndex: undefined } })
      ).toBe('')
      expect(numberColumn?.valueGetter?.({ node: { rowIndex: null } })).toBe('')
    })

    it('колонка Категория настроена как древовидная', () => {
      const wrapper = mount(TreeGrid, {
        global: {
          stubs: {
            AgGridVue: {
              name: 'AgGridVue',
              template: '<div class="ag-grid-stub" />',
              props: [
                'rowData',
                'columnDefs',
                'getDataPath',
                'treeDataDisplayType',
              ],
            },
          },
        },
      })

      const grid = wrapper.findComponent({ name: 'AgGridVue' })
      const columnDefs = grid.props('columnDefs') as Array<{
        headerName?: string
        field?: string
        showRowGroup?: boolean
        cellRenderer?: string
      }>
      const categoryColumn = columnDefs.find(
        (col) => col.headerName === 'Категория'
      )
      const nameColumn = columnDefs.find(
        (col) => col.headerName === 'Наименование'
      )

      expect(categoryColumn).toBeDefined()
      expect(categoryColumn?.field).toBe('category')
      expect(categoryColumn?.showRowGroup).toBe(true)
      expect(categoryColumn?.cellRenderer).toBe('agGroupCellRenderer')
      expect(nameColumn?.field).toBe('label')
    })
  })
})
