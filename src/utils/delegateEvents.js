function delegateEvents(eventsName) {
  return eventsName.reduce((acc, name) => {
    acc[name] = function(arg) {
      this.$emit(name, arg);
    };
    return acc;
  }, {});
}

export { delegateEvents };
