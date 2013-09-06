<?php

namespace NinjaTooken\ClanBundle\Listener;

use Doctrine\ORM\Event\PreUpdateEventArgs;
use NinjaTooken\ClanBundle\Entity\ClanProposition;
 
class ClanPropositionListener
{

    // met à jour la date de changement de l'état
    public function preUpdate(PreUpdateEventArgs $args)
    {
        $entity = $args->getEntity();
        if ($entity instanceof ClanProposition)
        {
            if($args->hasChangedField('etat'))
            {
                $em = $args->getEntityManager();
                $uow = $em->getUnitOfWork();

                $entity->setDateChangementEtat(new \DateTime());
                $uow->recomputeSingleEntityChangeSet(
                    $em->getClassMetadata("NinjaTookenClanBundle:ClanProposition"),
                    $entity
                );
            }
        }
    }
}