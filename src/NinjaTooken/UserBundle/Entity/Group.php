<?php

namespace NinjaTooken\UserBundle\Entity;

use Sonata\UserBundle\Entity\BaseGroup as BaseGroup;
use Doctrine\ORM\Mapping as ORM;

/**
* Group
*
* @ORM\Table(name="nt_group")
* @ORM\Entity
*/
class Group extends BaseGroup
{
    /**
    * @ORM\Id
    * @ORM\Column(type="integer")
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    protected $id;

    /**
    * Get id
    *
    * @return integer 
    */
    public function getId()
    {
        return $this->id;
    } 

}