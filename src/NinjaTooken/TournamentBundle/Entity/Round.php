<?php

namespace NinjaTooken\TournamentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Round
 *
 * @ORM\Table(name="nt_round")
 * @ORM\Entity
 */
class Round
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
     * @var integer
     *
     * @ORM\Column(name="carte", type="smallint")
     */
    private $carte = 0;

    /**
     * @var integer
     *
     * @ORM\Column(name="jeu", type="smallint")
     */
    private $jeu = 0;

    /**
     * @var string
     *
     * @ORM\Column(name="privee", type="string", length=20)
     */
    private $privee = "";

    /**
     * @var integer
     *
     * @ORM\Column(name="tour", type="smallint")
     */
    private $tour = 1;

    /**
     * @var integer
     *
     * @ORM\Column(name="ordre", type="smallint")
     */
    private $ordre = 0;

    /**
     * @var integer
     *
     * @ORM\Column(name="num_gagnant", type="smallint")
     */
    private $numGagnant = 1;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_ajout", type="datetime")
     */
    private $dateAjout;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_debut", type="datetime", nullable=true)
     */
    private $dateDebut;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_fin", type="datetime", nullable=true)
     */
    private $dateFin;

    /**
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Tournament", inversedBy="rounds", cascade={"persist"})
     * @var Tournament
     */
    private $tournament;

    /**
     * @ORM\OneToMany(targetEntity="NinjaTooken\TournamentBundle\Entity\RoundTeam", mappedBy="round", cascade={"persist", "remove"})
     * @var RoundTeam
     */
    private $teams;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->teams = new \Doctrine\Common\Collections\ArrayCollection();

        $this->setDateAjout(new \DateTime());
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
     * Set dateAjout
     *
     * @param \DateTime $dateAjout
     * @return Round
     */
    public function setDateAjout($dateAjout)
    {
        $this->dateAjout = $dateAjout;

        return $this;
    }

    /**
     * Get dateAjout
     *
     * @return \DateTime 
     */
    public function getDateAjout()
    {
        return $this->dateAjout;
    }

    /**
     * Set dateDebut
     *
     * @param \DateTime $dateDebut
     * @return Round
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
     * @return Round
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
     * Set tour
     *
     * @param integer $tour
     * @return Round
     */
    public function setTour($tour)
    {
        $this->tour = $tour;

        return $this;
    }

    /**
     * Get tour
     *
     * @return integer 
     */
    public function getTour()
    {
        return $this->tour;
    }

    /**
     * Set ordre
     *
     * @param integer $ordre
     * @return Round
     */
    public function setOrdre($ordre)
    {
        $this->ordre = $ordre;

        return $this;
    }

    /**
     * Get ordre
     *
     * @return integer 
     */
    public function getOrdre()
    {
        return $this->ordre;
    }

    /**
     * Set numGagnant
     *
     * @param integer $numGagnant
     * @return Round
     */
    public function setNumGagnant($numGagnant)
    {
        $this->numGagnant = $numGagnant;

        return $this;
    }

    /**
     * Get numGagnant
     *
     * @return integer 
     */
    public function getNumGagnant()
    {
        return $this->numGagnant;
    }

    /**
     * Set carte
     *
     * @param integer $carte
     * @return Round
     */
    public function setCarte($carte)
    {
        $this->carte = $carte;

        return $this;
    }

    /**
     * Get carte
     *
     * @return integer 
     */
    public function getCarte()
    {
        return $this->carte;
    }

    /**
     * Set jeu
     *
     * @param integer $jeu
     * @return Round
     */
    public function setJeu($jeu)
    {
        $this->jeu = $jeu;

        return $this;
    }

    /**
     * Get jeu
     *
     * @return integer 
     */
    public function getJeu()
    {
        return $this->jeu;
    }

    /**
     * Set team1
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Team $team1
     * @return Round
     */
    public function setTeam1(\NinjaTooken\TournamentBundle\Entity\Team $team1 = null)
    {
        $this->team1 = $team1;

        return $this;
    }

    /**
     * Get team1
     *
     * @return \NinjaTooken\TournamentBundle\Entity\Team 
     */
    public function getTeam1()
    {
        return $this->team1;
    }

    /**
     * Set team2
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Team $team2
     * @return Round
     */
    public function setTeam2(\NinjaTooken\TournamentBundle\Entity\Team $team2 = null)
    {
        $this->team2 = $team2;

        return $this;
    }

    /**
     * Get team2
     *
     * @return \NinjaTooken\TournamentBundle\Entity\Team 
     */
    public function getTeam2()
    {
        return $this->team2;
    }

    /**
     * Set tournament
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Tournament $tournament
     * @return Round
     */
    public function setTournament(\NinjaTooken\TournamentBundle\Entity\Tournament $tournament = null)
    {
        $this->tournament = $tournament;

        return $this;
    }

    /**
     * Get tournament
     *
     * @return \NinjaTooken\TournamentBundle\Entity\Tournament 
     */
    public function getTournament()
    {
        return $this->tournament;
    }

    /**
     * Set privee
     *
     * @param string $privee
     * @return Tournament
     */
    public function setPrivee($privee)
    {
        $this->privee = $privee;

        return $this;
    }

    /**
     * Get privee
     *
     * @return string 
     */
    public function getPrivee()
    {
        return $this->privee;
    }

    /**
     * Add teams
     *
     * @param \NinjaTooken\TournamentBundle\Entity\RoundTeam $team
     * @return Round
     */
    public function addTeam(\NinjaTooken\ClanBundle\Entity\RoundTeam $team)
    {
        $this->teams[] = $team;

        return $this;
    }

    /**
     * Remove teams
     *
     * @param \NinjaTooken\TournamentBundle\Entity\RoundTeam $team
     */
    public function removeTeam(\NinjaTooken\TournamentBundle\Entity\RoundTeam $team)
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
}
