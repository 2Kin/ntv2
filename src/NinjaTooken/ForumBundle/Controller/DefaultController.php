<?php

namespace NinjaTooken\ForumBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function forumAction()
    {
        return $this->render('NinjaTookenForumBundle:Default:forum.html.twig');
    }

    public function topicAction($topic_nom, $page)
    {
        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig');
    }

    public function topicAjouterAction()
    {
        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig');
    }

    public function topicModifierAction($topic_nom)
    {
        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig');
    }

    public function topicSupprimerAction($topic_nom)
    {
        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig');
    }

    public function messageAction($topic_nom, $message_nom, $page)
    {
        return $this->render('NinjaTookenForumBundle:Default:message.html.twig');
    }

    public function messageAjouterAction($topic_nom)
    {
        return $this->render('NinjaTookenForumBundle:Default:message.html.twig');
    }

    public function messageModifierAction($topic_nom, $message_nom)
    {
        return $this->render('NinjaTookenForumBundle:Default:message.html.twig');
    }

    public function messageSupprimerAction($topic_nom, $message_nom)
    {
        return $this->render('NinjaTookenForumBundle:Default:message.html.twig');
    }
}
