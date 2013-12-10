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

            // réaffectation des recruts
            $previousUser = $entity->getMembre(); // User
            $previousRecruts = $previousUser->getRecruts(); // ClanUtilisateur[]
            if(count($previousRecruts)>0){

                // le remplaçant (la plus ancienne recrut)
                $substitute = $this->getOldest($previousRecruts, $previousUser); // User

                // ré-affecte les liaisons des recruts
                if($substitute){

                    // les droits du membre supprimé
                    $previousDroit = $entity->getDroit();

                    // parcourt les recruts du remplaçant et met à jour les droits
                    $substituteRecruts = $substitute->getRecruts(); // ClanUtilisateur[]
                    if(count($substituteRecruts)>0){
                        // parcourt les recruts du remplaçant et les ré-assigne
                        foreach($substituteRecruts as $substituteRecrut){
                            $substituteRecrutMembre = $substituteRecrut->getMembre();
                            if($substituteRecrutMembre != $substitute){
                                $substituteRecrut->setDroit($previousDroit+1);

                                // met à jour si avait des recruts
                                $substituteRecrutRecruts = $substituteRecrutMembre->getRecruts();
                                foreach($substituteRecrutRecruts as $substituteRecrutRecrut){
                                    $substituteRecrutRecrut->setDroit($previousDroit+2);
                                    $em->persist($substituteRecrutRecrut);
                                }

                                $em->persist($substituteRecrut);
                            }
                        }
                    }

                    // parcourt les recruts de l'ancien utilisateur et les ré-assigne au remplaçant
                    foreach($previousRecruts as $previousRecrut){
                        $previousRecrutMembre = $previousRecrut->getMembre();
                        if($previousRecrutMembre != $substitute && $previousRecrutMembre!=$previousUser){
                            $previousRecrut->setRecruteur($substitute);
                            $previousRecrut->setDroit($previousDroit+1);

                            // met à jour si avait des recruts
                            $previousRecrutRecruts = $previousRecrutMembre->getRecruts();
                            foreach($previousRecrutRecruts as $previousRecrutRecrut){
                                $previousRecrutRecrut->setDroit($previousDroit+2);
                                $em->persist($previousRecrutRecrut);
                            }

                            $em->persist($previousRecrut);
                        }
                    }

                    // le recruteur du membre supprimé
                    $previousRecruteur = $entity->getRecruteur();//User
                    if(!$previousRecruteur || $previousRecruteur==$previousUser)
                        $previousRecruteur = $substitute;

                    // redéfini le remplaçant
                    $substitute_cu = $substitute->getClan(); // ClanUtilisateur
                    $substitute_cu->setRecruteur($previousRecruteur);
                    $substitute_cu->setDroit($previousDroit);

                    $em->persist($substitute_cu);

                    $em->flush();
                }
            }
        }
    }

    public function getOldest(Collection $recruts, \NinjaTooken\UserBundle\Entity\User $recruteur){
        foreach($recruts as $recrut){
            $membre = $recrut->getMembre();
            if($membre != $recruteur)
                return $membre;
        }
        return null;
    }

    // met à jour les recruts et supprime les propositions
    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        if ($entity instanceof ClanUtilisateur)
        {
            $em = $args->getEntityManager();

            // supprime les propositions de recrutement
            $propositions = $em->getRepository('NinjaTookenClanBundle:ClanProposition')->getPropositionByRecruteur($entity->getMembre());
            if($propositions){
                foreach($propositions as $proposition){
                    $em->remove($proposition);
                }
                $em->flush();
            }
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