<?php

namespace NinjaTooken\UserBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\DependencyInjection\ContainerInterface;
use NinjaTooken\UserBundle\Entity\MessageUser;
 
class MessageUserListener
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

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
                    $message = $entity->getMessage();
                    $user = $message->getAuthor();

                    $swiftMessage = \Swift_Message::newInstance()
                        ->setSubject('[NT] nouveau message de la part de '.$user->getUsername())
                        ->setFrom(array($this->container->getParameter('mail_contact') => $this->container->getParameter('mail_name')))
                        ->setTo($destinataire->getEmail())
                        ->setContentType("text/html")
                        ->setBody($this->container->get('twig')->render('NinjaTookenUserBundle:Default:avertissementEmail.html.twig', array(
                            'user' => $user,
                            'message' => $message,
                            'locale' => $destinataire->getLocale()
                        )));

                    $this->container->get('mailer')->send($swiftMessage);
                }
            }
        }
    }
}