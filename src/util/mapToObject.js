module.exports = map => {
  return [...map].reduce((l, [k, v]) => Object.assign(l, { [k]: v }), {});
};
