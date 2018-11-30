# ComponentFixture

[![CircleCI](https://circleci.com/gh/David-Desmaisons/ComponentFixture.svg?style=shield)](https://circleci.com/gh/David-Desmaisons/ComponentFixture)
[![Coverage](https://codecov.io/gh/David-Desmaisons/ComponentFixture/branch/master/graph/badge.svg)](https://codecov.io/gh/David-Desmaisons/ComponentFixture)
[![GitHub open issues](https://img.shields.io/github/issues/David-Desmaisons/ComponentFixture.svg?maxAge=20)](https://github.com/David-Desmaisons/ComponentFixture/issues)
[![Npm version](https://img.shields.io/npm/v/component-fixture.svg?maxAge=20)](https://www.npmjs.com/package/component-fixture)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/ComponentFixture.svg)](https://github.com/David-Desmaisons/ComponentFixture/blob/master/LICENSE)

## Demo

https://david-desmaisons.github.io/ComponentFixture/

## Description

Component is designed to receive any component you want to test as a default slot

```HTML
<component-fixture>

  <!-- Use the default slot to create the component under test -->
  <component-under-test/>

  <!-- Use this slot to enable edition of props values, Editor is provided by this lib-->
  <Editor slot="control" slot-scope="scope" v-bind="scope"/>

</component-fixture>
```
Component-fixture will automatically:
  - Mirror all the props of the tested component
  - Bind this data to the component under-test
  - Display all the props in a form so that it is possible to edit them

Features:
  - Respect props type and use custom input for each type
  - Provide input for objects and function
  - Create `v-model` binding if needed
  - Custom props validation when available
  - Support component with slots


Example using [vue-slider-component](https://github.com/NightCatSama/vue-slider-component):

![demo](./doc-images/example.png)


## Uses cases

Why would you need such a component?

`ComponentFixture` is intended to be used only in a test/dev context with two main applications.

### Discovering third party component
  - Explore Interactively a component you are willing to use in your application.
  - Understand by example what the props role.
  - Quickly identify bugs and limitation on the component. 


### Testing a component you creates 
  - Create an example usage of your component that will update automatically
  - Interact with the component while you create it.
  - Easily identify bugs

## Next steps

- Monkey testing: use randomly generated updates on component props.

This will be provided on next major version.

## Example usage

```HTML
<component-fixture>

  <!-- Use the default slot to create the component under test -->
  <component-under-test></component-under-test>

  <!-- Use this slot to enable edition of props values -->
  <editor slot="control" slot-scope="scope" v-bind="scope">
  </editor>

</component-fixture>
```

```javascript
import { ComponentFixture, Editor } from 'component-fixture'
import { componentUnderTest } from 'componentUnderTest'

export default {
  components: {
    ComponentFixture,
    componentUnderTest,
    Editor
  }
}
```

## Installation

```
npm install ComponentFixture
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Run your unit tests

```
npm run test:unit
```

### Update the API section of README.md with generated documentation

```
npm run doc:build
```

### Run style guide dev server

```
npm run styleguide
```

### Generate a static HTML style guide

```
npm run styleguide:build
```
