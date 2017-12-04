import phimmoi from './phimmoi'
import a47 from './anime47'
import qs from 'querystring'
import $ from 'cheerio'
import cs from 'cloudscraper'
import Movie from '../models/movie'
import {CronJob} from 'cron'

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
  return provider ? Promise.resolve(provider.search(qs.escape(q))) : Promise.reject('Provider is invalid')
}

exports.save = ({p, url}) => {
  return new Promise((resolve, reject) => {
    const provider = getProvider(p)
    if(!provider) {
      reject('Provider is invalid')
    } else {
      cs.get(`http://www.phimmoi.net/${url}`, (error, response, body) => {
        const model = parseModel(url, body)
        model.save((err, data) => {
          err ? reject(err) : resolve(data)
        })
      })
    }
  })
}

// Cron Job
const job = new CronJob('59 * * * * *', async () => {
  // Get list movies
  console.log(`------- Start job at: ${new Date()} -------`)
  let movies = await Movie.find()

  movies.forEach(movie => {
    const url = `http://www.phimmoi.net/${movie.url}`
    console.log(`\nExcute url: ${url}`)

    cs.get(url, (error, response, body) => {
      let messages = [];
      parseModel(movie.url, body).detail.forEach((newData, index) => {
        if(newData.content !== movie.detail[index].content) {
          messages.push(`${newData.label} đã được cập nhật: ${newData.content}`)
        }
      })

      messages.length 
        ? messages.forEach(msg => console.log(msg)) 
        : console.log(`${url} nothing changes`)
    })
  })
  
  // Send message
}, null, true, 'Asia/Ho_Chi_Minh');

const parseModel = (url, data) => {
  if(!data) {
    return null;
  }

  let model = new Movie()
  const element = $('.movie-detail', data)
  const labels = element.find('dt')
  const contents = element.find('dd')

  model.provider = 'PM'
  model.url = url
  model.title1 = element.find('.title-1').last().text()
  model.title2 = element.find('.title-2').text() + element.find('title-year').text()

  model.detail = [];
  contents.get().forEach((ele, idx) => {
    const label = $(labels[idx]).text()
    const content = getAText(ele)
    model.detail.push({label, content})
  })

  return model
}

const getAText = (ele) => {
  const aTags = $(ele).find('a').get()
  return aTags.length
    ? aTags.reduce((rs, item) => rs.concat($(item).attr('title')), []).join(', ')
    : ele.children[0] && ele.children[0].data
}