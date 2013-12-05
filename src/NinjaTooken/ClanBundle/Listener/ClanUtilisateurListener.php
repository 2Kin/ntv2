<?php

namespace NinjaTooken\ClanBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\ClanBundle\Entity\ClanUtilisateur;
 
class ClanUtilisateurListener
{

    // met à jour les recruts et supprime les propositions
    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        if ($entity instanceof ClanUtilisateur)
        {
            $em = $args->getEntityManager();

            $user = $entity->getMembre();

            // réaffectation des recruts
            $recruts = $user->getRecruts();
            if($recruts){

                // le supérieur du membre supprimé
                $newRecruteur = $entity->getRecruteur();
                // les droits du membre supprimé
                $newDroit = $entity->getDroit();

                // le plus ancien membre des recruts prend la place
                $dateAjout = new \DateTime();
                $newSubstitute = null;
                foreach($recruts as $recrut){
                    if($recrut->getDateAjout()<$dateAjout){
                        $newSubstitute = $recrut->getMembre();
                        $dateAjout = $recrut->getDateAjout();
                    }
                }

                // ré-affecte les liaisons
                if($newSubstitute){
                    // si l'ancien utilisateur était son propre chef
                    if(!$newRecruteur || $newRecruteur==$user)
                        $newRecruteur = $newSubstitute;

                    // parcourt les recruts de l'ancien utilisateur
                    foreach($recruts as $recrut){
                        // les nouvelles recruts
                        if($recrut->getMembre() != $newSubstitute){
                            $recrut->setRecruteur($newSubstitute);
                            $recrut->setDroit($newDroit+1);
                        // le remplaçant
                        }else{
                            $recrut->setRecruteur($newRecruteur);
                            $recrut->setDroit($newDroit);
                        }
                        $em->persist($recrut);
                    }
                }
            }

            // supprime les propositions de recrutement
            $propositions = $em->getRepository('NinjaTookenClanBundle:ClanProposition')->getPropositionByRecruteur($user);
            if($propositions){
                foreach($propositions as $proposition){
                    $em->remove($proposition);
                }
            }
            $em->flush();
        }
    }

    // supprime la postulation sur le même clan
    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof ClanUtilisateur)
        {
            $clan = $entity->getClan();
            $user = $entity->getMembre();
            if($clan){
                $postulation = $em->getRepository('NinjaTookenClanBundle:ClanPostulation')->getByClanUser($clan, $user);
                if($postulation){
                    $em->remove($postulation);
                    $em->flush();
                }
            }
        }
    }
}