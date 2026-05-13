# Тестовое задание `mstroy`

Проект реализует класс `TreeStore` на TypeScript для работы с древовидной структурой данных и Vue-компонент на базе `AgGrid Enterprise` для отображения этих данных в виде таблицы с раскрывающимися группами.

## Что реализовано

- Класс `TreeStore`, принимающий массив элементов с полями `id` и `parent`.
- Поддержка идентификаторов типов `string | number`.
- Методы `getAll`, `getItem`, `getChildren`, `getAllChildren`, `getAllParents`, `addItem`, `removeItem`, `updateItem`.
- Vue-компонент с древовидным отображением элементов через `AgGrid`.
- Определение категории строки по наличию дочерних элементов: `Группа` или `Элемент`.
- Отображение порядкового номера строки в колонке `№ п/п`.
- Unit-тесты для `TreeStore` и для компонента таблицы.

## Запуск

Установка зависимостей:

```bash
npm install
```

Запуск dev-сервера:

```bash
npm run dev
```

Запуск тестов:

```bash
npm test
```

Сборка проекта:

```bash
npm run build
```

## Структура

- [src/store/TreeStore.ts](</Users/bazon/Desktop/ проекты/mstroy/src/store/TreeStore.ts>) — реализация хранилища дерева и всех операций над элементами.
- [src/components/TreeGrid.vue](</Users/bazon/Desktop/ проекты/mstroy/src/components/TreeGrid.vue>) — Vue-компонент таблицы на `AgGrid`.
- [src/types/tree.ts](</Users/bazon/Desktop/ проекты/mstroy/src/types/tree.ts>) — общие типы для элементов дерева и строк таблицы.
- [tests/](</Users/bazon/Desktop/ проекты/mstroy/tests>) — unit-тесты для хранилища и компонента.

## Проверка

- Для визуальной проверки интерфейса запустите `npm run dev` и откройте приложение в браузере.
- Для проверки логики и регрессий запустите `npm test`.
- Для проверки корректности типизации и production-сборки запустите `npm run build`.
- Успешная проверка предполагает, что тесты проходят, а сборка завершается без ошибок.

## Примечания

- Для древовидной группировки используется пакет `ag-grid-enterprise` в ознакомительном режиме.
- Текущий демонстрационный набор данных находится в [src/store/treeItems.ts](</Users/bazon/Desktop/ проекты/mstroy/src/store/treeItems.ts>).
