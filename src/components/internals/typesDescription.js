const typesDescription = {
  Object: {
    display: "{}",
    component: "jsonAttributeEditor"
  },
  Array: {
    display: "[]",
    component: "jsonAttributeEditor"
  },
  Number: {
    display: "09",
    component: "numberAttributeEditor"
  },
  String: {
    display: '"',
    component: "stringAttributeEditor"
  },
  Boolean: {
    display: "01",
    component: "booleanAttributeEditor"
  },
  Function: {
    display: "fx",
    component: "functionAttributeEditor"
  }
};

export default typesDescription;
