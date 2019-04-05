const typesDescription = {
  Object: {
    display: "Obj",
    component: "jsonAttributeEditor",
    badge: "badge-info"
  },
  Array: {
    display: "Arr",
    component: "jsonAttributeEditor",
    badge: "badge-warning"
  },
  Number: {
    display: "Num",
    component: "numberAttributeEditor",
    badge: "badge-secondary"
  },
  String: {
    display: 'Str',
    component: "stringAttributeEditor",
    badge: "badge-success"
  },
  Boolean: {
    display: "Bool",
    component: "booleanAttributeEditor",
    badge: "badge-primary"
  },
  Function: {
    display: "Func",
    component: "functionAttributeEditor",
    badge: "badge-danger"
  }
};

export default typesDescription;
