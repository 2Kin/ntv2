<?php

namespace NinjaTooken\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NinjaEvent
 *
 * @ORM\Table(name="nt_ninjaevent")
 * @ORM\Entity
 */
class NinjaEvent
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
    * ninja
    *
    * @ORM\ManyToOne(targetEntity="NinjaTooken\GameBundle\Entity\Ninja")
    * @var Ninja
    */
    private $ninja;

    /**
    * event
    *
    * @ORM\ManyToOne(targetEntity="NinjaTooken\ForumBundle\Entity\Thread")
    * @var Thread
    */
    private $thread;


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
     * Set ninja
     *
     * @param \NinjaTooken\GameBundle\Entity\Ninja $ninja
     * @return NinjaEvent
     */
    public function setNinja(\NinjaTooken\GameBundle\Entity\Ninja $ninja = null)
    {
        $this->ninja = $ninja;

        return $this;
    }

    /**
     * Get ninja
     *
     * @return \NinjaTooken\GameBundle\Entity\Ninja 
     */
    public function getNinja()
    {
        return $this->ninja;
    }

    /**
     * Set thread
     *
     * @param \NinjaTooken\ForumBundle\Entity\Thread $thread
     * @return NinjaEvent
     */
    public function setThread(\NinjaTooken\ForumBundle\Entity\Thread $thread = null)
    {
        $this->thread = $thread;

        return $this;
    }

    /**
     * Get thread
     *
     * @return \NinjaTooken\ForumBundle\Entity\Thread 
     */
    public function getThread()
    {
        return $this->thread;
    }
}
