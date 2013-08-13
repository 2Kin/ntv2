<?php

class Tournament {
    
    public $tournamentName;
    public $drawTeamGroups;
    public $teams;
    
    private $groups;
    private $matches;
    
    
    public function Tournament( $teams = array() ){
        $this->tournamentName   = "League";
        $this->drawTeamGroups   = true;
        $this->playHomeAndAway  = true;
        
        $this->teams            = $teams;
        $this->groups           = array();
        $this->matches          = array();
    }
    
    
    public function createGroups( $numGroups = 1 ){
        $numTeamsPerGroup = intval( count($this->teams) / $numGroups );
        
        if( $this->drawTeamGroups )  shuffle( $this->teams );
        
        $this->groups = array_chunk($this->teams, $numTeamsPerGroup);
        return $this->groups;
    }
    
    
    public function createMatches( $groupNum = 0 ){
        
        $teams      = $this->groups[ $groupNum ];
        $matchDays  = array();
        
        $outTeam   = array();
        $outTeam[] = $teams[ count($teams)-1 ];
        
        // clicle num matchDays
        for( $i=0; $i < count($teams)-1; ++$i ){
            
            if( $i > 0 ){
                if( $i % 2 ){
                    array_pop($teams);
                    $aux   = array_splice($teams, ceil(count($teams)/2)+1 );
                    $teams = array_merge( $outTeam, $aux, $teams );
                }   
                else{
                    array_shift($teams);
                    $aux   = array_splice($teams, ceil(count($teams)/2)-1 );
                    $teams = array_merge( $aux, $teams, $outTeam );
                }
            }
            for( $j=0, $k = count($teams)-1; $j < $k; ++$j, --$k ){
                $matchDays[$i][] = array( $teams[$j], $teams[$k] );
            }
        }
        
        if( $this->playHomeAndAway ){
            $matchDays = array_merge($matchDays, $matchDays);
            
            for( ; $i < count($matchDays)*2; ++$i ){
                for( $j=0; $j < count($matchDays[$i]); ++$j ){
                    $matchDays[$i][$j] = array_reverse($matchDays[$i][$j]);
                }
            }
        }
        return $matchDays;
    }
    
}


/*
$teams                          = array('SCP', 'BEN', 'POR', 'BRA', 'ACA', 'SET', 'OLH', 'MAR');

$tournament                     = new Tournament( $teams );
$tournament->drawTeamGroups     = true;
$tournament->playHomeAndAway    = true;
$groups                         = $tournament->createGroups( 3 );

for( $i=0; $i < count($groups); ++$i ){

    $matchDays = $tournament->createMatches( $i );
 
    echo "<br/><h2>Group ". ($i+1) ."</h2>";
    
    echo '<b>Teams:</b> '.implode(' | ', $groups[$i]).'<br/>';
 
    for( $j=0; $j< count($matchDays); ++$j ){
        
        echo "<br/><b>MatchDay ".($j+1)."</b><br/>";
        
        for( $k=0; $k < count($matchDays[$k]); ++$k ){
            
            echo $matchDays[$j][$k][0] .' - '. $matchDays[$j][$k][1] .'<br/>';
        }
    }
    
}
*/

?>