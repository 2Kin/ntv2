<?php
namespace NinjaTooken\ForumBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use NinjaTooken\ForumBundle\Entity\Forum;
use NinjaTooken\UserBundle\Entity\User;
 
class ThreadRepository extends EntityRepository
{
    public function getThreads(Forum $forum, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('t')
            ->where('t.forum = :forum')
            ->setParameter('forum', $forum)
            ->addOrderBy('t.isPostit', 'DESC')
            ->addOrderBy('t.lastCommentAt', 'DESC')
            ->getQuery();

        $query->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return new Paginator($query);
    }

    public function getEvents($nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('t')
            ->where('t.isEvent = :isEvent')
            ->setParameter('isEvent', true)
            ->addOrderBy('t.isPostit', 'DESC')
            ->addOrderBy('t.lastCommentAt', 'DESC')
            ->getQuery();

        $query->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return new Paginator($query);
    }

    public function searchThreads(User $user=null, Forum $forum=null, $q = "", $nombreParPage=5, $page=1)
    {
        $query = $this->createQueryBuilder('t')
            ->addOrderBy('t.isPostit', 'DESC')
            ->addOrderBy('t.lastCommentAt', 'DESC');

        if(!empty($q)){
            $query->andWhere('t.nom LIKE :q')
                ->andWhere('t.body LIKE :q')
                ->setParameter('q', '%'.$q.'%');
        }

        if(isset($user)){
            $query->andWhere('t.author = :user')
                ->setParameter('user', $user);
        }

        if(isset($forum)){
            $query->andWhere('t.forum = :forum')
                ->setParameter('forum', $forum);
        }

        $query->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return $query->getQuery()->getResult();
    }

    public function deleteThreadsByForum(Forum $forum = null)
    {
        if($forum){
            $query = $this->createQueryBuilder('t')
                ->delete('NinjaTookenForumBundle:Thread', 't')
                ->where('t.forum = :forum')
                ->setParameter('forum', $forum)
                ->getQuery();
     
            return 1 === $query->getScalarResult();
        }
        return false;
    }
}