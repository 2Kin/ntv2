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

        $allForums = $repo_forum->createQueryBuilder('f')
            ->orderBy('f.ordre', 'DESC')
            ->where('f.type = :type')
            ->setParameter('type', 'forum')
            ->getQuery()->getResult();
        $forums = array();
        foreach($allForums as $forum){
            $threads = $this->getDoctrine()
                         ->getManager()
                         ->getRepository('NinjaTookenForumBundle:Thread')
                         ->getThreads($forum, 5, 1);
            if(count($threads)>0){
                $forum->threads = $threads;
                $forums[] = $forum;
            }
        }

        return $this->render('NinjaTookenForumBundle:Default:forum.html.twig', array('forums' => $forums));
    }

    public function forumSearchAction()
    {
        $repo_forum = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Forum');

        $allForums = $repo_forum->createQueryBuilder('a')->orderBy('a.ordre', 'DESC')->getQuery()->getResult();
        $forums = array();
        foreach($allForums as $forum){
            $threads = $this->getDoctrine()
                         ->getManager()
                         ->getRepository('NinjaTookenForumBundle:Thread')
                         ->getThreads($forum, 5, 1);
            if(count($threads)>0){
                $forum->threads = $threads;
                $forums[] = $forum;
            }
        }

        return $this->render('NinjaTookenForumBundle:Default:forum.html.twig', array('forums' => $forums));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function topicAction(Forum $forum, $page)
    {
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $threads = $this->getDoctrine()
                     ->getManager()
                     ->getRepository('NinjaTookenForumBundle:Thread')
                     ->getThreads($forum, $num, $page);

        return $this->render('NinjaTookenForumBundle:Default:topic.html.twig', array(
            'forum' => $forum,
            'threads' => $threads,
            'page' => $page,
            'nombrePage' => ceil(count($threads)/$num)
        ));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function topicAjouterAction(Forum $forum)
    {
        $num = $this->container->getParameter('numReponse');

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
        $num = $this->container->getParameter('numReponse');

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
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $comments = $this->getDoctrine()
                     ->getManager()
                     ->getRepository('NinjaTookenForumBundle:Comment')
                     ->getComments($thread, $num, $page);

        return $this->render('NinjaTookenForumBundle:Default:message.html.twig', array(
            'forum' => $forum,
            'thread' => $thread,
            'comments' => $comments,
            'page' => $page,
            'nombreComment' => count($comments),
            'nombrePage' => ceil(count($comments)/$num)
        ));
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
