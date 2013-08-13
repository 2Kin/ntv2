<?php

error_reporting(E_ALL);

// The knock-out class file contains two classes: "Knockout" and "KnockoutGD". KnockoutGD extends Knockout with GD-lib features (explained later).
include("class_knockout.php");

// Depending on whether or not GD-lib is installed this example file will output differently.
$GDLIB_INSTALLED = (function_exists("gd_info")) ? true : false;

// Lets create a knock-out tournament between some of our dear physicists.
$competitors = array(
    'Paul A.M. Dirac', 
    'Hans Christian Oersted', 
    'Murray Gell-Mann', 
    'Marie Curie', 
    'Neils Bohr', 
    'Richard P. Feynman', 
    'Max Planck');

// Create initial tournament bracket.
$KO = new KnockoutGD($competitors);

// At this point the bracket looks like this:
$bracket = $KO->getBracket();
if (!$GDLIB_INSTALLED)
    print_r($bracket);

/*
    ...which outputs:
    
    Array
    (
        [0] => Array
            (
                [0] => Array
                    (
                        [c1] => Paul A.M. Dirac
                        [s1] => 0
                        [c2] => Neils Bohr
                        [s2] => 0
                    )
                [1] => Array
                    (
                        [c1] => Hans Christian Oersted
                        [s1] => 0
                        [c2] => Richard P. Feynman
                        [s2] => 0
                    )
                [2] => Array
                    (
                        [c1] => Murray Gell-Mann
                        [s1] => 0
                        [c2] => Max Planck
                        [s2] => 0
                    )
            )
        [1] => Array
            (
                [0] => Array
                    (
                        [c1] => 
                        [s1] => -1
                        [c2] => 
                        [s2] => -1
                    )
                [1] => Array
                    (
                        [c1] => 
                        [s1] => -1
                        [c2] => Marie Curie
                        [s2] => 0
                    )
            )
    )    

    EXPLANATION:
    ------------
    The above bracket contains the initial scheduled matches.
    The utmost array elements represent rounds in the tournament, where round (index) 0 is the play-in round, and round 1 is the first "proper" round.
    The round elements are arrays themselves, and contain match elements which are organized by 4 properties: Competitor 1 and 2, 'c1' and 'c2', and their scores 's1' and 's2'.
    Due to the nature of a knock-out tournament, the winner of a given match proceeds to a new match in the following round. 
    For a match to exist in round N+1, it is therefore required that two matches have been played in round N.
    If a match entry contains a competitor score of -1, this denotes that the competitor is undecided due to an unplayed match in the preceding round.
    Once the result of the unplayed match is submitted, the undecided competitor will be updated.
*/

// Now, lets fill in some match results. This can be done two ways: either by directly specifying round and match indicies or by specifying competitor names.
$KO->setResByMatch(0, 0, 2, 1); // Arguments: match index, round index, score 1, score 2.
$KO->setResByCompets('Hans Christian Oersted', 'Richard P. Feynman', 3, 1); // Arguments: competitor 1, competitor 2, score 1, score 2.
$KO->setResByCompets('Murray Gell-Mann', 'Max Planck', 1, 0);

// At this point every undecided competitor from round 1 is now updated with the match winners of the preceding round. Dumping the return of $KO->getBracket() should agree with this - but it takes up to much space in this example file.

// Lets, just for the sake of it, fill out match 1 from round 1 since both competitors are now known!
$KO->setResByMatch(1, 1, 4, 0);

// Now, we would like to know some details about the rounds in our bracket structure.
if (!$GDLIB_INSTALLED)
    print_r($KO->roundsInfo);

/*
    ...which outputs:
    
    Array
    (
        [0] => Array
            (
                [0] => Play-in round
                [1] => 6
            )

        [1] => Array
            (
                [0] => Semi-finals
                [1] => 4
            )

        [2] => Array
            (
                [0] => Final
                [1] => 2
            )

    )
    
    EXPLANATION:
    ------------
    Each utmost element is a description of a round in the bracket structure. 
    The index of each element corresponds to the round number which the element describes.
    Each element contains two fields: the round title and the number of competitors in the round.
*/

// If GD-lib is installed, the below code will draw the bracket of the knock-out tournament.
if ($GDLIB_INSTALLED) {
    $im = $KO->getImage("Tournament name here");
    header('Content-type: image/png');
    imagepng($im);
    imagedestroy($im);
}

/*
 * Demonstration of helper-methods.
 */

/* 
    Lets say that we wish to rename all the competitors in the tournament bracket, then this is done by:
    
    $KO->renameCompets($dictionary);
    
    ...where the format of the $dictionary is:
    
    $dictionary = array(
        'Current name 1' => 'New name 1',
        'Current name 2' => 'New name 2',
    );

    ------------------------------------------
    
    Or you might want to know the status of a specific match, then these two methods might help you:
    
    $KO->isMatchCreated($m, $r)
    $KO->isMatchPlayed($m, $r)
    
    ...where $m and $r are the match and round bracket indicies.
    
    ------------------------------------------
    
    And finally, if a match (index) $m is played in round (index) $r, 
    then the match winner will play a new match in round $r+1, at the following match index and competitor position:
    
    list($nextMatchIdx, $competitorPos) = $KO->getNextMatch($m);
    
    Doing the same but in opposite direction is also possible by:
    
    $prevMatchIdx = $KO->getPrevMatch($m, $competitorPos);
*/

?>
