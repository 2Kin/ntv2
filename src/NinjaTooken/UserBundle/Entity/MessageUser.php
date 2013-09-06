<?php

namespace NinjaTooken\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MessageUser
 *
 * @ORM\Table(name="nt_messageuser")
 * @ORM\Entity(repositoryClass="NinjaTooken\UserBundle\Entity\MessageUserRepository")
 */
class MessageUser
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
     * @var Message
     *
     * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\Message", inversedBy="receivers")
     */
    private $message;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
     */
    private $destinataire;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_read", type="datetime", nullable=true)
     */
    private $dateRead;

    /**
     * @var boolean
     *
     * @ORM\Column(name="has_deleted", type="boolean")
     */
    private $hasDeleted = false;

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
     * Set dateRead
     *
     * @param \DateTime $dateRead
     * @return MessageUser
     */
    public function setDateRead($dateRead)
    {
        $this->dateRead = $dateRead;

        return $this;
    }

    /**
     * Get dateRead
     *
     * @return \DateTime 
     */
    public function getDateRead()
    {
        return $this->dateRead;
    }

    /**
     * Set hasDeleted
     *
     * @param boolean $hasDeleted
     * @return MessageUser
     */
    public function setHasDeleted($hasDeleted)
    {
        $this->hasDeleted = $hasDeleted;

        return $this;
    }

    /**
     * Get hasDeleted
     *
     * @return boolean 
     */
    public function getHasDeleted()
    {
        return $this->hasDeleted;
    }

    /**
     * Set destinataire
     *
     * @param \NinjaTooken\UserBundle\Entity\User $destinataire
     * @return MessageUser
     */
    public function setDestinataire(\NinjaTooken\UserBundle\Entity\User $destinataire = null)
    {
        $this->destinataire = $destinataire;

        return $this;
    }

    /**
     * Get destinataire
     *
     * @return \NinjaTooken\UserBundle\Entity\User 
     */
    public function getDestinataire()
    {
        return $this->destinataire;
    }

    /**
     * Set message
     *
     * @param \NinjaTooken\UserBundle\Entity\Message $message
     * @return MessageUser
     */
    public function setMessage(\NinjaTooken\UserBundle\Entity\Message $message = null)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Get message
     *
     * @return \NinjaTooken\UserBundle\Entity\Message 
     */
    public function getMessage()
    {
        return $this->message;
    }
}
