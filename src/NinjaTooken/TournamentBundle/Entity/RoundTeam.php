<?php

namespace NinjaTooken\TournamentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Round
 *
 * @ORM\Table(name="nt_round_team")
 * @ORM\Entity
 */
class RoundTeam
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
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Team", cascade={"persist"}, inversedBy="rounds")
     * @var Team
     */
    private $team;

    /**
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Round", cascade={"persist"}, inversedBy="teams")
     * @var Round
     */
    private $round;

    /**
     * @var integer
     *
     * @ORM\Column(name="score", type="smallint")
     */
    private $score = 0;

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
     * Set score
     *
     * @param integer $score
     * @return Round
     */
    public function setScore($score)
    {
        $this->score = $score;

        return $this;
    }

    /**
     * Get score
     *
     * @return integer 
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * Set team
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Team $team
     * @return RoundTeam
     */
    public function setTeam(\NinjaTooken\TournamentBundle\Entity\Team $team = null)
    {
        $this->team = $team;

        return $this;
    }

    /**
     * Get team
     *
     * @return \NinjaTooken\TournamentBundle\Entity\Team 
     */
    public function getTeam()
    {
        return $this->team;
    }

    /**
     * Set team
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Round $round
     * @return RoundTeam
     */
    public function setRound(\NinjaTooken\TournamentBundle\Entity\Round $round = null)
    {
        $this->round = $round;

        return $this;
    }

    /**
     * Get team
     *
     * @return \NinjaTooken\TournamentBundle\Entity\Round 
     */
    public function getRound()
    {
        return $this->round;
    }
}
