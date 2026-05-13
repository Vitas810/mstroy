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
      expect(store.getAll().map(item => item.id)).toEqual(treeItems.map(item => item.id))
    })

    it('getItem корректно работает для number/string id и отсутствующего id', () => {
      const store = createStore()
      expect(store.getItem(1)?.label).toBe('Айтем 1')
      expect(store.getItem('91064cee')?.label).toBe('Айтем 2')
      expect(store.getItem('missing')).toBeUndefined()
    })

    it('возвращает те же объекты, что хранятся в структуре', () => {
      const source = treeItems.map(item => ({ ...item }))
      const store = new TreeStore<DemoTreeItem>(source)
      const allItems = store.getAll()
      const item = store.getItem(1)

      expect(allItems[0]).toBe(source[0])
      expect(item).toBe(source[0])
      expect(store.getChildren(1)[0]).toBe(source[1])
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
      const ids = store.getAllChildren('91064cee').map(item => item.id)
      expect(ids).toEqual([4, 7, 8, 5, 6])
    })

    it('getAllParents возвращает цепочку от элемента к корню в правильном порядке', () => {
      const store = createStore()
      const ids = store.getAllParents(7).map(item => item.id)
      expect(ids).toEqual([7, 4, '91064cee', 1])
    })

    it('getAllParents для корневого элемента возвращает только его самого', () => {
      const store = createStore()
      const ids = store.getAllParents(1).map(item => item.id)
      expect(ids).toEqual([1])
    })
  })

  describe('Мутации', () => {
    it('addItem добавляет новый элемент и связывает с родителем', () => {
      const store = createStore()
      store.addItem({ id: 9, parent: 3, label: 'Айтем 9' })

      expect(store.getItem(9)?.label).toBe('Айтем 9')
      expect(store.getChildren(3).map(item => item.id)).toContain(9)
    })

    it('addItem выбрасывает ошибку при дублирующемся id', () => {
      const store = createStore()

      expect(() =>
        store.addItem({ id: 1, parent: null, label: 'Дубликат' }),
      ).toThrow('уже существует')
    })

    it('addItem выбрасывает ошибку при несуществующем родителе', () => {
      const store = createStore()

      expect(() =>
        store.addItem({ id: 9, parent: 'missing', label: 'Айтем 9' }),
      ).toThrow('не найден родитель')
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

    it('removeItem сохраняет порядок остальных элементов в getAll', () => {
      const store = createStore()
      store.removeItem('91064cee')

      expect(store.getAll().map(item => item.id)).toEqual([1, 3])
    })

    it('removeItem для отсутствующего id не ломает состояние', () => {
      const store = createStore()
      const before = store.getAll().length

      store.removeItem('missing')

      expect(store.getAll()).toHaveLength(before)
      expect(store.getItem(1)?.label).toBe('Айтем 1')
    })

    it('updateItem выбрасывает ошибку для отсутствующего id', () => {
      const store = createStore()

      expect(() =>
        store.updateItem({ id: 'missing', parent: null, label: 'Nope' }),
      ).toThrow('не найден')
    })

    it('updateItem запрещает делать элемент родителем самого себя', () => {
      const store = createStore()

      expect(() =>
        store.updateItem({ id: 1, parent: 1, label: 'Айтем 1' }),
      ).toThrow('не может быть родителем самого себя')
    })

    it('updateItem запрещает переносить элемент в собственного потомка', () => {
      const store = createStore()

      expect(() =>
        store.updateItem({ id: '91064cee', parent: 7, label: 'Айтем 2' }),
      ).toThrow('нельзя переместить в собственного потомка')
    })
  })
})
