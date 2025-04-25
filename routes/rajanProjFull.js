// export const maxDuration = 120;
const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
    try{

        const league_id = 596787
        const swid = '056525DF-9B33-448C-A525-DF9B33848CDA'
        const espn_s2 = 'AECaBhX7MIZ8OjeGKzFCtpaEYbn%2FNM4OWPheCNdn7Kcg4Xh5kkhW8wplHrbrgol45tGsGPjKN%2BfhrYyADkLa%2Fqs4EVOmUuSMREa%2F%2BJT6EMxB82UY25q%2BjBSyG21rN70bI6RoWwWCUWC17j6QXTmYK10iBRzYSIUujn%2FE1eb%2F6yykZ9%2B8jhWRO8hu2VIgU7Kq3Pwnt62E2GQUS80zLaBGLvo%2FYnLnw3BD4eLYPSH9iN5Sl9Yb4m%2Bw%2BvCTG5tGLY4IbCu%2Bx25%2BHOOD9pQ83DVD0jzn'
        
        // const year= req.params.year
        // const week= req.params.week
        const yearMax = 2024
        const weekMax = 18
    
        const leagueSize = 12
        const playerSlots = {0: 'QB', 4: 'WR', 2: 'RB', 23: 'FLEX', 6: 'TE', 16: 'D/ST', 17: 'K', 20: 'Bench', 21: 'IR'}
        const defaultPosID = {1: 'QB', 3: 'WR', 2: 'RB', 4: 'TE', 16: 'D/ST', 5: 'K'}
        // for(let year=2018;year<=yearMax;year++){
            //     out[year] = []
            // }
            let promises = []
            let out1 = {}
            
    console.log('here')
    for(let year=2018;year<=yearMax;year++){
        out1[year] = []
        for(let week=1;week<=weekMax;week++){
            if(year==2023&&week==1){continue}
            let url = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/' +year.toString() + '/segments/0/leagues/' + league_id.toString() +"?"+ new URLSearchParams({
                'view':'mMatchup',
                'scoringPeriodId':week,
                'matchupPeriodId':week
            }).toString() + "&view=mMatchupScore"
            const d = new Date();
            d.setTime(d.getTime() + (1*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            let cook = ('SWID='+swid+';SameSite=None; Secure; Path=/; '+expires+"; espn_s2="+espn_s2+';SameSite=None; Secure; Path=/; '+expires+';').toString()
    
            promises.push(
                fetch(url,{
                method:'GET',
                credentials:'include',
                params:{'scoringPeriodId': week, 'matchupPeriodId': week},
                headers:{
                    Cookie:cook
                        }
            }).then(result=>result.json()).then(json=>{
                let out = []
                // const json = json1['schedule']
                // out1 = json['schedule']
                // res.status(200).send(JSON.stringify(json))
                // console.log(json)
                for (let team=0;team<leagueSize;team++){ //for each team in teh league
                    if(json['teams'].length<=team){continue}
                    for (let slot=0;slot<17;slot++){ //for each roster slot
                        if(json['teams'][team]['roster']['entries'].length<=slot){continue}
                    
                        let outDict = {}
                        outDict['Week'] = week
                        outDict['PlayerName'] = json['teams'][team]['roster']['entries'][slot]['playerPoolEntry']['player']['fullName']
                        // outDict['PlayerScoreActual']
                        // outDict['PlayerScoreProjected']
                        outDict['PlayerRosterSlotId'] = json['teams'][team]['roster']['entries'][slot]['lineupSlotId']
                        outDict['PlayerFantasyTeam'] = json['teams'][team]['id']
                        outDict['Position'] = defaultPosID[json['teams'][team]['roster']['entries'][slot]['playerPoolEntry']['player']['defaultPositionId']]
                        outDict['ProTeam'] = json['teams'][team]['roster']['entries'][slot]['playerPoolEntry']['player']['proTeamId']
                        outDict['PlayerRosterSlot'] = playerSlots[json['teams'][team]['roster']['entries'][slot]['lineupSlotId']]
                        //for each listed stat
                        // console.log(json['teams'][team]['roster']['entries'][slot]['playerPoolEntry']['player'])
                        // console.log(json['teams'][team]['roster']['entries'][slot]['playerPoolEntry']['player']['stats'])
                        outDict['PlayerScoreActual'] =0
                        outDict['PlayerScoreProj'] = 0
                        for(let statInd=0;statInd<json['teams'][team]['roster']['entries'][slot]['playerPoolEntry']['player']['stats'].length;statInd++){
                            let stat = json['teams'][team]['roster']['entries'][slot]['playerPoolEntry']['player']['stats'][statInd]
                            if (stat['scoringPeriodId'] != week){continue}
                            if (stat['statSourceId'] == 0){
                                if(stat.appliedTotal!=undefined){outDict['PlayerScoreActual']=stat['appliedTotal']}}
                            else if (stat['statSourceId'] == 1){
                                if(stat.appliedTotal!=undefined){outDict['PlayerScoreProj']=stat['appliedTotal']}}
                            // else{console.log({1:'error',2:stat})
                            // stat.append(1)//error
                            // }
                        }
                        if(outDict['PlayerScoreActual']==undefined){outDict['PlayerScoreActual'] =0}
                        if(outDict['PlayerScoreProj']==undefined){outDict['PlayerScoreProj'] = 0}
                        // if(week==5&&year==2018&&)
                        // out[year].push(outDict)
                        out.push(outDict)
                        // out1 = outDict
                    }//for slot
                }//for team
                out1[year] = out1[year].concat(out)
                // if(year>=2018){
                // res.status(200).send(json)
                // }else{
                //     res.status(200).send(json[0]['schedule'])
                // }
            })//fetch
            // .then(()=>res.status(200).send(out))
        )//promises
        }//week
    }//year
    Promise.all(promises).then(()=>{
        res.status(200).send(out1)
    })
    }catch(er){res.status(401).send(er)}
}//function
)//router get


module.exports = router