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
                // cherche le remplaçant
                // par défaut le recruteur
                $newRecruteur = $entity->getRecruteur();
                if($newRecruteur){
                    if($newRecruteur->getClan()){
                        $newDroit = $newRecruteur->getClan()->getDroit()+2;
                        $dateAjout = new \DateTime();
                        // sinon le plus ancien membre
                        foreach($recruts as $recrut){
                            if($recrut->getDateAjout()<$dateAjout){
                                $newRecruteur = $recrut->getMembre();
                                $newDroit = $recrut->getDroit();
                                $dateAjout = $recrut->getDateAjout();
                            }
                        }

                        // ré-affecte les liaisons
                        if($newRecruteur){
                            foreach($recruts as $recrut){
                                if($recrut->getMembre() != $newRecruteur){
                                    $recrut->setRecruteur($newRecruteur);
                                    $recrut->setDroit($newDroit);
                                }else{
                                    $recrut->setRecruteur($entity->getRecruteur());
                                    $recrut->setDroit($newDroit-1);
                                }
                                $em->persist($recrut);
                            }
                        // supprime les liaisons
                        }else{
                            foreach($recruts as $recrut){
                                $em->remove($recrut);
                            }
                        }
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