import type { DemoTreeItem, TreeGridRow, TreeRowCategory } from '@/types/tree'

// Подготавливает плоский список строк для AgGrid treeData с путями по дереву и вычисленной категорией.
export function buildTreeGridRows(items: DemoTreeItem[]): TreeGridRow[] {
  const itemById = new Map(items.map(item => [item.id, item] as const))
  const childCountByParent = new Map<DemoTreeItem['parent'], number>()
  const pathById = new Map<DemoTreeItem['id'], string[]>()

  for (const item of items) {
    childCountByParent.set(item.parent, (childCountByParent.get(item.parent) ?? 0) + 1)
  }

  for (const item of items) {
    const path: string[] = []
    let current: DemoTreeItem | undefined = item

    while (current) {
      path.push(current.label)
      current = current.parent === null ? undefined : itemById.get(current.parent)
    }

    pathById.set(item.id, path.reverse())
  }

  return items.map((item) => {
    const category: TreeRowCategory = (childCountByParent.get(item.id) ?? 0) > 0
      ? 'Группа'
      : 'Элемент'

    return {
      ...item,
      path: pathById.get(item.id) ?? [item.label],
      category,
    }
  })
}
