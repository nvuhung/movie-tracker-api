exports.asyncFunc = cb => {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        resolve(await cb);
      } catch (error) {
        reject(error)
      }
    })();
  })
}
