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

exports.save = async ({p, url}) => {
  return new Promise(async (resolve, reject) => {
    const provider = getProvider(p)
    if(!provider) {
      reject('Provider is invalid')
    } else {
      const movie = await provider.getMovieDetail(url)
      movie.save((err, data) => {
        err ? reject(err) : resolve(data)
      })
    }
  })
}

// Cron Job
const job = new CronJob('59 * * * * *', async () => {
  console.log(`------- Start job at: ${new Date()} -------`)
  let movies = await Movie.find()

  movies.forEach(async mv => {
    console.log(`\nExcute url: ${mv.url}`)

    const movie = await getProvider(mv.provider).getMovieDetail(mv.url)
    
    let messages = []
    movie.detail.forEach((newDetail, idx) => {
      if(newDetail.content !== mv.detail[idx].content) {
        messages.push(`${newDetail.label}${newDetail.content}`)
      }
    })

    messages.length 
      ? messages.forEach(msg => console.log(msg)) 
      : console.log(`${mv.url} dữ liệu không đổi`)
  })
  
  // Send message
}, null, true, 'Asia/Ho_Chi_Minh');