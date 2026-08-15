# LOGIC SMART HOUSE

Интеллектуальная экосистема управления умным домом на базе **Loxone**. Современный landing page для демонстрации возможностей автоматизации частных домов, отелей и коммерческих зданий.

![Status](https://img.shields.io/badge/Status-Active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)

## О проекте

**LOGIC SMART HOUSE** — комплексное решение для умного дома с использованием технологии Loxone. Сайт демонстрирует возможности системы:

- Управление климатом и энергопотреблением
- Интеллектуальное освещение
- Безопасность и контроль доступа
- Мультирумная аудиосистема
- Решения для отелей и бизнеса
- Удаленное управление через приложение

## Структура проекта

```
logic-smart-house/
├── index.html          # Главный HTML файл сайта
├── favicon.ico         # Иконка сайта
├── server.py           # Flask-сервер (API + раздача статики)
├── pyproject.toml      # Зависимости проекта (uv)
├── requirements.txt    # Зависимости (pip)
├── DEPLOY.md           # Инструкции по деплою
├── QUICKSTART.md       # Быстрый старт
├── assets/
│   ├── logo.png
│   ├── smart-house-hero.png
│   ├── circuit-bg.png
│   ├── circuit-pattern.svg
│   └── images/         # Изображения проекта
├── css/
│   └── style.css       # Дополнительные стили
└── js/
    └── main.js         # Дополнительные скрипты
```

## Быстрый старт

### Вариант 1: Открыть напрямую в браузере

Просто откройте `index.html` в браузере — сайт работает без сервера (форма обратной связи не будет отправлять данные без бэкенда).

### Вариант 2: Запустить с Flask-сервером

Сервер обеспечивает работу API для формы обратной связи (отправка в Telegram).

#### Через pip

```bash
git clone https://github.com/your-username/logic-smart-house.git
cd logic-smart-house

python -m venv .venv
source .venv/bin/activate      # Linux/Mac
# .venv\Scripts\activate       # Windows

pip install -r requirements.txt

# Задайте токен Telegram-бота (опционально)
export TELEGRAM_BOT_TOKEN=your_token_here

python server.py
```

#### Через uv (рекомендуется)

```bash
git clone https://github.com/your-username/logic-smart-house.git
cd logic-smart-house

uv sync
export TELEGRAM_BOT_TOKEN=your_token_here
uv run python server.py
```

Сайт будет доступен по адресу: `http://localhost:5000`

### Вариант 3: GitHub Pages (статика)

Сайт можно разместить на GitHub Pages как статический. Зайдите в **Settings → Pages** вашего репозитория и выберите ветку `main` как источник.

```
https://your-username.github.io/logic-smart-house/
```

> Форма обратной связи в режиме GitHub Pages работать не будет — нужен сервер.

## Настройка Telegram-уведомлений

Форма на сайте отправляет заявки в Telegram-бот. Для настройки:

1. Создайте бота через [@BotFather](https://t.me/BotFather) и получите токен.
2. Задайте переменную окружения `TELEGRAM_BOT_TOKEN`.
3. В `server.py` укажите ваш `TELEGRAM_CHAT_ID`.

```bash
export TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyz
```

## Деплой на продакшн

Для деплоя используйте Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 server:app
```

Подробные инструкции по деплою на различные платформы — в файле [DEPLOY.md](DEPLOY.md).

## Технологии

- **HTML5** — семантическая разметка
- **CSS3** — CSS Grid, Flexbox, анимации
- **JavaScript (Vanilla)** — интерактивность без фреймворков
- **Python / Flask** — бэкенд-сервер и API
- **Google Fonts** — шрифт Montserrat

## Цветовая схема

```css
--neon:  #F5A623;   /* Оранжевый акцент */
--green: #2d8a45;   /* Основной зеленый */
--bg:    #0a1a0c;   /* Темный фон */
--text:  #e8f5ea;   /* Светлый текст */
```

## Адаптивность

Сайт полностью адаптирован для:
- Desktop (> 1200px)
- Laptop (768px – 1200px)
- Tablet (481px – 768px)
- Mobile (< 480px)

## Лицензия

Проект разработан для **LOGIC SMART HOUSE**. Все права защищены.

## Контакты

- **Email:** info@logicsmarthouse.com
