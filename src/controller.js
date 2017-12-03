import pages from './pages'

const sendResponse = async(res, cb) => {
  try {
    const data = await cb
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(400).send({error})
  }
}

exports.search = (req, res) => {
  req.query
    ? sendResponse(res, pages.search(req.query))
    : res.json([])
}

exports.save = (req, res) => {
  req.body
    ? sendResponse(res, pages.save(req.body))
    : res.json(null)
}