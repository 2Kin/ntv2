<?php

namespace NinjaTooken\ClanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ClanUtilisateur
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class ClanUtilisateur
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
     * @ORM\OneToOne(targetEntity="NinjaTooken\UserBundle\Entity\User", cascade={"persist"})
     */
    private $user;

    /**
    * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
    * @var User
     */
    private $recruteur;

    /**
     * @ORM\OneToOne(targetEntity="NinjaTooken\ClanBundle\Entity\Clan", cascade={"persist"})
     */
    private $clan;

    /**
     * @var string
     *
     * @ORM\Column(name="droit", type="string", length=50)
     */
    private $droit;

    /**
     * @var boolean
     *
     * @ORM\Column(name="can_edit_clan", type="boolean")
     */
    private $canEditClan;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_ajout", type="datetime")
     */
    private $dateAjout;


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
     * Set droit
     *
     * @param string $droit
     * @return ClanUtilisateur
     */
    public function setDroit($droit)
    {
        $this->droit = $droit;

        return $this;
    }

    /**
     * Get droit
     *
     * @return string 
     */
    public function getDroit()
    {
        return $this->droit;
    }

    /**
     * Set dateAjout
     *
     * @param \DateTime $dateAjout
     * @return ClanUtilisateur
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
     * Set user
     *
     * @param \NinjaTooken\UserBundle\Entity\User $user
     * @return ClanUtilisateur
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
     * Set recruteur
     *
     * @param \NinjaTooken\UserBundle\Entity\User $recruteur
     * @return ClanUtilisateur
     */
    public function setRecruteur(\NinjaTooken\UserBundle\Entity\User $recruteur = null)
    {
        $this->recruteur = $recruteur;

        return $this;
    }

    /**
     * Get recruteur
     *
     * @return \NinjaTooken\UserBundle\Entity\User 
     */
    public function getRecruteur()
    {
        return $this->recruteur;
    }

    /**
     * Set clan
     *
     * @param \NinjaTooken\ClanBundle\Entity\Clan $clan
     * @return ClanUtilisateur
     */
    public function setClan(\NinjaTooken\ClanBundle\Entity\Clan $clan = null)
    {
        $this->clan = $clan;

        return $this;
    }

    /**
     * Get clan
     *
     * @return \NinjaTooken\ClanBundle\Entity\Clan 
     */
    public function getClan()
    {
        return $this->clan;
    }

    /**
     * Set canEditClan
     *
     * @param boolean $canEditClan
     * @return ClanUtilisateur
     */
    public function setCanEditClan($canEditClan)
    {
        $this->canEditClan = $canEditClan;

        return $this;
    }

    /**
     * Get canEditClan
     *
     * @return boolean 
     */
    public function getCanEditClan()
    {
        return $this->canEditClan;
    }
}
