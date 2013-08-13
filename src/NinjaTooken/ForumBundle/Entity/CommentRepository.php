<?php
namespace NinjaTooken\ForumBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use NinjaTooken\ForumBundle\Entity\Thread;
use NinjaTooken\UserBundle\Entity\User;
 
class CommentRepository extends EntityRepository
{
    public function getComments(Thread $thread, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('c')
            ->where('c.thread = :thread')
            ->setParameter('thread', $thread)
            ->addOrderBy('c.dateAjout', 'DESC')
            ->getQuery();

        $query->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return new Paginator($query);
    }

    public function getCommentsByAuthor(User $user, $nombreParPage=10, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('c')
            ->where('c.author = :user')
            ->setParameter('user', $user)
            ->addOrderBy('c.dateAjout', 'DESC')
            ->getQuery();

        $query->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return $query->getResult();
    }
}