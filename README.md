# SAN HYDRO ENERGY — веб-сайт

Многоязычный (UZ / RU / EN) маркетинговый сайт компании **SAN HYDRO ENERGY**
(капельное орошение хлопка + мини ГЭС, Гулистан) со встроенным
**онлайн-магазином**, который работает поверх публичного **storefront API DukOnline**.

Только фронтенд — бэкенд DukOnline не изменяется. Магазин ходит в storefront API
через прокси-роуты Next.js, поэтому ключ `sk_live_...` никогда не попадает в браузер.

## Стек
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Шрифты: Oswald (заголовки), Manrope (текст), JetBrains Mono (коды) — с кириллицей
- lucide-react (иконки)

## Запуск
```bash
npm install
npm run dev     # http://localhost:3000  (в разработке использовался порт 3007)
npm run build && npm start
```
Бэкенд для магазина должен быть доступен по адресу из `STOREFRONT_API_BASE`.

## Переменные окружения (`.env.local`) — только сервер
```
STOREFRONT_API_BASE=https://api.dukonline.uz/api
STOREFRONT_KEY=sk_live_xxxxxxxx
```
Сейчас временно указан **демо-магазин на локальном бэкенде** (`localhost:8001`,
ключ `sk_live_demo_38201b46`), чтобы витрина работала.
Реальный ключ `sk_live_695ea4e16a_86552f95` пока отклоняется API (401):
для него нужно включить storefront (`storefront_enabled=True`) у организации на
проде. Когда включат — раскомментируйте боевые строки в `.env.local`.

## Структура
```
src/
  app/
    [locale]/            landing (page), about, solutions, contact,
                         shop, shop/cart, account
    api/shop/            прокси к storefront: info, products, orders, login, customer
  components/
    layout/              Header, Footer, LanguageSwitcher
    home/                ContactForm (WhatsApp), Faq
    shop/                ShopClient, ProductCard, CartClient
    account/             AccountClient (вход по ID клиента)
    providers/           CartProvider, CustomerProvider (localStorage)
    ui/                  Reveal (scroll-анимации), LangSetter
  lib/
    i18n/                config + dictionaries (uz/ru/en)
    shop/                types, server (sfFetch), client (fetch-обёртки)
    format.ts, site.ts   форматирование денег/дат, контакты
reference/public_html/   исходный старый PHP-сайт (только как источник контента)
public/img/              подобранные изображения из старого сайта
```

## Функции магазина
- Каталог из storefront API (поиск + фильтр по категориям, клиентская фильтрация).
- Корзина в localStorage, оформление заказа → `POST /storefront/orders/`.
- Цены с учётом валюты (UZS/USD) и ценового типа клиента (b2c/b2b), если он вошёл.
- **Вход по ID клиента (CUST-…)** → личный кабинет: баланс, долг, аванс,
  онлайн-заказы, покупки, платежи (`/storefront/login/` + `/storefront/customer/`).

## Что осталось (по мере готовности)
- Включить storefront для боевого ключа и переключить `.env.local`.
- Заменить плейсхолдер Telegram (`src/lib/site.ts`).
- amoCRM для лид-формы (сейчас форма уходит в WhatsApp).
# san-energy
