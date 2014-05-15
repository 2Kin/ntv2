<?php

namespace NinjaTooken\UserBundle\Controller;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;

class DetectionAdminController extends Controller
{

    public function listAction()
    {
        if (false === $this->admin->isGranted('LIST')) {
            throw new AccessDeniedException();
        }

        $request = $this->getRequest();

        $users = array();
        if ($this->getRestMethod() == 'POST') {
            $ip = $request->get('ip');
            if(!empty($ip))
                $ip = ip2long($ip);

            $username = $request->get('username');

            $em = $this->getDoctrine()->getManager();

            $userRepository = $em->getRepository('NinjaTookenUserBundle:User');
            $users = $userRepository->getMultiAccount($ip, $username);

        }

        return $this->render('NinjaTookenUserBundle:DetectionAdmin:detection.html.twig', array(
            'locale' => $request->getLocale(),
            'users' => $users
        ));
    }
}