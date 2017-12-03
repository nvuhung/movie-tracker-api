import phimmoi from './phimmoi'
import a47 from './anime47'
import qs from 'querystring'

const getProvider = p => {
  switch (p) {
    case 'PM':
      return phimmoi
    case 'A47':
      return a47
    default:
      return null
  }
}

exports.search = ({p, q}) => {
  const provider = getProvider(p)
  return provider ? Promise.resolve(provider.search(qs.escape(q))) : Promise.resolve([])
}

exports.save = ({p, url}) => {
  const provider = getProvider(p)
  return provider ? Promise.resolve(provider.save(url)) : Promise.reject()
}