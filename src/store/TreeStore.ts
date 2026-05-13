export type TreeItemId = string | number

export type TreeNodeBase = {
    id: TreeItemId
    parent: TreeItemId | null
}

export class TreeStore<T extends TreeNodeBase> {
    private items: T[]
    private readonly itemMap = new Map<TreeItemId, T>()
    private readonly itemIndexMap = new Map<TreeItemId, number>()
    private readonly childrenMap = new Map<TreeItemId | null, T[]>()

    constructor(items: T[]) {
        this.items = items

        for (const item of this.items) {
            this.itemMap.set(item.id, item)
            this.itemIndexMap.set(item.id, this.itemIndexMap.size)
            this.addChildLink(item)
        }
    }

    // Получение всех элементов
    getAll(): readonly T[] {
        return this.items
    }

    // Получаем конкретный элемент по id
    getItem(id: TreeItemId): T | undefined {
        return this.itemMap.get(id)
    }

    // Получаем прямых детей
    getChildren(id: TreeItemId): T[] {
        return this.childrenMap.get(id) ?? []
    }

    // Получаем всех детей
    getAllChildren(id: TreeItemId): T[] {
        const result: T[] = []
        const stack = [...this.getChildren(id)]

        while (stack.length > 0) {
            const current = stack.pop()

            if (!current) {
                continue
            }

            result.push(current)
            stack.push(...this.getChildren(current.id))
        }

        return result
    }

    // Получаем цепочку родительских элементов с сохранением порядка
    getAllParents(id: TreeItemId): T[] {
        const result: T[] = []
        let current = this.itemMap.get(id)

        while (current) {
            result.push(current)

            if (current.parent === null) {
                break
            }

            current = this.itemMap.get(current.parent)
        }

        return result
    }

    // Добавляем элемент
    addItem(item: T): void {
        if (this.itemMap.has(item.id)) {
            this.updateItem(item)
            return
        }

        this.items.push(item)
        this.itemMap.set(item.id, item)
        this.itemIndexMap.set(item.id, this.items.length - 1)
        this.addChildLink(item)
    }

    // Удаляем элемент и всех его потомков
    removeItem(id: TreeItemId): void {
        const root = this.itemMap.get(id)

        if (!root) {
            return
        }

        const stack: T[] = [root]
        const idsToRemove: TreeItemId[] = []

        while (stack.length > 0) {
            const current = stack.pop()

            if (!current) {
                continue
            }

            idsToRemove.push(current.id)
            stack.push(...this.getChildren(current.id))
        }

        for (const itemId of idsToRemove) {
            const item = this.itemMap.get(itemId)

            if (!item) {
                continue
            }

            this.removeChildLink(item)
            this.childrenMap.delete(item.id)
            this.itemMap.delete(item.id)
            this.removeFromItems(item.id)
        }
    }

    // Обновляем элемент
    updateItem(item: T): void {
        const currentItem = this.itemMap.get(item.id)

        if (!currentItem) {
            return
        }

        if (currentItem.parent !== item.parent) {
            this.removeChildLink(currentItem)
            this.addChildLink(item)
        } else {
            const childrenOfParent = this.childrenMap.get(item.parent)

            if (childrenOfParent) {
                const index = childrenOfParent.findIndex(
                    current => current.id === item.id,
                )

                if (index !== -1) {
                    childrenOfParent[index] = item
                }
            }
        }

        this.itemMap.set(item.id, item)

        const itemIndex = this.itemIndexMap.get(item.id)

        if (itemIndex !== undefined) {
            this.items[itemIndex] = item
        }
    }

    private addChildLink(item: T): void {
        const children = this.childrenMap.get(item.parent) ?? []
        children.push(item)
        this.childrenMap.set(item.parent, children)
    }

    private removeChildLink(item: T): void {
        const childrenOfParent = this.childrenMap.get(item.parent)

        if (!childrenOfParent) {
            return
        }

        const index = childrenOfParent.findIndex(
            current => current.id === item.id,
        )

        if (index === -1) {
            return
        }

        childrenOfParent.splice(index, 1)

        if (childrenOfParent.length === 0) {
            this.childrenMap.delete(item.parent)
        }
    }

    private removeFromItems(id: TreeItemId): void {
        const index = this.itemIndexMap.get(id)

        if (index === undefined) {
            return
        }

        const lastIndex = this.items.length - 1
        const lastItem = this.items[lastIndex]

        if (index !== lastIndex && lastItem) {
            this.items[index] = lastItem
            this.itemIndexMap.set(lastItem.id, index)
        }

        this.items.pop()
        this.itemIndexMap.delete(id)
    }
}
