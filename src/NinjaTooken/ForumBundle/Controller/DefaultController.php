<?php

namespace NinjaTooken\ForumBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use NinjaTooken\ForumBundle\Entity\Forum;
use NinjaTooken\ForumBundle\Entity\Thread;

class DefaultController extends Controller
{

    public function oldMessageAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $thread = $em->getRepository('NinjaTookenForumBundle:Thread')->findOneBy(array('old_id' => (int)$request->get('ID')));
        if(!$thread){
            $comment = $em->getRepository('NinjaTookenForumBundle:Comment')->findOneBy(array('old_id' => (int)$request->get('ID')));
            if($comment)
                $thread = $comment->getThread();
        }

        if(!$thread){
            throw new NotFoundHttpException('Ce message n\'existe pas !');
        }

        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug(),
            'page' => 1
        )));
    }

    public function oldForumAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $forum = $em->getRepository('NinjaTookenForumBundle:Forum')->findOneBy(array('old_id' => (int)$request->get('ID')));

        if(!$forum){
            throw new NotFoundHttpException('Ce forum n\'existe pas !');
        }

        return $this->redirect($this->generateUrl('ninja_tooken_topic', array(
            'topic_nom' => $forum->getSlug(),
            'page' => 1
        )));
    }

    public function eventAction($page)
    {
        $em = $this->getDoctrine()->getManager();

        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->getEvents($num, $page);
        $forum = null;
        if(!empty($threads)){
            $firstT = current($threads->getIterator());
            $forum = $firstT->getForum();
        }

        return $this->render('NinjaTookenForumBundle:Default:event.html.twig', array(
            'forum' => $forum,
            'threads' => $threads,
            'page' => $page,
            'nombrePage' => ceil(count($threads)/$num)
        ));
    }

    public function forumAction()
    {
        $em = $this->getDoctrine()->getManager();

        $allForums = $em->getRepository('NinjaTookenForumBundle:Forum')->getForum('');
        $forums = array();
        foreach($allForums as $forum){
            $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->getThreads($forum, 5, 1);
            if(count($threads)>0){
                $forum->threads = $threads;
                $forums[] = $forum;
            }
        }

        return $this->render('NinjaTookenForumBundle:Default:forum.html.twig', array('forums' => $forums));
    }

    public function forumSearchAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $num = $this->container->getParameter('numReponse');

        $user = $request->get('user');
        if(!empty($user)){
            $user = $em->getRepository('NinjaTookenUserBundle:User')->findOneBy(array('slug' => $user));
        }else
            $user = null;

        $forum = $request->get('forum');
        if(!empty($forum)){
            // recherche dans les messages
            $forum = $em->getRepository('NinjaTookenForumBundle:Forum')->findOneBy(array('slug' => $forum));
        }else
            $forum = null;

        // recherche dans les commentaires
        $comments = $em->getRepository('NinjaTookenForumBundle:Comment')->searchComments($user, $forum, $request->get('q'), $num, 1);

        // recherche dans les threads
        $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->searchThreads($user, $forum, $request->get('q'), $num, 1);

        // ajoute les commentaires trouvés
        foreach($comments as $comment){
            $thread = $comment->getThread();
            $finded = false;
            foreach($threads as $t){
                if($thread == $t){
                    $finded = true;
                    break;
                }
            }
            if(!$finded){
                $threads[] = $thread;
            }
        }

        return $this->render('NinjaTookenForumBundle:Default:search.html.twig', array(
            'threads' => $threads,
            'forum' => $forum,
            'user' => $user
        ));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     */
    public function topicAction(Forum $forum, $page)
    {
        $em = $this->getDoctrine()->getManager();

        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->getThreads($forum, $num, $page);

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
        $em = $this->getDoctrine()->getManager();
        $num = $this->container->getParameter('numReponse');

        $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->findBy(
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
        $em = $this->getDoctrine()->getManager();
        $num = $this->container->getParameter('numReponse');

        $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->findBy(
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
        return $this->redirect($this->generateUrl('ninja_tooken_topic', array(
            'topic_nom' => $thread->getForum()->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function messageAction(Forum $forum, Thread $thread, $page)
    {
        $em = $this->getDoctrine()->getManager();
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $comments = $em->getRepository('NinjaTookenForumBundle:Comment')->getComments($thread, $num, $page);

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
        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function messageSupprimerAction(Forum $forum, Thread $thread)
    {
        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function messageVerrouillerAction(Forum $forum, Thread $thread)
    {
        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function messagePostitAction(Forum $forum, Thread $thread)
    {
        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     */
    public function commentAjouterAction(Forum $forum, Thread $thread)
    {
        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     * @ParamConverter("comment", class="NinjaTookenForumBundle:Comment", options={"mapping": {"comment_id":"id"}})
     */
    public function commentModifierAction(Forum $forum, Thread $thread, Comment $comment)
    {
        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"topic_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"message_nom":"slug"}})
     * @ParamConverter("comment", class="NinjaTookenForumBundle:Comment", options={"mapping": {"comment_id":"id"}})
     */
    public function commentSupprimerAction(Forum $forum, Thread $thread, Comment $comment)
    {
        return $this->redirect($this->generateUrl('ninja_tooken_message', array(
            'topic_nom' => $thread->getForum()->getSlug(),
            'message_nom' => $thread->getSlug()
        )));
    }

    public function recentCommentsAction($max = 10, $forum = 0, $user = 0)
    {
        $em = $this->getDoctrine()->getManager();
        $query = $em->getRepository('NinjaTookenForumBundle:Comment')
            ->createQueryBuilder('a')
            ->orderBy('a.dateAjout', 'DESC');

        if(!empty($forum)){
            $query->leftJoin('NinjaTookenForumBundle:Thread', 't', 'WITH', 'a.thread = t.id')
                ->where('t.forum = :forum')
                ->setParameter('forum', $forum);
        }
        if(!empty($user)){
            $query->where('a.author = :user')
                ->setParameter('user', $user);
        }
        $comments = $query->getQuery()
            ->setFirstResult(0)
            ->setMaxResults($max)
            ->getResult();

        return $this->render('NinjaTookenForumBundle:Comments:recentList.html.twig', array('comments' => $comments));
    }
}
