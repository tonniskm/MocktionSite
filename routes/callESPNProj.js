const express = require('express');
const router = express.Router();



router.get('/:year/:week', function(req, res, next) {
const year = req.params.year
const week = req.params.week
// console.log(req.params.week)
const league_id = 596787
const swid = '056525DF-9B33-448C-A525-DF9B33848CDA'
const espn_s2 = 'AECaBhX7MIZ8OjeGKzFCtpaEYbn%2FNM4OWPheCNdn7Kcg4Xh5kkhW8wplHrbrgol45tGsGPjKN%2BfhrYyADkLa%2Fqs4EVOmUuSMREa%2F%2BJT6EMxB82UY25q%2BjBSyG21rN70bI6RoWwWCUWC17j6QXTmYK10iBRzYSIUujn%2FE1eb%2F6yykZ9%2B8jhWRO8hu2VIgU7Kq3Pwnt62E2GQUS80zLaBGLvo%2FYnLnw3BD4eLYPSH9iN5Sl9Yb4m%2Bw%2BvCTG5tGLY4IbCu%2Bx25%2BHOOD9pQ83DVD0jzn'
let url = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/' +year.toString() + '/segments/0/leagues/' + league_id.toString() +"?"+ new URLSearchParams({
    'view':'mMatchup',
    // 'view':'mMatchupScore',
    'scoringPeriodId':week,
    'matchupPeriodId':week
}).toString() + "&view=mMatchupScore"
//'?view=mMatchup&?view=mMatchupScore&?scoringPeriodId=1&?matchupPeriodId=1'
// year < 2018? url = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/leagueHistory/" +league_id.toString() +'?view=mMatchup'+ "&?seasonId=" + year.toString():{}
const d = new Date();
d.setTime(d.getTime() + (1*24*60*60*1000));
let expires = "expires="+ d.toUTCString();
// document.cookie = 'SWID'+'=' +swid+';'+expires+';domain=.lm-api-reads.fantasy.espn.com;;SameSite=None; Secure; Path=/;'
// document.cookie = 'espn_s2'+'=' +espn_s2+';'+expires+';domain=.lm-api-reads.fantasy.espn.com;;SameSite=None; Secure; Path=/;'
// console.log(document.cookie)
console.log(url)
let cook = ('SWID='+swid+';SameSite=None; Secure; Path=/; '+expires+"; espn_s2="+espn_s2+';SameSite=None; Secure; Path=/; '+expires+';').toString()
fetch(url,{
    method:'GET',
    credentials:'include',
    params:{'scoringPeriodId': week, 'matchupPeriodId': week},
    headers:{
        // Cookie:document.cookie
        Cookie:cook
        // Cookie:'SWID=056525DF-9B33-448C-A525-DF9B33848CDA; espn_s2=AECaBhX7MIZ8OjeGKzFCtpaEYbn%2FNM4OWPheCNdn7Kcg4Xh5kkhW8wplHrbrgol45tGsGPjKN%2BfhrYyADkLa%2Fqs4EVOmUuSMREa%2F%2BJT6EMxB82UY25q%2BjBSyG21rN70bI6RoWwWCUWC17j6QXTmYK10iBRzYSIUujn%2FE1eb%2F6yykZ9%2B8jhWRO8hu2VIgU7Kq3Pwnt62E2GQUS80zLaBGLvo%2FYnLnw3BD4eLYPSH9iN5Sl9Yb4m%2Bw%2BvCTG5tGLY4IbCu%2Bx25%2BHOOD9pQ83DVD0jzn'}
    }
}).then(result=>result.json()).then(json=>{
    if(year>=2018){
    res.status(200).send(json)
    }else{
        res.status(200).send(json[0]['schedule'])
    }
})
// res.status(200).send({'hello':req.params.year})
}
)


module.exports = router