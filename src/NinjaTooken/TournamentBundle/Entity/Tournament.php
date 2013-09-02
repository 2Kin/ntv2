<?php

namespace NinjaTooken\TournamentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tournament
 *
 * @ORM\Table(name="nt_tournament")
 * @ORM\Entity
 */
class Tournament
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
     * @var \DateTime
     *
     * @ORM\Column(name="dateLimiteInscription", type="datetime")
     */
    private $dateLimiteInscription;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="dateDebut", type="datetime")
     */
    private $dateDebut;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="dateFin", type="datetime")
     */
    private $dateFin;

    /**
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=255)
     */
    private $nom;

    /**
     * @var integer
     *
     * @ORM\Column(name="maxTeam", type="smallint")
     */
    private $maxTeam;

    /**
     * @var boolean
     *
     * @ORM\Column(name="isDuel", type="boolean")
     */
    private $isDuel;

    /**
     * @ORM\OneToOne(targetEntity="NinjaTooken\ForumBundle\Entity\Thread")
     * @var Thread
     */
    private $thread;

    /**
    * @ORM\OneToMany(targetEntity="NinjaTooken\TournamentBundle\Entity\Round", mappedBy="tournament", cascade={"persist", "remove"})
    * @ORM\OrderBy({"tour" = "ASC"})
    */
    private $rounds;

    /**
    * @ORM\OneToMany(targetEntity="NinjaTooken\TournamentBundle\Entity\Team", mappedBy="tournament", cascade={"persist", "remove"})
    * @ORM\OrderBy({"dateInscription" = "ASC"})
    */
    private $teams;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->rounds = new \Doctrine\Common\Collections\ArrayCollection();
        $this->teams = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
     * Set dateDebut
     *
     * @param \DateTime $dateDebut
     * @return Tournament
     */
    public function setDateDebut($dateDebut)
    {
        $this->dateDebut = $dateDebut;

        return $this;
    }

    /**
     * Get dateDebut
     *
     * @return \DateTime 
     */
    public function getDateDebut()
    {
        return $this->dateDebut;
    }

    /**
     * Set dateFin
     *
     * @param \DateTime $dateFin
     * @return Tournament
     */
    public function setDateFin($dateFin)
    {
        $this->dateFin = $dateFin;

        return $this;
    }

    /**
     * Get dateFin
     *
     * @return \DateTime 
     */
    public function getDateFin()
    {
        return $this->dateFin;
    }

    /**
     * Set dateLimiteInscription
     *
     * @param \DateTime $dateLimiteInscription
     * @return Tournament
     */
    public function setDateLimiteInscription($dateLimiteInscription)
    {
        $this->dateLimiteInscription = $dateLimiteInscription;

        return $this;
    }

    /**
     * Get dateLimiteInscription
     *
     * @return \DateTime 
     */
    public function getDateLimiteInscription()
    {
        return $this->dateLimiteInscription;
    }

    /**
     * Set nom
     *
     * @param string $nom
     * @return Tournament
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     *
     * @return string 
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set thread
     *
     * @param \NinjaTooken\ForumBundle\Entity\Thread $thread
     * @return Tournament
     */
    public function setThread(\NinjaTooken\ForumBundle\Entity\Thread $thread=null)
    {
        $this->thread = $thread;

        return $this;
    }

    /**
     * Get thread
     *
     * @return \NinjaTooken\ForumBundle\Entity\Thread 
     */
    public function getThread()
    {
        return $this->thread;
    }
    
    /**
     * Add rounds
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Round $round
     * @return Tournament
     */
    public function addRound(\NinjaTooken\TournamentBundle\Entity\Round $round)
    {
        $this->rounds[] = $round;
        $round->setTournament($this);
    
        return $this;
    }

    /**
     * Remove rounds
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Round $round
     */
    public function removeRound(\NinjaTooken\TournamentBundle\Entity\Round $round)
    {
        $this->rounds->removeElement($round);
    }

    /**
     * Get rounds
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getRounds()
    {
        return $this->rounds;
    }
    
    /**
     * Add teams
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Team $team
     * @return Tournament
     */
    public function addTeam(\NinjaTooken\TournamentBundle\Entity\Team $team)
    {
        $this->teams[] = $team;
        $team->setTournament($this);
    
        return $this;
    }

    /**
     * Remove teams
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Team $team
     */
    public function removeTeam(\NinjaTooken\TournamentBundle\Entity\Team $team)
    {
        $this->teams->removeElement($team);
    }

    /**
     * Get teams
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getTeams()
    {
        return $this->teams;
    }

    /**
     * Set maxTeam
     *
     * @param integer $maxTeam
     * @return Tournament
     */
    public function setMaxTeam($maxTeam)
    {
        $this->maxTeam = $maxTeam;

        return $this;
    }

    /**
     * Get maxTeam
     *
     * @return integer 
     */
    public function getMaxTeam()
    {
        return $this->maxTeam;
    }

    /**
     * Set isDuel
     *
     * @param boolean $isDuel
     * @return Tournament
     */
    public function setIsDuel($isDuel)
    {
        $this->isDuel = $isDuel;

        return $this;
    }

    /**
     * Get isDuel
     *
     * @return boolean 
     */
    public function getIsDuel()
    {
        return $this->isDuel;
    }
}
