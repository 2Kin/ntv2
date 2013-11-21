<?php

namespace NinjaTooken\UserBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\UserBundle\Entity\MessageUser;
 
class MessageUserListener
{
    // message d'avertissement
    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof MessageUser)
        {
            if($entity->getDestinataire() !== null)
            {
                $destinataire = $entity->getDestinataire();

                // envoyer un message d'avertissement par mail
                if($destinataire->getReceiveAvertissement() && $destinataire->getConfirmationToken()===null){
                    $email = $destinataire->getEmail();
                    $emailContact = $this->container->getParameter('mail_admin');

                    $message = $entity->getMessage();
                    $user = $message->getAuthor();

                    $swiftMessage = \Swift_Message::newInstance()
                        ->setSubject('[NT] nouveau message de la part de '.$user->getUsername())
                        ->setFrom($emailContact)
                        ->setTo($email)
                        ->setContentType("text/html")
                        ->setBody($this->renderView('NinjaTookenUserBundle:Default:avertissementEmail.html.twig', array(
                            'user' => $user,
                            'message' => $message->getContent()
                        )));

                    $this->get('mailer')->send($swiftMessage);
                }
            }
        }
    }
}