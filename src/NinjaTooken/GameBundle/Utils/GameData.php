<?php

namespace NinjaTooken\GameBundle\Utils;

use \DOMDocument;

class GameData
{
    private $document;
    private $xml;

    private $experience;
    private $experienceRelatif;
    private $dan;
    private $levelActuel;
    private $levelSuivant;

    private $domExperience;

    public function __construct()
    {
        $this->xml = file_get_contents(dirname(__FILE__).'/../Resources/public/xml/game.xml');
        $this->document = new DOMDocument();
        $this->document->loadXml('<root>'.$this->xml.'</root>' );

        $this->domExperience = $this->document->getElementsByTagName('experience')->item(0)->getElementsByTagName('x');
    }

    public function getDocument(){
        return $this->document;
    }
    public function getRaw(){
        return $this->xml;
    }

    public function setExperience($experience = 0, $dan = 0){
        $this->experience = (int)$experience;
        $this->dan = (int)$dan;

        $k = 0;
        $this->experienceRelatif = $this->experience - $this->dan * $this->domExperience->item($this->domExperience->length-2)->getAttribute('val');
        foreach($this->domExperience as $exp){
            if($exp->getAttribute('val') <= $this->experienceRelatif)
                $k++;
            else
                break;
        }
        $this->levelActuel = $this->domExperience->item($k>0?$k-1:0);
        $this->levelSuivant = $this->domExperience->item($k);

        return $this;
    }

    public function getLevelActuel(){
        return $this->levelActuel->getAttribute('niveau');
    }

    public function getRatio(){
        return ($this->experienceRelatif - $this->levelActuel->getAttribute("val"))/($this->levelSuivant->getAttribute("val")-$this->levelActuel->getAttribute("val"))*100;
    }
}
