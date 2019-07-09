# Findify + Next.js + Moltim demo store

Simple preview of how to use default Findify setup in React SPA based stores

## 🛠 Setup

> `yarn & yarn dev` or `npm i & npm run dev`

## 👀 Points of interest

- `./components/Layout.js:38`
> Add the link to Findify script in your Header with `async/defer` props

- `./components/Findify.js`
> The findify component which waits for script load and renders widgets. Check the file, props are described there.

- `./components/Header.js`
> Wrap input in Findify component and write Ref access function

- [`./pages/product.js`](http://localhost:3000/product?id=19f14ec4-959f-495d-9fa8-bca93bfd15f0)
> The recommendations for product 
> Send "view-page" event to Findify Analytics
