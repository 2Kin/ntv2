<?php

namespace NinjaTooken\TournamentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Team
 *
 * @ORM\Table(name="nt_team")
 * @ORM\Entity
 */
class Team
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
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=255)
     */
    private $nom;

    /**
     * @var string
     *
     * @ORM\Column(name="cri", type="string", length=255)
     */
    private $cri;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_abandon", type="boolean")
     */
    private $isAbandon = false;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_inscription", type="datetime")
     */
    private $dateInscription;

    /**
     * user
     *
     * @var User
     *
     * @ORM\ManyToMany(targetEntity="NinjaTooken\UserBundle\Entity\User")
     * @ORM\JoinTable(name="nt_team_user",
     *      joinColumns={@ORM\JoinColumn(name="team_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")}
     * )
     */
    private $membres;

    /**
     * @ORM\OneToMany(targetEntity="NinjaTooken\TournamentBundle\Entity\RoundTeam", mappedBy="team", cascade={"persist", "remove"})
     * @var RoundTeam
     */
    private $rounds;

    /**
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Tournament", inversedBy="teams", cascade={"persist"})
     * @var Tournament
     */
    private $tournament;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->membres = new \Doctrine\Common\Collections\ArrayCollection();
        $this->rounds = new \Doctrine\Common\Collections\ArrayCollection();
        $this->setDateInscription(new \DateTime());
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
     * Set nom
     *
     * @param string $nom
     * @return Team
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
     * Set cri
     *
     * @param string $cri
     * @return Team
     */
    public function setCri($cri)
    {
        $this->cri = $cri;

        return $this;
    }

    /**
     * Get cri
     *
     * @return string 
     */
    public function getCri()
    {
        return $this->cri;
    }

    /**
     * Add membres
     *
     * @param \NinjaTooken\UserBundle\Entity\User $membres
     * @return Team
     */
    public function addMembre(\NinjaTooken\UserBundle\Entity\User $membres)
    {
        $this->membres[] = $membres;

        return $this;
    }

    /**
     * Remove membres
     *
     * @param \NinjaTooken\UserBundle\Entity\User $membres
     */
    public function removeMembre(\NinjaTooken\UserBundle\Entity\User $membres)
    {
        $this->membres->removeElement($membres);
    }

    /**
     * Get membres
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getMembres()
    {
        return $this->membres;
    }

    /**
     * Set tournament
     *
     * @param \NinjaTooken\TournamentBundle\Entity\Tournament $tournament
     * @return Team
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
     * Set dateInscription
     *
     * @param \DateTime $dateInscription
     * @return Round
     */
    public function setDateInscription($dateInscription)
    {
        $this->dateInscription = $dateInscription;

        return $this;
    }

    /**
     * Get dateInscription
     *
     * @return \DateTime 
     */
    public function getDateInscription()
    {
        return $this->dateInscription;
    }

    /**
     * Add rounds
     *
     * @param \NinjaTooken\TournamentBundle\Entity\RoundTeam $round
     * @return Team
     */
    public function addRound(\NinjaTooken\ClanBundle\Entity\RoundTeam $round)
    {
        $this->rounds[] = $round;

        return $this;
    }

    /**
     * Remove rounds
     *
     * @param \NinjaTooken\TournamentBundle\Entity\RoundTeam $round
     */
    public function removeRound(\NinjaTooken\TournamentBundle\Entity\RoundTeam $round)
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
     * Set isAbandon
     *
     * @param boolean $isAbandon
     * @return Team
     */
    public function setIsAbandon($isAbandon)
    {
        $this->isAbandon = $isAbandon;

        return $this;
    }

    /**
     * Get isAbandon
     *
     * @return boolean 
     */
    public function getIsAbandon()
    {
        return $this->isAbandon;
    }
}
