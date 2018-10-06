# ComponentFixture

[![CircleCI](https://circleci.com/gh/David-Desmaisons/ComponentFixture.svg?style=shield)](https://circleci.com/gh/David-Desmaisons/ComponentFixture)
[![Coverage](https://codecov.io/gh/David-Desmaisons/ComponentFixture/branch/master/graph/badge.svg)](https://codecov.io/gh/David-Desmaisons/ComponentFixture)
[![GitHub open issues](https://img.shields.io/github/issues/David-Desmaisons/ComponentFixture.svg?maxAge=20)](https://github.com/David-Desmaisons/ComponentFixture/issues)
[![Npm version](https://img.shields.io/npm/v/component-fixture.svg?maxAge=20)](https://www.npmjs.com/package/component-fixture)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/ComponentFixture.svg)](https://github.com/David-Desmaisons/ComponentFixture/blob/master/LICENSE)

## Demo

https://david-desmaisons.github.io/ComponentFixture/

## Usage

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

## API

### component-fixture 

#### data 

- `componentName` 

  The component under test name. 

**initial value:** `null` 

- `dynamicAttributes` 

  This object will contain all the props to be bound with the component under test.
  after initialization. 

**initial value:** `[object Object]` 

- `propsDefinition` 

  This object will contain the props definition as declared in the component under test. 

**initial value:** `[object Object]` 

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
