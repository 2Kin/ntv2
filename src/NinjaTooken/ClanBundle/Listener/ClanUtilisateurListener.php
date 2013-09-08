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
        if ($entity instanceof ClanUtilisateur)
        {
            $em = $args->getEntityManager();

            $user = $entity->getMembre();
            $recruts = $user->getRecruts();
            if($recruts){
                // ré-affecte vers le rang supérieur
                if($entity->getRecruteur()){
                    $newRecruteur = $entity->getRecruteur();
                    foreach($recruts as $recrut){
                        $recrut->setRecruteur($newRecruteur);
                        $recrut->setDroit($newRecruteur->getDroit()+1);
                        $em->persist($recrut);
                    }
                // supprime les liaisons
                }else{
                    foreach($recruts as $recrut){
                        $em->remove($recrut);
                    }
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