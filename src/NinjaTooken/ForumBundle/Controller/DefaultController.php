<?php

namespace NinjaTooken\ForumBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use NinjaTooken\ForumBundle\Entity\Forum;
use NinjaTooken\ForumBundle\Entity\Thread;

class DefaultController extends Controller
{
    public function eventAction()
    {
        return $this->render('NinjaTookenForumBundle:Default:event.html.twig');
    }

    public function forumAction()
    {
        $repo_forum = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Forum');
        $repo_thread = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Thread');


        $forums = $repo_forum->createQueryBuilder('a')->orderBy('a.ordre', 'DESC')->getQuery()->getResult();
        foreach($forums as $forum){
            $forum->threads = $repo_thread->findBy(
                array('forum' => $forum),
                array('lastCommentAt' => 'desc'),
                5,0
            );
        }
     

        return $this->render('NinjaTookenForumBundle:Default:forum.html.twig', array('forums' => $forums));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function topicAction(Forum $forum, $page)
    {
        $num = 20;

        $repo_thread = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Thread');
        $threads = $repo_thread->findBy(
            array('forum' => $forum),
            array('lastCommentAt' => 'desc'),
            $num, 0
        );

        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig', array('forum' => $forum, 'threads' => $threads));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function topicAjouterAction(Forum $forum)
    {

        $num = 20;

        $repo_thread = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Thread');
        $threads = $repo_thread->findBy(
            array('forum' => $forum),
            array('lastCommentAt' => 'desc'),
            $num, 0
        );
        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig', array('forum' => $forum, 'threads' => $threads));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function topicModifierAction(Forum $forum)
    {

        $num = 20;

        $repo_thread = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Thread');
        $threads = $repo_thread->findBy(
            array('forum' => $forum),
            array('lastCommentAt' => 'desc'),
            $num, 0
        );
        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig', array('forum' => $forum, 'threads' => $threads));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function topicSupprimerAction(Forum $forum)
    {
        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig', array('forum' => $forum, 'threads' => $threads));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function messageAction(Forum $forum, Thread $thread, $page)
    {
        $num = 20;

        $repo_comment = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Comment');
        $comments = $repo_comment->findBy(
            array('thread' => $thread),
            array('dateAjout' => 'desc'),
            $num, 0
        );

        return $this->render('NinjaTookenForumBundle:Default:message.html.twig', array('forum' => $forum, 'thread' => $thread, 'comments' => $comments));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function messageAjouterAction(Forum $forum)
    {
        return $this->render('NinjaTookenForumBundle:Default:message.html.twig');
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function messageModifierAction(Forum $forum, Thread $thread)
    {
        return $this->render('NinjaTookenForumBundle:Default:message.html.twig');
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function messageSupprimerAction(Forum $forum, Thread $thread)
    {
        return $this->render('NinjaTookenForumBundle:Default:message.html.twig');
    }

    public function recentCommentsAction($max = 10, $forum = 0)
    {
        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Comment');

        if(empty($forum)){
            $q = $repo->createQueryBuilder('a')->orderBy('a.dateAjout', 'DESC')->getQuery();
            $q->setFirstResult(0);
            $q->setMaxResults($max);
            $comments = $q->getResult();
        }else{
            $q = $repo->createQueryBuilder('a')
                ->orderBy('a.dateAjout', 'DESC')
                ->leftJoin('NinjaTookenForumBundle:Thread', 't', 'WITH', 'a.thread = t.id')
                ->where('t.forum = :forum')
                ->setParameter('forum', $forum);
            $comments = $q->getQuery()
                ->setFirstResult(0)
                ->setMaxResults($max)
                ->getResult();
        }

        return $this->render('NinjaTookenForumBundle:Comments:recentList.html.twig', array('comments' => $comments));
    }
}
