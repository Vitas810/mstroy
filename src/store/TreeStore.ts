import type { TreeItemId, TreeNodeBase } from '@/types/tree'

export class TreeStore<T extends TreeNodeBase> {
  private items: T[]
  private readonly itemMap = new Map<TreeItemId, T>()
  private readonly itemIndexMap = new Map<TreeItemId, number>()
  private readonly childrenMap = new Map<TreeItemId | null, T[]>()
  private readonly emptyChildren: T[] = []

  constructor(items: T[]) {
    this.items = [...items]

    for (const [index, node] of this.items.entries()) {
      if (this.itemMap.has(node.id)) {
        throw new Error(`Элемент с id "${String(node.id)}" уже существует`)
      }

      this.itemMap.set(node.id, node)
      this.itemIndexMap.set(node.id, index)
    }

    for (const node of this.items) {
      this.validateParent(node)

      const children = this.childrenMap.get(node.parent) ?? []
      children.push(node)
      this.childrenMap.set(node.parent, children)
    }
  }

  getAll(): T[] {
    return this.items
  }

  getItem(id: TreeItemId): T | undefined {
    return this.itemMap.get(id)
  }

  getChildren(id: TreeItemId): T[] {
    return this.childrenMap.get(id) ?? this.emptyChildren
  }

  getAllChildren(id: TreeItemId): T[] {
    const allChildren: T[] = []
    const stack: T[] = []
    const children = this.childrenMap.get(id)

    if (children) {
      for (let index = children.length - 1; index >= 0; index--) {
        stack.push(children[index])
      }
    }

    while (stack.length > 0) {
      const node = stack.pop()

      if (!node) {
        continue
      }

      allChildren.push(node)

      const nestedChildren = this.childrenMap.get(node.id)

      if (!nestedChildren) {
        continue
      }

      for (let index = nestedChildren.length - 1; index >= 0; index--) {
        stack.push(nestedChildren[index])
      }
    }

    return allChildren
  }

  getAllParents(id: TreeItemId): T[] {
    const parents: T[] = []
    let node = this.itemMap.get(id)

    while (node) {
      parents.push(node)

      if (node.parent === null) {
        break
      }

      node = this.itemMap.get(node.parent)
    }

    return parents
  }

  addItem(item: T): void {
    if (this.itemMap.has(item.id)) {
      throw new Error(`Элемент с id "${String(item.id)}" уже существует`)
    }

    this.validateParent(item)

    this.items.push(item)
    this.itemMap.set(item.id, item)
    this.itemIndexMap.set(item.id, this.items.length - 1)
    this.appendChildToParent(item)
  }

  removeItem(id: TreeItemId): void {
    const rootNode = this.itemMap.get(id)

    if (!rootNode) {
      return
    }

    const stack: T[] = [rootNode]
    const idsToDelete = new Set<TreeItemId>()

    while (stack.length > 0) {
      const node = stack.pop()

      if (!node) {
        continue
      }

      idsToDelete.add(node.id)

      const children = this.childrenMap.get(node.id)

      if (!children) {
        continue
      }

      for (let index = children.length - 1; index >= 0; index--) {
        stack.push(children[index])
      }
    }

    this.removeChildFromParent(rootNode)

    for (const itemId of idsToDelete) {
      this.childrenMap.delete(itemId)
      this.itemMap.delete(itemId)
    }

    const nextItems: T[] = []

    for (const item of this.items) {
      if (!idsToDelete.has(item.id)) {
        nextItems.push(item)
      }
    }

    this.items = nextItems
    this.rebuildItemIndexMap()
  }

  updateItem(item: T): void {
    const currentNode = this.itemMap.get(item.id)

    if (!currentNode) {
      throw new Error(`Элемент с id "${String(item.id)}" не найден`)
    }

    this.validateParent(item, currentNode.id)

    if (currentNode.parent !== item.parent) {
      this.removeChildFromParent(currentNode)
      this.appendChildToParent(item)
    } else {
      this.replaceChildInParent(item)
    }

    this.itemMap.set(item.id, item)

    const itemIndex = this.itemIndexMap.get(item.id)

    if (itemIndex !== undefined) {
      this.items[itemIndex] = item
    }
  }

  private appendChildToParent(item: T): void {
    const children = this.childrenMap.get(item.parent) ?? []
    children.push(item)
    this.childrenMap.set(item.parent, children)
  }

  private removeChildFromParent(item: T): void {
    const children = this.childrenMap.get(item.parent)

    if (!children) {
      return
    }

    const nodeIndex = children.findIndex((child) => child.id === item.id)

    if (nodeIndex !== -1) {
      children.splice(nodeIndex, 1)
    }

    if (children.length === 0) {
      this.childrenMap.delete(item.parent)
    }
  }

  private replaceChildInParent(item: T): void {
    const children = this.childrenMap.get(item.parent)

    if (!children) {
      return
    }

    const nodeIndex = children.findIndex((child) => child.id === item.id)

    if (nodeIndex !== -1) {
      children[nodeIndex] = item
    }
  }

  private validateParent(item: T, movedItemId: TreeItemId | null = null): void {
    if (item.parent === null) {
      return
    }

    if (item.parent === item.id) {
      throw new Error(
        `Элемент "${String(item.id)}" не может быть родителем самого себя`
      )
    }

    if (!this.itemMap.has(item.parent)) {
      throw new Error(
        `У элемента "${String(item.id)}" не найден родитель "${String(item.parent)}"`
      )
    }

    if (
      movedItemId !== null &&
      this.parentChainIncludes(item.parent, movedItemId)
    ) {
      throw new Error(
        `Элемент "${String(movedItemId)}" нельзя переместить в собственного потомка`
      )
    }
  }

  private parentChainIncludes(
    startParentId: TreeItemId,
    targetId: TreeItemId
  ): boolean {
    let parent = this.itemMap.get(startParentId)

    while (parent) {
      if (parent.id === targetId) {
        return true
      }

      if (parent.parent === null) {
        return false
      }

      parent = this.itemMap.get(parent.parent)
    }

    return false
  }

  private rebuildItemIndexMap(): void {
    this.itemIndexMap.clear()

    for (let index = 0; index < this.items.length; index++) {
      this.itemIndexMap.set(this.items[index].id, index)
    }
  }
}
