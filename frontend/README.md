# Подготовка

Проект создан на основе https://github.com/MVVladimir/magician-frontend
Для удобства запуска, проект использует мои личные ключи. Если вы не являетесь участником команды, пожалуйста, задайте собственные.

## Установка ключей

1) Перейдите по ссылке: https://developers.sber.ru/studio/settings/emulator
2) Сгенерируйте и скопируйте ключ
3) В файле .env установите ключи и название вашего проекта:

```
REACT_APP_TOKEN="ВАШ_КЛЮЧ"
REACT_APP_SMARTAPP="ВАШЕ_НАЗВАНИЕ"
```

## Установка Node.js

Прежде всего, необходимо установить Node.js, вы можете скачать его на официальном сайте: https://nodejs.org/


# Запуск

## Веб-приложение

Для запуска, будучи в директории проекта, напишите в консоли:

```
npm start
```

## Бэкенд

Для подключения к собственному серверу, необходимо изменить адрес в файле https://github.com/MiiMan/psytest-smartapp/blob/master/src/services/APIHelper.js


# Создание собственного бэкенд сервера

Используете этот проект: https://github.com/MVVladimir/magician-backend
