<?php

namespace NinjaTooken\ClanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ClanUtilisateur
 *
 * @ORM\Table(name="nt_clanproposition")
 * @ORM\Entity(repositoryClass="NinjaTooken\ClanBundle\Entity\ClanPropositionRepository")
 */
class ClanProposition
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
    private $recruteur;

    /**
     * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
     * @var User
     */
    private $postulant;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_ajout", type="datetime")
     */
    private $dateAjout;

    /**
     * Constructor
     */
    public function __construct()
    {
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
     * Set droit
     *
     * @param integer $droit
     * @return ClanUtilisateur
     */
    public function setDroit($droit)
    {
        $this->droit = $droit;

        return $this;
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
     * Set recruteur
     *
     * @param \NinjaTooken\UserBundle\Entity\User $recruteur
     * @return ClanProposition
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
     * Set postulant
     *
     * @param \NinjaTooken\UserBundle\Entity\User $postulant
     * @return ClanProposition
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
}
