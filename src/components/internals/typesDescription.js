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
    display: "#",
    component: "numberAttributeEditor"
  },
  String: {
    display: "T",
    component: "stringAttributeEditor"
  },
  Boolean: {
    display: `\u2713`,
    component: "booleanAttributeEditor"
  },
  Function: {
    display: `\u0192` + "(x)",
    component: "functionAttributeEditor"
  }
};

export default typesDescription;
