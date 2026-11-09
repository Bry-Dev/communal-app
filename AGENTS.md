# User preferences

- Work efficiently and minimize token usage. Read only relevant file sections or diffs, keep tool output bounded, and keep progress updates and final replies concise.
- For small styling or copy changes, inspect the changed code; normally do not run tests, Svelte checks, or a production build.
- For behavior changes, run only the relevant tests or checks.
- Run a full test suite or production build only when the scope warrants it (for example, deployment, configuration, dependencies, routing, bundling, or broader integration changes), or when the user requests it.
- Avoid repeating successful checks unless further changes or unresolved issues justify another run.
