export type TreeItemId = string | number

export type TreeNodeBase = {
    id: TreeItemId
    parent: TreeItemId | null
}

export type DemoTreeItem = TreeNodeBase & {
    label: string
}

export type TreeRowCategory = 'Группа' | 'Элемент'

export type TreeGridRow = DemoTreeItem & {
    path: string[]
    category: TreeRowCategory
}
