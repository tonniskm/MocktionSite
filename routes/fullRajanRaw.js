const express = require('express');
const router = express.Router();



router.get('/:yearMax', function(req, res, next) {
    try{

        const yearMax = req.params.yearMax
        const league_id = 596787
        const swid = '056525DF-9B33-448C-A525-DF9B33848CDA'
        const espn_s2 = 'AECaBhX7MIZ8OjeGKzFCtpaEYbn%2FNM4OWPheCNdn7Kcg4Xh5kkhW8wplHrbrgol45tGsGPjKN%2BfhrYyADkLa%2Fqs4EVOmUuSMREa%2F%2BJT6EMxB82UY25q%2BjBSyG21rN70bI6RoWwWCUWC17j6QXTmYK10iBRzYSIUujn%2FE1eb%2F6yykZ9%2B8jhWRO8hu2VIgU7Kq3Pwnt62E2GQUS80zLaBGLvo%2FYnLnw3BD4eLYPSH9iN5Sl9Yb4m%2Bw%2BvCTG5tGLY4IbCu%2Bx25%2BHOOD9pQ83DVD0jzn'
        
        let out = {}
        let promises = []
        for(let year=2012;year<=yearMax;year++){
            out[year] = []
            let url = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/'+ year.toString() + '/segments/0/leagues/' +league_id.toString() +'?view=mMatchup'
            year < 2018? url = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/leagueHistory/" +league_id.toString() +'?view=mMatchup'+ "&?seasonId=" + year.toString():{}
            const d = new Date();
            d.setTime(d.getTime() + (1*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
        
            let cook = ('SWID='+swid+';SameSite=None; Secure; Path=/; '+expires+"; espn_s2="+espn_s2+';SameSite=None; Secure; Path=/; '+expires+';').toString()
            promises.push(fetch(url,{
                method:'GET',
                credentials:'include',
                params:{'view':'mMatchup'},
                headers:{
                    test:'test',
                    // Cookie:document.cookie
                    Cookie:cook
                    // Cookie:'SWID=056525DF-9B33-448C-A525-DF9B33848CDA; espn_s2=AECaBhX7MIZ8OjeGKzFCtpaEYbn%2FNM4OWPheCNdn7Kcg4Xh5kkhW8wplHrbrgol45tGsGPjKN%2BfhrYyADkLa%2Fqs4EVOmUuSMREa%2F%2BJT6EMxB82UY25q%2BjBSyG21rN70bI6RoWwWCUWC17j6QXTmYK10iBRzYSIUujn%2FE1eb%2F6yykZ9%2B8jhWRO8hu2VIgU7Kq3Pwnt62E2GQUS80zLaBGLvo%2FYnLnw3BD4eLYPSH9iN5Sl9Yb4m%2Bw%2BvCTG5tGLY4IbCu%2Bx25%2BHOOD9pQ83DVD0jzn'}
                }
            }).then(result=>result.json()).then(json=>{
                try{
                    if(json!==undefined){
                    if(year<2018){json=json[year-2012]['schedule']}else{json=json['schedule']}
                    let playoffStart = 1000
                    let byeCount = 0
                    let winnersBracket = []
                    let losersBracket = []
            
                        for(let i=0;i<json.length;i++){ //for each game in the season
                            //get the winner and loser scores
                            let game = json[i]
                            let winner = 'BYE'
                            if(game['winner']=='AWAY'){
                                winner=game['away']['teamId']
                            }else if(game['winner'] =='HOME'){
                                winner=game['home']['teamId']
                            }else if(game['winner'] =='TIE'){
                                winner = 'TIE'
                            }
                            let week = game['matchupPeriodId']
                            let home = game['home']['teamId']
                            let homeScore = game['home']['totalPoints']
                            let away = 'BYE'
                            let awayScore = 0
                            if(Object.keys(game).indexOf('away') > -1){
                                away = game['away']['teamId']
                                awayScore = game['away']['totalPoints']
                            }else{
                                if(byeCount==0){
                                    playoffStart = week
                                    byeCount=1
                                }else if (byeCount==1){
                                    byeCount=2
                                }
                            }
                            //playoff stuff
                            if(week==playoffStart){
                                if(away=='BYE'){winnersBracket.push(home)}
                                else if(byeCount==1){
                                    winnersBracket.push(home)
                                    winnersBracket.push(away)}
                                    else{losersBracket.push(home)
                                        losersBracket.push(away)
                                    }
                            }
                            let playoffWeek = week-playoffStart+1
                            let gameType = 'REG'
                            if(playoffWeek>=1){
                                if(winnersBracket.indexOf(home)>-1){
                                    gameType='P'+playoffWeek.toString()
                                }else if(losersBracket.indexOf(home)>-1){
                                    gameType='L'+playoffWeek.toString()
                                }else{gameType='lame'}
                            }
                            
                            if(winner==home&&winner!='BYE'){
                                if(gameType.includes('P')){winnersBracket=winnersBracket.filter(x=>x!=away)}
                                if(gameType.includes('L')&&(playoffWeek!=1||losersBracket.length!=4)){losersBracket=losersBracket.filter(x=>x!=home)}
                            }
                            if(winner==away&&winner!='BYE'){
                                if(gameType.includes('P')){winnersBracket=winnersBracket.filter(x=>x!=home)}
                                if(gameType.includes('L')&&(playoffWeek!=1||losersBracket.length!=4)){losersBracket=losersBracket.filter(x=>x!=away)}
                            }
                            // if(i==0){console.log(winnersBracket)}
                            out[year].push({'Week':week,'Team1':home,'Score1':homeScore,'Team2':away,'Score2':awayScore,'winner':winner,'type':gameType,
                                'winBracket':winnersBracket.toString(),'loseBracket':losersBracket.toString()
                            })
                
                        }//end for each game
                        
                    } // if got res
                }catch(err){}
        
            })//fetch
        )//promises
        }//year
        Promise.all(promises).then(()=>{
            res.status(200).send(out)
        })
    }catch(err){res.status(404).send(err)}
// res.status(200).send({'hello':req.params.year})
}
)


module.exports = router