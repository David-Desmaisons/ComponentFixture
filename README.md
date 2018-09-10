# ComponentFixture

[![CircleCI](https://circleci.com/gh/David-Desmaisons/ComponentFixture.svg?style=shield)](https://circleci.com/gh/David-Desmaisons/ComponentFixture)
[![GitHub open issues](https://img.shields.io/github/issues/David-Desmaisons/ComponentFixture.svg?maxAge=20)](https://github.com/David-Desmaisons/ComponentFixture/issues)
[![Npm version](https://img.shields.io/npm/v/ComponentFixture.svg?maxAge=20)](https://www.npmjs.com/package/ComponentFixture)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/ComponentFixture.svg)](https://github.com/David-Desmaisons/ComponentFixture/blob/master/LICENSE)

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
import { ComponentFixture, Editor } from 'ComponentFixture'
import { componentUnderTest } from 'componentUnderTest'

export default {
  components: {
    ComponentFixture,
    componentUnderTest
  }
}
```

## API

### component-fixture 

#### data 

- `componentName` 

  The component under test name. 

- `dynamicAttributes` 

  This object will contain all the props to be bound with the component under test.
  after initialization. 

- `propsDefinition` 

  This object will contain the props definition as declared in the component under test. 

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
