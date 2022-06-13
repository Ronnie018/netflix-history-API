module.exports = (string) => {
  try {
    const res = string.split(" ").join("%20");
    return res
  } catch (e) {
    console.log('error on parsing query');
    console.log(e.message);
  }
};
