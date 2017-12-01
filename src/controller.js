import pages from './pages'

exports.search = (req, res, next) => {
  if (!req.query.q) {
    return res.json([])
  }

  (async() => {
    try {
      const rs = await pages.search(encodeURIComponent(req.query.q))
      res.json({data: rs})
    } catch (error) {
      console.error(error)
      res.status(400).send({error})
    }
  })();
}
