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
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Team")
     * @var Team
     */
    private $team1;

    /**
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Team")
     * @var Team
     */
    private $team2;

    /**
     * @var integer
     *
     * @ORM\Column(name="scoreTeam1", type="smallint")
     */
    private $scoreTeam1;

    /**
     * @var integer
     *
     * @ORM\Column(name="scoreTeam2", type="smallint")
     */
    private $scoreTeam2;

    /**
     * @var integer
     *
     * @ORM\Column(name="carte", type="smallint")
     */
    private $carte;

    /**
     * @var integer
     *
     * @ORM\Column(name="jeu", type="smallint")
     */
    private $jeu;

    /**
     * @var string
     *
     * @ORM\Column(name="protected", type="string", length=20)
     */
    private $protected;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="dateAjout", type="datetime")
     */
    private $dateAjout;

    /**
     * @var integer
     *
     * @ORM\Column(name="tour", type="smallint")
     */
    private $tour;

    /**
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Tournament", inversedBy="rounds", cascade={"persist"})
     * @var Tournament
     */
    private $tournament;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->setDateAjout(new \DateTime());
        $this->setTour(1);
        $this->setJeu(0);
        $this->setCarte(0);
        $this->setScoreTeam1(0);
        $this->setScoreTeam2(0);
        $this->setProtected("");
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
     * Set scoreTeam1
     *
     * @param integer $scoreTeam1
     * @return Round
     */
    public function setScoreTeam1($scoreTeam1)
    {
        $this->scoreTeam1 = $scoreTeam1;

        return $this;
    }

    /**
     * Get scoreTeam1
     *
     * @return integer 
     */
    public function getScoreTeam1()
    {
        return $this->scoreTeam1;
    }

    /**
     * Set scoreTeam2
     *
     * @param integer $scoreTeam2
     * @return Round
     */
    public function setScoreTeam2($scoreTeam2)
    {
        $this->scoreTeam2 = $scoreTeam2;

        return $this;
    }

    /**
     * Get scoreTeam2
     *
     * @return integer 
     */
    public function getScoreTeam2()
    {
        return $this->scoreTeam2;
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
     * Set protected
     *
     * @param string $protected
     * @return Tournament
     */
    public function setProtected($protected)
    {
        $this->protected = $protected;

        return $this;
    }

    /**
     * Get protected
     *
     * @return string 
     */
    public function getProtected()
    {
        return $this->protected;
    }
}
