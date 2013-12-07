<?php

namespace NinjaTooken\ClanBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\ClanBundle\Entity\ClanUtilisateur;
use Doctrine\ORM\EntityManager;
use Doctrine\Common\Collections\Collection;
 
class ClanUtilisateurListener
{
    // supprime la liaison vers le clan
    public function preRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        if ($entity instanceof ClanUtilisateur)
        {
            $em = $args->getEntityManager();

            $user = $entity->getMembre();
            $recruteur = $entity->getRecruteur();

            // supprime la liaison vers le clan
            $user->setClan(null);
            $em->persist($user);

            // supprime la liaison du recruteur vers le joueur
            if($recruteur){
                $recruteur->removeRecrut($entity);
                $em->persist($recruteur);
            }
        }
    }

    public function getOldest(Collection $recruts){
        $dateAjout = new \DateTime();
        $newSubstitute = null;
        foreach($recruts as $recrut){
            if($recrut->getDateAjout()<$dateAjout){
                $newSubstitute = $recrut->getMembre();//User
                $dateAjout = $recrut->getDateAjout();
            }
        }
        return $newSubstitute;
    }

    public function iterateRemove(ClanUtilisateur $entity, EntityManager $em){
        $user = $entity->getMembre();

        // réaffectation des recruts
        $recruts = $user->getRecruts();//ClanUtilisateur[]
        if(count($recruts)>0){
            // les droits du membre supprimé
            $newDroit = $entity->getDroit();

            // le plus ancien membre prend la place
            $newSubstitute = $this->getOldest($recruts);

            // ré-affecte les liaisons
            if($newSubstitute){
                // le supérieur du membre supprimé
                $newRecruteur = $entity->getRecruteur();//User
                if(!$newRecruteur || $newRecruteur==$user)
                    $newRecruteur = $newSubstitute;

                // redéfini le remplaçant
                $clanutilisateur = $newSubstitute->getClan();
                $clanutilisateur->setRecruteur($newRecruteur);
                $clanutilisateur->setDroit($newDroit);
                $em->persist($clanutilisateur);

                // parcourt les recruts de l'ancien utilisateur et les ré-assigne
                foreach($recruts as $recrut){
                    // les nouvelles recruts
                    if($recrut->getMembre() != $newSubstitute){
                        $recrut->setRecruteur($newSubstitute);
                        $recrut->setDroit($newDroit+1);
                        $em->persist($recrut);
                    }
                }

                // parcourt les recruts du remplaçant et les réassigne
                $recrutsSubstitute = $newSubstitute->getRecruts();
                if(count($recrutsSubstitute)>0){
                    // le plus ancien membre prend la place
                    $newSubstitute = $this->getOldest($recrutsSubstitute);
                    // ré-affecte les liaisons
                    if($newSubstitute){
                        // redéfini le remplaçant
                        $clanutilisateur = $newSubstitute->getClan();
                        $clanutilisateur->setDroit($newDroit+1);
                        $em->persist($clanutilisateur);
                        // parcourt les recruts du remplaçant et les ré-assigne
                        foreach($recrutsSubstitute as $recrutSubstitute){
                            if($recrutSubstitute->getMembre() != $newSubstitute){
                                $recrutSubstitute->setRecruteur($newSubstitute);
                                $em->persist($recrutSubstitute);
                            }
                        }
                        // continu pour les niveaux suivants
                        $this->iterateRemove($clanutilisateur, $em);
                    }
                }

            }
        }
    }

    // met à jour les recruts et supprime les propositions
    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        if ($entity instanceof ClanUtilisateur)
        {
            $em = $args->getEntityManager();

            $this->iterateRemove($entity, $em);

            $user = $entity->getMembre();

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