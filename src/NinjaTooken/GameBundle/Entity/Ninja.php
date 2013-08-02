<?php

namespace NinjaTooken\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Ninja
 *
 * @ORM\Table(name="nt_ninja")
 * @ORM\Entity
 */
class Ninja
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
    * user of the ninja
    *
    * @ORM\OneToOne(targetEntity="NinjaTooken\UserBundle\Entity\User", inversedBy="ninja")
    * @var User
    */
    private $user;

    /**
     * @var integer
     *
     * @ORM\Column(name="aptitude_force", type="smallint")
     */
    private $aptitudeForce;

    /**
     * @var integer
     *
     * @ORM\Column(name="aptitude_vitesse", type="smallint")
     */
    private $aptitudeVitesse;

    /**
     * @var integer
     *
     * @ORM\Column(name="aptitude_vie", type="smallint")
     */
    private $aptitudeVie;

    /**
     * @var integer
     *
     * @ORM\Column(name="aptitude_chakra", type="smallint")
     */
    private $aptitudeChakra;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_boule", type="smallint")
     */
    private $jutsuBoule;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_double_saut", type="smallint")
     */
    private $jutsuDoubleSaut;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_bouclier", type="smallint")
     */
    private $jutsuBouclier;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_marcher_mur", type="smallint")
     */
    private $jutsuMarcherMur;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_deflagration", type="smallint")
     */
    private $jutsuDeflagration;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_marcher_eau", type="smallint")
     */
    private $jutsuMarcherEau;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_metamorphose", type="smallint")
     */
    private $jutsuMetamorphose;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_multishoot", type="smallint")
     */
    private $jutsuMultishoot;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_invisibilite", type="smallint")
     */
    private $jutsuInvisibilite;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_resistance_explosion", type="smallint")
     */
    private $jutsuResistanceExplosion;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_phoenix", type="smallint")
     */
    private $jutsuPhoenix;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_vague", type="smallint")
     */
    private $jutsuVague;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_pieux", type="smallint")
     */
    private $jutsuPieux;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_teleportation", type="smallint")
     */
    private $jutsuTeleportation;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_tornade", type="smallint")
     */
    private $jutsuTornade;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_kusanagi", type="smallint")
     */
    private $jutsuKusanagi;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_acier_renforce", type="smallint")
     */
    private $jutsuAcierRenforce;

    /**
     * @var integer
     *
     * @ORM\Column(name="jutsu_chakra_vie", type="smallint")
     */
    private $jutsuChakraVie;

    /**
     * @var integer
     *
     * @ORM\Column(name="grade", type="smallint")
     */
    private $grade;

    /**
     * @var integer
     *
     * @ORM\Column(name="experience", type="bigint")
     */
    private $experience;

    /**
     * @var string
     *
     * @ORM\Column(name="classe", type="string", length=25)
     */
    private $classe;

    /**
     * @var integer
     *
     * @ORM\Column(name="masque", type="smallint")
     */
    private $masque;

    /**
     * @var integer
     *
     * @ORM\Column(name="masque_couleur", type="smallint")
     */
    private $masqueCouleur;

    /**
     * @var integer
     *
     * @ORM\Column(name="masque_detail", type="smallint")
     */
    private $masqueDetail;

    /**
     * @var integer
     *
     * @ORM\Column(name="costume", type="smallint")
     */
    private $costume;

    /**
     * @var integer
     *
     * @ORM\Column(name="costume_couleur", type="smallint")
     */
    private $costumeCouleur;

    /**
     * @var integer
     *
     * @ORM\Column(name="costume_detail", type="smallint")
     */
    private $costumeDetail;

    /**
     * @var integer
     *
     * @ORM\Column(name="mission_assassinnat", type="smallint")
     */
    private $missionAssassinnat;

    /**
     * @var integer
     *
     * @ORM\Column(name="mission_course", type="smallint")
     */
    private $missionCourse;

    /**
     * @var string
     *
     * @ORM\Column(name="accomplissement", type="string", length=25)
     */
    private $accomplissement;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set aptitudeForce
     *
     * @param integer $aptitudeForce
     * @return Ninja
     */
    public function setAptitudeForce($aptitudeForce)
    {
        $this->aptitudeForce = $aptitudeForce;

        return $this;
    }

    /**
     * Get aptitudeForce
     *
     * @return integer 
     */
    public function getAptitudeForce()
    {
        return $this->aptitudeForce;
    }

    /**
     * Set aptitudeVitesse
     *
     * @param integer $aptitudeVitesse
     * @return Ninja
     */
    public function setAptitudeVitesse($aptitudeVitesse)
    {
        $this->aptitudeVitesse = $aptitudeVitesse;

        return $this;
    }

    /**
     * Get aptitudeVitesse
     *
     * @return integer 
     */
    public function getAptitudeVitesse()
    {
        return $this->aptitudeVitesse;
    }

    /**
     * Set aptitudeVie
     *
     * @param integer $aptitudeVie
     * @return Ninja
     */
    public function setAptitudeVie($aptitudeVie)
    {
        $this->aptitudeVie = $aptitudeVie;

        return $this;
    }

    /**
     * Get aptitudeVie
     *
     * @return integer 
     */
    public function getAptitudeVie()
    {
        return $this->aptitudeVie;
    }

    /**
     * Set aptitudeChakra
     *
     * @param integer $aptitudeChakra
     * @return Ninja
     */
    public function setAptitudeChakra($aptitudeChakra)
    {
        $this->aptitudeChakra = $aptitudeChakra;

        return $this;
    }

    /**
     * Get aptitudeChakra
     *
     * @return integer 
     */
    public function getAptitudeChakra()
    {
        return $this->aptitudeChakra;
    }

    /**
     * Set jutsuBoule
     *
     * @param integer $jutsuBoule
     * @return Ninja
     */
    public function setJutsuBoule($jutsuBoule)
    {
        $this->jutsuBoule = $jutsuBoule;

        return $this;
    }

    /**
     * Get jutsuBoule
     *
     * @return integer 
     */
    public function getJutsuBoule()
    {
        return $this->jutsuBoule;
    }

    /**
     * Set jutsuDoubleSaut
     *
     * @param integer $jutsuDoubleSaut
     * @return Ninja
     */
    public function setJutsuDoubleSaut($jutsuDoubleSaut)
    {
        $this->jutsuDoubleSaut = $jutsuDoubleSaut;

        return $this;
    }

    /**
     * Get jutsuDoubleSaut
     *
     * @return integer 
     */
    public function getJutsuDoubleSaut()
    {
        return $this->jutsuDoubleSaut;
    }

    /**
     * Set jutsuBouclier
     *
     * @param integer $jutsuBouclier
     * @return Ninja
     */
    public function setJutsuBouclier($jutsuBouclier)
    {
        $this->jutsuBouclier = $jutsuBouclier;

        return $this;
    }

    /**
     * Get jutsuBouclier
     *
     * @return integer 
     */
    public function getJutsuBouclier()
    {
        return $this->jutsuBouclier;
    }

    /**
     * Set jutsuMarcherMur
     *
     * @param integer $jutsuMarcherMur
     * @return Ninja
     */
    public function setJutsuMarcherMur($jutsuMarcherMur)
    {
        $this->jutsuMarcherMur = $jutsuMarcherMur;

        return $this;
    }

    /**
     * Get jutsuMarcherMur
     *
     * @return integer 
     */
    public function getJutsuMarcherMur()
    {
        return $this->jutsuMarcherMur;
    }

    /**
     * Set jutsuDeflagration
     *
     * @param integer $jutsuDeflagration
     * @return Ninja
     */
    public function setJutsuDeflagration($jutsuDeflagration)
    {
        $this->jutsuDeflagration = $jutsuDeflagration;

        return $this;
    }

    /**
     * Get jutsuDeflagration
     *
     * @return integer 
     */
    public function getJutsuDeflagration()
    {
        return $this->jutsuDeflagration;
    }

    /**
     * Set jutsuMarcherEau
     *
     * @param integer $jutsuMarcherEau
     * @return Ninja
     */
    public function setJutsuMarcherEau($jutsuMarcherEau)
    {
        $this->jutsuMarcherEau = $jutsuMarcherEau;

        return $this;
    }

    /**
     * Get jutsuMarcherEau
     *
     * @return integer 
     */
    public function getJutsuMarcherEau()
    {
        return $this->jutsuMarcherEau;
    }

    /**
     * Set jutsuMetamorphose
     *
     * @param integer $jutsuMetamorphose
     * @return Ninja
     */
    public function setJutsuMetamorphose($jutsuMetamorphose)
    {
        $this->jutsuMetamorphose = $jutsuMetamorphose;

        return $this;
    }

    /**
     * Get jutsuMetamorphose
     *
     * @return integer 
     */
    public function getJutsuMetamorphose()
    {
        return $this->jutsuMetamorphose;
    }

    /**
     * Set jutsuMultishoot
     *
     * @param integer $jutsuMultishoot
     * @return Ninja
     */
    public function setJutsuMultishoot($jutsuMultishoot)
    {
        $this->jutsuMultishoot = $jutsuMultishoot;

        return $this;
    }

    /**
     * Get jutsuMultishoot
     *
     * @return integer 
     */
    public function getJutsuMultishoot()
    {
        return $this->jutsuMultishoot;
    }

    /**
     * Set jutsuInvisibilite
     *
     * @param integer $jutsuInvisibilite
     * @return Ninja
     */
    public function setJutsuInvisibilite($jutsuInvisibilite)
    {
        $this->jutsuInvisibilite = $jutsuInvisibilite;

        return $this;
    }

    /**
     * Get jutsuInvisibilite
     *
     * @return integer 
     */
    public function getJutsuInvisibilite()
    {
        return $this->jutsuInvisibilite;
    }

    /**
     * Set jutsuResistanceExplosion
     *
     * @param integer $jutsuResistanceExplosion
     * @return Ninja
     */
    public function setJutsuResistanceExplosion($jutsuResistanceExplosion)
    {
        $this->jutsuResistanceExplosion = $jutsuResistanceExplosion;

        return $this;
    }

    /**
     * Get jutsuResistanceExplosion
     *
     * @return integer 
     */
    public function getJutsuResistanceExplosion()
    {
        return $this->jutsuResistanceExplosion;
    }

    /**
     * Set jutsuPhoenix
     *
     * @param integer $jutsuPhoenix
     * @return Ninja
     */
    public function setJutsuPhoenix($jutsuPhoenix)
    {
        $this->jutsuPhoenix = $jutsuPhoenix;

        return $this;
    }

    /**
     * Get jutsuPhoenix
     *
     * @return integer 
     */
    public function getJutsuPhoenix()
    {
        return $this->jutsuPhoenix;
    }

    /**
     * Set jutsuVague
     *
     * @param integer $jutsuVague
     * @return Ninja
     */
    public function setJutsuVague($jutsuVague)
    {
        $this->jutsuVague = $jutsuVague;

        return $this;
    }

    /**
     * Get jutsuVague
     *
     * @return integer 
     */
    public function getJutsuVague()
    {
        return $this->jutsuVague;
    }

    /**
     * Set jutsuPieux
     *
     * @param integer $jutsuPieux
     * @return Ninja
     */
    public function setJutsuPieux($jutsuPieux)
    {
        $this->jutsuPieux = $jutsuPieux;

        return $this;
    }

    /**
     * Get jutsuPieux
     *
     * @return integer 
     */
    public function getJutsuPieux()
    {
        return $this->jutsuPieux;
    }

    /**
     * Set jutsuTeleportation
     *
     * @param integer $jutsuTeleportation
     * @return Ninja
     */
    public function setJutsuTeleportation($jutsuTeleportation)
    {
        $this->jutsuTeleportation = $jutsuTeleportation;

        return $this;
    }

    /**
     * Get jutsuTeleportation
     *
     * @return integer 
     */
    public function getJutsuTeleportation()
    {
        return $this->jutsuTeleportation;
    }

    /**
     * Set jutsuTornade
     *
     * @param integer $jutsuTornade
     * @return Ninja
     */
    public function setJutsuTornade($jutsuTornade)
    {
        $this->jutsuTornade = $jutsuTornade;

        return $this;
    }

    /**
     * Get jutsuTornade
     *
     * @return integer 
     */
    public function getJutsuTornade()
    {
        return $this->jutsuTornade;
    }

    /**
     * Set jutsuKusanagi
     *
     * @param integer $jutsuKusanagi
     * @return Ninja
     */
    public function setJutsuKusanagi($jutsuKusanagi)
    {
        $this->jutsuKusanagi = $jutsuKusanagi;

        return $this;
    }

    /**
     * Get jutsuKusanagi
     *
     * @return integer 
     */
    public function getJutsuKusanagi()
    {
        return $this->jutsuKusanagi;
    }

    /**
     * Set jutsuAcierRenforce
     *
     * @param integer $jutsuAcierRenforce
     * @return Ninja
     */
    public function setJutsuAcierRenforce($jutsuAcierRenforce)
    {
        $this->jutsuAcierRenforce = $jutsuAcierRenforce;

        return $this;
    }

    /**
     * Get jutsuAcierRenforce
     *
     * @return integer 
     */
    public function getJutsuAcierRenforce()
    {
        return $this->jutsuAcierRenforce;
    }

    /**
     * Set jutsuChakraVie
     *
     * @param integer $jutsuChakraVie
     * @return Ninja
     */
    public function setJutsuChakraVie($jutsuChakraVie)
    {
        $this->jutsuChakraVie = $jutsuChakraVie;

        return $this;
    }

    /**
     * Get jutsuChakraVie
     *
     * @return integer 
     */
    public function getJutsuChakraVie()
    {
        return $this->jutsuChakraVie;
    }

    /**
     * Set grade
     *
     * @param integer $grade
     * @return Ninja
     */
    public function setGrade($grade)
    {
        $this->grade = $grade;

        return $this;
    }

    /**
     * Get grade
     *
     * @return integer 
     */
    public function getGrade()
    {
        return $this->grade;
    }

    /**
     * Set experience
     *
     * @param integer $experience
     * @return Ninja
     */
    public function setExperience($experience)
    {
        $this->experience = $experience;

        return $this;
    }

    /**
     * Get experience
     *
     * @return integer 
     */
    public function getExperience()
    {
        return $this->experience;
    }

    /**
     * Set classe
     *
     * @param string $classe
     * @return Ninja
     */
    public function setClasse($classe)
    {
        $this->classe = $classe;

        return $this;
    }

    /**
     * Get classe
     *
     * @return string 
     */
    public function getClasse()
    {
        return $this->classe;
    }

    /**
     * Set user
     *
     * @param \NinjaTooken\UserBundle\Entity\User $user
     * @return Ninja
     */
    public function setUser(\NinjaTooken\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \NinjaTooken\UserBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set masque
     *
     * @param integer $masque
     * @return Ninja
     */
    public function setMasque($masque)
    {
        $this->masque = $masque;

        return $this;
    }

    /**
     * Get masque
     *
     * @return integer 
     */
    public function getMasque()
    {
        return $this->masque;
    }

    /**
     * Set masqueCouleur
     *
     * @param integer $masqueCouleur
     * @return Ninja
     */
    public function setMasqueCouleur($masqueCouleur)
    {
        $this->masqueCouleur = $masqueCouleur;

        return $this;
    }

    /**
     * Get masqueCouleur
     *
     * @return integer 
     */
    public function getMasqueCouleur()
    {
        return $this->masqueCouleur;
    }

    /**
     * Set masqueDetail
     *
     * @param integer $masqueDetail
     * @return Ninja
     */
    public function setMasqueDetail($masqueDetail)
    {
        $this->masqueDetail = $masqueDetail;

        return $this;
    }

    /**
     * Get masqueDetail
     *
     * @return integer 
     */
    public function getMasqueDetail()
    {
        return $this->masqueDetail;
    }

    /**
     * Set costume
     *
     * @param integer $costume
     * @return Ninja
     */
    public function setCostume($costume)
    {
        $this->costume = $costume;

        return $this;
    }

    /**
     * Get costume
     *
     * @return integer 
     */
    public function getCostume()
    {
        return $this->costume;
    }

    /**
     * Set costumeCouleur
     *
     * @param integer $costumeCouleur
     * @return Ninja
     */
    public function setCostumeCouleur($costumeCouleur)
    {
        $this->costumeCouleur = $costumeCouleur;

        return $this;
    }

    /**
     * Get costumeCouleur
     *
     * @return integer 
     */
    public function getCostumeCouleur()
    {
        return $this->costumeCouleur;
    }

    /**
     * Set costumeDetail
     *
     * @param integer $costumeDetail
     * @return Ninja
     */
    public function setCostumeDetail($costumeDetail)
    {
        $this->costumeDetail = $costumeDetail;

        return $this;
    }

    /**
     * Get costumeDetail
     *
     * @return integer 
     */
    public function getCostumeDetail()
    {
        return $this->costumeDetail;
    }

    /**
     * Set missionAssassinnat
     *
     * @param integer $missionAssassinnat
     * @return Ninja
     */
    public function setMissionAssassinnat($missionAssassinnat)
    {
        $this->missionAssassinnat = $missionAssassinnat;

        return $this;
    }

    /**
     * Get missionAssassinnat
     *
     * @return integer 
     */
    public function getMissionAssassinnat()
    {
        return $this->missionAssassinnat;
    }

    /**
     * Set missionCourse
     *
     * @param integer $missionCourse
     * @return Ninja
     */
    public function setMissionCourse($missionCourse)
    {
        $this->missionCourse = $missionCourse;

        return $this;
    }

    /**
     * Get missionCourse
     *
     * @return integer 
     */
    public function getMissionCourse()
    {
        return $this->missionCourse;
    }

    /**
     * Set accomplissement
     *
     * @param string $accomplissement
     * @return Ninja
     */
    public function setAccomplissement($accomplissement)
    {
        $this->accomplissement = $accomplissement;

        return $this;
    }

    /**
     * Get accomplissement
     *
     * @return string 
     */
    public function getAccomplissement()
    {
        return $this->accomplissement;
    }
}
