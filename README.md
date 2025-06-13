# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# EventsWebAppWithReactQuery
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

# EventsWebAppWithReactQuery

## What is TanStack Query?

TanStack Query (formerly React Query) is a powerful data-fetching and state management library for React applications. It simplifies fetching, caching, synchronizing, and updating server state in your UI.

### Key Features

- **Data Fetching:** Easily fetch data from APIs and keep it in sync with your UI.
- **Caching:** Automatically caches data to avoid unnecessary network requests.
- **Background Updates:** Keeps data fresh by refetching in the background.
- **Automatic Retries:** Retries failed requests automatically.
- **Devtools:** Provides helpful devtools for debugging queries.

### Example Usage

Below is a simple example of how to use TanStack Query to fetch data in a React component:

```jsx
import { useQuery } from '@tanstack/react-query';

function Users() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: () =>
            fetch('https://jsonplaceholder.typicode.com/users').then(res =>
                res.json()
            ),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {data.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```

In this example:

- `useQuery` is used to fetch a list of users from an API.
- The hook manages loading and error states automatically.
- Data is cached and kept up-to-date by TanStack Query.

---

For more information, visit the [TanStack Query documentation](https://tanstack.com/query/latest).
tanstack Query