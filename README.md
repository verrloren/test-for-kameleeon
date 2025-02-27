Запуск проекта:
bun i && bun run dev


Фотографии с запущеного проекта:
Фильтры: ![image](https://github.com/user-attachments/assets/c7fc214f-24b2-4b5a-bc73-73a9ee785a66)
Поиск: ![image](https://github.com/user-attachments/assets/43d55ad8-bd32-449c-af33-15c5f36507de)
Динамичный роутинг /finalize/{testId}: ![image](https://github.com/user-attachments/assets/9418a5b8-a319-4368-b4d7-6a7163ef023a)


Архитектура:
Проект следует архитектуре Feature-Sliced Design (FSD), разделяя обязанности по доменам (например, features/table/api/hooks/use-get-sites.tsx) и UI-компонентам (например, widgets/table/ui/table.tsx, widgets/header/ui/header.tsx).

Стилизация:
Для стилизации компонентов используются SCSS-модули. Например, стиль компонента загрузчика определён в shared/ui/loader.module.scss, а стили компонента таблицы — в widgets/table/ui/table.module.scss.

Интеграция с API:
API-запросы выполняются с использованием кастомного jsonApiInstance, определённого в shared/api/api-instance.ts. Функциональность таблицы использует API-хуки из папки features/table/api/hooks.

Роутинг:
Для маршрутизации используется React Router. Маршруты определены в app/App.tsx. Страницы собраны в pages.
