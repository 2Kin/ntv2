<?php

namespace NinjaTooken\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MessageUser
 *
 * @ORM\Table()
 * @ORM\Entity
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
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
     */
    private $user;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_read", type="datetime")
     */
    private $dateRead;

    /**
     * @var boolean
     *
     * @ORM\Column(name="has_deleted", type="boolean")
     */
    private $hasDeleted;


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
     * Set user
     *
     * @param \NinjaTooken\UserBundle\Entity\User $user
     * @return MessageUser
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
}
