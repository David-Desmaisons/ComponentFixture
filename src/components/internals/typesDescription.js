const typesDescription = {
  Object: {
    display: "{}",
    component: "jsonAttributeEditor",
    badge: "badge-warning"
  },
  Array: {
    display: "[]",
    component: "jsonAttributeEditor",
    badge: "badge-warning"
  },
  Number: {
    display: "09",
    component: "numberAttributeEditor",
    badge: "badge-secondary"
  },
  String: {
    display: '"',
    component: "stringAttributeEditor",
    badge: "badge-primary"
  },
  Boolean: {
    display: "01",
    component: "booleanAttributeEditor",
    badge: "badge-primary"
  },
  Function: {
    display: "fx",
    component: "functionAttributeEditor",
    badge: "badge-danger"
  }
};

export default typesDescription;
