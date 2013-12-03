<?php

namespace NinjaTooken\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\SecurityContext;

class UserController extends Controller
{
    /*
     * Dummy controller for FB login
     */
    public function loginCheckFbAction() 
    {
        //intercepted by user provider
    }

    /*
     * Dummy controller for FB login
     */
    public function logoutFbAction() 
    {
        //intercepted by user provider
    }

    public function loginFbAction(Request $request) {
        if ($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR)) {
            $error = $request->attributes->get(SecurityContext::AUTHENTICATION_ERROR);
        } else {
            $error = $request->getSession()->get(SecurityContext::AUTHENTICATION_ERROR);
        }

        return new Response($error);
    }

}