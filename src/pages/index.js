import phimmoi from './phimmoi'
import a47 from './anime47'

exports.search = (query) => {
  return Promise.all([
    // phimmoi.search(query),
    a47.search(query)
  ]).then(result => {
    return result.reduce(
      (acc, cur) => acc.concat(cur), []
    )
  })
}
