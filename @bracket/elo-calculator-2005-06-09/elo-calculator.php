
class elo_calculator
{ public function rating($S1,$S2,$R1,$R2)
  { if (empty($S1) OR empty($S2) OR empty($R1) OR empty($R2)) return null;
    if ($S1!=$S2) { if ($S1>$S2) { $E=120-round(1/(1+pow(10,(($R2-$R1)/400)))*120); $R['R3']=$R1+$E; $R['R4']=$R2-$E; }
                            else { $E=120-round(1/(1+pow(10,(($R1-$R2)/400)))*120); $R['R3']=$R1-$E; $R['R4']=$R2+$E; }}
             else { if ($R1==$R2) { $R['R3']=$R1; $R['R4']=$R2; }
                             else { if($R1>$R2) { $E=(120-round(1/(1+pow(10,(($R1-$R2)/400)))*120))-(120-round(1/(1+pow(10,(($R2-$R1)/400)))*120)); $R['R3']=$R1-$E; $R['R4']=$R2+$E; }
                                           else { $E=(120-round(1/(1+pow(10,(($R2-$R1)/400)))*120))-(120-round(1/(1+pow(10,(($R1-$R2)/400)))*120)); $R['R3']=$R1+$E; $R['R4']=$R2-$E; }}}
    $R['S1']=$S1; $R['S2']=$S2; $R['R1']=$R1; $R['R2']=$R2;
    $R['P1']=((($R['R3']-$R['R1'])>0)?"+".($R['R3']-$R['R1']):($R['R3']-$R['R1']));
    $R['P2']=((($R['R4']-$R['R2'])>0)?"+".($R['R4']-$R['R2']):($R['R4']-$R['R2']));
    return $R; }}
