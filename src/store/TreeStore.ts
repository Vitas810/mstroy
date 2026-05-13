type TreeItemId = string | number

type TreeItem = {
    id: TreeItemId,
    parent: TreeItemId | null,
    label: string,
}

export class TreeStore {
    private items: TreeItem[]
    private itemMap = new Map<TreeItemId, TreeItem>()
    private childrenMap = new Map<TreeItemId | null, TreeItem[]>()

    constructor(items: TreeItem[]) {
        this.items = items

        for (const item of items) {
            this.itemMap.set(item.id, item)

            const children: TreeItem[] = this.childrenMap.get(item.parent) ?? []

            children.push(item)

            this.childrenMap.set(item.parent, children)
        }
    }

    // Получение всех элементов
    getAll():readonly TreeItem[] {
        return this.items
    }

    // Получаем конкретный элемент по id
    getItem(id: TreeItemId) {
        return this.itemMap.get(id)
    }

    // Получаем прямых детей
    getChildren(id: TreeItemId) {
        return this.childrenMap.get(id) ?? []
    }

    // Получаем всех детей
    getAllChildren(id: TreeItemId): TreeItem[] {
        const result: TreeItem[] = []
        const stack: TreeItem[] = []

        for (const child of this.getChildren(id)) {
            stack.push(child)
        }

        while (stack.length) {
            const current = stack.pop()!

            result.push(current)

            for (const child of this.getChildren(current.id)) {
                stack.push(child)
            }
        }

        return result
    }

    // Получаем цепочку родительских элементов с сохранением порядка
    getAllParents(id: TreeItemId) {
        const result: TreeItem[] = []

        let current: TreeItem | undefined = this.itemMap.get(id)

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
    addItem(item: TreeItem): void {
        this.items.push(item)
        this.itemMap.set(item.id, item)

        const children = this.childrenMap.get(item.parent) ?? []
        children.push(item)
        this.childrenMap.set(item.parent, children)
    }

    // Удаляем элемент
    removeItem(id: TreeItemId): void {
        const itemsToRemove: TreeItem[] = []

        const currentItem = this.getItem(id)

        if (!currentItem) {
            return
        }

        itemsToRemove.push(currentItem)

        for (const child of this.getAllChildren(id)) {
            itemsToRemove.push(child)
        }

        for (const item of itemsToRemove) {
            this.itemMap.delete(item.id)
            this.childrenMap.delete(item.id)

            const children = this.childrenMap.get(item.parent)

            if (!children) {
                continue
            }

            const index = children.findIndex(
                current => current.id === item.id,
            )

            if (index !== -1) {
                children.splice(index, 1)
            }
        }

        this.items = this.items.filter(
            item => this.itemMap.has(item.id),
        )
    }

    // Обновляем элемент
    updateItem(item: TreeItem): void {
        const currentItem = this.getItem(item.id)

        if (!currentItem) {
            return
        }

        this.itemMap.set(item.id, item)

        const children =
            this.childrenMap.get(currentItem.parent) ?? []

        const index = children.findIndex(
            current => current.id === item.id,
        )

        if (index !== -1) {
            children.splice(index, 1)
        }

        const nextChildren =
            this.childrenMap.get(item.parent) ?? []

        nextChildren.push(item)

        this.childrenMap.set(item.parent, nextChildren)

        this.items = this.items.map(current =>
            current.id === item.id
                ? item
                : current,
        )
    }
}