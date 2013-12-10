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

            // réagence les liaisons
            $previousUser = $entity->getMembre();

            // réaffectation des recruts
            $previousRecruts = $previousUser->getRecruts();//ClanUtilisateur[]
            if(count($previousRecruts)>0){
                // les droits du membre supprimé
                $previousDroit = $entity->getDroit();


                // le plus ancien membre prend la place
                $substitute = $this->getOldest($previousRecruts);

                // ré-affecte les liaisons
                if($substitute){
                    // le supérieur du membre supprimé
                    $previousRecruteur = $entity->getRecruteur();//User
                    if(!$previousRecruteur || $previousRecruteur==$previousUser)
                        $previousRecruteur = $substitute;

                    // les recruts du remplaçant
                    $substituteRecruts = $substitute->getRecruts();

                    // redéfini le remplaçant
                    $substitute_cu = $substitute->getClan();
                    $substitute_cu->setRecruteur($previousRecruteur);
                    $substitute_cu->setDroit($previousDroit);
                    $em->persist($substitute_cu);

                    // parcourt les recruts de l'ancien utilisateur et les ré-assigne au remplaçant
                    foreach($previousRecruts as $previousRecrut){
                        // les nouvelles recruts
                        if($previousRecrut->getMembre() != $substitute && $previousRecrut->getMembre()!=$previousUser){
                            $previousRecrut->setRecruteur($substitute);
                            $previousRecrut->setDroit($previousDroit+1);
                            $em->persist($previousRecrut);
                        }
                    }

                    // parcourt les recruts du remplaçant et les réassigne
                    if(count($substituteRecruts)>0){
                        // le plus ancien membre prend la place
                        $substitute_ = $this->getOldest($substituteRecruts);
                        // ré-affecte les liaisons
                        if($substitute_){
                            // redéfini le remplaçant
                            $substitute_cu_ = $substitute_->getClan();
                            $substitute_cu_->setDroit($previousDroit+1);
                            $em->persist($substitute_cu_);
                            // parcourt les recruts du remplaçant et les ré-assigne
                            foreach($substituteRecruts as $substituteRecrut){
                                if($substituteRecrut->getMembre() != $substitute_){
                                    $substituteRecrut->setRecruteur($substitute_);
                                    $substituteRecrut->setDroit($previousDroit+2);
                                    $em->persist($substituteRecrut);
                                }
                            }
                        }
                    }

                    $em->flush();
                }
            }
        }
    }

    public function getOldest(Collection $recruts){
        $dateAjout = new \DateTime();
        $oldest = null;
        foreach($recruts as $recrut){
            if($recrut->getDateAjout()<$dateAjout){
                $oldest = $recrut->getMembre();//User
                $dateAjout = $recrut->getDateAjout();
            }
        }
        return $oldest;
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