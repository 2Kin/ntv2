<?php

namespace NinjaTooken\ForumBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use NinjaTooken\UserBundle\Entity\User;
use NinjaTooken\ForumBundle\Entity\Forum;
use NinjaTooken\ForumBundle\Entity\Thread;
use NinjaTooken\ForumBundle\Form\Type\ThreadType;
use NinjaTooken\ForumBundle\Form\Type\EventType;
use NinjaTooken\ForumBundle\Entity\Comment;
use NinjaTooken\ForumBundle\Form\Type\CommentType;

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
            throw new NotFoundHttpException($this->get('translator')->trans('description.error404.message'));
        }

        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
            'forum_nom' => $thread->getForum()->getSlug(),
            'thread_nom' => $thread->getSlug(),
            'page' => 1
        )));
    }

    public function oldForumAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $forum = $em->getRepository('NinjaTookenForumBundle:Forum')->findOneBy(array('old_id' => (int)$request->get('ID')));

        if(!$forum){
            throw new NotFoundHttpException($this->get('translator')->trans('description.error404.forum'));
        }

        return $this->redirect($this->generateUrl('ninja_tooken_topic', array(
            'forum_nom' => $forum->getSlug(),
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

    public function eventAjouterAction(Request $request)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $thread = new Thread();
                $thread->setAuthor($user);
                $forum = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Forum')->getForum('nouveautes')[0];
                $thread->setForum($forum);
                $thread->setIsEvent(true);
                $form = $this->createForm(new EventType(), $thread);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('event', array_merge(
                        $request->request->get('event'),
                        array('body' => $request->get('event_body'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();
                        $em->persist($thread);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.topic.ajoutOk')
                        );

                        return $this->redirect($this->generateUrl('ninja_tooken_event'));
                    }
                }
                return $this->render('NinjaTookenForumBundle:Default:event.form.html.twig', array(
                    'form' => $form->createView()
                ));
            }
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     */
    public function eventModifierAction(Request $request, Thread $thread)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($thread->getAuthor() == $user || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $form = $this->createForm(new EventType(), $thread);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('event', array_merge(
                        $request->request->get('event'),
                        array('body' => $request->get('event_body'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();
                        $em->persist($thread);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.topic.editOk')
                        );

                        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
                            'forum_nom' => $thread->getForum()->getSlug(),
                            'thread_nom' => $thread->getSlug()
                        )));
                    }
                }
                return $this->render('NinjaTookenForumBundle:Default:event.form.html.twig', array(
                    'thread' => $thread,
                    'form' => $form->createView()
                ));
            }
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
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

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
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
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     */
    public function threadAction(Forum $forum, Thread $thread, $page)
    {
        $em = $this->getDoctrine()->getManager();
        $num = $this->container->getParameter('numReponse');
        $security = $this->get('security.context');
        $page = max(1, $page);

        $comments = $em->getRepository('NinjaTookenForumBundle:Comment')->getCommentsByThread($thread, $num, $page);

        $form = $this->createForm(new CommentType(), new Comment());

        return $this->render('NinjaTookenForumBundle:Default:thread.html.twig', array(
            'forum' => $forum,
            'thread' => $thread,
            'comments' => $comments,
            'page' => $page,
            'nombrePage' => ceil($thread->getNumComments()/$num),
            'form_comment' => $form->createView()
        ));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     */
    public function threadAjouterAction(Request $request, Forum $forum)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($forum->getCanUserCreateThread() || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $thread = new Thread();
                $thread->setAuthor($user);
                $thread->setForum($forum);
                $form = $this->createForm(new ThreadType(), $thread);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('thread', array_merge(
                        $request->request->get('thread'),
                        array('body' => $request->get('thread_body'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();
                        $em->persist($thread);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.topic.ajoutOk')
                        );

                        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
                            'forum_nom' => $forum->getSlug(),
                            'thread_nom' => $thread->getSlug()
                        )));
                    }
                }
                return $this->render('NinjaTookenForumBundle:Default:thread.form.html.twig', array(
                    'forum' => $forum,
                    'form' => $form->createView()
                ));
            }
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     */
    public function threadModifierAction(Request $request, Forum $forum, Thread $thread)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($thread->getAuthor() == $user || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $form = $this->createForm(new ThreadType(), $thread);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('thread', array_merge(
                        $request->request->get('thread'),
                        array('body' => $request->get('thread_body'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();
                        $em->persist($thread);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.topic.editOk')
                        );

                        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
                            'forum_nom' => $forum->getSlug(),
                            'thread_nom' => $thread->getSlug()
                        )));
                    }
                }
                return $this->render('NinjaTookenForumBundle:Default:thread.form.html.twig', array(
                    'forum' => $forum,
                    'thread' => $thread,
                    'form' => $form->createView()
                ));
            }
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     */
    public function threadVerrouillerAction(Forum $forum, Thread $thread)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $em = $this->getDoctrine()->getManager();
                $thread->setIsCommentable(
                    !$thread->getIsCommentable()
                );
                $em->persist($thread);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $thread->getIsCommentable()?$this->get('translator')->trans('notice.topic.deverrouilleOk'):$this->get('translator')->trans('notice.topic.verrouilleOk')
                );
            }
        }
        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
            'forum_nom' => $forum->getSlug(),
            'thread_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     */
    public function threadPostitAction(Forum $forum, Thread $thread)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $em = $this->getDoctrine()->getManager();
                $thread->setIsPostit(
                    !$thread->getIsPostit()
                );
                $em->persist($thread);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $thread->getIsPostit()?$this->get('translator')->trans('notice.topic.postitOk'):$this->get('translator')->trans('notice.topic.unpostitOk')
                );
            }
        }
        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
            'forum_nom' => $forum->getSlug(),
            'thread_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     */
    public function threadSupprimerAction(Forum $forum, Thread $thread)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($thread->getAuthor() == $user || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $isEvent = $thread->getIsEvent();

                $em = $this->getDoctrine()->getManager();
                $em->remove($thread);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $this->get('translator')->trans('notice.topic.deleteOk')
                );

                if(!$forum->getClan()){
                    if($isEvent)
                        return $this->redirect($this->generateUrl('ninja_tooken_event'));
                    else
                        return $this->redirect($this->generateUrl('ninja_tooken_topic', array(
                            'forum_nom' => $forum->getSlug()
                        )));
                }else
                    return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                        'clan_nom' => $forum->getClan()->getSlug()
                    )));
            }
        }
        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
            'forum_nom' => $forum->getSlug(),
            'thread_nom' => $thread->getSlug()
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     */
    public function commentAjouterAction(Request $request, Forum $forum, Thread $thread, $page)
    {
        $security = $this->get('security.context');
        $page = max(1, $page);

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if($thread->getIsCommentable() || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $comment = new Comment();
                $comment->setAuthor($user);
                $comment->setThread($thread);

                $form = $this->createForm(new CommentType(), $comment);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('comment', array_merge(
                        $request->request->get('comment'),
                        array('body' => $request->get('comment_body'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();
                        $em->persist($comment);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.comment.ajoutOk')
                        );
                    }
                }
            }
        }
        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
            'forum_nom' => $forum->getSlug(),
            'thread_nom' => $thread->getSlug(),
            'page' => $page
        )));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     * @ParamConverter("comment", class="NinjaTookenForumBundle:Comment", options={"mapping": {"comment_id":"id"}})
     */
    public function commentModifierAction(Request $request, Forum $forum, Thread $thread, Comment $comment, $page)
    {
        $security = $this->get('security.context');
        $page = max(1, $page);

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if( ($thread->getIsCommentable() && $comment->getAuthor() == $user) || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $form = $this->createForm(new CommentType(), $comment);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('comment', array_merge(
                        $request->request->get('comment'),
                        array('body' => $request->get('comment_body'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();
                        $em->persist($comment);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.comment.editOk')
                        );
                        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
                            'forum_nom' => $forum->getSlug(),
                            'thread_nom' => $thread->getSlug(),
                            'page' => $page
                        )));
                    }
                }
                return $this->render('NinjaTookenForumBundle:Default:comment.form.html.twig', array(
                    'forum' => $forum,
                    'thread' => $thread,
                    'comment' => $comment,
                    'page' => $page,
                    'form' => $form->createView()
                ));
            }
            return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
                'forum_nom' => $forum->getSlug(),
                'thread_nom' => $thread->getSlug(),
                'page' => $page
            )));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("forum", class="NinjaTookenForumBundle:Forum", options={"mapping": {"forum_nom":"slug"}})
     * @ParamConverter("thread", class="NinjaTookenForumBundle:Thread", options={"mapping": {"thread_nom":"slug"}})
     * @ParamConverter("comment", class="NinjaTookenForumBundle:Comment", options={"mapping": {"comment_id":"id"}})
     */
    public function commentSupprimerAction(Request $request, Forum $forum, Thread $thread, Comment $comment, $page)
    {
        $security = $this->get('security.context');
        $page = max(1, $page);

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if( ($thread->getIsCommentable() && $comment->getAuthor() == $user) || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $em = $this->getDoctrine()->getManager();
                $em->remove($comment);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                     $this->get('translator')->trans('notice.comment.deleteOk')
                );
            }
        }
        return $this->redirect($this->generateUrl('ninja_tooken_thread', array(
            'forum_nom' => $forum->getSlug(),
            'thread_nom' => $thread->getSlug(),
            'page' => $page
        )));
    }

    public function recentCommentsAction($max = 10, Forum $forum = null, User $user = null)
    {
        return $this->render('NinjaTookenForumBundle:Comments:recentList.html.twig', array(
            'comments' => $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Comment')->getRecentComments($forum, $user, $max)
        ));
    }
}
