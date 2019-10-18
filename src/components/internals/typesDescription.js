const typesDescription = {
  Object: {
    display: "{}",
    component: "jsonAttributeEditor",
    badge: "badge-info"
  },
  Array: {
    display: "[]",
    component: "jsonAttributeEditor",
    badge: "badge-warning"
  },
  Number: {
    display: "#",
    component: "numberAttributeEditor",
    badge: "badge-secondary"
  },
  String: {
    display: "T",
    component: "stringAttributeEditor",
    badge: "badge-success"
  },
  Boolean: {
    display: `\u2713`,
    component: "booleanAttributeEditor",
    badge: "badge-primary"
  },
  Function: {
    display: "f(x)",
    component: "functionAttributeEditor",
    badge: "badge-danger"
  }
};

export default typesDescription;
