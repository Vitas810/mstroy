import { describe, expect, it } from 'vitest'
import { TreeStore } from '@/store/TreeStore'
import { treeItems } from '@/store/treeItems'
import type { DemoTreeItem } from '@/types/tree'

const createStore = () =>
  new TreeStore<DemoTreeItem>(treeItems.map(item => ({ ...item })))

describe('TreeStore', () => {
  describe('Чтение данных', () => {
    it('getAll возвращает исходный набор', () => {
      const store = createStore()
      expect(store.getAll()).toHaveLength(treeItems.length)
    })

    it('getItem корректно работает для number/string id и отсутствующего id', () => {
      const store = createStore()
      expect(store.getItem(1)?.label).toBe('Айтем 1')
      expect(store.getItem('91064cee')?.label).toBe('Айтем 2')
      expect(store.getItem('missing')).toBeUndefined()
    })
  })

  describe('Иерархия дерева', () => {
    it('getChildren возвращает только прямых детей', () => {
      const store = createStore()
      expect(store.getChildren(1).map(item => item.id)).toEqual([ '91064cee', 3 ])
      expect(store.getChildren(8)).toEqual([])
    })

    it('getAllChildren возвращает всех потомков узла', () => {
      const store = createStore()
      const ids = store.getAllChildren('91064cee').map(item => item.id).sort()
      expect(ids).toEqual([4, 5, 6, 7, 8])
    })

    it('getAllParents возвращает цепочку от элемента к корню в правильном порядке', () => {
      const store = createStore()
      const ids = store.getAllParents(7).map(item => item.id)
      expect(ids).toEqual([7, 4, '91064cee', 1])
    })
  })

  describe('Мутации', () => {
    it('addItem добавляет новый элемент и связывает с родителем', () => {
      const store = createStore()
      store.addItem({ id: 9, parent: 3, label: 'Айтем 9' })

      expect(store.getItem(9)?.label).toBe('Айтем 9')
      expect(store.getChildren(3).map(item => item.id)).toContain(9)
    })

    it('updateItem обновляет поля и переносит элемент к новому родителю', () => {
      const store = createStore()
      store.updateItem({ id: 6, parent: 4, label: 'Айтем 6 (updated)' })

      expect(store.getItem(6)?.label).toBe('Айтем 6 (updated)')
      expect(store.getChildren('91064cee').map(item => item.id)).not.toContain(6)
      expect(store.getChildren(4).map(item => item.id)).toContain(6)
    })

    it('removeItem удаляет узел и всех потомков', () => {
      const store = createStore()
      store.removeItem(4)

      expect(store.getItem(4)).toBeUndefined()
      expect(store.getItem(7)).toBeUndefined()
      expect(store.getItem(8)).toBeUndefined()
      expect(store.getChildren('91064cee').map(item => item.id)).toEqual([5, 6])
    })

    it('removeItem и updateItem для отсутствующего id не ломают состояние', () => {
      const store = createStore()
      const before = store.getAll().length

      store.removeItem('missing')
      store.updateItem({ id: 'missing', parent: null, label: 'Nope' })

      expect(store.getAll()).toHaveLength(before)
      expect(store.getItem(1)?.label).toBe('Айтем 1')
    })
  })
})
