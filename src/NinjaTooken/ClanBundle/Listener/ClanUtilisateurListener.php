<?php

namespace NinjaTooken\ClanBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\ClanBundle\Entity\ClanUtilisateur;
 
class ClanUtilisateurListener
{

    // supprime les recruts
    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof ClanUtilisateur)
        {
            $user = $entity->getMembre();
            $recruts = $user->getRecruts();
            if($recruts){
                foreach($recruts as $recrut){
                    $em->remove($recrut);
                }
            }
            $propositions = $em->getRepository('NinjaTookenClanBundle:ClanProposition')->getPropositionByRecruteur($user);
            if($propositions){
                foreach($propositions as $proposition){
                    $em->remove($proposition);
                }
            }
            $em->flush();
        }
    }
}