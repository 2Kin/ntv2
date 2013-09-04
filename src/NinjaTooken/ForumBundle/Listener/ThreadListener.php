<?php

namespace NinjaTooken\ForumBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\ForumBundle\Entity\Thread;
 
class ThreadListener
{
    // supprime les commentaires associés
    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof Thread)
        {
            if($entity->getNumComments() > 0)
                $em->getRepository('NinjaTookenForumBundle:Comment')->deleteCommentsByThread($entity);
        }
    }
}