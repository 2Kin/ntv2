<?php

namespace NinjaTooken\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Lobby
 *
 * @ORM\Table(name="nt_lobby")
 * @ORM\Entity
 */
class Lobby
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
     * user
     *
     * @var User
     *
     * @ORM\ManyToMany(targetEntity="NinjaTooken\UserBundle\Entity\User")
     * @ORM\JoinTable(name="nt_lobby_user",
     *      joinColumns={@ORM\JoinColumn(name="lobby_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")}
     * )
     */
    public $users;

    /**
     * @var integer
     *
     * @ORM\Column(name="carte", type="smallint")
     */
    private $carte = 0;

    /**
     * @var integer
     *
     * @ORM\Column(name="partie", type="smallint")
     */
    private $partie = 0;

    /**
     * @var integer
     *
     * @ORM\Column(name="maximum", type="smallint")
     */
    private $maximum = 2;

    /**
     * @var integer
     *
     * @ORM\Column(name="jeu", type="smallint")
     */
    private $jeu = 0;

    /**
     * @var string
     *
     * @ORM\Column(name="privee", type="string", length=30)
     */
    private $privee = '';

    /**
     * @var float
     *
     * @ORM\Column(name="version", type="decimal", precision=10, scale=6)
     */
    private $version = 0;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_debut", type="datetime")
     */
    private $dateDebut;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_update", type="datetime")
     */
    private $dateUpdate;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
        $this->setDateDebut(new \DateTime());
        $this->setDateUpdate(new \DateTime());
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
     * Set carte
     *
     * @param integer $carte
     * @return Lobby
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
     * Set partie
     *
     * @param integer $partie
     * @return Lobby
     */
    public function setPartie($partie)
    {
        $this->partie = $partie;

        return $this;
    }

    /**
     * Get partie
     *
     * @return integer 
     */
    public function getPartie()
    {
        return $this->partie;
    }

    /**
     * Set maximum
     *
     * @param integer $maximum
     * @return Lobby
     */
    public function setMaximum($maximum)
    {
        $this->maximum = $maximum;

        return $this;
    }

    /**
     * Get maximum
     *
     * @return integer 
     */
    public function getMaximum()
    {
        return $this->maximum;
    }

    /**
     * Set jeu
     *
     * @param integer $jeu
     * @return Lobby
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
     * Set privee
     *
     * @param string $privee
     * @return Lobby
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
     * Set version
     *
     * @param float $version
     * @return Lobby
     */
    public function setVersion($version)
    {
        $this->version = $version;

        return $this;
    }

    /**
     * Get version
     *
     * @return float 
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Set dateDebut
     *
     * @param \DateTime $dateDebut
     * @return Lobby
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
     * Set dateUpdate
     *
     * @param \DateTime $dateUpdate
     * @return Lobby
     */
    public function setDateUpdate($dateUpdate)
    {
        $this->dateUpdate = $dateUpdate;

        return $this;
    }

    /**
     * Get dateUpdate
     *
     * @return \DateTime 
     */
    public function getDateUpdate()
    {
        return $this->dateUpdate;
    }

    /**
     * Add users
     *
     * @param \NinjaTooken\UserBundle\Entity\User $user
     * @return Lobby
     */
    public function addUser(\NinjaTooken\UserBundle\Entity\User $user)
    {
        $this->users[] = $user;

        return $this;
    }

    /**
     * Remove users
     *
     * @param \NinjaTooken\UserBundle\Entity\User $user
     */
    public function removeUser(\NinjaTooken\UserBundle\Entity\User $user)
    {
        $this->users->removeElement($user);
    }

    /**
     * Get users
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getUsers()
    {
        return $this->users;
    }
}
