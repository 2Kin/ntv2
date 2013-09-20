<?php

namespace NinjaTooken\ClanBundle\Listener;

use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\ClanBundle\Entity\ClanPostulation;
use NinjaTooken\UserBundle\Entity\Message;
use NinjaTooken\UserBundle\Entity\MessageUser;
use Symfony\Component\Translation\TranslatorInterface;
 
class ClanPostulationListener
{
    protected $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    // envoie un message pour prévenir le clan
    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof ClanPostulation)
        {
            $this->sendMessage($entity, $em);
        }
    }

    // met à jour la date de changement de l'état
    public function preUpdate(PreUpdateEventArgs $args)
    {
        $entity = $args->getEntity();
        if ($entity instanceof ClanPostulation)
        {
            if($args->hasChangedField('etat'))
            {
                $em = $args->getEntityManager();
                $uow = $em->getUnitOfWork();

                $this->sendMessage($entity, $em);

                $entity->setDateChangementEtat(new \DateTime());
                $uow->recomputeSingleEntityChangeSet(
                    $em->getClassMetadata("NinjaTookenClanBundle:ClanPostulation"),
                    $entity
                );
            }
        }
    }

    // envoi un message à tous les recruteurs potentiels
    public function sendMessage(ClanPostulation $clanProposition, $em){
        $message = new Message();

        $message->setAuthor($clanProposition->getPostulant());
        $message->setNom($this->translator->trans('mail.recrutement.nouveau.sujet'));

        $content = $this->translator->trans('description.recrutement.postulation'.($clanProposition->getEtat()==0?'Add':'Remove'));
        $message->setContent($content);

        // envoi aux membres du clan pouvant recruter
        $membres = $clanProposition->getClan()->getMembres();
        foreach($membres as $membre){
            if($membre->getDroit()<3){
                $messageuser = new MessageUser();
                $messageuser->setDestinataire($membre->getMembre());
                $message->addReceiver($messageuser);
                $em->persist($messageuser);
            }
        }

        $em->persist($message);
        $em->flush();
    }
}