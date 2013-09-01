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
     * @ORM\ManyToOne(targetEntity="NinjaTooken\TournamentBundle\Entity\Tournament")
     * @var Tournament
     */
    private $tournament;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->membres = new \Doctrine\Common\Collections\ArrayCollection();
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
}
