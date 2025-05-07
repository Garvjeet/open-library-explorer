
# Open Library Explorer


## Clone Project

Clone project from github:

```bash
git clone git@github.com:Garvjeet/open-library-explorer.git
```

## Steps to setup the backend server:
```bash
cd backend
npm install
```

#### Create Sample dataset by running this command in backend directory: 
```bash
node scripts/generate-db.js
```

#### Run server: 
```bash
npm run dev
```

## Steps to setup the frontend:
```bash
cd frontend
npm install
```

#### Run frontend locally: 
```bash
npm run dev
```
## API Reference

#### Get Books List (paginated)

```http
  GET /books
```

| Query Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page`    | `number` | *Optional*. Pagination offset |
| `limit` | `number` | *Optional*. Pagination limit |
| `genre` | `string` | *Optional*. Genre name. |
| `author` | `string` | *Optional*. Book's Author. |
| `publishedYear` | `number` | *Optional*. Book published year. |

By default the pagination limit is set to 12.

#### Get Book by ID

```http
  GET /books/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of book to fetch |

#### Get All Genres

```http
  GET /genre
```
No Parameters are required for this API.




## System design explanation and decisions

### Backend:

- A **custom in-memory database** is implemented to simulate real-world database behavior.
- The database is instantiated when the server starts, and is populated with data from `books.json` located in the `data/` directory.
- A script named `generate-db.js` is used to generate 1,000 book records using static sample data from `mock-books-data.js`. Each book includes a dynamic placeholder image containing its book ID.
- Upon initialization, indexes on `genre`, `author`, and `publishedYear` are created using JavaScript’s `Map` data structure for constant-time lookups. Currently, only the genre index is utilized to fetch all genres.
- A caching mechanism is implemented using **dynamic cache keys** based on filter values. Keys follow the format `${author}-${genre}-${publishedYear}`. The key generation method auto-handles additional filters by sorting keys lexicographically and joining them with hyphens.
- When fetching data, the database first checks the cache. If the data is cached, it serves it immediately, bypassing additional filtering or sorting. Otherwise, it computes and caches the result.
- (Optional for scale) A **timestamp-based cache eviction policy** can be added to manage memory usage efficiently.
- Code organization follows a clean modular structure:
   * Constants are in the `constants/` folder.
   * Routes are modularized in the `routes/` directory.

---

### Frontend:

- The frontend is built using **Vue 3 with Vite**, which ensures fast development and optimized production builds through tree-shaking.
- The codebase maintains clean separation:

   * Pages and components are stored in dedicated folders.
   * Subfolders (e.g., `components/books/`) are used to logically group related components.
- **Client-side pagination** is supported via a "Load More" button, fetching paginated book data from the API.
- While images load, an animated placeholder is displayed to prevent layout shifts and improve perceived performance.
- A centralized store (like Vuex or Pinia) is intentionally not used to keep things lightweight—data sharing between components is minimal and doesn’t justify the added complexity or bundle size.
- Lazy-loading of components is not implemented since the UI is simple and all core components load above-the-fold (e.g., cards, search bar).
- All API interactions are centralized in `services/api.js` for consistency and maintainability.
- **Tailwind CSS** is used for rapid UI development:

   * Provides utility-first classes for cleaner HTML.
   * Enables easy theming and customizations using global config.

---
