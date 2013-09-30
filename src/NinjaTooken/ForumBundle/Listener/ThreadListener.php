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
            if($entity->getNumComments() > 0){
                $em = $args->getEntityManager();
                $em->getRepository('NinjaTookenForumBundle:Comment')->deleteCommentsByThread($entity);
            }
            // retire du thread
            if($entity->getForum() !== null)
            {
                $forum = $entity->getForum();
                $forum->incrementNumThreads(-1);
                $em->persist($forum);
                $em->flush();
            }
        }
    }

    // met à jour le forum
    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof Thread)
        {
            if($entity->getForum() !== null)
            {
                $forum = $entity->getForum();
                $forum->incrementNumThreads();
                $em->persist($forum);
                $em->flush();
            }
        }
    }
}