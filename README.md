# ipyvuelink-example-1


![](img/ipyvuelink-example-3.png)


## 1 - Bootstapping

This project is generated via [@vue/cli](https://cli.vuejs.org/) with the following manually selected features:

- Babel
- Linter/Formatter
- ESLint + Prettier
- Lint on save
- config in dedicated files

Then the following extra configuration was applied:


- add plugin `vue add xxx`:
  - bootstrap-vue

- add packages `yarn add xxx`:
  - topojson-client
  - d3-fetch
  - d3-transition
  - d3-geo

- add dev packages `yarn add -D xxx`:
  - @vue/eslint-config-prettier
- [.eslintrc.js](.eslintrc.js) extra config - see comments
- [.prettierrc.js](.prettierrc.js) extra config - see comments
- [vue.config.js](.prettierrc.js) extra config - see comments

_Tip_: With VSCode create a custom shortcut for doc formatting different from the standard `Alt+Shift+F` (say `Alt+Shift+G`) to avoid conflicts.

## 2 - Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Try it
```
$ ipyvuelink/cli install-dev
$ jupyter notebook Example3.ipynb
```