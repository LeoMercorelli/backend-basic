# Proyecto Backend - Leonel Mercorelli

Este proyecto corresponde a la materia **Tecnicatura en Programación (UTN)** y utiliza Express, MongoDB y Socket.io.

## Requisitos
- Node.js
- Una base de datos MongoDB (Atlas o local)

## Puesta en marcha
```bash
git clone <URL>
cd <proyecto>
npm install
cp .env.example .env # completar MONGO_URL con tu cadena de conexión
npm start
```
El servidor se inicia en [http://localhost:8080/](http://localhost:8080/).

## Rutas principales
- `/api/products`
- `/api/carts`
- `/products`
- `/realtimeproducts`

### Carga de datos de ejemplo (opcional)
Si necesitas poblar la base con los productos del archivo `data/products.json` puedes ejecutar:
```bash
mongoimport --uri="$MONGO_URL" --collection products --file data/products.json --jsonArray
```

