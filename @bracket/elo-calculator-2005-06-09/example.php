<?

require('elo-calculator.php');

if (!empty($_POST['S1']) OR !empty($_POST['S2']) OR !empty($_POST['R1']) OR !empty($_POST['R2']))
{ $elo_calculator=&new elo_calculator;
  $results=$elo_calculator->rating($_POST['S1'],$_POST['S2'],$_POST['R1'],$_POST['R2']);
  $R=$results; /* variable alias. not required but easier for me to write the example */ }

echo '<form action="'.$_SERVER['PHP_SELF'].'" method="post">';
echo '<table>';
echo '<tr><td>&nbsp;</td>';
echo '    <td>Player 1</td>';
echo '    <td>Player 2</td></tr>';
echo '<tr><td>Points:</td>';
echo '    <td><input type="text" size="5"name="R1" value="'; if (!empty($R['R1'])) { echo $R['R1']; } echo '"/></td>';
echo '    <td><input type="text" name="R2" size="5" value="'; if (!empty($R['R2'])) { echo $R['R2']; } echo '"/></td></tr>';
echo '<tr><td>Match Results:</td>';
echo '    <td><input type="text" name="S1" size="5" value="'; if (!empty($R['S1'])) { echo $R['S1']; } echo '"/></td>';
echo '    <td><input type="text" name="S2" size="5" value="'; if (!empty($R['S2'])) { echo $R['S2']; } echo '"/></td></tr>';
echo '<tr><td>Points gained/lost:</td>';
echo '    <td>'; if (!empty($R['P1'])) { echo $R['P1']; } echo '</td>';
echo '    <td>'; if (!empty($R['P2'])) { echo $R['P2']; } echo '</td></tr>';
echo '<tr><td>Final results:</td>';
echo '    <td><input type="text" size="5" name="" value="'; if (!empty($R['R3'])) { echo $R['R3']; } echo '"/></td>';
echo '    <td><input type="text" size="5" name="" value="'; if (!empty($R['R4'])) { echo $R['R4']; } echo '"/></td>';
echo '<tr><td>&nbsp;</td>';
echo '    <td colspan="2">';
echo '    <input type="submit" value="Calculate"/></td></tr>';
echo '</table>';

?>