<?php

namespace NinjaTooken\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class UserController extends Controller
{

    public function connectFacebookWithAccountAction()
    {
        $fbService = $this->get('fos_facebook.user.login');
        //todo: check if service is successfully connected.
        $fbService->connectExistingAccount();
        return $this->redirect($this->generateUrl('ninja_tooken_homepage'));
    }

    public function loginFbAction() {
        return $this->redirect($this->generateUrl("ninja_tooken_homepage"));
    }

}