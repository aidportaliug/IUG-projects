# Coding Standards for React with TypeScript

Here are the coding standards we will follow for React with TypeScript in this project.

## Naming Conventions

- **Components name:**
    PascalCase:
- **Variables**:
    camelCase:
- **Other files:**
    camelCase
- **Global constants:**
    CAPITALIZED_SNAKE_CASE


## Code Style & Formatting: 
The source code is formatted with [Prettier](https://github.com/prettier/prettier), and uses [ESLint](https://github.com/eslint/eslint) for basic linting.
###Prettier
Use Prettier to autoformat your code.
It can be installed as a plugin in VS Code

### ESLint
Will be used to analyze the code for style and coding errors that may causes bugs.
To check for style and coding errors:
```bash
$ yarn lint
```
Alternatively you can also run `yarn lint:prettier` to run just Prettier, and `yarn lint:eslint` to run just ESLint.

To auto fix code style warnings and errors:
```bash
$ yarn lint:fix
```


## Testing

To run tests run
```bash
$ yarn test
```

## Documentation

Generate documentation page by running
```bash
$ yarn typedoc --out docs src
```
This will generate HTML files in [/docs](./docs).

## Further Reading

 - [React](https://reactjs.org/)
 - [React Cheatsheet](https://github.com/typescript-cheatsheets/react)
 - [React Boostrap](https://react-bootstrap.github.io/)
