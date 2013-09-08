<?php

namespace NinjaTooken\ForumBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\ForumBundle\Entity\Forum;
 
class ForumListener
{
    // supprime les threads associés
    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof Forum)
        {
            $em->getRepository('NinjaTookenForumBundle:Thread')->deleteThreadsByForum($entity);
            $em->flush();
        }
    }
}