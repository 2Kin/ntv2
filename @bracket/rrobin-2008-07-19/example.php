<?php

error_reporting(E_ALL);

require("class_rrobin.php");

// Lets create a round robin style tournament between some of our dear physicists.
$competitors = array(
    'Paul A.M. Dirac', 
    'Hans Christian Oersted', 
    'Murray Gell-Mann', 
    'Marie Curie', 
    'Neils Bohr', 
    'Richard P. Feynman', 
    'Max Planck');

$robin = new RRobin();
$robin->create($competitors);

echo $robin->tot_games . " games scheduled:\n";
print_r($robin->tour);

?>
