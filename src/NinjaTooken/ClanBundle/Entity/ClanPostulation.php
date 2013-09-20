<?php

namespace NinjaTooken\ClanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ClanPostulation
 *
 * @ORM\Table(name="nt_clanpostulation")
 * @ORM\Entity(repositoryClass="NinjaTooken\ClanBundle\Entity\ClanPostulationRepository")
 */
class ClanPostulation
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
     * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
     * @var User
     */
    private $postulant;

    /**
     * @ORM\ManyToOne(targetEntity="NinjaTooken\ClanBundle\Entity\Clan")
     */
    private $clan;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_ajout", type="datetime")
     */
    private $dateAjout;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_changement_etat", type="datetime", nullable=true)
     */
    private $dateChangementEtat;

    /**
     * @var integer
     *
     * @ORM\Column(name="etat", type="smallint")
     */
    private $etat = 0;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->setDateChangementEtat(new \DateTime());
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
     * @return ClanPostulation
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
     * Set postulant
     *
     * @param \NinjaTooken\UserBundle\Entity\User $postulant
     * @return ClanPostulation
     */
    public function setPostulant(\NinjaTooken\UserBundle\Entity\User $postulant = null)
    {
        $this->postulant = $postulant;

        return $this;
    }

    /**
     * Get postulant
     *
     * @return \NinjaTooken\UserBundle\Entity\User 
     */
    public function getPostulant()
    {
        return $this->postulant;
    }

    /**
     * Set clan
     *
     * @param \NinjaTooken\ClanBundle\Entity\Clan $clan
     * @return ClanPostulation
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
     * Set etat
     *
     * @param integer $etat
     * @return ClanPostulation
     */
    public function setEtat($etat)
    {
        $this->etat = $etat;

        return $this;
    }

    /**
     * Get etat
     *
     * @return integer 
     */
    public function getEtat()
    {
        return $this->etat;
    }

    /**
     * Set dateChangementEtat
     *
     * @param \DateTime $dateChangementEtat
     * @return ClanPostulation
     */
    public function setDateChangementEtat($dateChangementEtat)
    {
        $this->dateChangementEtat = $dateChangementEtat;

        return $this;
    }

    /**
     * Get dateChangementEtat
     *
     * @return \DateTime 
     */
    public function getDateChangementEtat()
    {
        return $this->dateChangementEtat;
    }
}
