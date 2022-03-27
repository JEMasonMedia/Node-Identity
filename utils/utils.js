const Utils = {
  objectOmit: (obj, omitKey) => {
    return Object.keys(obj).reduce((result, key) => {
      if (key !== omitKey) {
        result[key] = obj[key]
      }
      return result
    }, {})
  },
}

// module.exports = Utils
export default Utils
