<?php

namespace NinjaTooken\CommonBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use NinjaTooken\GameBundle\NinjaTookenGameBundle;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $num = $this->container->getParameter('numReponse');
        $em = $this->getDoctrine()->getManager();

        return $this->render('NinjaTookenCommonBundle:Default:index.html.twig', array(
            'threads' => $em->getRepository('NinjaTookenForumBundle:Thread')->findBy(
                array('forum' => $em->getRepository('NinjaTookenForumBundle:Forum')->findOneBy(array('slug' => 'nouveautes'))),
                array('dateAjout' => 'DESC'),
                $num,0
            )
        ));
    }

    public function jouerAction()
    {
        $response = $this->render('NinjaTookenCommonBundle:Default:jouer.html.twig');
        $response->setSharedMaxAge(600);
        
        return $response;
    }

    public function manuelAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:manuel.html.twig');
    }

    public function reglementAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:reglement.html.twig');
    }

    public function chatAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:chat.html.twig');
    }

    public function faqGeneraleAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:faqGenerale.html.twig');
    }

    public function faqTechniqueAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:faqTechnique.html.twig');
    }

    public function teamAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:team.html.twig');
    }

    public function mentionsLegalesAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:mentionsLegales.html.twig');
    }

    public function contactAction(Request $request)
    {
        if ('POST' === $request->getMethod()) {
            $csrfProvider = $this->get('form.csrf_provider');
            if(!$csrfProvider->isCsrfTokenValid('contact'.$request->cookies->get('PHPSESSID'), $request->request->get('_token'))) {
                throw new RuntimeException('CSRF attack detected.');
            }
            $texte = trim($request->get('content'));
            $sujet = trim($request->get('sujet'));
            $email = trim($request->get('email'));
            if(!empty($texte)){
                $emailContact = $this->container->getParameter('mail_admin');

                $message = \Swift_Message::newInstance()
                    ->setSubject('[NT] Contact : '.$sujet)
                    ->setFrom($email)
                    ->setTo($emailContact)
                    ->setBody($this->renderView('NinjaTookenCommonBundle:Default:contactEmail.html.twig', array(
                        'texte' => $texte,
                        'email' => $email
                    )));

                $this->get('mailer')->send($message);

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $this->get('translator')->trans('notice.contact')
                );
            }
        }

        return $this->render('NinjaTookenCommonBundle:Default:contact.html.twig');
    }
}
