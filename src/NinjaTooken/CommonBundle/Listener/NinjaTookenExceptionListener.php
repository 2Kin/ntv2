<?php

namespace NinjaTooken\CommonBundle\Listener;

use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;

class NinjaTookenExceptionListener{

    protected $templating;

    public function __construct(EngineInterface $templating)
    {
        $this->templating = $templating;
    }

    public function onKernelException(GetResponseForExceptionEvent $event)
    {

        $exception =  $event->getException();

        // personnalise notre objet réponse pour afficher les détails de notre exception
        $response = new Response();
        $response->setContent(
            $this->templating->render('::exception.html.twig',
                array('exception' => $exception->getMessage())
            )
        );

        // HttpExceptionInterface est un type d'exception spécial qui
        // contient le code statut et les détails de l'entête
        if ($exception instanceof HttpExceptionInterface) {
            $response->setStatusCode($exception->getStatusCode());
            $response->headers->replace($exception->getHeaders());
        } else {
            $response->setStatusCode(500);
        }

        $response->headers->set('Content-Type', 'text/html');

        // envoie notre objet réponse modifié à l'évènement
        $event->setResponse($response);
    }
}