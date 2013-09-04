<?php

namespace NinjaTooken\ForumBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use NinjaTooken\ForumBundle\Entity\Comment;
use NinjaTooken\ForumBundle\Utils\Akismet;
 
class CommentListener
{
    protected $akismetActive;
    protected $akismetKey;
    protected $akismetUrl;

    public function __construct($akismetActive = false, $akismetKey = "", $akismetUrl = "")
    {
        $this->akismetActive = $akismetActive;
        $this->akismetKey = $akismetKey;
        $this->akismetUrl = $akismetUrl;
    }

    // vérification akismet du commentaire
    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof Comment)
        {
            // si la vérification akismet est activée
            if($this->akismetActive){
                if($entity->getThread() !== null && $entity->getAuthor() !== null)
                {
                    $akismet = new Akismet();
                    $akismet->setUserAgent('rzeka.net/1.0.0 | Akismet/1.0.0');
                    $akismet->keyCheck(
                        $this->akismetKey,
                        $this->akismetUrl
                    );
                    // on check qu'il ne s'agit pas d'un spam
                    if(!$akismet->check(array(
                        'permalink' => $this->request->getUri(),
                        'user_ip' => $this->request->getClientIp(),
                        'user_agent' => $this->request->server->get('HTTP_USER_AGENT'),
                        'referrer' => $this->request->server->get('HTTP_REFERER'),
                        'comment_type' => 'comment',
                        'comment_author' => $entity->getAuthor()->getUsername(),
                        'comment_author_email' => $entity->getAuthor()->getEmail(),
                        'comment_author_url' => '',
                        'comment_content' => $entity->getBody()
                    ))){
                        // annule l'ajout
                        $em->detach($entity);
                    }
                }
            }
        }
    }

    // met à jour le thread
    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof Comment)
        {
            if($entity->getThread() !== null && $entity->getAuthor() !== null)
            {
                $thread = $entity->getThread();
                $thread->setLastCommentBy($entity->getAuthor());
                $thread->incrementNumComments();
                $thread->setLastCommentAt($entity->getDateAjout());
                $em->persist($thread);
                $em->flush();
            }
        }
    }

    // met à jour le thread
    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();

        if ($entity instanceof Comment)
        {
            // retire du thread
            if($entity->getThread() !== null && $entity->getAuthor() !== null)
            {
                $thread = $entity->getThread();
                $thread->incrementNumComments(-1);
                // met à jour les références vers le message précédent
                if($thread->getNumComments() == 0){
                    $thread->setLastCommentBy(null);
                    $thread->setLastCommentAt($thread->getDateAjout());
                }else{
                    if($thread->getLastCommentBy() == $entity->getAuthor() && $thread->getLastCommentAt() == $entity->getDateAjout()){
                        $lastComment = $em->getRepository('NinjaTookenForumBundle:Comment')->getCommentsByThread($thread, 1, 1);
                        if($lastComment){
                            $lastComment = current($lastComment);
                            $thread->setLastCommentBy($lastComment->getAuthor());
                            $thread->setLastCommentAt($lastComment->getDateAjout());
                        }else{
                            $thread->setLastCommentBy(null);
                            $thread->setLastCommentAt($thread->getDateAjout());
                        }
                    }
                }
                $em->persist($thread);
                $em->flush();
            }
        }
    }
}