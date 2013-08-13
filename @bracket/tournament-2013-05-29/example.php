<?php

include("class.tournament.php");

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

?>